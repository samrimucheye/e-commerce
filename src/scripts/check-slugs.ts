
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

async function listSlugs() {
    try {
        const { default: dbConnect } = await import('../lib/db');
        const { default: Product } = await import('../models/Product');

        await dbConnect();
        const products = await Product.find({}, 'name slug');
        console.log('--- Product Slugs ---');
        products.forEach(p => {
            // console.log(`Name: "${p.name}", Slug: "${p.slug}"`);
            // Use JSON.stringify to see hidden chars or structure
            console.log(JSON.stringify({ name: p.name, slug: p.slug }));
        });
        console.log('---------------------');
        process.exit(0);
    } catch (error) {
        console.error('Error listing slugs:', error);
        process.exit(1);
    }
}

listSlugs();
