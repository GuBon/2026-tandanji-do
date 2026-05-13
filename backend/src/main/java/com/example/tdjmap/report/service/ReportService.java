package com.example.tdjmap.report.service;

import com.example.tdjmap.common.exception.BusinessException;
import com.example.tdjmap.common.exception.ErrorCode;
import com.example.tdjmap.config.SecurityUtil;
import com.example.tdjmap.entity.Menu;
import com.example.tdjmap.entity.Report;
import com.example.tdjmap.entity.ReportVote;
import com.example.tdjmap.entity.Store;
import com.example.tdjmap.entity.User;
import com.example.tdjmap.report.dto.ReportAdminResponse;
import com.example.tdjmap.report.dto.ReportCreateRequest;
import com.example.tdjmap.report.dto.ReportPublicResponse;
import com.example.tdjmap.report.dto.ReportVoteResponse;
import com.example.tdjmap.entity.Brand;
import com.example.tdjmap.repository.BrandRepository;
import com.example.tdjmap.repository.MenuRepository;
import com.example.tdjmap.repository.ReportRepository;
import com.example.tdjmap.repository.ReportVoteRepository;
import com.example.tdjmap.repository.StoreRepository;
import com.example.tdjmap.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ReportService {

    private final ReportRepository reportRepository;
    private final ReportVoteRepository reportVoteRepository;
    private final UserRepository userRepository;
    private final StoreRepository storeRepository;
    private final MenuRepository menuRepository;
    private final BrandRepository brandRepository;

    @Transactional
    public void createReport(ReportCreateRequest req) {
        Long userId = SecurityUtil.getCurrentUserId();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        Store store = null;
        Menu menu = null;

        if (req.getStoreId() != null) {
            store = storeRepository.findById(req.getStoreId()).orElse(null);
        } else if (req.getStoreLat() != null && req.getStoreLon() != null) {
            List<Store> nearby = storeRepository.findNearby(req.getStoreLat(), req.getStoreLon());
            if (!nearby.isEmpty()) store = nearby.get(0);
        }
        if (store != null && req.getMenuName() != null) {
            menu = findMenuByStoreName(store, req.getMenuName());
        }

        Report report = Report.builder()
                .user(user)
                .store(store)
                .menu(menu)
                .storeName(req.getStoreName())
                .storeAddress(req.getStoreAddress())
                .storeLat(req.getStoreLat())
                .storeLon(req.getStoreLon())
                .menuName(req.getMenuName())
                .carbs(req.getCarbs())
                .protein(req.getProtein())
                .fat(req.getFat())
                .imageUrl(req.getImageUrl())
                .status("PENDING")
                .createdAt(LocalDateTime.now())
                .build();

        reportRepository.save(report);
    }

    private Brand resolveBrand(String storeName) {
        if (storeName == null) return null;
        return brandRepository.findAll().stream()
                .filter(b -> storeName.startsWith(b.getName()))
                .max(Comparator.comparingInt(b -> b.getName().length()))
                .orElse(null);
    }

    private Menu findMenuByStoreName(Store store, String menuName) {
        Long brandId = store.getBrand() != null ? store.getBrand().getId() : null;
        List<Menu> candidates = menuRepository.findStoreMenus(store.getId(), brandId);
        return candidates.stream()
                .filter(m -> m.getName().equalsIgnoreCase(menuName.trim()))
                .findFirst()
                .orElse(null);
    }

    public List<ReportPublicResponse> getPublicReports(Long storeId) {
        Long currentUserId = SecurityUtil.getCurrentUserIdOrNull();
        List<Report> reports = storeId != null
                ? reportRepository.findPendingByStoreId(storeId)
                : reportRepository.findPendingWithRelations();

        return buildPublicResponses(reports, currentUserId);
    }

    private List<ReportPublicResponse> buildPublicResponses(List<Report> reports, Long currentUserId) {
        if (reports.isEmpty()) return List.of();

        List<Long> reportIds = reports.stream().map(Report::getId).toList();
        Map<Long, long[]> voteCounts = buildVoteCounts(reportIds);
        Map<Long, String> myVoteMap = currentUserId != null
                ? buildMyVoteMap(reportIds, currentUserId) : Map.of();

        return reports.stream().map(r -> {
            long[] counts = voteCounts.getOrDefault(r.getId(), new long[]{0, 0});
            return ReportPublicResponse.builder()
                    .reportId(r.getId())
                    .storeId(r.getStore() != null ? r.getStore().getId() : null)
                    .storeName(r.getStoreName())
                    .storeAddress(r.getStoreAddress())
                    .storeLat(r.getStoreLat())
                    .storeLon(r.getStoreLon())
                    .menuId(r.getMenu() != null ? r.getMenu().getId() : null)
                    .menuName(r.getMenuName())
                    .carbs(r.getCarbs())
                    .protein(r.getProtein())
                    .fat(r.getFat())
                    .imageUrl(r.getImageUrl())
                    .upVotes(counts[0])
                    .downVotes(counts[1])
                    .myVote(myVoteMap.get(r.getId()))
                    .createdAt(r.getCreatedAt())
                    .build();
        }).toList();
    }

    private Map<Long, String> buildMyVoteMap(List<Long> reportIds, Long userId) {
        return reportVoteRepository.findUserVotesByReportIds(reportIds, userId)
                .stream()
                .collect(Collectors.toMap(
                        row -> ((Number) row[0]).longValue(),
                        row -> (String) row[1]
                ));
    }

    private Map<Long, long[]> buildVoteCounts(List<Long> reportIds) {
        List<Object[]> rows = reportVoteRepository.countVotesByReportIds(reportIds);
        Map<Long, long[]> map = new HashMap<>();
        for (Object[] row : rows) {
            Long rId = ((Number) row[0]).longValue();
            String type = (String) row[1];
            long cnt = ((Number) row[2]).longValue();
            map.computeIfAbsent(rId, k -> new long[]{0, 0});
            if ("UP".equals(type))   map.get(rId)[0] = cnt;
            if ("DOWN".equals(type)) map.get(rId)[1] = cnt;
        }
        return map;
    }

    @Transactional
    public ReportVoteResponse toggleVote(Long reportId, String voteType) {
        if (!"UP".equals(voteType) && !"DOWN".equals(voteType)) {
            throw new BusinessException(ErrorCode.REPORT_VOTE_INVALID);
        }
        Long userId = SecurityUtil.getCurrentUserId();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));
        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new BusinessException(ErrorCode.REPORT_NOT_FOUND));

        String resultMyVote;
        Optional<ReportVote> existing = reportVoteRepository.findByReportIdAndUserId(reportId, userId);
        if (existing.isPresent()) {
            if (existing.get().getVoteType().equals(voteType)) {
                reportVoteRepository.delete(existing.get());
                resultMyVote = null;
            } else {
                existing.get().setVoteType(voteType);
                resultMyVote = voteType;
            }
        } else {
            reportVoteRepository.save(ReportVote.builder()
                    .report(report)
                    .user(user)
                    .voteType(voteType)
                    .createdAt(LocalDateTime.now())
                    .build());
            resultMyVote = voteType;
        }

        long[] vc = buildVoteCounts(List.of(reportId)).getOrDefault(reportId, new long[]{0, 0});

        if (vc[0] - vc[1] >= 5 && "PENDING".equals(report.getStatus())) {
            report.setStatus("APPROVED");
            Store store = report.getStore();
            Menu menu = report.getMenu();

            if (store == null && report.getStoreLat() != null && report.getStoreLon() != null) {
                // 케이스 1: DB에 없는 매장 → 브랜드 매칭 후 Store·Menu 생성
                Brand matchedBrand = resolveBrand(report.getStoreName());
                store = storeRepository.save(Store.builder()
                        .name(report.getStoreName())
                        .address(report.getStoreAddress())
                        .latitude(BigDecimal.valueOf(report.getStoreLat()))
                        .longitude(BigDecimal.valueOf(report.getStoreLon()))
                        .brand(matchedBrand)
                        .createdAt(LocalDateTime.now())
                        .build());
                report.setStore(store);
                menu = menuRepository.save(Menu.builder()
                        .store(store)
                        .name(report.getMenuName())
                        .kcal(report.getKcal())
                        .carbs(report.getCarbs())
                        .protein(report.getProtein())
                        .fat(report.getFat())
                        .isStandard(true)
                        .build());
                report.setMenu(menu);
            } else if (store != null && menu == null) {
                // 케이스 2: 매장은 있지만 메뉴 미매칭 → Menu 생성
                // brand를 함께 설정해야 CHECK(brand_id IS NOT NULL OR is_standard = true) 만족
                menu = menuRepository.save(Menu.builder()
                        .store(store)
                        .name(report.getMenuName())
                        .kcal(report.getKcal())
                        .carbs(report.getCarbs())
                        .protein(report.getProtein())
                        .fat(report.getFat())
                        .isStandard(true)
                        .build());
                report.setMenu(menu);
            } else if (menu != null) {
                // 케이스 3: 매장 + 메뉴 모두 매칭 → 영양정보 업데이트
                if (report.getCarbs() != null) menu.setCarbs(report.getCarbs());
                if (report.getProtein() != null) menu.setProtein(report.getProtein());
                if (report.getFat() != null) menu.setFat(report.getFat());
            }
        }

        return ReportVoteResponse.builder()
                .upVotes(vc[0])
                .downVotes(vc[1])
                .myVote(resultMyVote)
                .build();
    }

    public List<ReportAdminResponse> getAdminReports() {
        return reportRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(ReportAdminResponse::from)
                .toList();
    }

    @Transactional
    public ReportAdminResponse updateStatus(Long reportId, String status) {
        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new BusinessException(ErrorCode.REPORT_NOT_FOUND));
        report.setStatus(status);
        return ReportAdminResponse.from(report);
    }
}
