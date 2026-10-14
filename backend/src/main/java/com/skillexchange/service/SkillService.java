package com.skillexchange.service;

import com.skillexchange.dto.request.SkillCreateRequest;
import com.skillexchange.dto.request.UserSkillRequest;
import com.skillexchange.dto.response.SkillDto;
import com.skillexchange.dto.response.UserSkillDto;
import com.skillexchange.entity.Skill;
import com.skillexchange.entity.User;
import com.skillexchange.entity.UserSkill;
import com.skillexchange.entity.enums.SkillType;
import com.skillexchange.exception.BadRequestException;
import com.skillexchange.exception.ResourceNotFoundException;
import com.skillexchange.repository.SkillRepository;
import com.skillexchange.repository.UserRepository;
import com.skillexchange.repository.UserSkillRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class SkillService {

    private final SkillRepository skillRepository;
    private final UserSkillRepository userSkillRepository;
    private final UserRepository userRepository;

    public SkillService(SkillRepository skillRepository,
                        UserSkillRepository userSkillRepository,
                        UserRepository userRepository) {
        this.skillRepository = skillRepository;
        this.userSkillRepository = userSkillRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<SkillDto> getAllSkills() {
        return skillRepository.findAll().stream()
                .map(this::mapToSkillDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<SkillDto> searchSkills(String query) {
        if (!StringUtils.hasText(query)) {
            return getAllSkills();
        }
        return skillRepository.searchSkills(query.trim()).stream()
                .map(this::mapToSkillDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<String> getAllCategories() {
        return skillRepository.findAllCategories();
    }

    @Transactional
    public SkillDto createSkill(SkillCreateRequest request) {
        String trimmedName = request.getName().trim();
        Optional<Skill> existing = skillRepository.findByNameIgnoreCase(trimmedName);
        if (existing.isPresent()) {
            return mapToSkillDto(existing.get());
        }

        Skill skill = new Skill(
                trimmedName,
                request.getCategory().trim(),
                request.getDescription() != null ? request.getDescription().trim() : null
        );
        Skill saved = skillRepository.save(skill);
        return mapToSkillDto(saved);
    }

    @Transactional
    public Skill getOrCreateSkill(String name, String category, String description) {
        String trimmedName = name.trim();
        return skillRepository.findByNameIgnoreCase(trimmedName)
                .orElseGet(() -> skillRepository.save(new Skill(
                        trimmedName,
                        StringUtils.hasText(category) ? category.trim() : "General",
                        description != null ? description.trim() : ""
                )));
    }

    @Transactional(readOnly = true)
    public List<UserSkillDto> getUserSkills(Long userId, SkillType skillType) {
        List<UserSkill> list = (skillType != null)
                ? userSkillRepository.findByUserIdAndSkillType(userId, skillType)
                : userSkillRepository.findByUserId(userId);

        return list.stream().map(this::mapToUserSkillDto).collect(Collectors.toList());
    }

    @Transactional
    public UserSkillDto addUserSkill(Long userId, UserSkillRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        Skill skill;
        if (request.getSkillId() != null) {
            skill = skillRepository.findById(request.getSkillId())
                    .orElseThrow(() -> new ResourceNotFoundException("Skill", "id", request.getSkillId()));
        } else if (StringUtils.hasText(request.getSkillName())) {
            skill = getOrCreateSkill(request.getSkillName(), request.getCategory(), request.getDescription());
        } else {
            throw new BadRequestException("Either skillId or skillName must be provided");
        }

        // Check if user already has this skill with this type
        if (userSkillRepository.existsByUserIdAndSkillIdAndSkillType(userId, skill.getId(), request.getSkillType())) {
            throw new BadRequestException("You have already added " + skill.getName() + " to your " + request.getSkillType() + " list");
        }

        UserSkill userSkill = new UserSkill(
                user,
                skill,
                request.getSkillType(),
                request.getProficiencyLevel(),
                request.getDescription(),
                request.getYearsOfExperience()
        );

        UserSkill saved = userSkillRepository.save(userSkill);
        return mapToUserSkillDto(saved);
    }

    @Transactional
    public UserSkillDto updateUserSkill(Long userId, Long userSkillId, UserSkillRequest request) {
        UserSkill userSkill = userSkillRepository.findByUserIdAndId(userId, userSkillId)
                .orElseThrow(() -> new ResourceNotFoundException("Skill entry not found for this user"));

        if (request.getProficiencyLevel() != null) {
            userSkill.setProficiencyLevel(request.getProficiencyLevel());
        }
        if (request.getDescription() != null) {
            userSkill.setDescription(request.getDescription());
        }
        if (request.getYearsOfExperience() != null) {
            userSkill.setYearsOfExperience(request.getYearsOfExperience());
        }

        UserSkill updated = userSkillRepository.save(userSkill);
        return mapToUserSkillDto(updated);
    }

    @Transactional
    public void removeUserSkill(Long userId, Long userSkillId) {
        UserSkill userSkill = userSkillRepository.findByUserIdAndId(userId, userSkillId)
                .orElseThrow(() -> new ResourceNotFoundException("Skill entry not found for this user"));

        userSkillRepository.delete(userSkill);
    }

    public SkillDto mapToSkillDto(Skill skill) {
        return new SkillDto(
                skill.getId(),
                skill.getName(),
                skill.getCategory(),
                skill.getDescription(),
                skill.getCreatedAt()
        );
    }

    public UserSkillDto mapToUserSkillDto(UserSkill userSkill) {
        UserSkillDto dto = new UserSkillDto();
        dto.setId(userSkill.getId());
        dto.setSkillId(userSkill.getSkill().getId());
        dto.setSkillName(userSkill.getSkill().getName());
        dto.setCategory(userSkill.getSkill().getCategory());
        dto.setSkillType(userSkill.getSkillType());
        dto.setProficiencyLevel(userSkill.getProficiencyLevel());
        dto.setDescription(userSkill.getDescription());
        dto.setYearsOfExperience(userSkill.getYearsOfExperience());
        dto.setCreatedAt(userSkill.getCreatedAt());
        return dto;
    }
}
