-- Trigger types regeneration by adding a comment
COMMENT ON TABLE public.alerts IS 'Emergency alerts broadcast to community members';
COMMENT ON TABLE public.incidents IS 'Reported incidents requiring emergency response';
COMMENT ON TABLE public.skills IS 'User skills for emergency response coordination';
COMMENT ON TABLE public.resources IS 'Available resources for emergency situations';
COMMENT ON TABLE public.drills IS 'Emergency preparedness drills and exercises';
COMMENT ON TABLE public.profiles IS 'Extended user profile information';
COMMENT ON TABLE public.user_roles IS 'User role assignments for access control';
COMMENT ON TABLE public.vulnerability_registry IS 'Registry of vulnerable individuals needing assistance';
COMMENT ON TABLE public.disaster_zones IS 'Designated high-risk disaster zones';
COMMENT ON TABLE public.drill_participation IS 'User participation records in emergency drills';