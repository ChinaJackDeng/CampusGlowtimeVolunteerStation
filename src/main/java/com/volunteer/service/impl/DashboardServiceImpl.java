package com.volunteer.service.impl;

import com.volunteer.mapper.UserActivityEnrollMapper;
import com.volunteer.pojo.EnrollmentVO;
import com.volunteer.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class DashboardServiceImpl implements DashboardService {


    private UserActivityEnrollMapper enrollMapper;
    @Autowired
    private  void setEnrollMapper(UserActivityEnrollMapper enrollMapper){
        this.enrollMapper=enrollMapper;
    }
    @Override
    public boolean isAdmin(String role) {
        // 假设role为"admin"或"管理员"即为管理员
        return "admin".equalsIgnoreCase(role) || "管理员".equals(role);
    }

    @Override
    public List<EnrollmentVO> findAllWithUserAndActivity() {
        // 查询报名表、用户表、活动表联合
        return enrollMapper.selectAllEnrollmentWithUserAndActivity();
    }

    @Override
    public boolean updateStatus(Long id, int status) {
        return enrollMapper.updateEnrollmentStatus(id, status) > 0;
    }
}