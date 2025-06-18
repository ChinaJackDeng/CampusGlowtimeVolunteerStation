<%@ page language="java" contentType="text/html; charset=UTF-8" %>
<%@ include file="../common/header.jsp" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/static/css/main.css">
    <script>
    // 定义全局变量，由JSP引擎解析
    window.BASE_URL = "<%= request.getContextPath() %>";
    </script>
</head>

<body>
    <ul class="enrollments-tabs">
        <li data-status="1" class="on">等待审核</li>
        <li data-status="2">审核通过</li>
        <li data-status="3">报名失败</li>
    </ul>
    <div id="enrollList" class="enrollments-list"></div>


<!-- 先加载 jQuery -->
<script src="${pageContext.request.contextPath}/static/js/jquery-1.11.3.min.js"></script>
<!-- 再加载自定义 JS -->
<script src="${pageContext.request.contextPath}/static/js/enrollments.js"></script>
</body>
</html>
<%@ include file="../common/footer.jsp" %>