<%@ page contentType="text/html; charset=UTF-8" %>
<%@ include file="../common/header.jsp" %>
<link rel="stylesheet" href="${pageContext.request.contextPath}/static/css/main.css"/>
<%-- 志愿时长管理页面 --%>
<div class="container mt-4">
    <table id="hourTable" class="hours-table">
        <thead>
        <tr>
            <th>序号</th>
            <th>活动日期</th>
            <th>活动名称</th>
            <th>志愿时长(小时)</th>
        </tr>
        </thead>
        <tbody></tbody>
    </table>

    <div style="margin-top: 1.5rem;">
        <button id="exportExcel" class="hours-export-btn">
            <i class="icon-download"></i> 导出Excel
        </button>
    </div>
</div>

<script>
    // 定义全局基础路径，使用JSP表达式获取上下文路径
    window.BASE_URL = "<%= request.getContextPath() %>";

</script>
<script src="${pageContext.request.contextPath}/static/js/hours.js"></script>
<%@ include file="../common/footer.jsp" %>