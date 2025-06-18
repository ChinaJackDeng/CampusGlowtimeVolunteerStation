// 公共js，可空；若需全局事件可放这里
$(function () {
    // 关闭所有modal
    $(document).on("click", ".modal", function (e) {
        if ($(e.target).hasClass("modal")) $(this).hide();
    });
});