package com.skillexchange.controller;

import com.skillexchange.config.UserPrincipal;
import com.skillexchange.dto.response.DashboardStatsDto;
import com.skillexchange.dto.response.SkillMatchDto;
import com.skillexchange.service.DashboardService;
import com.skillexchange.service.MatchingService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;
    private final MatchingService matchingService;

    public DashboardController(DashboardService dashboardService, MatchingService matchingService) {
        this.dashboardService = dashboardService;
        this.matchingService = matchingService;
    }

    @GetMapping
    public ResponseEntity<DashboardStatsDto> getDashboard(@AuthenticationPrincipal UserPrincipal currentUser) {
        DashboardStatsDto stats = dashboardService.getDashboardData(currentUser.getId());
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/matches")
    public ResponseEntity<List<SkillMatchDto>> getMatches(@AuthenticationPrincipal UserPrincipal currentUser) {
        List<SkillMatchDto> matches = matchingService.getSmartMatchesForUser(currentUser.getId());
        return ResponseEntity.ok(matches);
    }
}
