import express from 'express';
import { createClient } from '@supabase/supabase-js';

// 初始化 Supabase 客户端
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

const router = express.Router();

// 获取所有生日数据
router.get('/birthdays', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('birthdays')
            .select('*')
            .order('month', { ascending: true })
            .order('day', { ascending: true });

        if (error) {
            console.error('Supabase error:', error);
            return res.status(500).json({ error: error.message });
        }

        return res.status(200).json(data);
    } catch (err) {
        console.error('Server error:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

// 添加新的生日数据
router.post('/add', async (req, res) => {
    const { name, month, day } = req.body;

    // 验证请求体
    if (!name || !month || !day) {
        return res.status(400).json({ message: 'Missing name, month, or day' });
    }

    try {
        const { data, error } = await supabase
            .from('birthdays')
            .insert([{ name, month, day }]);

        if (error) {
            console.error('Supabase error:', error);
            return res.status(500).json({ error: error.message });
        }

        return res.status(200).json(data);
    } catch (err) {
        console.error('Server error:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

// 导出路由
export default router;