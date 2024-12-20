const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const Users = require("../models/User");

// Email transporter configuration
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587, // Use 465 if secure is true
    secure: false, // Set true for SSL (port 465)
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS,
    },
});

// Create a router
const router = express.Router();

// Request a reset link
router.post('/request-reset-link', async (req, res) => {
    const { email } = req.body;

    const user = await Users.findOne({ where: { email: email } });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const resetToken = await jwt.sign(
        { email: email, id: user.id },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );

    const resetLink = `${process.env.BASE_URL}/reset-password?token=${resetToken}`;
    try {
        await transporter.sendMail({
            from: 'EMS',
            to: email,
            subject: 'Password Reset',
            html: `<p>Click <a href="${resetLink}">here</a> to reset your password. This link will expire in 1 hour.</p>`,
        });
        res.json({ message: 'Password reset link sent to your email' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to send email', error: err.message });
    }
});

// Reset the password
router.post('/reset-password', async (req, res) => {
    const { token, newPassword } = req.body;

    let decoded;
    try {
        decoded = await jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        return res.status(400).json({ message: 'Invalid or expired token' });
    }

    // Get user by email from the decoded token
    const user = await Users.findOne({ where: { email: decoded.email } });
    if (!user) return res.status(400).json({ message: 'User not found' });

    try {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await Users.update(
            { password: hashedPassword }, // Update the password field
            { where: { id: user.id } } // Find user by id
        );
        res.json({ message: 'Password reset successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to reset password', error: err.message });
    }
});

module.exports = router;
