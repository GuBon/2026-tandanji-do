package com.example.tdjmap.repository;

import com.example.tdjmap.entity.Brand;
import com.example.tdjmap.entity.Menu;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MenuRepository extends JpaRepository<Menu, Long> {
    boolean existsByBrandAndName(Brand brand, String name);
    List<Menu> findByBrand_IdOrderByIdAsc(Long brandId);
}
