import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

const router = express.Router();

router.get('/birthdays', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('birthdays')
            .select('*')
            .order('month', { ascending: true })
            .order('day', { ascending: true });

        if (error) {
            return res.status(500).json({ error: error.message });
        }

        return res.status(200).json(data);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

router.post('/add', async (req, res) => {
    const { name, month, day } = req.body;

    if (!name || !month || !day) {
        return res.status(400).json({ message: 'Missing name, month, or day' });
    }

    try {
        const { data, error } = await supabase
            .from('birthdays')
            .insert([{ name, month, day }]);

        if (error) {
            return res.status(500).json({ error: error.message });
        }

        return res.status(200).json(data);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

export default router;