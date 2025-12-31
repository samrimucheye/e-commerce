// Script to reset a user's password
// Usage: node scripts/reset-password.js <email> <newPassword>

const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
require('dotenv').config();

async function resetPassword() {
    const email = process.argv[2];
    const newPassword = process.argv[3];

    if (!email || !newPassword) {
        console.error('❌ Usage: node scripts/reset-password.js <email> <newPassword>');
        process.exit(1);
    }

    if (newPassword.length < 6) {
        console.error('❌ Password must be at least 6 characters');
        process.exit(1);
    }

    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Get User model
        const User = mongoose.model('User', new mongoose.Schema({
            email: String,
            password: String,
        }));

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            console.error(`❌ User not found: ${email}`);
            process.exit(1);
        }

        // Hash the new password
        console.log('🔐 Hashing password...');
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update password
        await User.updateOne(
            { email },
            { $set: { password: hashedPassword } }
        );

        console.log(`✅ Password reset successfully for: ${email}`);
        console.log('You can now log in with your new password!');

        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

resetPassword();
