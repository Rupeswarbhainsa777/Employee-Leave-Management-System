package com.example.Employee.Leave.Management.System.repository;

import com.example.Employee.Leave.Management.System.entity.LeaveRequest;
import com.example.Employee.Leave.Management.System.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface LeaveRepository extends JpaRepository<LeaveRequest, Long> {

    List<LeaveRequest> findByStatus(String status);
    List<LeaveRequest> findByUser(User user);

    @Query("SELECT l FROM LeaveRequest l WHERE l.status = 'APPROVED' AND " +
            "((l.startDate BETWEEN :start AND :end) OR " +
            "(l.endDate BETWEEN :start AND :end) OR " +
            "(l.startDate <= :start AND l.endDate >= :end))")

    List<LeaveRequest> findApprovedLeavesBetween(
            @Param("start") LocalDate start,
            @Param("end") LocalDate end
    );

    List<LeaveRequest> findByUserId(Long userId);
}