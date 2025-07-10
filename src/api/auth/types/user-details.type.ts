export interface UserDetails {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    picture: string | null;
    role: string;
    provider: string | null;
    createdAt: Date;
    updatedAt: Date;
}
