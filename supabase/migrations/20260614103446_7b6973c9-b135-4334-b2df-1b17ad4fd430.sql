
-- user_roles: restrict SELECT
DROP POLICY IF EXISTS "Users can view all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);
REVOKE SELECT ON public.user_roles FROM anon;

-- vulnerability_registry: own-entry select + strict insert/update/delete check
DROP POLICY IF EXISTS "Users can insert their own registry entry" ON public.vulnerability_registry;
DROP POLICY IF EXISTS "Users can view their own registry entry" ON public.vulnerability_registry;
DROP POLICY IF EXISTS "Users can update their own registry entry" ON public.vulnerability_registry;
DROP POLICY IF EXISTS "Users can delete their own registry entry" ON public.vulnerability_registry;
DROP POLICY IF EXISTS "Authenticated users can insert registry entries" ON public.vulnerability_registry;

CREATE POLICY "Users can view their own registry entry"
  ON public.vulnerability_registry FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own registry entry"
  ON public.vulnerability_registry FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own registry entry"
  ON public.vulnerability_registry FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own registry entry"
  ON public.vulnerability_registry FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- alerts: restrict INSERT to privileged roles
DROP POLICY IF EXISTS "Authenticated users can create alerts" ON public.alerts;
DROP POLICY IF EXISTS "Privileged users can create alerts" ON public.alerts;
CREATE POLICY "Privileged users can create alerts"
  ON public.alerts FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = created_by
    AND (public.has_role(auth.uid(), 'emergency_responder') OR public.has_role(auth.uid(), 'community_lead'))
  );

-- disaster_zones: restrict INSERT to privileged roles
DROP POLICY IF EXISTS "Authenticated users can create disaster zones" ON public.disaster_zones;
DROP POLICY IF EXISTS "Privileged users can create disaster zones" ON public.disaster_zones;
CREATE POLICY "Privileged users can create disaster zones"
  ON public.disaster_zones FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = created_by
    AND (public.has_role(auth.uid(), 'emergency_responder') OR public.has_role(auth.uid(), 'community_lead'))
  );

-- drill_participation: own rows only (plus privileged roles)
DROP POLICY IF EXISTS "Users can view all drill participation" ON public.drill_participation;
DROP POLICY IF EXISTS "Users can view their own drill participation" ON public.drill_participation;
CREATE POLICY "Users can view their own drill participation"
  ON public.drill_participation FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id
    OR public.has_role(auth.uid(), 'emergency_responder')
    OR public.has_role(auth.uid(), 'community_lead')
  );

-- resources: require authentication to read
DROP POLICY IF EXISTS "Anyone can view resources" ON public.resources;
DROP POLICY IF EXISTS "Authenticated users can view resources" ON public.resources;
CREATE POLICY "Authenticated users can view resources"
  ON public.resources FOR SELECT
  TO authenticated
  USING (true);
REVOKE SELECT ON public.resources FROM anon;
