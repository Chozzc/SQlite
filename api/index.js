import express from 'express';
import { createClient } from '@supabase/supabase-js';
import apiRouter from './api.js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

const app = express();
app.use(express.json());

// 静态文件服务
app.use(express.static('public'));

// API 路由
app.use('/api', apiRouter);

// 启动服务器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});