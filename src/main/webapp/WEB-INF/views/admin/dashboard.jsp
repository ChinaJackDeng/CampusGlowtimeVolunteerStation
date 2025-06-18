<%@ page contentType="text/html; charset=UTF-8" %>
<%@ page language="java" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>活动管理系统</title>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/static/css/dashboard.css">
</head>
<body>
<div class="dashboard-container">
    <div class="dashboard-sidebar">
        <div class="dashboard-logo">
            活动管理系统
        </div>
        <div class="dashboard-admin-info">
            <i class="dashboard-icon">👤</i>
            <span id="adminName">管理员：<%=session.getAttribute("adminName")%></span>
        </div>
        <nav class="dashboard-nav">
            <!-- 修改这里：移除 onclick 属性，改用事件监听器 -->
            <a href="#activity" class="dashboard-nav-item active" id="activityLink">
                <i class="dashboard-icon">📋</i>活动管理
            </a>
            <a href="#enroll" class="dashboard-nav-item" id="enrollLink">
                <i class="dashboard-icon">👥</i>报名审核
            </a>
        </nav>
    </div>

    <div class="dashboard-main">
        <div class="dashboard-header">
            <h1 class="dashboard-title">活动管理后台</h1>
        </div>
        <div class="dashboard-content">
            <div id="adminModule"></div>
        </div>
    </div>
</div>

<!-- 1. 首先加载 jQuery -->
<script src="${pageContext.request.contextPath}/static/js/jquery-1.11.3.min.js"></script>

<!-- 2. 设置全局变量 -->
<script>
    window.BASE_URL = "<%= request.getContextPath() %>";
    window.ADMIN_NAME = "<%= request.getAttribute("adminName") %>";
</script>

<!-- 3. 最后加载应用的 JavaScript -->
<script src="${pageContext.request.contextPath}/static/js/dashboard.js"></script>

<!-- 4. 添加错误处理 -->
<script>
    document.addEventListener('DOMContentLoaded', function() {
        // 确保 dashboard.js 加载完成
        if (typeof loadActivities === 'undefined') {
            console.error('Dashboard.js 未能正确加载！');
            alert('系统加载出现错误，请刷新页面重试！');
        }

        // 使用事件委托绑定点击事件
        document.querySelector('.dashboard-nav').addEventListener('click', function(e) {
            const link = e.target.closest('a');
            if (!link) return;

            e.preventDefault();

            if (link.id === 'activityLink') {
                loadActivities();
            } else if (link.id === 'enrollLink') {
                loadEnrollments();
            }
        });
    });
</script>

</body>
</html>