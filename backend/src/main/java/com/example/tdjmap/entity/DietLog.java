package com.example.tdjmap.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "diet_logs", schema = "tdj")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DietLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "log_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "menu_id")
    private Menu menu;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "store_id")
    private Store store;

    @Column(name = "log_kcal")
    private Long logKcal;

    @Column(name = "log_carbs")
    private Long logCarbs;

    @Column(name = "log_protein")
    private Long logProtein;

    @Column(name = "log_fat")
    private Long logFat;

    @Column(name = "log_sugar")
    private Long logSugar;

    @Column(name = "img_url")
    private String imgUrl;

    @Column(name = "meal_type", length = 20)
    private String mealType;

    @Column(name = "ate_at", nullable = false)
    private LocalDateTime ateAt;
}
