package com.example.tdjmap.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "stores", schema = "tdj")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Store {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "store_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "brand_id")
    private Brand brand;

    @Column(name = "store_name")
    private String name;

    private String address;

    @Column(nullable = false, precision = 11, scale = 7)
    private BigDecimal longitude;

    @Column(nullable = false, precision = 10, scale = 7)
    private BigDecimal latitude;

    private String category;

    @Column(name = "created_at")
    private LocalDateTime createdAt;
}
