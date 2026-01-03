// services/auth.ts
import { UserProfile } from '../types';

export class AuthService {
  static getCurrentUser(): UserProfile | null {
    // محاكاة مستخدم مسجل دخول (يمكنك جعلها null لتجربة شاشة الدخول)
    return null; 
  }

  static async register(data: any) {
    return {
      success: true,
      user: {
        name: data.name,
        email: data.email,
        avatar: 'https://via.placeholder.com/150'
      }
    };
  }

  static logout() {
    console.log("Logged out");
  }
}