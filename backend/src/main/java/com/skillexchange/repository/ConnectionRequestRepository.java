package com.skillexchange.repository;

import com.skillexchange.entity.ConnectionRequest;
import com.skillexchange.entity.enums.ConnectionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Repository
public interface ConnectionRequestRepository extends JpaRepository<ConnectionRequest, Long> {

    List<ConnectionRequest> findByReceiverIdOrderByCreatedAtDesc(Long receiverId);

    List<ConnectionRequest> findBySenderIdOrderByCreatedAtDesc(Long senderId);

    List<ConnectionRequest> findByReceiverIdAndStatusOrderByCreatedAtDesc(Long receiverId, ConnectionStatus status);

    List<ConnectionRequest> findBySenderIdAndStatusOrderByCreatedAtDesc(Long senderId, ConnectionStatus status);

    @Query("SELECT cr FROM ConnectionRequest cr WHERE " +
           "(cr.sender.id = :u1 AND cr.receiver.id = :u2) OR " +
           "(cr.sender.id = :u2 AND cr.receiver.id = :u1)")
    List<ConnectionRequest> findBetweenUsers(@Param("u1") Long u1, @Param("u2") Long u2);

    @Query("SELECT cr FROM ConnectionRequest cr WHERE " +
           "((cr.sender.id = :u1 AND cr.receiver.id = :u2) OR (cr.sender.id = :u2 AND cr.receiver.id = :u1)) " +
           "AND cr.status IN :statuses")
    List<ConnectionRequest> findBetweenUsersWithStatus(@Param("u1") Long u1, @Param("u2") Long u2, @Param("statuses") Collection<ConnectionStatus> statuses);

    @Query("SELECT cr FROM ConnectionRequest cr WHERE " +
           "(cr.sender.id = :userId OR cr.receiver.id = :userId) AND cr.status = 'ACCEPTED' " +
           "ORDER BY cr.respondedAt DESC")
    List<ConnectionRequest> findAcceptedConnectionsForUser(@Param("userId") Long userId);

    long countByReceiverIdAndStatus(Long receiverId, ConnectionStatus status);

    long countBySenderIdAndStatus(Long senderId, ConnectionStatus status);
}
