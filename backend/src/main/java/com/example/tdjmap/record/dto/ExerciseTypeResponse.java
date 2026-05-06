package com.example.tdjmap.record.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;

@Getter
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ExerciseTypeResponse {
    private Long typeId;
    private String typeName;
    private BigDecimal metValue;
    private String iconUrl;
}
