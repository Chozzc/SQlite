import express from 'express';
import birthdaysRouter from '../routes/birthdays.js';

const app = express();
app.use(express.json());

// 关键修改：将路由挂载到 /api 前缀下
app.use('/api', birthdaysRouter); // 这样 /api/birthdays 才能匹配

export default app;