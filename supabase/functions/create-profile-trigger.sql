
-- This trigger will create a profile automatically when a user signs up
CREATE OR REPLACE FUNCTION public.create_profile_for_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if the profile already exists to avoid duplicate errors
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = NEW.id) THEN
    INSERT INTO public.profiles (id, name, email, role)
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'name', 'User'),
      NEW.email,
      COALESCE(NEW.raw_user_meta_data->>'role', 'student')
    );
  END IF;
  RETURN NEW;
END;
$$;

-- Add trigger to create user profile when a new user signs up
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.create_profile_for_user();

-- Add another trigger to update user profile when a user confirms their email
CREATE OR REPLACE FUNCTION public.update_profile_on_email_confirm()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Update the profile if needed when email is confirmed
  UPDATE public.profiles
  SET email = NEW.email
  WHERE id = NEW.id AND email <> NEW.email;
  
  RETURN NEW;
END;
$$;

-- Add trigger to update profile when user confirms email
DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;
CREATE TRIGGER on_auth_user_updated
  AFTER UPDATE ON auth.users
  FOR EACH ROW
  WHEN (OLD.email_confirmed_at IS NULL AND NEW.email_confirmed_at IS NOT NULL)
  EXECUTE FUNCTION public.update_profile_on_email_confirm();
