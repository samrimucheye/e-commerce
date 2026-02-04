// import { NextResponse } from 'next/server';
// import { cj } from '@/lib/cj';
// import { auth } from '@/auth';

// export async function GET(req: Request) {
//     try {
//         const session = await auth();
//         if (!session || (session.user as any).role !== 'admin') {
//             return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
//         }

//         const { searchParams } = new URL(req.url);
//         const keyword = searchParams.get('keyword') || '';
//         const pageNum = parseInt(searchParams.get('pageNum') || '1');

//         const data = await cj.searchProducts({ keyword, pageNum });
//         return NextResponse.json(data);
//     } catch (error: any) {
//         console.error('CJ Search Error:', error);
//         return NextResponse.json({ message: error.message }, { status: 500 });
//     }
// }


import { NextResponse } from 'next/server';
import { cj } from '@/lib/cj';
import { auth } from '@/auth';

export async function GET(req: Request) {
    try {
        const session = await auth();

        // ✅ safer session / role check
        if (!session?.user || (session.user as { role?: string }).role !== 'admin') {
            return NextResponse.json(
                { message: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(req.url);

        const keyword = searchParams.get('keyword') ?? undefined;
        const pageNum = Number(searchParams.get('pageNum') ?? 1);
        const pageSize = Number(searchParams.get('pageSize') ?? 20);

        // ✅ guard against NaN
        const data = await cj.searchProducts({
            keyword,
            pageNum: Number.isNaN(pageNum) ? 1 : pageNum,
            pageSize: Number.isNaN(pageSize) ? 20 : pageSize,
        });

        if (data && data.list && data.list.length > 0) {
            console.log("CJ Search Debug:", {
                keyword,
                firstMatch: {
                    pid: data.list[0].pid,
                    sku: data.list[0].productSku,
                    name: data.list[0].productNameEn
                }
            });
        }

        return NextResponse.json({
            success: true,
            data,
        });
    } catch (error) {
        console.error('CJ Search Error:', error);

        const message =
            error instanceof Error
                ? error.message
                : 'Internal Server Error';

        return NextResponse.json(
            { success: false, message },
            { status: 500 }
        );
    }
}
