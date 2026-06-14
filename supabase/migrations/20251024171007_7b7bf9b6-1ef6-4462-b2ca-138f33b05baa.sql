-- Fix 1: Restrict user_roles INSERT to service role only
DROP POLICY IF EXISTS "Only system can insert roles" ON public.user_roles;

CREATE POLICY "Only service role can insert roles"
  ON public.user_roles FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

-- Fix 2: Restrict profiles table access
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;

CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Responders can view profiles"
  ON public.profiles FOR SELECT
  USING (has_role(auth.uid(), 'emergency_responder'::app_role) OR has_role(auth.uid(), 'community_lead'::app_role));