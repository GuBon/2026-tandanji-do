package com.example.tdjmap.repository;

import com.example.tdjmap.entity.Store;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StoreRepository extends JpaRepository<Store, Long> {
    List<Store> findByBrandId(Long brandId);
}
