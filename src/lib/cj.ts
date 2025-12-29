const CJ_API_BASE = 'https://tools.cjdropshipping.com/api2.0/v1';

export class CJClient {
    private apiKey: string;
    private accessToken: string | null = null;

    constructor() {
        this.apiKey = process.env.CJ_API_KEY || '';
    }

    private async getAccessToken() {
        // Note: In a real scenario, you'd handle token expiration & refreshing.
        // This is a simplified version assuming a valid token is provided or fetched.
        if (this.accessToken) return this.accessToken;

        // CJ Authentication flow usually involves exchange of API Key for a token
        // For this implementation, we expect CJ_ACCESS_TOKEN in env or a fresh fetch.
        this.accessToken = process.env.CJ_ACCESS_TOKEN || null;
        return this.accessToken;
    }

    async searchProducts(params: { keyword?: string; pageNum?: number; pageSize?: number; categoryId?: string }) {
        const token = await this.getAccessToken();
        if (!token) throw new Error('CJ Access Token not configured');

        const query = new URLSearchParams({
            pageNum: (params.pageNum || 1).toString(),
            pageSize: (params.pageSize || 20).toString(),
            ...(params.keyword && { productName: params.keyword }),
            ...(params.categoryId && { categoryId: params.categoryId }),
        });

        const res = await fetch(`${CJ_API_BASE}/product/list?${query.toString()}`, {
            headers: {
                'CJ-Access-Token': token,
            },
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.message || 'Failed to fetch products from CJ');
        }

        return res.json();
    }

    async getProductDetail(pid: string) {
        const token = await this.getAccessToken();
        if (!token) throw new Error('CJ Access Token not configured');

        const res = await fetch(`${CJ_API_BASE}/product/detail?pid=${pid}`, {
            headers: {
                'CJ-Access-Token': token,
            },
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.message || 'Failed to fetch product details from CJ');
        }

        return res.json();
    }
}

export const cj = new CJClient();
