-- Step 1: Create app_role enum for role-based access
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Step 2: Create user_roles table for role management
CREATE TABLE public.user_roles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Step 3: Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Step 4: Create security definer function to check roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Step 5: Create policies for user_roles table
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Only admins can manage roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Step 6: Remove admin credentials from settings table (security fix)
ALTER TABLE public.settings DROP COLUMN IF EXISTS admin_username;
ALTER TABLE public.settings DROP COLUMN IF EXISTS admin_password;

-- Step 7: Drop existing public access policies on settings
DROP POLICY IF EXISTS "Allow public read settings" ON public.settings;
DROP POLICY IF EXISTS "Allow public update settings" ON public.settings;

-- Step 8: Create new secure policies for settings (read-only for all, write for admins)
CREATE POLICY "Anyone can read library settings"
ON public.settings
FOR SELECT
USING (true);

CREATE POLICY "Only admins can update settings"
ON public.settings
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Step 9: Drop existing public access policies on members
DROP POLICY IF EXISTS "Allow public delete members" ON public.members;
DROP POLICY IF EXISTS "Allow public insert members" ON public.members;
DROP POLICY IF EXISTS "Allow public read members" ON public.members;
DROP POLICY IF EXISTS "Allow public update members" ON public.members;

-- Step 10: Create new secure policies for members
CREATE POLICY "Anyone can read members for check-in"
ON public.members
FOR SELECT
USING (true);

CREATE POLICY "Only admins can insert members"
ON public.members
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can update members"
ON public.members
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can delete members"
ON public.members
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Step 11: Drop existing public access policies on check_ins
DROP POLICY IF EXISTS "Allow public delete check_ins" ON public.check_ins;
DROP POLICY IF EXISTS "Allow public insert check_ins" ON public.check_ins;
DROP POLICY IF EXISTS "Allow public read check_ins" ON public.check_ins;

-- Step 12: Create new secure policies for check_ins
CREATE POLICY "Anyone can insert check_ins for visitor registration"
ON public.check_ins
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Only admins can read check_ins"
ON public.check_ins
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can delete check_ins"
ON public.check_ins
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Step 13: Drop existing public access policies on thesis_attendance
DROP POLICY IF EXISTS "Allow public delete thesis_attendance" ON public.thesis_attendance;
DROP POLICY IF EXISTS "Allow public insert thesis_attendance" ON public.thesis_attendance;
DROP POLICY IF EXISTS "Allow public read thesis_attendance" ON public.thesis_attendance;
DROP POLICY IF EXISTS "Allow public update thesis_attendance" ON public.thesis_attendance;

-- Step 14: Create new secure policies for thesis_attendance
CREATE POLICY "Anyone can insert thesis_attendance for check-in"
ON public.thesis_attendance
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can update thesis_attendance for check-out"
ON public.thesis_attendance
FOR UPDATE
USING (true)
WITH CHECK (true);

CREATE POLICY "Only admins can read thesis_attendance"
ON public.thesis_attendance
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can delete thesis_attendance"
ON public.thesis_attendance
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));