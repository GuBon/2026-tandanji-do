package com.example.tdjmap.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "exercise_logs", schema = "tdj")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExerciseLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "exercise_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "type_id", nullable = false)
    private ExerciseType type;

    private String title;

    @Column(name = "duration_min", nullable = false)
    private Long durationMin;

    @Column(name = "calories_burned", nullable = false)
    private Long caloriesBurned;

    @Column(columnDefinition = "text")
    private String memo;

    @Column(name = "created_at")
    private LocalDateTime createdAt;
}
