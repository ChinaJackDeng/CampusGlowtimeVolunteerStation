package com.volunteer.service;

import java.util.List;
import java.util.Map;

public interface FavoriteService {
    public boolean addFavorite(Long userId, Long activityId);
    public boolean cancelFavorite(Long userId, Long activityId);
    Map<String, Object> getFavoriteActivities(
            Long userId,
            String type,
            int page,
            int pageSize
    );
    public boolean batchCancelFavorites(Long userId, List<Long> activityIds);
}
