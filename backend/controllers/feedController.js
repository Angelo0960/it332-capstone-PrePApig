import supabase from '../config/supabase.js';

// CREATE FEED RECORD
export const createFeedRecord = async (req, res) => {
    try {
        const {
            batch_id,
            feed_type,
            quantity_kg,
            feeding_date,
            feeding_time,
            notes
        } = req.body;

        const { data, error } = await supabase
            .from('feed_records')
            .insert([{
                batch_id,
                feed_type,
                quantity_kg,
                feeding_date,
                feeding_time,
                notes
            }])
            .select();

        if (error) throw error;

        res.status(201).json({
            success: true,
            data
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// VIEW ALL
export const getAllFeedRecords = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('feed_records')
            .select('*')
            .order('feeding_date', { ascending: false });

        if (error) throw error;

        res.status(200).json({
            success: true,
            count: data.length,
            data
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};