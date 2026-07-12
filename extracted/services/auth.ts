
export interface UserProfile {
  email: string;
  name: string;
  age: number;
  gender: 'male' | 'female';
  password?: string; // Stored for simulation only
  gems: number;
  joinedAt: number;
  lastLogin: number;
  isVip: boolean;
  vipExpiry?: number;
  currency: 'USD' | 'SAR' | 'AED' | 'KWD' | 'EGP' | 'EUR' | 'GBP';
  language: 'ar' | 'en'; // Added language preference
  lastDailyRewardClaim?: number;
  dailyLoginStreak: number;
  xp: number;
  level: number;
}

export interface RegisterDTO {
    email: string;
    password: string;
    name: string;
    age: number;
    gender: 'male' | 'female';
}

const DB_KEY = 'jawr_users_db_v3'; // Bump version to reset schema if needed
const CURRENT_USER_KEY = 'jawr_current_session_v2';

export const AuthService = {
  getDB: (): Record<string, UserProfile> => {
    try {
      return JSON.parse(localStorage.getItem(DB_KEY) || '{}');
    } catch {
      return {};
    }
  },

  saveDB: (db: Record<string, UserProfile>) => {
    localStorage.setItem(DB_KEY, JSON.stringify(db));
  },

  register: async (data: RegisterDTO): Promise<{ success: boolean; user?: UserProfile; message?: string }> => {
    await new Promise(r => setTimeout(r, 800)); // Faster simulation
    
    if (!data.email || !data.password || !data.name) {
        return { success: false, message: 'Invalid data' };
    }

    const normalizedEmail = data.email.toLowerCase().trim();
    const db = AuthService.getDB();

    if (db[normalizedEmail]) {
        return { success: false, message: 'Email already exists' };
    }

    const newUser: UserProfile = {
        email: normalizedEmail,
        name: data.name,
        password: data.password, 
        age: data.age,
        gender: data.gender,
        gems: 0, 
        joinedAt: Date.now(),
        lastLogin: Date.now(),
        isVip: false,
        currency: 'USD', // Will be auto-detected on first load
        language: 'ar',  // Default
        dailyLoginStreak: 0,
        xp: 0,
        level: 1
    };

    db[normalizedEmail] = newUser;
    AuthService.saveDB(db);
    localStorage.setItem(CURRENT_USER_KEY, normalizedEmail);

    return { success: true, user: newUser };
  },

  login: async (email: string, password: string): Promise<{ success: boolean; user?: UserProfile; message?: string }> => {
    await new Promise(r => setTimeout(r, 800));
    
    const normalizedEmail = email.toLowerCase().trim();
    const db = AuthService.getDB();
    const user = db[normalizedEmail];

    if (!user) {
        return { success: false, message: 'User not found' };
    }

    if (user.password !== password) {
        return { success: false, message: 'Invalid password' };
    }

    user.lastLogin = Date.now();
    AuthService.saveDB(db);
    localStorage.setItem(CURRENT_USER_KEY, normalizedEmail);

    return { success: true, user };
  },

  getCurrentUser: (): UserProfile | null => {
    const email = localStorage.getItem(CURRENT_USER_KEY);
    if (!email) return null;
    const db = AuthService.getDB();
    return db[email] || null;
  },

  logout: () => {
    localStorage.removeItem(CURRENT_USER_KEY);
  },

  updateGems: (email: string, amount: number): number => {
    const db = AuthService.getDB();
    if (db[email]) {
      db[email].gems = Math.max(0, db[email].gems + amount);
      AuthService.saveDB(db);
      return db[email].gems;
    }
    return 0;
  },

  setCurrency: (email: string, currency: UserProfile['currency']) => {
    const db = AuthService.getDB();
    if (db[email]) {
        db[email].currency = currency;
        AuthService.saveDB(db);
    }
  },

  setLanguage: (email: string, lang: 'ar' | 'en') => {
      const db = AuthService.getDB();
      if (db[email]) {
          db[email].language = lang;
          AuthService.saveDB(db);
      }
  }
};
