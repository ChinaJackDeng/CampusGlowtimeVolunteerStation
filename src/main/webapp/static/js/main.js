// ����js���ɿգ�����ȫ���¼��ɷ�����
$(function () {
    // �ر�����modal
    $(document).on("click", ".modal", function (e) {
        if ($(e.target).hasClass("modal")) $(this).hide();
    });
});