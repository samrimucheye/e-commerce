import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Newsletter from '@/models/Newsletter';
import { z } from 'zod';

const newsletterSchema = z.object({
    email: z.string().email('Invalid email address'),
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email } = newsletterSchema.parse(body);

        await dbConnect();

        const existingSubscription = await Newsletter.findOne({ email });
        if (existingSubscription) {
            return NextResponse.json(
                { message: 'You are already subscribed!' },
                { status: 400 }
            );
        }

        await Newsletter.create({ email });

        return NextResponse.json(
            { message: 'Welcome to the circle! You have successfully subscribed.' },
            { status: 201 }
        );
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ message: error.issues[0].message }, { status: 400 });
        }

        if (error.code === 11000) {
            return NextResponse.json({ message: 'You are already subscribed!' }, { status: 400 });
        }

        console.error('Newsletter API Error:', error);
        return NextResponse.json(
            { message: 'Something went wrong. Please try again later.' },
            { status: 500 }
        );
    }
}
