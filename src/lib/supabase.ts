'use client';

const USERS_KEY = 'supabase_users';
const SESSION_KEY = 'supabase_session';

interface UserRecord {
  email: string;
  password: string;
}

function getStoredUsers(): UserRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function setStoredUsers(users: UserRecord[]) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function getStoredSession() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function setStoredSession(session: { email: string } | null) {
  if (typeof window === 'undefined') return;
  if (session) {
    window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } else {
    window.localStorage.removeItem(SESSION_KEY);
  }
}

const listeners = new Set<(event: string, session: { email: string } | null) => void>();

function notifyAuthStateChange(event: string, session: { email: string } | null) {
  listeners.forEach((listener) => listener(event, session));
}

export const supabase = {
  auth: {
    getSession: async () => ({ data: { session: getStoredSession() } }),
    onAuthStateChange: (callback: (event: string, session: { email: string } | null) => void) => {
      listeners.add(callback);
      const subscription = {
        unsubscribe: () => {
          listeners.delete(callback);
        },
      };
      return { data: { subscription } };
    },
    signInWithPassword: async ({ email, password }: { email: string; password: string }) => {
      const users = getStoredUsers();
      const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (!user || user.password !== password) {
        return { error: { message: 'Invalid login credentials.' } };
      }

      const session = { email: user.email };
      setStoredSession(session);
      notifyAuthStateChange('SIGNED_IN', session);
      return { data: { session }, error: null };
    },
    signUp: async ({ email, password }: { email: string; password: string }) => {
      const users = getStoredUsers();
      const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (existing) {
        return { error: { message: 'User already exists.' } };
      }

      users.push({ email, password });
      setStoredUsers(users);
      const session = { email };
      setStoredSession(session);
      notifyAuthStateChange('SIGNED_IN', session);
      return { data: { user: { email } }, error: null };
    },
    signOut: async () => {
      setStoredSession(null);
      notifyAuthStateChange('SIGNED_OUT', null);
      return { error: null };
    },
  },
};
