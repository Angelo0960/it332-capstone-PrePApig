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
// FEED RECORDS 
export const getFeedRecordById = async (req, res) => {
    try {
        const { id } = req.params;

        const { data, error } = await supabase
            .from('feed_records')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;

        res.status(200).json({
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

// VIEW BY BATCH
export const getFeedByBatch = async (req, res) => {
    try {
        const { batchId } = req.params;

        const { data, error } = await supabase
            .from('feed_records')
            .select('*')
            .eq('batch_id', batchId);

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

// UPDATE
export const updateFeedRecord = async (req, res) => {
    try {
        const { id } = req.params;

        const { data, error } = await supabase
            .from('feed_records')
            .update(req.body)
            .eq('id', id)
            .select();

        if (error) throw error;

        res.status(200).json({
            success: true,
            message: 'Feed record updated successfully',
            data
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const deleteFeedRecord = async (req, res) => {
    try {
        const { id } = req.params;

        const { error } = await supabase
            .from('feed_records')
            .delete()
            .eq('id', id);

        if (error) throw error;

        res.status(200).json({
            success: true,
            message: 'Feed record deleted successfully'
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// SUMMARY
export const getFeedSummary = async (req, res) => {
    try {

        const { data, error } = await supabase
            .from('feed_records')
            .select('*');

        if (error) throw error;

        const totalRecords = data.length;

        const totalFeedConsumed = data.reduce(
            (sum, item) => sum + Number(item.quantity_kg),
            0
        );

        res.status(200).json({
            success: true,
            summary: {
                totalRecords,
                totalFeedConsumed
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};