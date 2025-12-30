import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { auth } from '@/auth';

export async function GET(req: Request) {
    try {
        const session = await auth();
        const userRole = (session?.user as any)?.role;

        if (!session || userRole !== 'admin') {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        const users = await User.find({}).sort({ createdAt: -1 });

        return NextResponse.json(users);
    } catch (error: any) {
        return NextResponse.json(
            { message: 'Error fetching users', error: error.message },
            { status: 500 }
        );
    }
}
export async function POST(req: Request) {
    try {
        const session = await auth();
        const userRole = (session?.user as any)?.role;

        if (!session || userRole !== 'admin') {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { name, email, password, role } = body;

        if (!name || !email || !password) {
            return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
        }

        await dbConnect();

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ message: 'User already exists' }, { status: 400 });
        }

        // Note: In a real app, you should hash the password here if not handled by the model
        const user = await User.create({
            name,
            email,
            password, // Assuming the model or a middleware hashes this, or using a simple implementation for now
            role: role || 'user'
        });

        return NextResponse.json(user, { status: 201 });
    } catch (error: any) {
        return NextResponse.json(
            { message: 'Error creating user', error: error.message },
            { status: 500 }
        );
    }
}
