import { supabase } from "@/integrations/supabase/client";

// Member types
export interface Member {
  id?: string;
  member_id: string;
  nama: string;
  tipe_keanggotaan: string;
  jurusan?: string;
  no_telepon?: string;
  email?: string;
  alamat?: string;
}

export interface CheckInData {
  id?: string;
  member_id?: string;
  nama: string;
  type: string;
  tipe_keanggotaan?: string;
  jurusan?: string;
  no_telepon?: string;
  alamat?: string;
  check_in_time: string;
  date: string;
}

export interface ThesisAttendance {
  id?: string;
  student_id: string;
  student_name: string;
  check_in_time?: string;
  check_out_time?: string;
  date: string;
}

export interface LibrarySettings {
  id?: string;
  library_name: string;
  footer_text?: string;
  header_image_url?: string;
  footer_image_url?: string;
  header_height?: number;
  footer_height?: number;
  admin_username: string;
  admin_password: string;
}

// Members operations
export const getMembers = async (): Promise<Member[]> => {
  const { data, error } = await supabase
    .from('members')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data || [];
};

export const addMember = async (member: Member): Promise<Member | null> => {
  // Check if member already exists
  const { data: existing } = await supabase
    .from('members')
    .select('*')
    .eq('member_id', member.member_id)
    .maybeSingle();
  
  if (existing) return null;

  const { data, error } = await supabase
    .from('members')
    .insert([member])
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const deleteMember = async (memberId: string): Promise<void> => {
  const { error } = await supabase
    .from('members')
    .delete()
    .eq('member_id', memberId);
  
  if (error) throw error;
};

// Check-ins operations
export const getCheckIns = async (): Promise<CheckInData[]> => {
  const { data, error } = await supabase
    .from('check_ins')
    .select('*')
    .order('check_in_time', { ascending: false });
  
  if (error) throw error;
  return data || [];
};

export const getTodayCheckIns = async (): Promise<CheckInData[]> => {
  const today = new Date().toISOString().split('T')[0];
  const { data, error } = await supabase
    .from('check_ins')
    .select('*')
    .eq('date', today)
    .order('check_in_time', { ascending: false });
  
  if (error) throw error;
  return data || [];
};

export const addCheckIn = async (checkIn: CheckInData): Promise<CheckInData | null> => {
  // Check for duplicate on same day
  const today = new Date().toISOString().split('T')[0];
  const { data: existing } = await supabase
    .from('check_ins')
    .select('*')
    .eq('nama', checkIn.nama)
    .eq('date', today)
    .maybeSingle();
  
  if (existing) return null;

  const { data, error } = await supabase
    .from('check_ins')
    .insert([checkIn])
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const deleteCheckIn = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('check_ins')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};

// Thesis attendance operations
export const getThesisAttendances = async (): Promise<ThesisAttendance[]> => {
  const { data, error } = await supabase
    .from('thesis_attendance')
    .select('*')
    .order('date', { ascending: false });
  
  if (error) throw error;
  return data || [];
};

export const addOrUpdateThesisAttendance = async (
  studentId: string,
  studentName: string,
  type: 'checkin' | 'checkout'
): Promise<ThesisAttendance | null> => {
  const today = new Date().toISOString().split('T')[0];
  
  // Check if there's already a record for today
  const { data: existing } = await supabase
    .from('thesis_attendance')
    .select('*')
    .eq('student_id', studentId)
    .eq('date', today)
    .maybeSingle();
  
  if (type === 'checkin') {
    // Check if already checked in today
    if (existing?.check_in_time) return null;
    
    if (existing) {
      // Update existing record
      const { data, error } = await supabase
        .from('thesis_attendance')
        .update({ check_in_time: new Date().toISOString() })
        .eq('id', existing.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } else {
      // Create new record
      const { data, error } = await supabase
        .from('thesis_attendance')
        .insert([{
          student_id: studentId,
          student_name: studentName,
          check_in_time: new Date().toISOString(),
          date: today
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    }
  } else {
    // Check out
    if (!existing?.check_in_time) {
      throw new Error('Belum check-in hari ini');
    }
    if (existing?.check_out_time) return null;
    
    const { data, error } = await supabase
      .from('thesis_attendance')
      .update({ check_out_time: new Date().toISOString() })
      .eq('id', existing.id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

export const deleteThesisAttendance = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('thesis_attendance')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};

// Settings operations
export const getSettings = async (): Promise<LibrarySettings> => {
  const { data, error } = await supabase
    .from('settings')
    .select('*')
    .limit(1)
    .maybeSingle();
  
  if (error) throw error;
  
  return data || {
    library_name: 'Perpustakaan Agustinus STTRII',
    admin_username: 'Admin',
    admin_password: 'admin123'
  };
};

export const updateSettings = async (settings: Partial<LibrarySettings>): Promise<LibrarySettings> => {
  // Get existing settings
  const existing = await getSettings();
  
  let query;
  if (existing.id) {
    // Update existing
    query = supabase
      .from('settings')
      .update({ ...settings, updated_at: new Date().toISOString() })
      .eq('id', existing.id)
      .select()
      .single();
  } else {
    // Insert new
    query = supabase
      .from('settings')
      .insert([settings])
      .select()
      .single();
  }
  
  const { data, error } = await query;
  if (error) throw error;
  return data;
};

// Storage operations for images
export const uploadImage = async (file: File, path: string): Promise<string> => {
  const { data, error } = await supabase.storage
    .from('library-assets')
    .upload(path, file, { upsert: true });
  
  if (error) throw error;
  
  const { data: { publicUrl } } = supabase.storage
    .from('library-assets')
    .getPublicUrl(data.path);
  
  return publicUrl;
};

export const deleteImage = async (path: string): Promise<void> => {
  const { error } = await supabase.storage
    .from('library-assets')
    .remove([path]);
  
  if (error) throw error;
};
