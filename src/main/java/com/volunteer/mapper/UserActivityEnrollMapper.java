package com.volunteer.mapper;

import com.volunteer.pojo.ActivityEnrollment;
import com.volunteer.pojo.EnrollmentVO;
import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface UserActivityEnrollMapper {
    // 插入报名记录
    int insertEnrollment(@Param("userId") Long userId, @Param("activityId") Long activityId);

    // 查询用户是否已报名某活动
    int checkEnrollment(@Param("userId") Long userId, @Param("activityId") Long activityId);
    List<ActivityEnrollment> selectByUserIdAndStatus(@Param("userId") Long userId, @Param("status") int status);

    ActivityEnrollment selectById(Long id);

    int update(ActivityEnrollment enrollment);

    // 更新报名记录（逻辑删除时使用）
    int updateByPrimaryKeySelective(ActivityEnrollment record);

    // 物理删除（可选）
    int deleteByPrimaryKey(Long id);

    List<EnrollmentVO> selectAllEnrollmentWithUserAndActivity();

    // 修改报名状态
    int updateEnrollmentStatus(@Param("id") Long id, @Param("status") int status);

    int deleteByActivityId(@Param("activityId") Long activityId);
}