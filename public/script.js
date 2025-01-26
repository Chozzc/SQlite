document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('birthdayForm');
    const errorMessage = document.getElementById('errorMessage');
    const tableBody = document.getElementById('birthdayTableBody');

    // 加载所有生日记录
    loadBirthdays();

    // 表单提交事件
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = form.name.value.trim();
        const month = parseInt(form.month.value.trim());
        const day = parseInt(form.day.value.trim());

        // 验证输入
        if (!name || isNaN(month) || isNaN(day) || month < 1 || month > 12 || day < 1 || day > 31) {
            errorMessage.textContent = 'Please enter valid name, month (1-12), and day (1-31).';
            return;
        }

        try {
            // 调用后端 API 添加生日
            const response = await fetch('/api/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, month, day }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to add birthday');
            }

            // 清空表单和错误信息
            form.reset();
            errorMessage.textContent = '';

            // 重新加载生日记录
            loadBirthdays();
        } catch (err) {
            errorMessage.textContent = err.message;
        }
    });

    // 加载生日记录
    async function loadBirthdays() {
        try {
            const response = await fetch('/api/birthdays');
            if (!response.ok) {
                throw new Error('Failed to load birthdays');
            }

            const birthdays = await response.json();

            // 清空表格内容
            tableBody.innerHTML = '';

            // 动态添加生日记录到表格
            birthdays.forEach(birthday => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${birthday.name}</td>
                    <td>${birthday.month}/${birthday.day}</td>
                `;
                tableBody.appendChild(row);
            });
        } catch (err) {
            errorMessage.textContent = err.message;
        }
    }
});