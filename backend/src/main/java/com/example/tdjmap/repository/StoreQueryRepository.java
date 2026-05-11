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
            SELECT
                s.store_id,
                s.brand_id,
                s.store_name,
                s.address,
                CAST(s.latitude  AS DOUBLE PRECISION) AS latitude,
                CAST(s.longitude AS DOUBLE PRECISION) AS longitude,
                s.category,
                CAST(ROUND(AVG(r.star)::numeric, 1) AS DOUBLE PRECISION) AS rating,
                bm.carbs,
                bm.protein,
                bm.fat,
                bm.nutrition_grade,
                bm.nutrition_tags
            FROM tandanji.stores s
            LEFT JOIN tandanji.reviews r ON r.store_id = s.store_id
            LEFT JOIN LATERAL (
                SELECT
                    m.carbs,
                    m.protein,
                    m.fat,
                    m.nutrition_info->>'grade' AS nutrition_grade,
                    ARRAY(
                        SELECT jsonb_array_elements_text(COALESCE(m.nutrition_info->'tags', '[]'::jsonb))
                    ) AS nutrition_tags
                FROM tandanji.menus m
                WHERE (m.store_id = s.store_id OR (m.store_id IS NULL AND m.brand_id = s.brand_id))
                ORDER BY
                         CASE WHEN m.store_id = s.store_id THEN 0 ELSE 1 END,
                         CASE m.nutrition_info->>'grade'
                             WHEN 'GREEN'  THEN 1
                             WHEN 'YELLOW' THEN 2
                             WHEN 'RED'    THEN 3
                             ELSE 4
                         END,
                         m.menu_id
                LIMIT 1
            ) bm ON TRUE
            WHERE CAST(s.latitude  AS DOUBLE PRECISION) BETWEEN :swLat AND :neLat
              AND CAST(s.longitude AS DOUBLE PRECISION) BETWEEN :swLng AND :neLng
              AND (:category IS NULL OR s.category = :category)
              AND (
                  :keywordLike IS NULL
                  OR LOWER(s.store_name) LIKE :keywordLike
                  OR LOWER(COALESCE(s.address, '')) LIKE :keywordLike
                  OR EXISTS (
                      SELECT 1
                      FROM tandanji.brands b
                      WHERE b.brand_id = s.brand_id
                        AND LOWER(COALESCE(b.brand_name, '')) LIKE :keywordLike
                  )
                  OR EXISTS (
                      SELECT 1
                      FROM tandanji.menus sm
                      WHERE (sm.store_id = s.store_id OR (sm.store_id IS NULL AND sm.brand_id = s.brand_id))
                        AND LOWER(sm.menu_name) LIKE :keywordLike
                  )
              )
            GROUP BY
                s.store_id,
                s.brand_id,
                s.store_name,
                s.address,
                s.latitude,
                s.longitude,
                s.category,
                bm.carbs,
                bm.protein,
                bm.fat,
                bm.nutrition_grade,
                bm.nutrition_tags
            ORDER BY s.store_id
            """;

    public List<StoreMarkerResponse> searchStoreMarkers(StoreSearchRequest req) {
        MapSqlParameterSource params = new MapSqlParameterSource()
                .addValue("swLat", req.getSwLat())
                .addValue("neLat", req.getNeLat())
                .addValue("swLng", req.getSwLng())
                .addValue("neLng", req.getNeLng())
                .addValue("category", req.getCategory(), Types.VARCHAR)
                .addValue("keywordLike", toKeywordLike(req.getKeyword()), Types.VARCHAR);

        return jdbcTemplate.query(SEARCH_SQL, params, (rs, rowNum) -> {
            Long carbs = toLong(rs.getObject("carbs"));
            Long protein = toLong(rs.getObject("protein"));
            Long fat = toLong(rs.getObject("fat"));
            String nutritionGrade = rs.getString("nutrition_grade");
            List<String> nutritionTags = toStringList(rs.getArray("nutrition_tags"));

            MarkerMacroDto macro = (carbs != null || protein != null || fat != null)
                    ? new MarkerMacroDto(carbs, protein, fat, nutritionGrade, nutritionTags)
                    : null;

            return StoreMarkerResponse.builder()
                    .storeId(rs.getLong("store_id"))
                    .brandId(toLong(rs.getObject("brand_id")))
                    .storeName(rs.getString("store_name"))
                    .address(rs.getString("address"))
                    .latitude(rs.getDouble("latitude"))
                    .longitude(rs.getDouble("longitude"))
                    .category(rs.getString("category"))
                    .rating(toDouble(rs.getObject("rating")))
                    .markerMacro(macro)
                    .build();
        });
    }

    private Long toLong(Object obj) {
        if (obj == null) return null;
        return ((Number) obj).longValue();
    }

    private Double toDouble(Object obj) {
        if (obj == null) return null;
        return ((Number) obj).doubleValue();
    }

    private String toKeywordLike(String keyword) {
        if (keyword == null || keyword.isBlank()) {
            return null;
        }
        return "%" + keyword.trim().toLowerCase() + "%";
    }

    private List<String> toStringList(java.sql.Array array) throws java.sql.SQLException {
        if (array == null) {
            return List.of();
        }
        Object raw = array.getArray();
        if (raw instanceof String[] strings) {
            return List.of(strings);
        }
        return List.of();
    }
}
