// 全局变量
const baseUrl = window.BASE_URL;

// 活动管理相关函数
function loadActivities() {
    // 设置导航激活状态
    setActiveNav('activity');

    fetch(`${baseUrl}/admin/activity/list`)
        .then(resp => resp.json())
        .then(data => renderActivityTable(data));
}
function renderActivityTable(activities) {
    console.log(activities);
    let html = `
        <div class="dashboard-table-container">
            <table class="dashboard-table">
                <thead>
                    <tr>
                        <th>ID</th>                    
                        <th>名称</th>                                        
                        <th>地点</th>                                                              
                        <th>总容量</th>                       
                        <th>状态</th>
                        <th>要求</th>
                        <th>联系方式</th>
                        <th>操作</th>
                    </tr>
                </thead>
                <tbody>
    `;

    activities.forEach(act => {
        console.log(act)
        html += `
            <tr>
                <td>${act.id}</td>             
                <td><input class="dashboard-input" value="${act.name}" data-id="${act.id}" data-field="name" onchange="updateActivityField(this)"/></td>                             
                <td><input class="dashboard-input" value="${act.location}" data-id="${act.id}" data-field="location" onchange="updateActivityField(this)"/></td>
                <td><input class="dashboard-input" type="number" value="${act.capacity}" data-id="${act.id}" data-field="capacity" onchange="updateActivityField(this)"/></td>            
                <td><input class="dashboard-input" value="${act.status}" data-id="${act.id}" data-field="status" onchange="updateActivityField(this)"/></td>
                <td><textarea class="dashboard-textarea" data-id="${act.id}" data-field="requirement" onchange="updateActivityField(this)">${act.requirement}</textarea></td>
                <td><input class="dashboard-input" value="${act.contact}" data-id="${act.id}" data-field="contact" onchange="updateActivityField(this)"/></td>
                <td>
                    <button class="dashboard-button delete" onclick="deleteActivity(${act.id})">删除</button>
                </td>
            </tr>
        `;
    });

    html += `</tbody></table></div>

        <div class="dashboard-form">
            <h4>发布新活动</h4>
            <form id="addActivityForm" onsubmit="addActivity(event)">
                <div class="form-group">
                    <label>活动图片:</label>
                    <input type="file" accept="image/*" class="dashboard-input" name="coverFile" required onchange="previewImage(this)" />
                    <div class="image-preview" id="imagePreview">
                        <span>预览图片</span>
                    </div>
                </div>
                <div class="form-group">
                    <label>名称:</label>
                    <input class="dashboard-input" name="name" required />
                </div>
                <div class="form-group">
                    <label>类型:</label>
                    <input class="dashboard-input" name="type" required />
                </div>
                <div class="form-group">
                    <label>描述:</label>
                    <textarea class="dashboard-textarea" name="description" required></textarea>
                </div>
                <div class="form-group">
                    <label>地点:</label>
                    <input class="dashboard-input" name="location" required />
                </div>
                <div class="form-group">
                    <label>开始时间:</label>
                    <input class="dashboard-input" name="startTime" type="datetime-local" required />
                </div>
                <div class="form-group">
                    <label>结束时间:</label>
                    <input class="dashboard-input" name="endTime" type="datetime-local" required />
                </div>
                <div class="form-group">
                    <label>时长(小时):</label>
                    <input class="dashboard-input" name="duration" type="number" step="0.5" required />
                </div>
                <div class="form-group">
                    <label>容量:</label>
                    <input class="dashboard-input" name="capacity" type="number" required />
                </div>
                <div class="form-group">
                    <label>要求:</label>
                    <textarea class="dashboard-textarea" name="requirement" required></textarea>
                </div>
                <div class="form-group">
                    <label>联系方式:</label>
                    <input class="dashboard-input" name="contact" required />
                </div>
                <button type="submit" class="dashboard-button">发布</button>
            </form>
        </div>
    `;

    document.getElementById('adminModule').innerHTML = html;
}
// 图片预览功能
function previewImage(input) {
    const preview = document.getElementById('imagePreview');
    const file = input.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.innerHTML = `<img src="${e.target.result}" alt="预览图片">`;
        }
        reader.readAsDataURL(file);
    }
}


function updateActivityField(input) {
    fetch(`${baseUrl}/admin/activity/update`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            id: input.getAttribute('data-id'),
            field: input.getAttribute('data-field'),
            value: input.value
        })
    })
        .then(resp => resp.json())
        .then(data => {
            if (data.success) {
                showToast('修改成功');
            } else {
                showToast('修改失败', 'error');
            }
        });
}

function deleteActivity(id) {
    if (!confirm('确定删除活动?')) return;

    fetch(`${baseUrl}/admin/activity/delete?id=` + id, { method: 'POST' })
        .then(resp => resp.json())
        .then(data => {
            if (data.success) {
                loadActivities();
                showToast('删除成功');
            } else {
                showToast('删除失败', 'error');
            }
        });
}
function addActivity(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);

    // 直接构造活动数据，包括文件名
    const activityData = {
        name: formData.get('name'),
        type: formData.get('type'),
        description: formData.get('description'),
        location: formData.get('location'),
        startTime: formData.get('startTime'),
        endTime: formData.get('endTime'),
        duration: formData.get('duration'),
        capacity: formData.get('capacity'),
        requirement: formData.get('requirement'),
        contact: formData.get('contact'),
        coverUrl: formData.get('coverFile').name  // 直接使用文件名
    };

    // 直接调用添加活动接口
    fetch(`${baseUrl}/admin/activity/add`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(activityData)
    })
        .then(resp => resp.json())
        .then(data => {
            if (data.code===200) {
                loadActivities();
                form.reset();
                showToast('添加成功');
            } else {
                showToast('添加失败', 'error');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showToast('添加失败: ' + error.msg, 'error');
        });
}

// 报名审核相关函数
function loadEnrollments() {
    // 设置导航激活状态
    setActiveNav('enroll');

    fetch(`${baseUrl}/admin/enroll/list`)
        .then(resp => resp.json())
        .then(data => renderEnrollmentTable(data));
}

// 更新报名审核表格渲染函数
function renderEnrollmentTable(enrollments) {
    console.log(enrollments);
    let html = `
        <div class="dashboard-table-container">
            <table class="dashboard-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>学号</th>
                        <th>姓名</th>
                        <th>邮箱</th>
                        <th>活动</th>
                        <th>状态</th>
                        <th>说明</th>
                    </tr>
                </thead>
                <tbody>
    `;

    enrollments.forEach(e => {
        console.log(e);
        html += `
            <tr>
                <td>${e.id}</td>
                <td>${e.userNo}</td>
                <td>${e.userName}</td>
                <td>${e.userEmail}</td>
                <td>${e.activityName}</td>
                <td>
                    <select class="dashboard-select" data-id="${e.id}" onchange="updateEnrollmentStatus(this)">
                        <option value="1" ${e.status==1?'selected':''}>待审核</option>
                        <option value="2" ${e.status==2?'selected':''}>通过</option>
                        <option value="3" ${e.status==3?'selected':''}>拒绝</option>
                    </select>
                </td>
                <td>
                    <textarea class="dashboard-textarea" data-id="${e.id}" onchange="updateEnrollmentExplanation(this)">${e.explanation||''}</textarea>
                </td>
            </tr>
        `;
    });

    html += `</tbody></table></div>`;

    document.getElementById('adminModule').innerHTML = html;
}

function updateEnrollmentStatus(select) {
    fetch(`${baseUrl}/admin/enroll/status`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            id: select.getAttribute('data-id'),
            status: select.value
        })
    })
        .then(resp => resp.json())
        .then(data => {
            if (data.success) {
                showToast('审核状态已修改');
            } else {
                showToast('修改失败', 'error');
            }
        });
}

// 添加更新说明的函数
function updateEnrollmentExplanation(textarea) {
    fetch(`${baseUrl}/admin/enroll/explanation`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            id: textarea.getAttribute('data-id'),
            explanation: textarea.value
        })
    })
        .then(resp => resp.json())
        .then(data => {
            if (data.success) {
                showToast('说明已更新');
            } else {
                showToast('更新失败', 'error');
            }
        });
}

// 辅助函数
function setActiveNav(type) {
    document.querySelectorAll('.dashboard-nav-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`[href="#${type}"]`).classList.add('active');
}

function showToast(message, type = 'success') {
    // 简单的提示实现，你可以使用更复杂的提示库
    alert(message);
}

// 页面加载完成后自动加载活动列表
document.addEventListener('DOMContentLoaded', () => {
    loadActivities();
});