
import { PostgrestError, User as SupabaseUser } from '@supabase/supabase-js';
import { Tables } from '@/integrations/supabase/types';

export type AuthError = PostgrestError | null;

export interface AuthSession {
  user: SupabaseUser | null;
  error: AuthError;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'teacher' | 'student';
  avatar?: string;
  bio?: string;
  contactDetails?: string;
  bookmarks?: string[];
}

// Map Supabase database profile to our app's UserProfile type
export const mapDatabaseProfileToUserProfile = (profile: Tables<'profiles'>): UserProfile => {
  return {
    id: profile.id,
    name: profile.name,
    email: profile.email,
    role: profile.role as 'teacher' | 'student',
    avatar: profile.avatar || undefined,
    bio: profile.bio || undefined,
    contactDetails: profile.contact_details || undefined,
    bookmarks: profile.bookmarks || [],
  };
};
