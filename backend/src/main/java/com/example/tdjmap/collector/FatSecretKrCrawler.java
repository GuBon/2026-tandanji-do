package com.example.tdjmap.collector;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

import java.io.*;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.sql.*;
import java.util.*;

/**
 * www.fatsecret.kr 검색 결과를 크롤링해 incheon_brands.csv 브랜드의
 * 메뉴·영양성분을 tandanji.brands / tandanji.menus 테이블에 저장합니다.
 *
 * 실행: ./gradlew crawlFatSecret
 */
public class FatSecretKrCrawler {

    private static final String BASE_URL        = "https://www.fatsecret.kr";
    private static final String DB_URL          = "jdbc:postgresql://localhost:5432/postgres";
    private static final String DB_USER         = "postgres";
    private static final String DB_PASS         = "0218";
    private static final int    REQUEST_DELAY_MS  = 1500;  // 페이지 간 딜레이
    private static final int    BRAND_DELAY_MS    = 3000;  // 브랜드 간 딜레이
    private static final int    RETRY_DELAY_MS    = 15000; // 429 발생 시 대기
    private static final int    MAX_RETRIES       = 3;
    private static final String USER_AGENT      =
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0 Safari/537.36";

    // ── 진입점 ───────────────────────────────────────────────────────────────

    public static void main(String[] args) throws Exception {
        new FatSecretKrCrawler().run();
    }

    private void run() throws Exception {
        List<String> brandNames = readBrandNames("incheon_brands.csv");
        System.out.printf("총 %d개 브랜드 크롤링 시작%n", brandNames.size());
        // 특정 브랜드만 테스트: -Dbrand=이삭토스트
        String filter = System.getProperty("brand");
        if (filter != null && !filter.isBlank()) {
            brandNames = brandNames.stream().filter(b -> b.equals(filter)).toList();
            System.out.printf("→ 필터 적용: '%s'%n", filter);
        }

        try (Connection conn = DriverManager.getConnection(DB_URL, DB_USER, DB_PASS)) {
            conn.setAutoCommit(false);
            int totalSaved = 0;

            for (int i = 0; i < brandNames.size(); i++) {
                String brandName = brandNames.get(i);
                if (i > 0) Thread.sleep(BRAND_DELAY_MS);

                int saved = crawlBrandWithRetry(conn, brandName);
                totalSaved += saved;
                System.out.printf("[완료] %-30s  신규 %d건%n", brandName, saved);
            }
            System.out.printf("=== 전체 완료: 총 %d건 저장 ===%n", totalSaved);
        }
    }

    // ── 브랜드 크롤링 (재시도 포함) ──────────────────────────────────────────

    private int crawlBrandWithRetry(Connection conn, String brandName) throws Exception {
        for (int attempt = 1; attempt <= MAX_RETRIES; attempt++) {
            try {
                int saved = crawlBrand(conn, brandName);
                conn.commit();
                return saved;
            } catch (Exception e) {
                conn.rollback();
                if (e.getMessage() != null && e.getMessage().contains("429") && attempt < MAX_RETRIES) {
                    System.err.printf("[재시도 %d/%d] %s — 429 rate limit, %d초 대기%n",
                            attempt, MAX_RETRIES, brandName, RETRY_DELAY_MS / 1000);
                    Thread.sleep(RETRY_DELAY_MS);
                } else {
                    System.err.printf("[실패] %s — %s%n", brandName, e.getMessage());
                    return 0;
                }
            }
        }
        return 0;
    }

    private int crawlBrand(Connection conn, String brandName) throws Exception {
        long brandId = upsertBrand(conn, brandName);
        int  saved   = 0;
        int  page    = 0;
        int  consecutiveEmptyPages = 0;
        final int MAX_EMPTY_PAGES = 2; // 매칭되는 아이템이 없는 페이지가 연속 2개면 중단

        while (page < 20) { // 최대 20페이지까지 탐색
            String   searchUrl = buildSearchUrl(brandName, page);
            System.out.println("  [fetch] " + searchUrl);
            Document doc       = fetchPage(searchUrl);

            List<FoodItem> items = parseSearchResults(doc, brandName);
            
            if (items.isEmpty()) {
                consecutiveEmptyPages++;
                System.out.println("  [info] 해당 페이지에 매칭되는 아이템 없음 (연속 " + consecutiveEmptyPages + "페이지)");
            } else {
                consecutiveEmptyPages = 0;
                for (FoodItem item : items) {
                    if (insertMenu(conn, brandId, item.menuName(),
                            item.kcal(), item.carbs(), item.protein(), item.fat())) {
                        saved++;
                    }
                }
            }

            if (!hasNextPage(doc) || consecutiveEmptyPages >= MAX_EMPTY_PAGES) break;
            
            page++;
            Thread.sleep(REQUEST_DELAY_MS);
        }

        return saved;
    }

    // ── HTML 파싱 ────────────────────────────────────────────────────────────

    private List<FoodItem> parseSearchResults(Document doc, String searchedBrand) {
        List<FoodItem>   items   = new ArrayList<>();
        Set<String>      seen    = new HashSet<>();

        // href를 디코딩해서 /칼로리-영양소/ 경로를 포함하는 a 태그 탐색
        Elements links = doc.select("a[href]").stream()
                .filter(a -> urlDecode(a.attr("href")).contains("/칼로리-영양소/"))
                .collect(java.util.stream.Collectors.toCollection(Elements::new));

        for (Element link : links) {
            String href = link.attr("href");
            String[] segments = href.split("/");
            // 최소 구조: ["", "칼로리-영양소", brand, menu]
            if (segments.length < 4) continue;

            String brandSlug = urlDecode(segments[2]);
            String menuSlug  = urlDecode(segments[3]);

            // 일반명(브랜드 없는 일반 식품) 제외
            if ("일반명".equals(brandSlug)) continue;

            // 메뉴명: 링크 텍스트 우선, 없으면 슬러그에서 복원
            String menuName = link.text().trim();
            if (menuName.isBlank()) {
                menuName = menuSlug.replace("-", " ");
            }

            // 브랜드 매칭: URL 브랜드 슬러그가 매칭되거나, 메뉴명에 검색한 브랜드명이 포함되어야 함
            boolean brandMatched = brandMatches(brandSlug, searchedBrand) || 
                                   normalize(menuName).contains(normalize(searchedBrand));
            
            if (!brandMatched) continue;
            
            if (seen.contains(menuName)) continue;
            // "영양 정보", "비슷한" 등 메타 링크 제외
            if (menuName.equals("영양 정보") || menuName.equals("비슷한") || menuName.equals("칼로리")) continue;
            seen.add(menuName);

            // 영양정보 텍스트 탐색 (링크의 상위 요소에서 "칼로리:" 포함 텍스트 검색)
            String nutrition = findNutritionText(link);
            if (nutrition == null) continue;

            Long kcal    = extractLong(nutrition, "칼로리:", "kcal");
            Long fat     = extractLong(nutrition, "지방:",   "g");
            Long carbs   = extractLong(nutrition, "탄수화물:", "g");
            Long protein = extractLong(nutrition, "단백질:", "g");

            if (kcal == null) continue;
            // 탄수화물·단백질·지방이 모두 0이면 파싱 실패로 간주
            boolean allZero = (carbs == null || carbs == 0)
                           && (protein == null || protein == 0)
                           && (fat == null || fat == 0);
            if (allZero) continue;

            items.add(new FoodItem(menuName, kcal, carbs, protein, fat));
        }

        return items;
    }

    /**
     * 링크 요소의 상위를 최대 4단계까지 탐색하면서
     * "칼로리:" 텍스트를 포함하는 가장 가까운 요소의 텍스트를 반환합니다.
     */
    private String findNutritionText(Element link) {
        Element el = link.parent();
        for (int depth = 0; depth < 4 && el != null; depth++) {
            // ownText() — 직접 텍스트 노드만 (자식 요소 제외)
            String ownText = el.ownText();
            if (ownText.contains("칼로리:")) return ownText;

            // 자식 요소 중 영양 정보를 담고 있는 요소 탐색
            for (Element child : el.children()) {
                String childText = child.text();
                if (childText.contains("칼로리:")) return childText;
            }

            el = el.parent();
        }
        return null;
    }

    private boolean hasNextPage(Document doc) {
        return !doc.select("a:containsOwn(다음)").isEmpty() || 
               !doc.select("a:containsOwn(>)").isEmpty();
    }

    // ── 유틸리티 ─────────────────────────────────────────────────────────────

    private boolean brandMatches(String urlBrand, String searchBrand) {
        String a = normalize(urlBrand);
        String b = normalize(searchBrand);
        return a.contains(b) || b.contains(a);
    }

    private String normalize(String s) {
        return s.replaceAll("[\\s\\-_]", "").toLowerCase();
    }

    private String urlDecode(String s) {
        try {
            return URLDecoder.decode(s, StandardCharsets.UTF_8);
        } catch (Exception e) {
            return s;
        }
    }

    // /칼로리-영양소/ 의 퍼센트 인코딩
    private static final String CALORIES_PATH = "/%EC%B9%BC%EB%A1%9C%EB%A6%AC-%EC%98%81%EC%96%91%EC%86%8C";

    private String buildSearchUrl(String brand, int page) throws Exception {
        String encoded = URLEncoder.encode(brand, StandardCharsets.UTF_8);
        return BASE_URL + CALORIES_PATH + "/search?q=" + encoded + "&pg=" + page;
    }

    private Document fetchPage(String url) throws IOException {
        return Jsoup.connect(url)
                .userAgent(USER_AGENT)
                .timeout(15_000)
                .get();
    }

    /**
     * 파이프(|) 구분 영양정보 텍스트에서 값을 추출합니다.
     * 예: "칼로리: 420kcal | 지방: 17.00g | 탄수화물: 48.00g | 단백질: 19.00g"
     */
    private Long extractLong(String text, String key, String unit) {
        int keyIdx = text.indexOf(key);
        if (keyIdx < 0) return null;
        int valueStart = keyIdx + key.length();
        int unitIdx    = text.indexOf(unit, valueStart);
        if (unitIdx < 0) return null;
        String raw = text.substring(valueStart, unitIdx).trim();
        try {
            return Math.round(Double.parseDouble(raw));
        } catch (NumberFormatException e) {
            return null;
        }
    }

    // ── CSV 읽기 ─────────────────────────────────────────────────────────────

    private List<String> readBrandNames(String path) throws Exception {
        List<String> names = new ArrayList<>();
        try (BufferedReader br = new BufferedReader(
                new InputStreamReader(new FileInputStream(path), StandardCharsets.UTF_8))) {

            String header = br.readLine(); // 헤더 스킵
            if (header != null && header.startsWith("﻿")) header = header.substring(1); // BOM 제거

            String line;
            while ((line = br.readLine()) != null) {
                if (line.isBlank()) continue;
                String[] cols = line.split(",", -1);
                if (cols.length > 1) {
                    String name = cols[1].trim().replace("\"", "");
                    if (!name.isBlank()) names.add(name);
                }
            }
        }
        return names;
    }

    // ── DB 헬퍼 ──────────────────────────────────────────────────────────────

    private long upsertBrand(Connection conn, String brandName) throws SQLException {
        String trimmedName = brandName.trim();
        try (PreparedStatement ps = conn.prepareStatement(
                "SELECT brand_id FROM tandanji.brands WHERE brand_name = ?")) {
            ps.setString(1, trimmedName);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) return rs.getLong(1);
        }
        try (PreparedStatement ps = conn.prepareStatement(
                "INSERT INTO tandanji.brands (brand_name) VALUES (?) RETURNING brand_id")) {
            ps.setString(1, trimmedName);
            ResultSet rs = ps.executeQuery();
            rs.next();
            return rs.getLong(1);
        }
    }

    private boolean insertMenu(Connection conn, long brandId, String menuName,
                               Long kcal, Long carbs, Long protein, Long fat)
            throws SQLException {
        if (menuName == null || menuName.isBlank()) return false;

        String trimmedMenu = menuName.trim();
        try (PreparedStatement ps = conn.prepareStatement(
                "SELECT 1 FROM tandanji.menus WHERE brand_id = ? AND menu_name = ?")) {
            ps.setLong(1, brandId);
            ps.setString(2, trimmedMenu);
            if (ps.executeQuery().next()) {
                // System.out.println("    [중복 건너뜀] " + trimmedMenu);
                return false;
            }
        }
        try (PreparedStatement ps = conn.prepareStatement(
                "INSERT INTO tandanji.menus (brand_id, menu_name, kcal, carbs, protein, fat, is_standard) " +
                "VALUES (?, ?, ?, ?, ?, ?, false)")) {
            ps.setLong(1, brandId);
            ps.setString(2, trimmedMenu);
            setLongOrNull(ps, 3, kcal);
            setLongOrNull(ps, 4, carbs);
            setLongOrNull(ps, 5, protein);
            setLongOrNull(ps, 6, fat);
            ps.executeUpdate();
        }
        return true;
    }

    private void setLongOrNull(PreparedStatement ps, int idx, Long value) throws SQLException {
        if (value != null) ps.setLong(idx, value);
        else               ps.setNull(idx, Types.BIGINT);
    }

    // ── 데이터 클래스 ────────────────────────────────────────────────────────

    private record FoodItem(String menuName, Long kcal, Long carbs, Long protein, Long fat) {}
}
