import supabase from '../config/supabase.js';

// CREATE
export const createVaccination = async (req, res) => {
    try {
        const {
            batch_id,
            vaccine_name,
            vaccination_date,
            next_due_date,
            administered_by,
            dosage,
            notes,
            status
        } = req.body;

        const { data, error } = await supabase
            .from('vaccination_records')
            .insert([{
                batch_id,
                vaccine_name,
                vaccination_date,
                next_due_date,
                administered_by,
                dosage,
                notes,
                status
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
export const getAllVaccinations = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('vaccination_records')
            .select('*')
            .order('vaccination_date', { ascending: false });

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