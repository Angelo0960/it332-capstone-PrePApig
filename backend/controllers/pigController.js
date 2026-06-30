import supabase from '../config/supabase.js';

// CREATE
export const createBatch = async (req, res) => {
  try {
    const {
      batch_code,
      pig_count,
      breed,
      start_weight,
      current_weight,
      date_acquired,
      status
    } = req.body;

    const { data, error } = await supabase
      .from('pig_batches')
      .insert([{
        batch_code,
        pig_count,
        breed,
        start_weight,
        current_weight,
        date_acquired,
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

// GET ALL
export const getAllBatches = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('pig_batches')
      .select('*')
      .order('created_at', { ascending: false });

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