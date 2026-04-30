package com.example.tdjmap.repository;

import com.example.tdjmap.entity.Brand;
import com.example.tdjmap.entity.Menu;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MenuRepository extends JpaRepository<Menu, Long> {
    boolean existsByBrandAndName(Brand brand, String name);
}
