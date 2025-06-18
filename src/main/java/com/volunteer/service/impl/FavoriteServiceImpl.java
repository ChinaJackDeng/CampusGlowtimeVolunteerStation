package com.volunteer.service.impl;

import com.volunteer.mapper.UserActivityFavoriteMapper;
import com.volunteer.service.ActivityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.volunteer.pojo.Activity;
import com.volunteer.service.FavoriteService;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * 收藏功能服务实现类
 * 负责处理用户对活动的收藏、取消收藏及收藏列表查询等业务逻辑
 */
@Service
public class FavoriteServiceImpl implements FavoriteService {

    private UserActivityFavoriteMapper favoriteMapper;
    private ActivityService activityService;

    @Autowired
    public void setFavoriteMapper(UserActivityFavoriteMapper favoriteMapper) {
        this.favoriteMapper = favoriteMapper;
    }

    @Autowired
    public void setActivityService(ActivityService activityService) {
        this.activityService = activityService;
    }

    /**
     * 添加活动到收藏列表
     * @param userId 用户ID
     * @param activityId 活动ID
     * @return 收藏操作是否成功
     * 确保数据库操作的原子性，失败时自动回滚
     */
    @Override
    @Transactional
    public boolean addFavorite(Long userId, Long activityId) {
        // 查询活动信息，验证活动存在性及状态有效性
        Activity activity = activityService.getActivityById(activityId);
        if (activity == null || "已结束".equals(activity.getStatus())) {
            return false; // 活动不存在或已结束，无法收藏
        }

        // 检查用户是否已收藏该活动（避免重复收藏）
        if (favoriteMapper.existsFavorite(userId, activityId)) {
            return true; // 已收藏则直接返回成功
        }

        // 执行收藏操作，向数据库插入收藏记录
        int rows = favoriteMapper.insertFavorite(userId, activityId);
        return rows > 0; // 返回受影响行数是否大于0（即操作是否成功）
    }

    /**
     * 取消收藏活动
     * @param userId 用户ID
     * @param activityId 活动ID
     * @return 取消收藏操作是否成功
     *  确保数据库操作的原子性，失败时自动回滚
     */
    @Override
    @Transactional
    public boolean cancelFavorite(Long userId, Long activityId) {
        // 检查用户是否已收藏该活动（避免无效操作）
        if (!favoriteMapper.existsFavorite(userId, activityId)) {
            return false; // 未收藏则直接返回失败
        }

        // 执行取消收藏操作，更新数据库中收藏状态为已取消
        int rows = favoriteMapper.cancelFavorite(userId, activityId);
        Activity activity = activityService.getActivityById(activityId);
        return rows > 0; // 返回受影响行数是否大于0（即操作是否成功）
    }

    /**
     * 获取用户的收藏活动列表
     * @param userId 用户ID
     * @param type 列表类型（全部/all、可报名/can-enroll、不可报名/cannot-enroll）
     * @param page 页码
     * @param pageSize 每页记录数
     * @return 包含活动列表、总数、页码等信息的Map
     */
    @Override
    public Map<String, Object> getFavoriteActivities(Long userId, String type, int page, int pageSize) {
        int offset = (page - 1) * pageSize; // 计算分页偏移量

        // 从数据库查询用户的收藏活动列表（带分页）
        List<Activity> activities = favoriteMapper.getFavoriteActivities(userId, offset, pageSize);

        // 根据type参数过滤活动列表
        List<Activity> filteredActivities = activities;
        Date now = new Date(); // 获取当前时间用于状态判断

        if ("can-enroll".equals(type)) {
            // 筛选出"可报名"的活动（活动开始时间在当前时间之后）
            filteredActivities = activities.stream()
                    .filter(act -> act.getStartTime() != null && now.before(act.getStartTime()))
                    .collect(Collectors.toList());
        } else if ("cannot-enroll".equals(type)) {
            // 筛选出"不可报名"的活动（活动开始时间在当前时间之前或为空）
            filteredActivities = activities.stream()
                    .filter(act -> act.getStartTime() != null && !now.before(act.getStartTime()))
                    .collect(Collectors.toList());
        }

        // 封装结果集（包含过滤后的活动列表、总数、当前页码等信息）
        Map<String, Object> result = new HashMap<>();
        result.put("activities", filteredActivities);
        result.put("total", favoriteMapper.getFavoriteActivityCount(userId, type));
        result.put("page", page);
        result.put("pageSize", pageSize);
        return result;
    }

    /**
     * 批量取消收藏活动
     * @param userId 用户ID
     * @param activityIds 要取消收藏的活动ID列表
     * @return 批量操作是否成功
     * 确保数据库操作的原子性，失败时自动回滚
     */
    @Override
    @Transactional
    public boolean batchCancelFavorites(Long userId, List<Long> activityIds) {
        if (activityIds == null || activityIds.isEmpty()) {
            return false; // 活动ID列表为空，直接返回失败
        }
        // 执行批量取消收藏操作，返回成功取消的记录数是否大于0
        return favoriteMapper.batchCancelFavorites(userId, activityIds) > 0;
    }
}