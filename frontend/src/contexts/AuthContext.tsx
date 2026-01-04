import { createContext, useContext, useEffect, useState, useRef } from 'react';
import { authService } from '../services';
import { toast } from '../utils/toast';

interface AuthContextType {
  isAuthenticated: boolean;
  loading: boolean;
  isSuperuser: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Refresh token 2 minutes before it expires
const REFRESH_BUFFER_MS = 2 * 60 * 1000; // 2 minutes

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSuperuser, setIsSuperuser] = useState(false);
  const [loading, setLoading] = useState(true);
  const refreshTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Check if user is already logged in
    checkAuth();

    // Cleanup timer on unmount
    return () => {
      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current);
      }
    };
  }, []);

  const scheduleTokenRefresh = (accessToken: string) => {
    // Clear any existing timer
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
    }

    const timeUntilExpiration = authService.getTimeUntilExpiration(accessToken);
    
    // Schedule refresh before token expires (minus buffer time)
    const refreshTime = Math.max(0, timeUntilExpiration - REFRESH_BUFFER_MS);

    console.log(`[Auth] Token expires in ${Math.floor(timeUntilExpiration / 1000)}s, scheduling refresh in ${Math.floor(refreshTime / 1000)}s`);

    refreshTimerRef.current = setTimeout(async () => {
      console.log('[Auth] Refreshing token...');
      
      try {
        const refreshToken = authService.getRefreshToken();
        if (!refreshToken) {
          console.error('[Auth] No refresh token available');
          await signOut();
          toast.error('Session expired. Please log in again.');
          return;
        }

        const refreshResponse = await authService.refreshToken(refreshToken);
        if (refreshResponse) {
          authService.storeTokens(refreshResponse.access_token, refreshToken);
          console.log('[Auth] Token refreshed successfully');
          
          // Schedule next refresh
          scheduleTokenRefresh(refreshResponse.access_token);
        } else {
          console.error('[Auth] Token refresh failed');
          await signOut();
          toast.error('Session expired. Please log in again.');
        }
      } catch (error) {
        console.error('[Auth] Token refresh error:', error);
        await signOut();
        toast.error('Session expired. Please log in again.');
      }
    }, refreshTime);
  };

  const checkAuth = async () => {
    try {
      const token = authService.getAccessToken();
      
      if (token) {
        // Check if token is still valid by trying to refresh it
        const validToken = await authService.ensureValidToken();
        if (validToken) {
          setIsAuthenticated(true);
          // Get superuser status from localStorage
          const superuserStatus = localStorage.getItem('is_superuser');
          setIsSuperuser(superuserStatus === 'true');
          // Schedule automatic refresh
          scheduleTokenRefresh(validToken);
        } else {
          // Token invalid, clear everything
          authService.clearTokens();
          localStorage.removeItem('user_email');
          localStorage.removeItem('is_superuser');
          setIsAuthenticated(false);
          setIsSuperuser(false);
        }
      } else {
        setIsAuthenticated(false);
        setIsSuperuser(false);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      authService.clearTokens();
      localStorage.removeItem('user_email');
      localStorage.removeItem('is_superuser');
      setIsAuthenticated(false);
      setIsSuperuser(false);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    const response = await authService.login({
      username: email,
      password: password,
    });

    if (!response) {
      throw new Error('Invalid email or password');
    }

    // Store tokens
    authService.storeTokens(response.access_token, response.refresh_token);
    
    // Store email and superuser status
    localStorage.setItem('user_email', email);
    localStorage.setItem('is_superuser', String(response.is_superuser));

    // Set authenticated status
    setIsAuthenticated(true);
    setIsSuperuser(response.is_superuser);

    // Schedule automatic token refresh
    scheduleTokenRefresh(response.access_token);
  };

  const signOut = async () => {
    // Clear refresh timer
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
      refreshTimerRef.current = null;
    }

    authService.clearTokens();
    localStorage.removeItem('user_email');
    localStorage.removeItem('is_superuser');
    setIsAuthenticated(false);
    setIsSuperuser(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, isSuperuser, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}