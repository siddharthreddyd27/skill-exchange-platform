package com.skillexchange.repository;

import com.skillexchange.entity.SkillExchange;
import com.skillexchange.entity.enums.ExchangeStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;

@Repository
public interface SkillExchangeRepository extends JpaRepository<SkillExchange, Long> {

    @Query("SELECT se FROM SkillExchange se WHERE se.initiator.id = :userId OR se.partner.id = :userId ORDER BY se.updatedAt DESC")
    List<SkillExchange> findUserExchanges(@Param("userId") Long userId);

    @Query("SELECT se FROM SkillExchange se WHERE (se.initiator.id = :userId OR se.partner.id = :userId) AND se.status = :status ORDER BY se.updatedAt DESC")
    List<SkillExchange> findUserExchangesByStatus(@Param("userId") Long userId, @Param("status") ExchangeStatus status);

    @Query("SELECT COUNT(se) FROM SkillExchange se WHERE (se.initiator.id = :userId OR se.partner.id = :userId) AND se.status IN :statuses")
    long countUserExchangesByStatusIn(@Param("userId") Long userId, @Param("statuses") Collection<ExchangeStatus> statuses);
}
