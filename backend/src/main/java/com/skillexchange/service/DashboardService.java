package com.skillexchange.service;

import com.skillexchange.dto.response.DashboardStatsDto;
import com.skillexchange.dto.response.UserProfileDto;
import com.skillexchange.entity.enums.ConnectionStatus;
import com.skillexchange.entity.enums.ExchangeStatus;
import com.skillexchange.entity.enums.SkillType;
import com.skillexchange.repository.ConnectionRequestRepository;
import com.skillexchange.repository.SkillExchangeRepository;
import com.skillexchange.repository.UserSkillRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;

@Service
public class DashboardService {

    private final UserService userService;
    private final UserSkillRepository userSkillRepository;
    private final ConnectionRequestRepository connectionRequestRepository;
    private final SkillExchangeRepository skillExchangeRepository;
    private final ConnectionService connectionService;
    private final SkillExchangeService skillExchangeService;
    private final MatchingService matchingService;

    public DashboardService(UserService userService,
                            UserSkillRepository userSkillRepository,
                            ConnectionRequestRepository connectionRequestRepository,
                            SkillExchangeRepository skillExchangeRepository,
                            ConnectionService connectionService,
                            SkillExchangeService skillExchangeService,
                            MatchingService matchingService) {
        this.userService = userService;
        this.userSkillRepository = userSkillRepository;
        this.connectionRequestRepository = connectionRequestRepository;
        this.skillExchangeRepository = skillExchangeRepository;
        this.connectionService = connectionService;
        this.skillExchangeService = skillExchangeService;
        this.matchingService = matchingService;
    }

    @Transactional(readOnly = true)
    public DashboardStatsDto getDashboardData(Long userId) {
        DashboardStatsDto stats = new DashboardStatsDto();

        UserProfileDto profile = userService.getCurrentUserProfile(userId);
        stats.setProfile(profile);

        stats.setTotalTeachingSkills(userSkillRepository.countByUserIdAndSkillType(userId, SkillType.TEACH));
        stats.setTotalLearningSkills(userSkillRepository.countByUserIdAndSkillType(userId, SkillType.LEARN));

        stats.setPendingIncomingRequests(connectionRequestRepository.countByReceiverIdAndStatus(userId, ConnectionStatus.PENDING));
        stats.setPendingOutgoingRequests(connectionRequestRepository.countBySenderIdAndStatus(userId, ConnectionStatus.PENDING));

        long acceptedCount = connectionRequestRepository.findAcceptedConnectionsForUser(userId).size();
        stats.setTotalConnections(acceptedCount);

        long activeCount = skillExchangeRepository.countUserExchangesByStatusIn(
                userId,
                Arrays.asList(ExchangeStatus.PROPOSED, ExchangeStatus.ACCEPTED, ExchangeStatus.IN_PROGRESS)
        );
        stats.setActiveExchanges(activeCount);

        long completedCount = skillExchangeRepository.countUserExchangesByStatusIn(
                userId,
                Arrays.asList(ExchangeStatus.COMPLETED)
        );
        stats.setCompletedExchanges(completedCount);

        // Smart matches
        stats.setSuggestedMatches(matchingService.getSmartMatchesForUser(userId));

        // Recent incoming requests
        stats.setRecentIncomingRequests(
                connectionService.getIncomingRequests(userId).stream().limit(5).toList()
        );

        // Recent exchanges
        stats.setRecentExchanges(
                skillExchangeService.getUserExchanges(userId, null).stream().limit(5).toList()
        );

        return stats;
    }
}
