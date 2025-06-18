<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="../common/header.jsp" %>
<script>
    // 定义全局变量，由JSP引擎解析
    window.BASE_URL = "<%= request.getContextPath() %>";
</script>
<div class="search-bar">
    <form id="searchForm" class="flex-container">
        <div class="search-input-group">
            <input name="keyword" placeholder="搜索活动">
        </div>
        <div class="search-input-group">
            <select name="type">
                <option value="">类型</option> <!-- 第一个选项为默认空值，如需默认选中第一个有效选项，移除 selected 属性 -->
                <option value="公益" ${param.type == '公益' ? 'selected' : ''}>公益</option>
                <option value="环保" ${param.type == '环保' ? 'selected' : ''}>环保</option>
                <option value="教育" ${param.type == '教育' ? 'selected' : ''}>教育</option>
                <option value="文化" ${param.type == '文化' ? 'selected' : ''}>文化</option>
            </select>
        </div>
        <div class="weekday-buttons">
            <button type="button" class="weekday-btn" data-value="1">周一</button>
            <button type="button" class="weekday-btn" data-value="2">周二</button>
            <button type="button" class="weekday-btn" data-value="3">周三</button>
            <button type="button" class="weekday-btn" data-value="4">周四</button> <!-- 默认选中周六 -->
            <button type="button" class="weekday-btn" data-value="5">周五</button>
            <button type="button" class="weekday-btn active" data-value="6">周六</button> <!-- 修正按钮顺序，确保 data-value=6 对应周六 -->
            <button type="button" class="weekday-btn" data-value="7">周日</button>
        </div>
        <div class="search-input-group">
            <button type="submit" class="search-btn">查找</button>
        </div>
    </form>
</div>

<!-- 活动列表容器 -->
<div id="activityList" class="card-list">
    <!-- 加载中状态 -->
    <div class="empty" id="loadingIndicator">
        <i class="fa fa-spinner fa-spin"></i> 加载中...
    </div>
</div>

<div id="pagination"></div>
<div id="detailModal" class="modal"></div>
<script src="${pageContext.request.contextPath}/static/js/hall.js"></script>
<%@ include file="../common/footer.jsp" %>