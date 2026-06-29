import supabase from '../config/supabase.js';


// Register
export const register = async (req, res) => {
  try {
    const { email, password } = req.body;

    const { data, error } = await supabase.auth.signUp({
      email,
      password
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: data.user
    });

  } catch (err) {
    console.error('Register Error:', err);

    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};