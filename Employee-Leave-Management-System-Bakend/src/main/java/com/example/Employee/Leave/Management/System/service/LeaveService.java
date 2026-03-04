package com.example.Employee.Leave.Management.System.service;

import com.example.Employee.Leave.Management.System.entity.LeaveRequest;
import com.example.Employee.Leave.Management.System.entity.User;
import com.example.Employee.Leave.Management.System.repository.LeaveRepository;
import com.example.Employee.Leave.Management.System.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class LeaveService {

    @Autowired
    private LeaveRepository leaveRepository;

    @Autowired
    private UserRepository userRepository;


    public LeaveRequest applyLeave(LeaveRequest leave) {
        leave.setStatus("PENDING");
        return leaveRepository.save(leave);
    }

    // 🔥 ONLY MANAGER CAN APPROVE
    public LeaveRequest approveLeave(Long leaveId, Long managerId) {

        User manager = userRepository.findById(managerId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // ✅ Check role
        if (!manager.getRole().equalsIgnoreCase("MANAGER")) {
            throw new RuntimeException("Only Manager can approve leave");
        }

        LeaveRequest leave = leaveRepository.findById(leaveId)
                .orElseThrow(() -> new RuntimeException("Leave not found"));

        leave.setStatus("APPROVED");

        return leaveRepository.save(leave);
    }

    public List<LeaveRequest> getPendingLeaves() {
        return leaveRepository.findByStatus("PENDING");
    }

    public List<LeaveRequest> getAll() {
        return leaveRepository.findAll();
    }

    public List<LeaveRequest> getMonthlyCalendar(int year, int month) {

        LocalDate start = LocalDate.of(year, month, 1);
        LocalDate end = start.withDayOfMonth(start.lengthOfMonth());

        return leaveRepository.findApprovedLeavesBetween(start, end);
    }
}