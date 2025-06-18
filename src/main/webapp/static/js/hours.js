const baseUrl = window.BASE_URL;
$(function() {
    // ����־Ըʱ���б�
    function loadHoursList() {
        $.get(baseUrl + "/user/hours/list", function(data) {
            console.log("�յ�����:", data);
            updateHourTable(data);
        }).fail(function(xhr) {
            handleLoadError(xhr);
        });
    }

    // ���±������
    function updateHourTable(data) {
        let totalHours = 0;
        const $tbody = $("#hourTable tbody");
        $tbody.empty();

        console.log("��������:", typeof data);
        console.log("�����Ƿ�Ϊ����:", Array.isArray(data));
        console.log("���ݳ���:", data.length);
        console.log("��������:", data);

        if (!Array.isArray(data) || data.length === 0) {
            $tbody.append(`<tr><td colspan="4" class="text-center no-data">����־Ըʱ����¼</td></tr>`);
            return;
        }

        data.forEach((item, index) => {
            console.log(`��Ⱦ�� ${index + 1} ������ (����: ${index})`, item);

            const date = item.activityDate || '������';
            const name = item.activityName || '������';
            const hour = item.hours !== undefined ? item.hours : 0;

            const row = `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${date}</td>
                        <td>${name}</td>
                        <td>${hour}</td>
                    </tr>
                `;

            $tbody.append(row);
            totalHours += parseFloat(hour);
        });

        const totalRow = `
                <tr class="total-row">
                    <td colspan="3"><b>�ܼ�</b></td>
                    <td><b>${totalHours.toFixed(2)}</b></td>
                </tr>
            `;
        $tbody.append(totalRow);

        console.log("�������Ⱦ���ܼ�ʱ��:", totalHours);
    }

    // ������ش���
    function handleLoadError(xhr) {
        let errorMsg = "����־Ըʱ��ʧ��";
        if (xhr.status === 401) {
            errorMsg = "δ��¼�����ȵ�¼";
        } else if (xhr.status === 404) {
            errorMsg = "�������Դ������";
        } else if (xhr.status === 500) {
            errorMsg = "�������ڲ�����";
        }
        alert(errorMsg);
    }

    // ����Excel
    function exportToExcel() {
        const $btn = $("#exportExcel");
        $btn.addClass("spinning").prop("disabled", true).html('<i class="icon-spinner spinning"></i> ������...');

        window.location = baseUrl + "/user/hours/export?type=excel";

        setTimeout(() => {
            $btn.removeClass("spinning").prop("disabled", false).html('<i class="icon-download"></i> ����Excel');
        }, 3000);
    }

    // ���¼�
    $("#exportExcel").click(exportToExcel);

    // ��ʼ������
    loadHoursList();
});