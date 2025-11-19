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
  memberId?: string;
  nama: string;
  type: string;
  tipe_keanggotaan?: string;
  tipeKeanggotaan?: string;
  jurusan?: string;
  no_telepon?: string;
  noTelepon?: string;
  alamat?: string;
  check_in_time?: string;
  date?: string;
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
  header_margin_top?: number;
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

export const addCheckIn = async (checkIn: Partial<CheckInData>): Promise<CheckInData | null> => {
  // Check for duplicate on same day
  const today = new Date().toISOString().split('T')[0];
  const memberId = checkIn.member_id || checkIn.memberId;
  
  const { data: existing } = await supabase
    .from('check_ins')
    .select('*')
    .eq('member_id', memberId)
    .eq('date', today)
    .maybeSingle();
  
  if (existing) return null;

  const insertData = {
    member_id: memberId,
    nama: checkIn.nama!,
    type: checkIn.type!,
    tipe_keanggotaan: checkIn.tipe_keanggotaan || checkIn.tipeKeanggotaan,
    jurusan: checkIn.jurusan || '',
    no_telepon: checkIn.no_telepon || checkIn.noTelepon || '',
    alamat: checkIn.alamat || '',
    check_in_time: new Date().toISOString(),
    date: today
  };

  const { data, error } = await supabase
    .from('check_ins')
    .insert([insertData])
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

export const getTodayThesisAttendances = async (): Promise<ThesisAttendance[]> => {
  const today = new Date().toISOString().split('T')[0];
  const { data, error } = await supabase
    .from('thesis_attendance')
    .select('*')
    .eq('date', today)
    .order('check_in_time', { ascending: false });
  
  if (error) throw error;
  return data || [];
};

export const addThesisAttendance = async (attendance: { studentId: string; nama: string; checkInTime: string }): Promise<ThesisAttendance | null> => {
  const today = new Date().toISOString().split('T')[0];
  
  // Check if already exists
  const { data: existing } = await supabase
    .from('thesis_attendance')
    .select('*')
    .eq('student_id', attendance.studentId)
    .eq('date', today)
    .maybeSingle();
  
  if (existing) return null;

  const { data, error } = await supabase
    .from('thesis_attendance')
    .insert([{
      student_id: attendance.studentId,
      student_name: attendance.nama,
      check_in_time: attendance.checkInTime,
      date: today
    }])
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const updateThesisCheckOut = async (studentId: string): Promise<boolean> => {
  const today = new Date().toISOString().split('T')[0];
  
  const { data: existing } = await supabase
    .from('thesis_attendance')
    .select('*')
    .eq('student_id', studentId)
    .eq('date', today)
    .maybeSingle();
  
  if (!existing || existing.check_out_time) return false;

  const { error } = await supabase
    .from('thesis_attendance')
    .update({ check_out_time: new Date().toISOString() })
    .eq('id', existing.id);
  
  if (error) throw error;
  return true;
};

export const findMemberById = async (memberId: string): Promise<Member | null> => {
  const { data, error } = await supabase
    .from('members')
    .select('*')
    .eq('member_id', memberId)
    .maybeSingle();
  
  if (error) throw error;
  return data;
};

// Helper to check if visitor already checked in today
export const checkVisitorToday = async (memberId: string): Promise<boolean> => {
  const today = new Date().toISOString().split('T')[0];
  const { data } = await supabase
    .from('check_ins')
    .select('id')
    .eq('member_id', memberId)
    .eq('date', today)
    .maybeSingle();
  return !!data;
};

// Helper to check if thesis student already checked in today
export const checkThesisAttendanceToday = async (studentId: string): Promise<boolean> => {
  const today = new Date().toISOString().split('T')[0];
  const { data } = await supabase
    .from('thesis_attendance')
    .select('id')
    .eq('student_id', studentId)
    .eq('date', today)
    .maybeSingle();
  return !!data;
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
