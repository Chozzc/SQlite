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
/*新功能
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('birthdayForm');
    const errorMessage = document.getElementById('errorMessage');
    const tableBody = document.getElementById('birthdayTableBody');
    const countdownContainer = document.getElementById('countdownContainer');

    // 本地存储管理
    const storageKey = 'birthdays';

    function getBirthdays() {
        return JSON.parse(localStorage.getItem(storageKey)) || [];
    }

    function saveBirthdays(data) {
        localStorage.setItem(storageKey, JSON.stringify(data));
    }

    // 星座计算
    const zodiacSigns = [
        { start: [3,21], end: [4,19], name: "♈白羊" },
        { start: [4,20], end: [5,20], name: "♉金牛" },
        { start: [5,21], end: [6,21], name: "♊双子" },
        { start: [6,22], end: [7,22], name: "♋巨蟹" },
        { start: [7,23], end: [8,22], name: "♌狮子" },
        { start: [8,23], end: [9,22], name: "♍处女" },
        { start: [9,23], end: [10,23], name: "♎天秤" },
        { start: [10,24], end: [11,22], name: "♏天蝎" },
        { start: [11,23], end: [12,21], name: "♐射手" },
        { start: [12,22], end: [1,19], name: "♑摩羯" },
        { start: [1,20], end: [2,18], name: "♒水瓶" },
        { start: [2,19], end: [3,20], name: "♓双鱼" }
    ];

    function getZodiac(month, day) {
        const date = new Date(2023, month-1, day);
        return zodiacSigns.find(sign => 
            date >= new Date(2023, sign.start[0]-1, sign.start[1]) &&
            date <= new Date(2023, sign.end[0]-1, sign.end[1])
        )?.name || "";
    }

    // 倒计时计算
    function getCountdownDays(month, day) {
        const today = new Date();
        const currentYear = today.getFullYear();
        const nextBirthday = new Date(currentYear, month-1, day);
        
        if (today > nextBirthday) {
            nextBirthday.setFullYear(currentYear + 1);
        }
        
        const diff = nextBirthday - today;
        return Math.ceil(diff / (1000 * 60 * 60 * 24));
    }

    // 数据渲染
    function renderTable() {
        const birthdays = getBirthdays();
        tableBody.innerHTML = birthdays.map(b => `
            <tr>
                <td>${b.name}</td>
                <td>
                    ${b.month}/${b.day}
                    <span class="zodiac">${getZodiac(b.month, b.day)}</span>
                </td>
                <td>${getCountdownDays(b.month, b.day)}天</td>
                <td class="actions">
                    <button class="edit" onclick="editBirthday('${b.id}')">编辑</button>
                    <button onclick="deleteBirthday('${b.id}')">删除</button>
                </td>
            </tr>
        `).join('');

        // 更新倒计时看板
        countdownContainer.innerHTML = birthdays
            .map(b => ({
                ...b,
                days: getCountdownDays(b.month, b.day)
            }))
            .sort((a,b) => a.days - b.days)
            .slice(0, 5)
            .map(b => `
                <div class="countdown-item">
                    <span>${b.name}</span>
                    <span>${b.days}天后</span>
                </div>
            `).join('');
    }

    // 表单提交
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

            // 保存到本地存储
            saveBirthdays(birthdays);

            // 渲染表格
            renderTable();
        } catch (err) {
            errorMessage.textContent = err.message;
        }
    }

    // 删除功能
    window.deleteBirthday = async (id) => {
        try {
            const response = await fetch(`/api/delete/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to delete birthday');
            }

            // 重新加载生日记录
            loadBirthdays();
        } catch (err) {
            errorMessage.textContent = err.message;
        }
    };

    // 编辑功能
    window.editBirthday = async (id) => {
        const birthdays = getBirthdays();
        const target = birthdays.find(b => b.id === id);
        
        const newName = prompt('请输入新姓名:', target.name);
        const newMonth = prompt('请输入新月份:', target.month);
        const newDay = prompt('请输入新日期:', target.day);

        if(newName && newMonth && newDay) {
            try {
                const response = await fetch(`/api/edit/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ name: newName, month: parseInt(newMonth), day: parseInt(newDay) }),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Failed to edit birthday');
                }

                // 重新加载生日记录
                loadBirthdays();
            } catch (err) {
                errorMessage.textContent = err.message;
            }
        }
    };

    // 导出CSV
    window.exportToCSV = () => {
        const birthdays = getBirthdays();
        const csvContent = "data:text/csv;charset=utf-8," 
            + [
                ['姓名', '月份', '日期', '星座', '剩余天数'],
                ...birthdays.map(b => [
                    b.name,
                    b.month,
                    b.day,
                    getZodiac(b.month, b.day),
                    getCountdownDays(b.month, b.day)
                ])
            ].map(e => e.join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "生日数据.csv");
        document.body.appendChild(link);
        link.click();
    };

    // 初始化
    loadBirthdays();
});
*/