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
