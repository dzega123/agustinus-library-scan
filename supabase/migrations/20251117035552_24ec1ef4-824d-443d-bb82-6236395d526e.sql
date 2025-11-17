-- Create members table for registered library members
CREATE TABLE public.members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id TEXT UNIQUE NOT NULL,
  nama TEXT NOT NULL,
  tipe_keanggotaan TEXT NOT NULL,
  jurusan TEXT,
  no_telepon TEXT,
  email TEXT,
  alamat TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create check_ins table for visitor check-ins
CREATE TABLE public.check_ins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id TEXT,
  nama TEXT NOT NULL,
  type TEXT NOT NULL,
  tipe_keanggotaan TEXT,
  jurusan TEXT,
  no_telepon TEXT,
  alamat TEXT,
  check_in_time TIMESTAMPTZ DEFAULT now(),
  date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create thesis_attendance table for thesis student attendance
CREATE TABLE public.thesis_attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id TEXT NOT NULL,
  student_name TEXT NOT NULL,
  check_in_time TIMESTAMPTZ,
  check_out_time TIMESTAMPTZ,
  date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create settings table for library configuration
CREATE TABLE public.settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  library_name TEXT DEFAULT 'Perpustakaan Agustinus STTRII',
  footer_text TEXT,
  header_image_url TEXT,
  footer_image_url TEXT,
  header_height INTEGER DEFAULT 100,
  footer_height INTEGER DEFAULT 80,
  admin_username TEXT DEFAULT 'Admin',
  admin_password TEXT DEFAULT 'admin123',
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Insert default settings
INSERT INTO public.settings (library_name, admin_username, admin_password) 
VALUES ('Perpustakaan Agustinus STTRII', 'Admin', 'admin123');

-- Create storage bucket for header/footer images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('library-assets', 'library-assets', true);

-- Enable RLS
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.check_ins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.thesis_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies - Allow public read access for check-in functionality
CREATE POLICY "Allow public read members" ON public.members FOR SELECT USING (true);
CREATE POLICY "Allow public insert members" ON public.members FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update members" ON public.members FOR UPDATE USING (true);
CREATE POLICY "Allow public delete members" ON public.members FOR DELETE USING (true);

CREATE POLICY "Allow public read check_ins" ON public.check_ins FOR SELECT USING (true);
CREATE POLICY "Allow public insert check_ins" ON public.check_ins FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public delete check_ins" ON public.check_ins FOR DELETE USING (true);

CREATE POLICY "Allow public read thesis_attendance" ON public.thesis_attendance FOR SELECT USING (true);
CREATE POLICY "Allow public insert thesis_attendance" ON public.thesis_attendance FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update thesis_attendance" ON public.thesis_attendance FOR UPDATE USING (true);
CREATE POLICY "Allow public delete thesis_attendance" ON public.thesis_attendance FOR DELETE USING (true);

CREATE POLICY "Allow public read settings" ON public.settings FOR SELECT USING (true);
CREATE POLICY "Allow public update settings" ON public.settings FOR UPDATE USING (true);

-- Storage policies for library assets
CREATE POLICY "Public can view library assets" ON storage.objects FOR SELECT USING (bucket_id = 'library-assets');
CREATE POLICY "Public can upload library assets" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'library-assets');
CREATE POLICY "Public can update library assets" ON storage.objects FOR UPDATE USING (bucket_id = 'library-assets');
CREATE POLICY "Public can delete library assets" ON storage.objects FOR DELETE USING (bucket_id = 'library-assets');

-- Create indexes for better performance
CREATE INDEX idx_members_member_id ON public.members(member_id);
CREATE INDEX idx_check_ins_date ON public.check_ins(date);
CREATE INDEX idx_check_ins_member_id ON public.check_ins(member_id);
CREATE INDEX idx_thesis_attendance_date ON public.thesis_attendance(date);
CREATE INDEX idx_thesis_attendance_student_id ON public.thesis_attendance(student_id);