package com.skillexchange;

import com.skillexchange.dto.response.SkillMatchDto;
import com.skillexchange.dto.response.UserSummaryDto;
import com.skillexchange.entity.Skill;
import com.skillexchange.entity.User;
import com.skillexchange.entity.UserSkill;
import com.skillexchange.entity.enums.ProficiencyLevel;
import com.skillexchange.entity.enums.SkillType;
import com.skillexchange.repository.UserRepository;
import com.skillexchange.repository.UserSkillRepository;
import com.skillexchange.service.MatchingService;
import com.skillexchange.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class MatchingServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private UserSkillRepository userSkillRepository;

    @Mock
    private UserService userService;

    @InjectMocks
    private MatchingService matchingService;

    private User user1;
    private User user2;
    private Skill javaSkill;
    private Skill pythonSkill;

    @BeforeEach
    void setUp() {
        user1 = new User("dev1", "dev1@test.com", "pass", "Developer One");
        user1.setId(1L);

        user2 = new User("dev2", "dev2@test.com", "pass", "Developer Two");
        user2.setId(2L);

        javaSkill = new Skill("Java", "Programming", "Java backend");
        javaSkill.setId(101L);

        pythonSkill = new Skill("Python", "Programming", "Python data");
        pythonSkill.setId(102L);
    }

    @Test
    void testMutualSkillMatch() {
        // user1 teaches Java, wants to learn Python
        UserSkill u1Teach = new UserSkill(user1, javaSkill, SkillType.TEACH, ProficiencyLevel.ADVANCED, "", 3);
        UserSkill u1Learn = new UserSkill(user1, pythonSkill, SkillType.LEARN, ProficiencyLevel.BEGINNER, "", 0);

        // user2 teaches Python, wants to learn Java
        UserSkill u2Teach = new UserSkill(user2, pythonSkill, SkillType.TEACH, ProficiencyLevel.ADVANCED, "", 4);
        UserSkill u2Learn = new UserSkill(user2, javaSkill, SkillType.LEARN, ProficiencyLevel.BEGINNER, "", 0);

        when(userRepository.findById(1L)).thenReturn(Optional.of(user1));
        when(userSkillRepository.findByUserId(1L)).thenReturn(Arrays.asList(u1Teach, u1Learn));
        when(userRepository.findAll()).thenReturn(Arrays.asList(user1, user2));
        when(userSkillRepository.findByUserId(2L)).thenReturn(Arrays.asList(u2Teach, u2Learn));

        UserSummaryDto u2Summary = new UserSummaryDto();
        u2Summary.setId(2L);
        u2Summary.setFullName("Developer Two");
        when(userService.buildUserSummary(user2, 1L)).thenReturn(u2Summary);

        List<SkillMatchDto> matches = matchingService.getSmartMatchesForUser(1L);

        assertFalse(matches.isEmpty());
        SkillMatchDto match = matches.get(0);
        assertEquals("MUTUAL_MATCH", match.getMatchType());
        assertTrue(match.getMatchScore() >= 85);
        assertTrue(match.getMatchingSkillsToLearn().contains("Python"));
        assertTrue(match.getMatchingSkillsToTeach().contains("Java"));
    }
}
