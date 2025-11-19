-- Add header_margin_top column to settings table
ALTER TABLE public.settings 
ADD COLUMN IF NOT EXISTS header_margin_top integer DEFAULT 15;