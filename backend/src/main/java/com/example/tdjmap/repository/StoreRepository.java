package com.example.tdjmap.repository;

import com.example.tdjmap.entity.Store;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface StoreRepository extends JpaRepository<Store, Long> {
    List<Store> findByBrandId(Long brandId);

    // 위도/경도 근접 매칭 (약 ±0.001도 ≈ 100m 이내)
    @Query("SELECT s FROM Store s WHERE ABS(s.latitude - :lat) < 0.000009 AND ABS(s.longitude - :lon) < 0.000009 ORDER BY ABS(s.latitude - :lat) + ABS(s.longitude - :lon) ASC")
    List<Store> findNearby(@Param("lat") double lat, @Param("lon") double lon);
}
