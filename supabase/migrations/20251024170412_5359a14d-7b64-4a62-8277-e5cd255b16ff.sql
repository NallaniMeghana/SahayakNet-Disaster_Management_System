-- Create disaster_zones table for disaster-prone areas
CREATE TABLE IF NOT EXISTS public.disaster_zones (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  zone_name TEXT NOT NULL,
  zone_type TEXT NOT NULL,
  risk_level TEXT NOT NULL CHECK (risk_level IN ('critical', 'high', 'medium', 'low')),
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  radius INTEGER NOT NULL DEFAULT 5000,
  description TEXT,
  last_incident TIMESTAMP WITH TIME ZONE,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.disaster_zones ENABLE ROW LEVEL SECURITY;

-- RLS Policies for disaster_zones
CREATE POLICY "Anyone can view disaster zones" ON public.disaster_zones FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create disaster zones" ON public.disaster_zones FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Users can update disaster zones they created" ON public.disaster_zones FOR UPDATE USING (auth.uid() = created_by);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_disaster_zones_updated_at
  BEFORE UPDATE ON public.disaster_zones
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some sample disaster zones (India specific locations)
INSERT INTO public.disaster_zones (zone_name, zone_type, risk_level, latitude, longitude, radius, description) VALUES
  ('Mumbai Coastal Area', 'Flood', 'high', 19.0760, 72.8777, 8000, 'Heavy monsoon prone area with frequent flooding'),
  ('Delhi NCR', 'Air Quality', 'critical', 28.7041, 77.1025, 15000, 'Severe air pollution levels especially during winter'),
  ('Gujarat Earthquake Zone', 'Earthquake', 'high', 23.0225, 72.5714, 50000, 'Seismically active region with history of major earthquakes'),
  ('Chennai Cyclone Belt', 'Cyclone', 'high', 13.0827, 80.2707, 20000, 'Prone to tropical cyclones during monsoon season'),
  ('Assam Flood Plains', 'Flood', 'critical', 26.2006, 92.9376, 30000, 'Annual flooding from Brahmaputra River'),
  ('Kerala Landslide Zone', 'Landslide', 'medium', 10.8505, 76.2711, 10000, 'Mountainous terrain susceptible to landslides during heavy rains')
ON CONFLICT DO NOTHING;
