export interface User {
  id: string;
  email: string;
  role: 'USER' | 'ADMIN' | 'SUPER_ADMIN' | 'SUB_ADMIN';
  isVerified: boolean;
  avatarUrl: string | null;
  verificationToken: string | null;
  firstName: string | null;
  lastName: string | null;
  createdAt: string;
  updatedAt: string;
}
