import { z } from 'zod';

// Auth validation schemas
export const emailSchema = z.string().email('Invalid email address').max(255, 'Email too long');
export const passwordSchema = z.string().min(6, 'Password must be at least 6 characters').max(72, 'Password too long');
export const fullNameSchema = z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name too long').trim();

export const authSignUpSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  fullName: fullNameSchema,
  userType: z.enum(['community_member', 'emergency_responder', 'community_lead']),
});

export const authSignInSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

// Incident validation schema
export const incidentSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(100, 'Title too long').trim(),
  incident_type: z.enum(['fire', 'flood', 'earthquake', 'medical', 'accident', 'other']),
  severity: z.enum(['low', 'medium', 'high', 'critical']),
  description: z.string().max(1000, 'Description too long').trim().optional().or(z.literal('')),
  latitude: z.number().min(-90, 'Invalid latitude').max(90, 'Invalid latitude'),
  longitude: z.number().min(-180, 'Invalid longitude').max(180, 'Invalid longitude'),
});

// Alert validation schema
export const alertSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(100, 'Title too long').trim(),
  message: z.string().min(10, 'Message must be at least 10 characters').max(500, 'Message too long').trim(),
  alert_type: z.enum(['warning', 'evacuation', 'all_clear', 'general']),
  severity: z.enum(['low', 'medium', 'high', 'critical']),
});

// Registry validation schema
export const registrySchema = z.object({
  full_name: fullNameSchema,
  phone: z.string().min(10, 'Phone number must be at least 10 digits').max(20, 'Phone number too long').trim(),
  address: z.string().min(5, 'Address must be at least 5 characters').max(200, 'Address too long').trim(),
  vulnerability_type: z.array(z.string()).min(1, 'Select at least one vulnerability type'),
  medical_conditions: z.string().max(500, 'Medical conditions description too long').trim().optional().or(z.literal('')),
  emergency_contact: z.string().max(100, 'Emergency contact too long').trim().optional().or(z.literal('')),
  special_needs: z.string().max(500, 'Special needs description too long').trim().optional().or(z.literal('')),
});

// Drill validation schema
export const drillSchema = z.object({
  drill_name: z.string().min(5, 'Name must be at least 5 characters').max(100, 'Name too long').trim(),
  drill_type: z.enum(['fire', 'flood', 'earthquake', 'evacuation', 'other']),
  duration_minutes: z.number().min(1, 'Duration must be at least 1 minute').max(480, 'Duration too long'),
  description: z.string().max(500, 'Description too long').trim().optional().or(z.literal('')),
});

// Resource validation schema
export const resourceSchema = z.object({
  resource_name: z.string().min(3, 'Name must be at least 3 characters').max(100, 'Name too long').trim(),
  resource_type: z.enum(['vehicle', 'equipment', 'shelter', 'supplies', 'medical', 'other']),
  description: z.string().max(500, 'Description too long').trim().optional().or(z.literal('')),
  location: z.string().max(200, 'Location too long').trim().optional().or(z.literal('')),
  contact_info: z.string().max(100, 'Contact info too long').trim().optional().or(z.literal('')),
});
