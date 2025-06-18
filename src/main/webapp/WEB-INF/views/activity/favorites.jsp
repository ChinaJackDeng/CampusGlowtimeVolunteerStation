<%@ page language="java" contentType="text/html; charset=UTF-8" %>
<%@ include file="../common/header.jsp" %>
<link rel="stylesheet" href="${pageContext.request.contextPath}/static/css/main.css">
<script>
    // 定义全局变量，由JSP引擎解析
    window.BASE_URL = "<%= request.getContextPath() %>";
</script>
<div class="favorite-page">
    <div class="favorite-tabs">
        <button class="favorite-tabs__btn favorite-tabs__btn--active" data-type="all">全部活动</button>
        <button class="favorite-tabs__btn" data-type="can-enroll">可报名活动</button>
        <button class="favorite-tabs__btn" data-type="cannot-enroll">不可报名活动</button>
        <button class="favorite-tabs__btn favorite-tabs__btn--cancel-all" data-type="cancel-all">一键取消不可报名</button>
    </div>

    <!-- 活动列表 -->
    <div id="favList" class="favorite-grid">
        <div class="favorite-grid__empty">您还没有收藏任何活动</div>
    </div>
</div>

<script src="${pageContext.request.contextPath}/static/js/favorites.js"></script>
<%@ include file="../common/footer.jsp" %>