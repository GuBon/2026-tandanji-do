package com.example.tdjmap.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "exercise_types", schema = "tandanji")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExerciseType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "type_id")
    private Long id;

    @Column(name = "type_name", nullable = false)
    private String name;

    @Column(name = "met_value", nullable = false, precision = 4, scale = 2)
    private BigDecimal metValue;

    @Column(name = "icon_url")
    private String iconUrl;
}
