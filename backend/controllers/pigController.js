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

// GET BY ID
export const getBatchById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('pig_batches')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message
    });
  }
};

// UPDATE BATCH
export const updateBatch = async (req, res) => {
  try {
    const { id } = req.params;

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
      .update({
        batch_code,
        pig_count,
        breed,
        start_weight,
        current_weight,
        date_acquired,
        status
      })
      .eq('id', id)
      .select();

    if (error) throw error;

    res.status(200).json({
      success: true,
      message: 'Batch updated successfully',
      data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// DELETE BATCH 
export const deleteBatch = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('pig_batches')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.status(200).json({
      success: true,
      message: 'Batch deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};