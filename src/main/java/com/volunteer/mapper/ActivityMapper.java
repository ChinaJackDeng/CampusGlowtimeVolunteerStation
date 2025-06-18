package com.volunteer.mapper;

import com.volunteer.pojo.Activity;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface ActivityMapper {
    // 查询活动列表（带分页）
    List<Activity> selectActivityList(
            @Param("keyword") String keyword,
            @Param("type") String type,
            @Param("weekday") Integer weekday,
            @Param("offset") Integer offset,
            @Param("limit") Integer limit
    );

    // 查询活动总数（用于分页）
    Integer selectActivityCount(
            @Param("keyword") String keyword,
            @Param("type") String type,
            @Param("weekday") Integer weekday
    );

    // 根据ID查询活动
    Activity selectById(Long id);

    // 更新活动报名人数
    int updateEnrolledCount(@Param("id") Long id, @Param("capacity") Integer count);

    // 乐观锁更新人数
    int decreaseEnrollmentCount(@Param("activityId") Long activityId,
                                @Param("oldCount") Integer oldCount,
                                @Param("newCount") Integer newCount,
                                @Param("version") Integer version);

    @Select("SELECT * FROM volunteer_activity")
    List<Activity> selectAll();

    // 动态 SQL 更新任意字段，安全做法
    int updateField(@Param("id") Long id, @Param("field") String field, @Param("value") String value);

    @Delete("DELETE FROM volunteer_activity WHERE id = #{id}")
    int deleteById(Long id);

    @Insert("INSERT INTO volunteer_activity (name, cover_url, type, description,location,start_time, end_time, duration, capacity, status, requirement, contact, creator_id, creator_name, create_time, update_time, version) " +
            "VALUES (#{name}, #{coverUrl},#{type}, #{description}, #{location},#{startTime}, #{endTime}, #{duration}, #{capacity}, #{status}, #{requirement}, #{contact}, #{creatorId}, #{creatorName}, #{createTime}, #{updateTime}, #{version})")
    int insert(Activity activity);
}