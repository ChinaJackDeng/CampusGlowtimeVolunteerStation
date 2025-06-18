package com.volunteer.service;

import com.volunteer.pojo.Activity;
import com.volunteer.pojo.ActivityEnrollment;

import java.util.List;
import java.util.Map;

public interface ActivityService {
    // 获取活动列表（分页）
    Map<String, Object> getActivityList(
            String keyword,
            String type,
            Integer weekday,
            Integer pageNum,
            Integer pageSize
    );

    // 根据ID获取活动
    Activity getActivityById(Long id);

    //报名活动
    boolean enroll(Long activityId);

    List<ActivityEnrollment> getEnrollmentsByUserIdAndStatus(Long userId, String status);

    ActivityEnrollment getEnrollmentById(Long id);

    void updateEnrollment(ActivityEnrollment enrollment);

    // 删除报名记录
    void deleteEnrollment(Long id);

    // 减少活动报名人数
    void decreaseEnrollmentCount(Long activityId);

    //获得所有活动
    List<Activity> getAllActivities();

    boolean updateField(Long id ,String field,String value);

    boolean deleteActivityById(Long id);
    boolean addActivity(Activity activity);
}
