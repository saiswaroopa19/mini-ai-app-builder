const jwt = require('jsonwebtoken');
const User = require('../models/users');

const loginUsers = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });

        const isMatch = await user.authenticate(password);
        if (!isMatch) return res.status(401).json({ success: false, message: 'Email and password do not match' });

        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '30m' });

        res.cookie('jwt', token, {
            httpOnly: true,
            maxAge: 1800000,
            secure: false, // set true in production
            sameSite: 'Lax',
        });

        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: { id: user._id, email: user.email, name: user.name },
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

const signupUsers = async (req, res) => {
    const { email, password, name } = req.body;

    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(403).json({ success: false, message: 'User already exists' });
        }

        const user = new User({ email, password, name });
        await user.save();

        res.status(200).json({ success: true, message: 'Signup successful' });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ success: false, message: 'Error during signup', error: error.message });
    }
};

module.exports = { loginUsers, signupUsers };
