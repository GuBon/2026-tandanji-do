package com.example.tdjmap.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "menus", schema = "tdj")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Menu {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "menu_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "brand_id")
    private Brand brand;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "store_id")
    private Store store;

    @Column(name = "menu_name", nullable = false)
    private String name;

    private Long kcal;
    private Long carbs;
    private Long protein;
    private Long fat;
    private Long sugar;

    @Column(name = "menu_url")
    private String menuUrl;

    @Column(name = "is_standard")
    private Boolean isStandard;

    @Column(name = "nutrition_info", columnDefinition = "jsonb", insertable = false, updatable = false)
    private String nutritionInfo;
}
