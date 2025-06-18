package com.volunteer.mapper;

import com.volunteer.pojo.Activity;
import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface UserActivityFavoriteMapper {
    // Mapper 接口
    int insertFavorite(@Param("userId") Long userId, @Param("activityId") Long activityId);
    int cancelFavorite(@Param("userId") Long userId, @Param("activityId") Long activityId);
    // Mapper 接口
    List<Activity> selectFavoriteActivities(@Param("userId") Long userId);

    boolean existsFavorite(@Param("userId") Long userId, @Param("activityId") Long activityId);

    // FavoriteMapper.java
    List<Activity> getFavoriteActivities(
            @Param("userId") Long userId,
            @Param("offset") int offset,
            @Param("pageSize") int pageSize
    );

    int getFavoriteActivityCount(
            @Param("userId") Long userId,
            @Param("type") String type
    );

    int batchCancelFavorites(@Param("userId") Long userId, @Param("activityIds") List<Long> activityIds);

    @Delete("DELETE FROM user_activity_favorite WHERE activity_id=#{activityId}")
    int deleteFavoriteByActivityId(@Param("activityId") Long activityId);
}
