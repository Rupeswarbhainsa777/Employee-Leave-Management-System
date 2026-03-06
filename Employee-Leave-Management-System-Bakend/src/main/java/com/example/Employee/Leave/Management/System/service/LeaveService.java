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


    public LeaveRequest applyLeave(LeaveRequest leave, String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        leave.setUser(user);
        leave.setStatus("PENDING");

        return leaveRepository.save(leave);
    }


    public LeaveRequest approveLeave(Long leaveId, String email) {

        User manager = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!manager.getRole().equalsIgnoreCase("MANAGER")) {
            throw new RuntimeException("Only Manager can approve leave");
        }

        LeaveRequest leave = leaveRepository.findById(leaveId)
                .orElseThrow(() -> new RuntimeException("Leave not found"));

        if (leave.getStatus().equalsIgnoreCase("APPROVED")) {
            throw new RuntimeException("Leave already approved");
        }

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

        return leaveRepository.findApprovedLeavesBetween(
                start, end);
    }

    public List<LeaveRequest> getMyLeaves(String email){
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return leaveRepository.findByUser(user);
    }
    public List<LeaveRequest> getLeavesByUser(Long userId) {
        return leaveRepository.findByUserId(userId);
    }


    public LeaveRequest rejectLeave(Long leaveId, String email) {

        User manager = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Only manager can reject
        if (!manager.getRole().equalsIgnoreCase("MANAGER")) {
            throw new RuntimeException("Only Manager can reject leave");
        }

        LeaveRequest leave = leaveRepository.findById(leaveId)
                .orElseThrow(() -> new RuntimeException("Leave not found"));

        if (leave.getStatus().equalsIgnoreCase("REJECTED")) {
            throw new RuntimeException("Leave already rejected");
        }

        leave.setStatus("REJECTED");

        return leaveRepository.save(leave);
    }
}