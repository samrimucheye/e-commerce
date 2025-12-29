import { NextResponse } from 'next/server';
import { cj } from '@/lib/cj';
import { auth } from '@/auth';

export async function GET(req: Request) {
    try {
        const session = await auth();
        if (!session || (session.user as any).role !== 'admin') {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const keyword = searchParams.get('keyword') || '';
        const pageNum = parseInt(searchParams.get('pageNum') || '1');

        const data = await cj.searchProducts({ keyword, pageNum });
        return NextResponse.json(data);
    } catch (error: any) {
        console.error('CJ Search Error:', error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
