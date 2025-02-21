export type BaseAPIResponse<T> = {
    data: T;
    error: string | null;
    message?: string;
    status: number;
    total?: number;
    page?: number;
    per_page?: number;
};
