import supabase from '../config/supabase.js';
import admin from '../config/firebase.js';

// Create and Send Notification
export const createNotification = async (req, res) => {

    try {

        const {
            title,
            message,
            type,
            recipient_token
        } = req.body;

        // Save to database
        const { data, error } = await supabase
            .from('notifications')
            .insert([{
                title,
                message,
                type,
                recipient_token
            }])
            .select();

        if (error) throw error;

        // Send Push Notification
        if (recipient_token) {

            await admin.messaging().send({
                token: recipient_token,
                notification: {
                    title,
                    body: message
                }
            });

        }

        res.status(201).json({
            success: true,
            message: "Notification sent successfully",
            data
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

// View All Notifications
export const getAllNotifications = async (req, res) => {

    try {

        const { data, error } = await supabase
            .from('notifications')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        res.json({
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

// Mark Notification as Read
export const markAsRead = async (req, res) => {

    try {

        const { id } = req.params;

        const { data, error } = await supabase
            .from('notifications')
            .update({
                is_read: true
            })
            .eq('id', id)
            .select();

        if (error) throw error;

        res.json({
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

// Delete Notification
export const deleteNotification = async (req, res) => {

    try {

        const { id } = req.params;

        const { error } = await supabase
            .from('notifications')
            .delete()
            .eq('id', id);

        if (error) throw error;

        res.json({
            success: true,
            message: "Notification deleted"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};