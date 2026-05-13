package com.example.tdjmap.repository;

import com.example.tdjmap.entity.Report;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ReportRepository extends JpaRepository<Report, Long> {
    List<Report> findAllByOrderByCreatedAtDesc();
    List<Report> findByStatusOrderByCreatedAtDesc(String status);

    @Query("SELECT r FROM Report r LEFT JOIN FETCH r.store LEFT JOIN FETCH r.menu WHERE r.status = 'PENDING' ORDER BY r.createdAt DESC")
    List<Report> findPendingWithRelations();

    @Query("SELECT r FROM Report r LEFT JOIN FETCH r.store LEFT JOIN FETCH r.menu WHERE r.store.id = :storeId AND r.status = 'PENDING' ORDER BY r.createdAt DESC")
    List<Report> findPendingByStoreId(@Param("storeId") Long storeId);

    @Query("SELECT r FROM Report r WHERE r.menu.id IN :menuIds AND r.status = 'PENDING' ORDER BY r.createdAt DESC")
    List<Report> findPendingByMenuIds(@Param("menuIds") List<Long> menuIds);
}
