package com.volunteer.service.impl;

import com.volunteer.mapper.UserActivityEnrollMapper;
import com.volunteer.mapper.UserActivityFavoriteMapper;
import com.volunteer.pojo.Activity;
import com.volunteer.mapper.ActivityMapper;
import com.volunteer.pojo.ActivityEnrollment;
import com.volunteer.service.ActivityService;
import com.volunteer.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ActivityServiceImpl implements ActivityService {

    private UserActivityEnrollMapper enrollMapper;

    @Autowired
    public void setEnrollMapper(UserActivityEnrollMapper enrollMapper) {
        this.enrollMapper = enrollMapper;
    }

    private UserService userService; // 假设存在用户服务获取当前用户ID

    @Autowired
    public void setUserService(UserService userService) {
        this.userService = userService;
    }

    private  ActivityMapper activityMapper;
    @Autowired
    private void setActivityMapper(ActivityMapper activityMapper) {
        this.activityMapper = activityMapper;
    }

    private UserActivityFavoriteMapper favoriteMapper;
    @Autowired
    private void setFavoriteMapper(UserActivityFavoriteMapper favoriteMapper){
        this.favoriteMapper=favoriteMapper;
    }
    @Override
    public Map<String, Object> getActivityList(String keyword, String type, Integer weekday, Integer pageNum, Integer pageSize) {
        // 计算分页偏移量
        Integer offset = (pageNum - 1) * pageSize;

        // 转换星期参数（前端1-7 → 数据库0-6）
        Integer dbWeekday = (weekday != null) ? weekday - 1 : null;

        // 查询活动列表
        List<Activity> activities = activityMapper.selectActivityList(
                keyword, type, dbWeekday, offset, pageSize
        );

        // 查询总数
        Integer totalCount = activityMapper.selectActivityCount(
                keyword, type, dbWeekday
        );

        // 计算总页数
        Integer totalPages = (totalCount + pageSize - 1) / pageSize;

        // 封装结果
        Map<String, Object> result = new HashMap<>();

        result.put("activities", activities);
        result.put("currentPage", pageNum);
        result.put("totalPages", totalPages);
        result.put("totalCount", totalCount);

        return result;
    }

    @Override
    public Activity getActivityById(Long id) {
        return activityMapper.selectById(id);
    }


    @Override
    @Transactional
    public boolean enroll(Long activityId) {
        Long userId = userService.getCurrentUserId();
        if (userId == null) return false;

        Activity activity = activityMapper.selectById(activityId);
        if (activity == null || !"报名中".equals(activity.getStatus())) return false;

        int count = enrollMapper.checkEnrollment(userId, activityId);
        if (count > 0) return false;

        // 1. 先尝试更新活动名额（利用数据库行锁和条件校验）
        int updateResult = activityMapper.updateEnrolledCount(activityId, activity.getCapacity());

        if (updateResult == 0) { // 更新失败，说明名额不足或活动状态变更
            return false;
        }

        // 2. 更新成功后，再插入报名记录
        int insertResult = enrollMapper.insertEnrollment(userId, activityId);

        return insertResult > 0;
    }

    @Override
    public List<ActivityEnrollment> getEnrollmentsByUserIdAndStatus(Long userId, String status) {
        return enrollMapper.selectByUserIdAndStatus(userId, Integer.parseInt(status));
    }

    @Override
    public ActivityEnrollment getEnrollmentById(Long id) {
        return enrollMapper.selectById(id);
    }

    @Override
    public void updateEnrollment(ActivityEnrollment enrollment) {
        enrollMapper.update(enrollment);
    }

    @Override
    @Transactional
    public void deleteEnrollment(Long id) {
        // 逻辑删除（推荐）：更新状态为"已删除"
        ActivityEnrollment enrollment = new ActivityEnrollment();
        enrollment.setId(id);
        enrollment.setStatus(4);
        enrollMapper.updateByPrimaryKeySelective(enrollment);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void decreaseEnrollmentCount(Long activityId) {
        // 方法1：乐观锁实现（推荐）
        updateEnrollmentCountOptimistically(activityId);

        // 方法2：悲观锁实现（备选，性能较差）
        // updateEnrollmentCountPessimistically(activityId);
    }

    private void updateEnrollmentCountOptimistically(Long activityId) {
        int maxRetries = 3;
        for (int i = 0; i < maxRetries; i++) {
            try {
                Activity activity = activityMapper.selectById(activityId);
                if (activity == null) {
                    throw new RuntimeException("活动不存在，ID: " + activityId);
                }

                int newCount = Math.max(0, activity.getEnrolledCount() - 1);
                int rowsAffected = activityMapper.decreaseEnrollmentCount(
                        activityId,
                        activity.getEnrolledCount(),
                        newCount,
                        activity.getVersion()
                );

                if (rowsAffected > 0) {
                    return;
                }


            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        // 重试多次后仍失败
        throw new RuntimeException("活动人数更新失败，可能存在高并发冲突，请稍后再试");
    }

    @Override
    public List<Activity> getAllActivities() {
        return activityMapper.selectAll();
    }

    @Override
    public boolean updateField(Long id, String field, String value) {
        // 推荐用动态 SQL，防止 SQL 注入
        return activityMapper.updateField(id, field, value) > 0;
    }

    @Override
    public boolean deleteActivityById(Long id) {
        enrollMapper.deleteByActivityId(id);
        favoriteMapper.deleteFavoriteByActivityId(id);
        return activityMapper.deleteById(id)>0 ;
    }

    @Override
    public boolean addActivity(Activity activity) {
        Activity finalActivity = new Activity(
                activity.getName(),
                activity.getType(),
                activity.getDescription(),
                activity.getLocation(),
                activity.getStartTime(),
                activity.getEndTime(),
                activity.getDuration(),
                activity.getCapacity(),
                activity.getRequirement(),
                activity.getContact(),
                activity.getCreatorId(),
                activity.getCreatorName(),
                activity.getCoverUrl()
        );
        return activityMapper.insert(finalActivity) > 0;
    }
}