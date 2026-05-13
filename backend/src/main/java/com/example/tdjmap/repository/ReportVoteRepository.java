package com.example.tdjmap.repository;

import com.example.tdjmap.entity.ReportVote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ReportVoteRepository extends JpaRepository<ReportVote, Long> {

    Optional<ReportVote> findByReportIdAndUserId(Long reportId, Long userId);

    long countByReportIdAndVoteType(Long reportId, String voteType);

    @Query("SELECT rv.report.id, rv.voteType, COUNT(rv) FROM ReportVote rv WHERE rv.report.id IN :reportIds GROUP BY rv.report.id, rv.voteType")
    List<Object[]> countVotesByReportIds(@Param("reportIds") List<Long> reportIds);

    // reportId → voteType 맵 (UP/DOWN 한 번에 조회)
    @Query("SELECT rv.report.id, rv.voteType FROM ReportVote rv WHERE rv.report.id IN :reportIds AND rv.user.id = :userId")
    List<Object[]> findUserVotesByReportIds(@Param("reportIds") List<Long> reportIds, @Param("userId") Long userId);

    void deleteByReportIdAndUserId(Long reportId, Long userId);
}
