package com.example.tdjmap.store.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class MenuReportGroupResponse {
    private Long menuId;
    private String menuName;
    private List<MenuReportItemDto> reports;
}
