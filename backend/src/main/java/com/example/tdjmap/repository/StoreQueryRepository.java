package com.example.tdjmap.repository;

import com.example.tdjmap.store.dto.MarkerMacroDto;
import com.example.tdjmap.store.dto.StoreMarkerResponse;
import com.example.tdjmap.store.dto.StoreSearchRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.Types;
import java.util.List;

@Repository
@RequiredArgsConstructor
public class StoreQueryRepository {

    private final NamedParameterJdbcTemplate jdbcTemplate;

    private static final String SEARCH_SQL = """
            WITH best_menus AS (
                SELECT DISTINCT ON (brand_id)
                    brand_id, carbs, protein, fat,
                    nutrition_info->>'grade' AS nutrition_grade
                FROM tandanji.menus
                WHERE (:minProtein IS NULL OR protein >= :minProtein)
                  AND (:maxCarbs  IS NULL OR carbs   <= :maxCarbs)
                  AND (:maxFat    IS NULL OR fat     <= :maxFat)
                  AND (:maxSugar  IS NULL OR sugar   <= :maxSugar)
                ORDER BY brand_id,
                         CASE nutrition_info->>'grade'
                             WHEN 'GREEN'  THEN 1
                             WHEN 'YELLOW' THEN 2
                             WHEN 'RED'    THEN 3
                             ELSE 4
                         END,
                         menu_id
            )
            SELECT
                s.store_id,
                s.brand_id,
                s.store_name,
                CAST(s.latitude  AS DOUBLE PRECISION) AS latitude,
                CAST(s.longitude AS DOUBLE PRECISION) AS longitude,
                s.category,
                bm.carbs,
                bm.protein,
                bm.fat,
                bm.nutrition_grade
            FROM tandanji.stores s
            LEFT JOIN best_menus bm ON bm.brand_id = s.brand_id
            WHERE CAST(s.latitude  AS DOUBLE PRECISION) BETWEEN :swLat AND :neLat
              AND CAST(s.longitude AS DOUBLE PRECISION) BETWEEN :swLng AND :neLng
              AND (:category IS NULL OR s.category = :category)
            ORDER BY s.store_id
            """;

    public List<StoreMarkerResponse> searchStoreMarkers(StoreSearchRequest req) {
        MapSqlParameterSource params = new MapSqlParameterSource()
                .addValue("swLat",      req.getSwLat())
                .addValue("neLat",      req.getNeLat())
                .addValue("swLng",      req.getSwLng())
                .addValue("neLng",      req.getNeLng())
                .addValue("category",   req.getCategory(),   Types.VARCHAR)
                .addValue("minProtein", req.getMinProtein(), Types.INTEGER)
                .addValue("maxCarbs",   req.getMaxCarbs(),   Types.INTEGER)
                .addValue("maxFat",     req.getMaxFat(),     Types.INTEGER)
                .addValue("maxSugar",   req.getMaxSugar(),   Types.INTEGER);

        boolean hasNutritionFilter = req.hasNutritionFilter();

        return jdbcTemplate.query(SEARCH_SQL, params, (rs, rowNum) -> {
            Long carbs          = toLong(rs.getObject("carbs"));
            Long protein        = toLong(rs.getObject("protein"));
            Long fat            = toLong(rs.getObject("fat"));
            String nutritionGrade = rs.getString("nutrition_grade");

            // 영양 필터가 있는데 해당 브랜드에 조건을 만족하는 메뉴가 없으면 제외
            if (hasNutritionFilter && carbs == null && protein == null && fat == null) {
                return null;
            }

            MarkerMacroDto macro = (carbs != null || protein != null || fat != null)
                    ? new MarkerMacroDto(carbs, protein, fat, nutritionGrade)
                    : null;

            return StoreMarkerResponse.builder()
                    .storeId(rs.getLong("store_id"))
                    .brandId(toLong(rs.getObject("brand_id")))
                    .storeName(rs.getString("store_name"))
                    .latitude(rs.getDouble("latitude"))
                    .longitude(rs.getDouble("longitude"))
                    .category(rs.getString("category"))
                    .markerMacro(macro)
                    .build();
        }).stream()
                .filter(r -> r != null)
                .toList();
    }

    private Long toLong(Object obj) {
        if (obj == null) return null;
        return ((Number) obj).longValue();
    }
}
