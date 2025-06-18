<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%
    // 推荐用服务端重定向，更加可靠（不会有内容输出引发的异常）
    response.sendRedirect(request.getContextPath() + "/login");
    return;
%>