package com.example.tdjmap.repository;

import com.example.tdjmap.entity.Brand;
import com.example.tdjmap.entity.Menu;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MenuRepository extends JpaRepository<Menu, Long> {
    boolean existsByBrandAndName(Brand brand, String name);
    List<Menu> findByBrand_IdOrderByIdAsc(Long brandId);

    @Query("""
            select m
            from Menu m
            where m.store.id = :storeId
               or (:brandId is not null and m.brand.id = :brandId and m.store is null)
            order by m.id asc
            """)
    List<Menu> findStoreMenus(@Param("storeId") Long storeId, @Param("brandId") Long brandId);
}
