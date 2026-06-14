-- Create role enum for user types
CREATE TYPE public.app_role AS ENUM ('community_member', 'emergency_responder', 'community_lead');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Create function to get user role
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id UUID)
RETURNS app_role
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role
  FROM public.user_roles
  WHERE user_id = _user_id
  LIMIT 1
$$;

-- RLS Policies for user_roles
CREATE POLICY "Users can view all roles"
  ON public.user_roles FOR SELECT
  USING (true);

CREATE POLICY "Only system can insert roles"
  ON public.user_roles FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Update vulnerability_registry RLS to only allow emergency responders and community leads
DROP POLICY IF EXISTS "Registry viewable by authenticated users" ON public.vulnerability_registry;

CREATE POLICY "Registry viewable by responders and leads"
  ON public.vulnerability_registry FOR SELECT
  USING (
    public.has_role(auth.uid(), 'emergency_responder') OR 
    public.has_role(auth.uid(), 'community_lead')
  );

-- Add some sample drills
INSERT INTO public.drills (drill_name, drill_type, description, duration_minutes) VALUES
  ('Fire Evacuation Drill', 'Fire', 'Practice evacuating the building safely in case of fire emergency', 15),
  ('Earthquake Drop-Cover-Hold', 'Earthquake', 'Learn and practice the drop, cover, and hold on technique during earthquakes', 10),
  ('Flood Response Drill', 'Flood', 'Practice moving to higher ground and securing emergency supplies', 20),
  ('First Aid Response', 'Medical', 'Basic first aid and CPR practice for emergency medical situations', 30),
  ('Communication Chain Test', 'Communication', 'Test the emergency communication network and alert system', 5);