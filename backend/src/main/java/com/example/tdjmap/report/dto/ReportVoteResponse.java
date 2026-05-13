package com.example.tdjmap.report.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ReportVoteResponse {
    private long upVotes;
    private long downVotes;
    private String myVote;
}
