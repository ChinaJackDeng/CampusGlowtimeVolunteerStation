package com.volunteer.mapper;

import com.volunteer.pojo.User;
import com.volunteer.pojo.VolunteerHourVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;


@Mapper
public interface UserMapper {
   List<User> findAll();
   String findPasswordById(String stuNo);
   User getUserById(String stuNo);
   void insertNewUser(User user);
   // 查询用户志愿时长列表
   List<VolunteerHourVO> selectVolunteerHours(@Param("userId") Long userId);
}
