package com.volunteer.service;

import com.volunteer.pojo.VolunteerHourVO;

import java.io.OutputStream;
import java.util.List;

public interface VolunteerHoursService {
    // 获取用户志愿时长列表
    public List<VolunteerHourVO> getVolunteerHours(Long userId);

    // 导出Excel
    public void exportToExcel(Long userId, OutputStream outputStream);

}
