package com.skillexchange.service;

import com.skillexchange.dto.request.ProfileUpdateRequest;
import com.skillexchange.dto.response.UserProfileDto;
import com.skillexchange.dto.response.UserSkillDto;
import com.skillexchange.dto.response.UserSummaryDto;
import com.skillexchange.entity.ConnectionRequest;
import com.skillexchange.entity.User;
import com.skillexchange.entity.enums.ConnectionStatus;
import com.skillexchange.entity.enums.SkillType;
import com.skillexchange.exception.ResourceNotFoundException;
import com.skillexchange.repository.ConnectionRequestRepository;
import com.skillexchange.repository.SkillExchangeRepository;
import com.skillexchange.repository.UserRepository;
import com.skillexchange.repository.UserSkillRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final UserSkillRepository userSkillRepository;
    private final ConnectionRequestRepository connectionRequestRepository;
    private final SkillExchangeRepository skillExchangeRepository;
    private final SkillService skillService;

    public UserService(UserRepository userRepository,
                       UserSkillRepository userSkillRepository,
                       ConnectionRequestRepository connectionRequestRepository,
                       SkillExchangeRepository skillExchangeRepository,
                       SkillService skillService) {
        this.userRepository = userRepository;
        this.userSkillRepository = userSkillRepository;
        this.connectionRequestRepository = connectionRequestRepository;
        this.skillExchangeRepository = skillExchangeRepository;
        this.skillService = skillService;
    }

    @Transactional(readOnly = true)
    public UserProfileDto getCurrentUserProfile(Long currentUserId) {
        User user = userRepository.findById(currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", currentUserId));
        return buildUserProfile(user);
    }

    @Transactional(readOnly = true)
    public UserProfileDto getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
        return buildUserProfile(user);
    }

    @Transactional(readOnly = true)
    public UserProfileDto getUserByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));
        return buildUserProfile(user);
    }

    @Transactional
    public UserProfileDto updateProfile(Long currentUserId, ProfileUpdateRequest request) {
        User user = userRepository.findById(currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", currentUserId));

        if (StringUtils.hasText(request.getFullName())) {
            user.setFullName(request.getFullName().trim());
        }
        user.setBio(request.getBio());
        user.setAvatarUrl(request.getAvatarUrl());
        user.setInterests(request.getInterests());
        user.setLocation(request.getLocation());

        User updated = userRepository.save(user);
        return buildUserProfile(updated);
    }

    @Transactional(readOnly = true)
    public List<UserSummaryDto> searchUsers(String query, Long currentUserId) {
        List<User> users;
        if (StringUtils.hasText(query)) {
            users = userRepository.searchUsers(query.trim());
        } else {
            users = userRepository.findAll();
        }

        return users.stream()
                .filter(u -> currentUserId == null || !u.getId().equals(currentUserId))
                .map(u -> buildUserSummary(u, currentUserId))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<UserSummaryDto> filterUsersByTeachSkill(String skillName, String category, Long currentUserId) {
        List<User> users = userRepository.findUsersTeachingSkill(
                StringUtils.hasText(skillName) ? skillName.trim() : null,
                StringUtils.hasText(category) ? category.trim() : null
        );

        return users.stream()
                .filter(u -> currentUserId == null || !u.getId().equals(currentUserId))
                .map(u -> buildUserSummary(u, currentUserId))
                .collect(Collectors.toList());
    }

    public UserSummaryDto buildUserSummary(User user, Long currentUserId) {
        UserSummaryDto dto = new UserSummaryDto();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setFullName(user.getFullName());
        dto.setAvatarUrl(user.getAvatarUrl());
        dto.setBio(user.getBio());
        dto.setInterests(user.getInterests());
        dto.setLocation(user.getLocation());

        // Skills taught
        List<UserSkillDto> teachSkills = userSkillRepository.findByUserIdAndSkillType(user.getId(), SkillType.TEACH)
                .stream().map(skillService::mapToUserSkillDto).collect(Collectors.toList());
        dto.setTeachingSkills(teachSkills);

        // Skills wanted to learn
        List<UserSkillDto> learnSkills = userSkillRepository.findByUserIdAndSkillType(user.getId(), SkillType.LEARN)
                .stream().map(skillService::mapToUserSkillDto).collect(Collectors.toList());
        dto.setLearningSkills(learnSkills);

        // Calculate connection status relative to current user
        if (currentUserId != null && !currentUserId.equals(user.getId())) {
            List<ConnectionRequest> reqs = connectionRequestRepository.findBetweenUsers(currentUserId, user.getId());
            if (!reqs.isEmpty()) {
                ConnectionRequest latest = reqs.get(0);
                dto.setConnectionId(latest.getId());
                if (latest.getStatus() == ConnectionStatus.ACCEPTED) {
                    dto.setConnectionStatus("CONNECTED");
                } else if (latest.getStatus() == ConnectionStatus.PENDING) {
                    if (latest.getSender().getId().equals(currentUserId)) {
                        dto.setConnectionStatus("PENDING_OUTGOING");
                    } else {
                        dto.setConnectionStatus("PENDING_INCOMING");
                    }
                } else {
                    dto.setConnectionStatus("REJECTED");
                }
            } else {
                dto.setConnectionStatus("NONE");
            }
        } else {
            dto.setConnectionStatus("SELF");
        }

        return dto;
    }

    public UserProfileDto buildUserProfile(User user) {
        UserProfileDto dto = new UserProfileDto();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setFullName(user.getFullName());
        dto.setBio(user.getBio());
        dto.setAvatarUrl(user.getAvatarUrl());
        dto.setInterests(user.getInterests());
        dto.setLocation(user.getLocation());
        dto.setRole(user.getRole().name());
        dto.setCreatedAt(user.getCreatedAt());

        List<UserSkillDto> teachSkills = userSkillRepository.findByUserIdAndSkillType(user.getId(), SkillType.TEACH)
                .stream().map(skillService::mapToUserSkillDto).collect(Collectors.toList());
        dto.setTeachingSkills(teachSkills);

        List<UserSkillDto> learnSkills = userSkillRepository.findByUserIdAndSkillType(user.getId(), SkillType.LEARN)
                .stream().map(skillService::mapToUserSkillDto).collect(Collectors.toList());
        dto.setLearningSkills(learnSkills);

        long connectionsCount = connectionRequestRepository.findAcceptedConnectionsForUser(user.getId()).size();
        dto.setTotalConnections(connectionsCount);

        long exchangesCount = skillExchangeRepository.findUserExchanges(user.getId()).size();
        dto.setTotalExchanges(exchangesCount);

        return dto;
    }
}
