package com.skillexchange.repository;

import com.skillexchange.entity.UserSkill;
import com.skillexchange.entity.enums.SkillType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserSkillRepository extends JpaRepository<UserSkill, Long> {

    List<UserSkill> findByUserId(Long userId);

    List<UserSkill> findByUserIdAndSkillType(Long userId, SkillType skillType);

    List<UserSkill> findBySkillId(Long skillId);

    List<UserSkill> findBySkillIdAndSkillType(Long skillId, SkillType skillType);

    Optional<UserSkill> findByUserIdAndSkillIdAndSkillType(Long userId, Long skillId, SkillType skillType);

    boolean existsByUserIdAndSkillIdAndSkillType(Long userId, Long skillId, SkillType skillType);

    @Query("SELECT us FROM UserSkill us WHERE us.user.id = :userId AND us.id = :userSkillId")
    Optional<UserSkill> findByUserIdAndId(@Param("userId") Long userId, @Param("userSkillId") Long userSkillId);

    void deleteByUserIdAndId(Long userId, Long id);

    @Query("SELECT COUNT(us) FROM UserSkill us WHERE us.user.id = :userId AND us.skillType = :skillType")
    long countByUserIdAndSkillType(@Param("userId") Long userId, @Param("skillType") SkillType skillType);
}
