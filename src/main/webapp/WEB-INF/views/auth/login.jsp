<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ include file="../common/header.jsp" %>

<!-- 登录卡片容器 -->
<div class="login-container">
    <div class="login-box">
        <h2 class="login-title">欢迎登录</h2>
        <form method="post" action="${pageContext.request.contextPath}/login">
            <div class="form-group">
                <input name="stuNo" placeholder="学号" required>
            </div>
            <div class="form-group">
                <input name="password" type="password" placeholder="密码" required>
            </div>
            <button type="submit" class="login-btn">登录</button>
        </form>
        <a href="${pageContext.request.contextPath}/register" class="register-link">注册新用户</a>
    </div>
</div>

<%@ include file="../common/footer.jsp" %>