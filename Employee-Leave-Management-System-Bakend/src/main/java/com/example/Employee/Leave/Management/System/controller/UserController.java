package com.example.Employee.Leave.Management.System.controller;

import com.example.Employee.Leave.Management.System.dto.LoginRequest;
import com.example.Employee.Leave.Management.System.entity.User;
import com.example.Employee.Leave.Management.System.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user")
@CrossOrigin
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("reg")
    public User adduser(@RequestBody User user){

        return userService.registerUser(user);
    }

    @PostMapping("login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request){
        try {
            User user = userService.login(request.getEmail(), request.getPassword());
            if (user != null) {
                user.setPassword(null); // don't return password
                return ResponseEntity.ok(user);
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
            }
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ex.getMessage());
        }
    }

    @GetMapping("alluser")
    public List<User> getall(){
        return userService.getAllUsers();
    }
}
