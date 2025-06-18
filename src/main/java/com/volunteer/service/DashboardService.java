package com.volunteer.service;

import com.volunteer.pojo.EnrollmentVO;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public interface DashboardService {


    boolean isAdmin(String role);


    List<EnrollmentVO> findAllWithUserAndActivity();



    boolean updateStatus(Long id, int status);

}