export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: string;
    roles?: Array<{ id: number; name: string }>;
}

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
    auth: {
        user: User;
    };
};
