package com.volunteer.service;

import com.volunteer.mapper.UserMapper;
import com.volunteer.pojo.User;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.util.List;

@Service
public class UserService {

    private final UserMapper userMapper;

    //构造器方式注入
    @Autowired
    public UserService(UserMapper userMapper) {
        this.userMapper = userMapper;
    }

    public List<User> findAll() {
        return userMapper.findAll();
    }

    public boolean isPasswordMatchById(String stuNo,String password){
        User user=userMapper.getUserById(stuNo);
        if(user!=null){
            return user.getPassword().equals(password);
        }
        return false;
    }
    public boolean canRegister(String stuNo){
        User user=userMapper.getUserById(stuNo);
        if(user==null)
            return true;
        return false;
    }

    public void registerNewUser(String stuNo, String name,String password, String gender, String phone, String email) {
        User user = new User();
        user.setStuNo(stuNo);
        user.setName(name);
        user.setPassword(password);
        user.setGender(gender);
        user.setPhone(phone);
        user.setEmail(email);
        user.setRole("student");
        user.setStatus(1);
        userMapper.insertNewUser(user);
    }

    public User getUserByStuNoAndPwd(String stuNo,String password){
        User user=null;
        user=userMapper.getUserById(stuNo);
        return user;
    }

    public Long getCurrentUserId() {
        // 获取当前请求的Session
        HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.currentRequestAttributes()).getRequest();
        HttpSession session = request.getSession(false); // false表示若不存在Session则返回null

        if (session == null) {
            return null;
        }

        User user=(User)session.getAttribute("user");
        return user.getId();
    }
}