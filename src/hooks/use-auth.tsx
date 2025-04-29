
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { UserProfile, mapDatabaseProfileToUserProfile } from '@/integrations/supabase/auth-types';
import { Database } from '@/integrations/supabase/types';

// Define auth context types
interface AuthContextType {
  user: UserProfile | null;
  supabaseUser: SupabaseUser | null;
  session: Session | null;
  isAuthenticated: boolean;
  isTeacher: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string, name: string, role: 'teacher' | 'student') => Promise<void>;
  toggleBookmark: (noteId: string) => Promise<void>;
  isBookmarked: (noteId: string) => boolean;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
}

// Create auth context with default values to prevent "undefined" errors
const AuthContext = createContext<AuthContextType>({
  user: null,
  supabaseUser: null,
  session: null,
  isAuthenticated: false,
  isTeacher: false,
  isLoading: true,
  login: async () => {},
  logout: async () => {},
  register: async () => {},
  toggleBookmark: async () => {},
  isBookmarked: () => false,
  updateProfile: async () => {},
});

// Safe localStorage functions to prevent crashes
const safeGetItem = (key: string): string | null => {
  try {
    return localStorage.getItem(key);
  } catch (error) {
    console.error(`Error getting ${key} from localStorage:`, error);
    return null;
  }
};

// Create auth provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<Error | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Fetch user profile from database
  const fetchUserProfile = async (userId: string) => {
    try {
      console.log(`Fetching profile for user: ${userId}`);
      
      // Using match parameter instead of direct .eq() method to fix TypeScript error
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId as any)
        .single();
      
      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }
      
      if (!data) {
        console.log('No profile data found');
        return null;
      }
      
      console.log('Profile data retrieved:', data);
      // Safely map the profile data
      return mapDatabaseProfileToUserProfile(data as any);
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      return null;
    }
  };

  // Initialize auth state
  useEffect(() => {
    let mounted = true;
    let subscription: { unsubscribe: () => void } | null = null;
    
    const initializeAuth = async () => {
      if (!mounted) return;
      
      setIsLoading(true);
      
      try {
        console.log("Initializing auth state...");
        
        // First set up the auth state listener
        const { data } = await supabase.auth.onAuthStateChange(
          async (event, currentSession) => {
            if (!mounted) return;
            
            console.log("Auth state change event:", event);
            setSession(currentSession);
            setSupabaseUser(currentSession?.user ?? null);
            
            // Fetch profile when auth state changes
            if (currentSession?.user) {
              // Use setTimeout to break potential deadlocks
              setTimeout(async () => {
                if (!mounted) return;
                const profile = await fetchUserProfile(currentSession.user.id);
                setUser(profile);
              }, 0);
            } else {
              setUser(null);
            }
          }
        );
        
        subscription = data.subscription;
        
        // Get current session
        const { data: sessionData } = await supabase.auth.getSession();
        
        if (!mounted) return;
        
        console.log("Initial session:", sessionData.session);
        setSession(sessionData.session);
        setSupabaseUser(sessionData.session?.user ?? null);
        
        // Fetch profile for current session
        if (sessionData.session?.user) {
          const profile = await fetchUserProfile(sessionData.session.user.id);
          if (!mounted) return;
          setUser(profile);
        }

        setIsInitialized(true);
      } catch (error) {
        console.error('Auth initialization failed:', error);
        setAuthError(error as Error);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };
    
    initializeAuth();
    
    return () => {
      mounted = false;
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);

  // Handle user login
  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    
    try {
      console.log(`Attempting login with email: ${email}`);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('Login error:', error);
        throw error;
      }
      
      console.log("Login successful:", data);
      // Session and user will be updated by onAuthStateChange
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Handle user registration
  const register = async (
    email: string, 
    password: string, 
    name: string, 
    role: 'teacher' | 'student'
  ): Promise<void> => {
    setIsLoading(true);
    
    try {
      console.log(`Registering user with email: ${email}, name: ${name}, role: ${role}`);
      
      // Register the user with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role,
          },
          emailRedirectTo: window.location.origin,
        },
      });
      
      if (error) {
        console.error('Registration error:', error);
        throw error;
      }
      
      if (data?.user) {
        console.log('User registered successfully:', data.user.id);
        
        // Check if profile was created by the trigger
        // If not, we create it manually as a fallback
        setTimeout(async () => {
          const profile = await fetchUserProfile(data.user!.id);
          
          if (!profile) {
            console.log('No profile found, creating manually');
            // Create profile manually if trigger didn't work
            const { error: profileError } = await supabase
              .from('profiles')
              .insert({
                id: data.user!.id,
                name,
                email,
                role
              } as any);
            
            if (profileError) {
              console.error('Error creating profile manually:', profileError);
            }
          }
        }, 1000);
      }
      
      // Auth state listener will handle session updates
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Handle user logout
  const logout = async () => {
    setIsLoading(true);
    try {
      console.log("Logging out...");
      await supabase.auth.signOut();
      // Auth state listener will handle updating state
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle bookmark for a note
  const toggleBookmark = async (noteId: string) => {
    if (!user || !supabaseUser) return;
    
    try {
      console.log(`Toggling bookmark for note: ${noteId}`);
      
      // Get current bookmarks
      const bookmarks = user.bookmarks || [];
      const isCurrentlyBookmarked = bookmarks.includes(noteId);
      
      // Update bookmarks array
      const updatedBookmarks = isCurrentlyBookmarked
        ? bookmarks.filter(id => id !== noteId)
        : [...bookmarks, noteId];
      
      // Update profile in database
      const { error } = await supabase
        .from('profiles')
        .update({ bookmarks: updatedBookmarks } as any)
        .eq('id', user.id as any);
      
      if (error) {
        throw error;
      }
      
      // Update local state
      setUser({
        ...user,
        bookmarks: updatedBookmarks,
      });
      
      console.log(`Bookmark ${isCurrentlyBookmarked ? 'removed' : 'added'}`);
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    }
  };
  
  // Check if a note is bookmarked
  const isBookmarked = (noteId: string): boolean => {
    if (!user || !user.bookmarks) return false;
    return user.bookmarks.includes(noteId);
  };

  // Update user profile
  const updateProfile = async (data: Partial<UserProfile>): Promise<void> => {
    if (!user || !supabaseUser) throw new Error('User not authenticated');
    
    setIsLoading(true);
    
    try {
      // Convert from our UserProfile type to the database format
      const dbData: any = {};
      if (data.name) dbData.name = data.name;
      if (data.email) dbData.email = data.email;
      if (data.role) dbData.role = data.role;
      if (data.avatar !== undefined) dbData.avatar = data.avatar;
      if (data.bio !== undefined) dbData.bio = data.bio;
      if (data.contactDetails !== undefined) dbData.contact_details = data.contactDetails;
      if (data.bookmarks !== undefined) dbData.bookmarks = data.bookmarks;
      
      const { error } = await supabase
        .from('profiles')
        .update(dbData)
        .eq('id', user.id as any);
      
      if (error) {
        throw error;
      }
      
      // Update local state
      setUser({
        ...user,
        ...data,
      });
    } catch (error) {
      console.error('Profile update failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Determine if user is a teacher
  const isTeacher = user?.role === 'teacher';
  
  // Create context value
  const value = {
    user,
    supabaseUser,
    session,
    isAuthenticated: !!session && !!user,
    isTeacher,
    isLoading,
    login,
    logout,
    register,
    toggleBookmark,
    isBookmarked,
    updateProfile
  };

  if (authError) {
    console.error("Auth error during initialization:", authError);
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center p-4">
          <h2 className="text-xl font-bold mb-2">Authentication Error</h2>
          <p className="text-red-500">Please try refreshing the page</p>
        </div>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};
