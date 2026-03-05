const CJ_API_BASE = 'https://developers.cjdropshipping.com/api2.0/v1';

const globalForCJ = globalThis as unknown as {
    cjTokenCache: {
        accessToken: string | null;
        tokenExpiry: number | null;
        fetchPromise: Promise<string> | null;
    } | undefined;
    cj: any;
};

const tokenCache = globalForCJ.cjTokenCache ?? {
    accessToken: null,
    tokenExpiry: null,
    fetchPromise: null,
};

if (process.env.NODE_ENV !== 'production') {
    globalForCJ.cjTokenCache = tokenCache;
}

export class CJClient {
    private apiKey: string;

    constructor() {
        if (!process.env.CJ_API_KEY) {
            throw new Error('CJ_API_KEY is missing');
        }
        this.apiKey = process.env.CJ_API_KEY;
    }

    private async getAccessToken(): Promise<string> {
        const now = Date.now();

        // 1. Check valid cache
        if (tokenCache.accessToken && tokenCache.tokenExpiry && now < tokenCache.tokenExpiry) {
            return tokenCache.accessToken;
        }

        // 2. Check if a fetch is currently in progress
        if (tokenCache.fetchPromise) {
            return tokenCache.fetchPromise;
        }

        // 3. Start a new fetch
        tokenCache.fetchPromise = (async () => {
            try {
                const res = await fetch(
                    `${CJ_API_BASE}/authentication/getAccessToken`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            apiKey: this.apiKey,
                        }),
                    }
                );

                const data = await res.json();

                // strict validation (matches Postman)
                if (!res.ok || data.code !== 200 || !data.data?.accessToken) {
                    throw new Error(
                        `CJ auth failed: ${JSON.stringify(data)}`
                    );
                }

                tokenCache.accessToken = data.data.accessToken;
                // Token valid for 4 hours (14400000ms), cache for 3.5 hours to be safe
                tokenCache.tokenExpiry = Date.now() + 12600000;
                return tokenCache.accessToken as string;
            } finally {
                tokenCache.fetchPromise = null;
            }
        })();

        return tokenCache.fetchPromise as Promise<string>;
    }

    async searchProducts(params: {
        keyword?: string;
        pageNum?: number;
        pageSize?: number;
        categoryId?: string;
    }) {
        const token = await this.getAccessToken();

        const query = new URLSearchParams({
            pageNum: String(params.pageNum ?? 1),
            pageSize: String(params.pageSize ?? 20),
            ...(params.keyword && (params.keyword.toUpperCase().startsWith('CJ')
                ? { productSku: params.keyword }
                : { productName: params.keyword }
            )),
            ...(params.categoryId && { categoryId: params.categoryId }),
        });

        const res = await fetch(
            `${CJ_API_BASE}/product/list?${query.toString()}`,
            {
                headers: {
                    'CJ-Access-Token': token,
                    'Content-Type': 'application/json',
                },
            }
        );

        const data = await res.json();

        if (!res.ok || data.code !== 200) {
            throw new Error(
                `CJ product list failed: ${JSON.stringify(data)}`
            );
        }

        return data.data ?? data.result;
    }

    async getProductDetail(pid: string) {
        const token = await this.getAccessToken();

        const res = await fetch(
            `${CJ_API_BASE}/product/query?pid=${pid}`,
            {
                headers: {
                    'CJ-Access-Token': token,
                    'Content-Type': 'application/json',
                },
            }
        );

        const data = await res.json();

        if (!res.ok || data.code !== 200) {
            throw new Error(
                `CJ product detail failed: ${JSON.stringify(data)}`
            );
        }

        return data.data ?? data.result;
    }
}

export const cj = globalForCJ.cj ?? new CJClient();

if (process.env.NODE_ENV !== 'production') {
    globalForCJ.cj = cj as any;
}
