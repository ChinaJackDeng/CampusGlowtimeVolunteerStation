<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ include file="../common/header.jsp" %>

<!-- 注册卡片容器 -->
<div class="login-container">
    <div class="login-box">
        <h2 class="login-title">注册新用户</h2>
        <form method="post" action="${pageContext.request.contextPath}/register">
            <div class="form-group">
                <input name="name" placeholder="姓名" required>
            </div>
            <div class="form-group">
                <input name="stuNo" placeholder="学号" required>
            </div>
            <div class="form-group">
                <input name="password" type="password" placeholder="密码" required>
            </div>
            <div class="form-group">
                <select name="gender" required>
                    <option value="">请选择性别</option>
                    <option value="男">男</option>
                    <option value="女">女</option>
                </select>
            </div>
            <div class="form-group">
                <input name="phone" placeholder="手机号" required>
            </div>
            <div class="form-group">
                <input name="email" placeholder="邮箱" required type="email">
            </div>
            <button type="submit" class="login-btn">注册</button>
        </form>
        <a href="${pageContext.request.contextPath}/login" class="register-link">已有账号？立即登录</a>
    </div>
</div>

<%@ include file="../common/footer.jsp" %>