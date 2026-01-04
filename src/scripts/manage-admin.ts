
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

async function main() {
    try {
        const { default: dbConnect } = await import('../lib/db');
        const { default: User } = await import('../models/User');

        await dbConnect();

        console.log('Connected to database.');

        const command = process.argv[2];
        const email = process.argv[3];

        if (command === 'list') {
            const users = await User.find({});
            console.log(JSON.stringify(users.map(u => ({ email: u.email, role: u.role, id: u._id })), null, 2));
        } else if (command === 'list-categories') {
            const { default: Category } = await import('../models/Category');
            const categories = await Category.find({});
            console.log(JSON.stringify(categories, null, 2));
        } else if (command === 'promote' && email) {
            const user = await User.findOne({ email });
            if (!user) {
                console.log('User not found.');
            } else {
                user.role = 'admin';
                await user.save();
                console.log(`User ${email} promoted to admin.`);
            }
        } else {
            console.log('Usage:');
            console.log('  npx tsx src/scripts/manage-admin.ts list');
            console.log('  npx tsx src/scripts/manage-admin.ts promote <email>');
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
    }
}

main();
