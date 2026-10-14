package com.skillexchange.repository;

import com.skillexchange.entity.Skill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SkillRepository extends JpaRepository<Skill, Long> {

    Optional<Skill> findByNameIgnoreCase(String name);

    boolean existsByNameIgnoreCase(String name);

    List<Skill> findByCategoryIgnoreCase(String category);

    @Query("SELECT s FROM Skill s WHERE " +
           "LOWER(s.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(s.category) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(s.description) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Skill> searchSkills(@Param("query") String query);

    @Query("SELECT DISTINCT s.category FROM Skill s ORDER BY s.category ASC")
    List<String> findAllCategories();
}
