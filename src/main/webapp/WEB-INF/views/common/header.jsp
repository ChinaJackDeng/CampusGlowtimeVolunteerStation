<%@ page language="java" contentType="text/html; charset=UTF-8" %>
<!DOCTYPE html>
<html>
<head>
    <title>校园拾光志愿站</title>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/static/css/main.css"/>
    <script src="${pageContext.request.contextPath}/static/js/jquery-1.11.3.min.js"></script>
    <script src="${pageContext.request.contextPath}/static/js/main.js"></script>
    <script>
        $(document).ready(function() {
            $(".navbar-container > div").click(function() {
                $(this).siblings().removeClass("active"); // 移除其他项的激活状态
                $(this).addClass("active"); // 添加当前项的激活状态
            });
        });
    </script>
</head>
<body>
<div class="sys_title">
    <span class="sys_title_content">大学校园拾光志愿站</span>
</div>

<nav class="navbar">
    <div class="navbar-container">
        <div onclick="window.location='${pageContext.request.contextPath}/activity/hall'">
            <!-- 在 img 标签中添加 alt 属性 -->
            <img src="${pageContext.request.contextPath}/static/img/hall.png" class="bar_img"
                    alt="活动大厅图标"/>
            <a href="${pageContext.request.contextPath}/activity/hall" class="nav-link">活动大厅</a>
        </div>
        <div onclick="window.location='${pageContext.request.contextPath}/activity/favorites'">
            <!-- 在 img 标签中添加 alt 属性 -->
            <img src="${pageContext.request.contextPath}/static/img/favorite.png" class="bar_img"
                 alt="我的收藏图标"/>
            <a href="${pageContext.request.contextPath}/activity/favorites" class="nav-link">我的收藏</a>
        </div>
        <div onclick="window.location='${pageContext.request.contextPath}/activity/enrollments'">
            <!-- 在 img 标签中添加 alt 属性 -->
            <img src="${pageContext.request.contextPath}/static/img/enroll.png" class="bar_img"
                 alt="我的报名图标"/>
            <a href="${pageContext.request.contextPath}/activity/enrollments" class="nav-link">我的报名</a>
        </div>
        <div onclick="window.location='${pageContext.request.contextPath}/user/hours'">
            <!-- 在 img 标签中添加 alt 属性 -->
            <img src="${pageContext.request.contextPath}/static/img/hours.png" class="bar_img"
                 alt="志愿时长图标"/>
            <a href="${pageContext.request.contextPath}/user/hours" class="nav-link">志愿时长</a>
        </div>

        <div class="navbar-right">
            <span class="user-welcome">Hello!</span>
            <span class="user-info">${sessionScope.user.name}</span>
            <a href="${pageContext.request.contextPath}/logout" class="nav-link">退出</a>
        </div>
    </div>
</nav>

<div class="main-container">