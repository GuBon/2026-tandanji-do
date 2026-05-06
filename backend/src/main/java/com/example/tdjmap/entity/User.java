package com.example.tdjmap.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "users", schema = "tandanji")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long id;

    private String email;
    private String nickname;
    private Long height;
    private Long weight;
    private String gender;

    @Builder.Default
    @Column(nullable = false, length = 10)
    private String role = "USER";

    @Column(name = "created_at")
    private LocalDateTime createdAt;
}
