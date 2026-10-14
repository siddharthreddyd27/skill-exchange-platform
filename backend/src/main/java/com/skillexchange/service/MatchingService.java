package com.skillexchange.service;

import com.skillexchange.dto.response.SkillMatchDto;
import com.skillexchange.dto.response.UserSummaryDto;
import com.skillexchange.entity.User;
import com.skillexchange.entity.UserSkill;
import com.skillexchange.entity.enums.SkillType;
import com.skillexchange.repository.UserRepository;
import com.skillexchange.repository.UserSkillRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class MatchingService {

    private final UserRepository userRepository;
    private final UserSkillRepository userSkillRepository;
    private final UserService userService;

    public MatchingService(UserRepository userRepository,
                           UserSkillRepository userSkillRepository,
                           UserService userService) {
        this.userRepository = userRepository;
        this.userSkillRepository = userSkillRepository;
        this.userService = userService;
    }

    @Transactional(readOnly = true)
    public List<SkillMatchDto> getSmartMatchesForUser(Long userId) {
        User currentUser = userRepository.findById(userId).orElse(null);
        if (currentUser == null) {
            return Collections.emptyList();
        }

        List<UserSkill> mySkills = userSkillRepository.findByUserId(userId);
        Set<String> myTeachingSkillNames = mySkills.stream()
                .filter(us -> us.getSkillType() == SkillType.TEACH)
                .map(us -> us.getSkill().getName().toLowerCase().trim())
                .collect(Collectors.toSet());

        Set<String> myLearningSkillNames = mySkills.stream()
                .filter(us -> us.getSkillType() == SkillType.LEARN)
                .map(us -> us.getSkill().getName().toLowerCase().trim())
                .collect(Collectors.toSet());

        List<User> otherUsers = userRepository.findAll().stream()
                .filter(u -> !u.getId().equals(userId))
                .collect(Collectors.toList());

        List<SkillMatchDto> matches = new ArrayList<>();

        for (User other : otherUsers) {
            List<UserSkill> otherSkills = userSkillRepository.findByUserId(other.getId());

            List<String> theyCanTeachMe = new ArrayList<>();
            List<String> iCanTeachThem = new ArrayList<>();

            for (UserSkill os : otherSkills) {
                String skillName = os.getSkill().getName();
                String lowerName = skillName.toLowerCase().trim();

                if (os.getSkillType() == SkillType.TEACH && myLearningSkillNames.contains(lowerName)) {
                    theyCanTeachMe.add(skillName);
                }
                if (os.getSkillType() == SkillType.LEARN && myTeachingSkillNames.contains(lowerName)) {
                    iCanTeachThem.add(skillName);
                }
            }

            int score = 0;
            String type = null;
            String reason = null;

            if (!theyCanTeachMe.isEmpty() && !iCanTeachThem.isEmpty()) {
                score = Math.min(100, 85 + (theyCanTeachMe.size() + iCanTeachThem.size()) * 5);
                type = "MUTUAL_MATCH";
                reason = "Perfect 2-way match! They can teach you " + String.join(", ", theyCanTeachMe)
                        + " and want to learn " + String.join(", ", iCanTeachThem) + " from you.";
            } else if (!theyCanTeachMe.isEmpty()) {
                score = Math.min(85, 70 + theyCanTeachMe.size() * 5);
                type = "CAN_TEACH_YOU";
                reason = "They teach " + String.join(", ", theyCanTeachMe) + " which is on your wishlist!";
            } else if (!iCanTeachThem.isEmpty()) {
                score = Math.min(75, 60 + iCanTeachThem.size() * 5);
                type = "WANTS_TO_LEARN_FROM_YOU";
                reason = "They want to learn " + String.join(", ", iCanTeachThem) + " which you can teach!";
            } else if (currentUser.getInterests() != null && other.getInterests() != null) {
                // Check if they share interest keywords
                String[] myInts = currentUser.getInterests().toLowerCase().split("[,\\s]+");
                String otherInts = other.getInterests().toLowerCase();
                boolean shareInterest = Arrays.stream(myInts).anyMatch(i -> i.length() > 2 && otherInts.contains(i));
                if (shareInterest) {
                    score = 45;
                    type = "RELATED_INTERESTS";
                    reason = "Shares similar interests and learning goals with you.";
                }
            }

            if (score > 0) {
                SkillMatchDto matchDto = new SkillMatchDto();
                UserSummaryDto userSummary = userService.buildUserSummary(other, userId);
                matchDto.setUser(userSummary);
                matchDto.setMatchScore(score);
                matchDto.setMatchType(type);
                matchDto.setMatchReason(reason);
                matchDto.setMatchingSkillsToLearn(theyCanTeachMe);
                matchDto.setMatchingSkillsToTeach(iCanTeachThem);
                matches.add(matchDto);
            }
        }

        // Sort by match score descending
        matches.sort((a, b) -> Integer.compare(b.getMatchScore(), a.getMatchScore()));

        // Return top 10 matches
        return matches.stream().limit(10).collect(Collectors.toList());
    }
}
