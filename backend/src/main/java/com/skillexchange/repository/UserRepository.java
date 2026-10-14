package com.skillexchange.repository;

import com.skillexchange.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);

    Optional<User> findByUsernameOrEmail(String username, String email);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);

    @Query("SELECT DISTINCT u FROM User u " +
           "LEFT JOIN u.userSkills us " +
           "LEFT JOIN us.skill s " +
           "WHERE (:query IS NULL OR :query = '' " +
           "   OR LOWER(u.fullName) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "   OR LOWER(u.username) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "   OR LOWER(u.interests) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "   OR LOWER(s.name) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "   OR LOWER(s.category) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<User> searchUsers(@Param("query") String query);

    @Query("SELECT DISTINCT u FROM User u " +
           "JOIN u.userSkills us " +
           "JOIN us.skill s " +
           "WHERE us.skillType = com.skillexchange.entity.enums.SkillType.TEACH " +
           "AND (:skillName IS NULL OR LOWER(s.name) LIKE LOWER(CONCAT('%', :skillName, '%'))) " +
           "AND (:category IS NULL OR LOWER(s.category) = LOWER(:category))")
    List<User> findUsersTeachingSkill(@Param("skillName") String skillName, @Param("category") String category);
}
