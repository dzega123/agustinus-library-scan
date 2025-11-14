interface StoredMember {
  idAnggota: string;
  nama: string;
  tipeKeanggotaan: string;
  institusi: string;
  registeredAt: string;
}

interface CheckInRecord {
  id: string;
  nama: string;
  type: string;
  timestamp: string;
  data?: any;
}

interface ThesisAttendance {
  id: string;
  studentId: string;
  nama: string;
  checkInTime: string;
  checkOutTime?: string;
}

const MEMBERS_KEY = "library_members";
const CHECKINS_KEY = "library_checkins";
const THESIS_ATTENDANCE_KEY = "library_thesis_attendance";
const SETTINGS_KEY = "library_settings";

interface Settings {
  libraryName?: string;
  logoUrl?: string;
  faviconUrl?: string;
  adminUsername?: string;
  adminPassword?: string;
  footerText?: string;
}

export const storageUtils = {
  // Member management
  getMembers: (): StoredMember[] => {
    const data = localStorage.getItem(MEMBERS_KEY);
    return data ? JSON.parse(data) : [];
  },

  addMember: (member: Omit<StoredMember, "registeredAt">) => {
    const members = storageUtils.getMembers();
    const newMember: StoredMember = {
      ...member,
      registeredAt: new Date().toISOString(),
    };
    members.push(newMember);
    localStorage.setItem(MEMBERS_KEY, JSON.stringify(members));
    return newMember;
  },

  findMemberById: (idAnggota: string): StoredMember | undefined => {
    const members = storageUtils.getMembers();
    return members.find((m) => m.idAnggota === idAnggota);
  },

  // Check-in management
  getCheckIns: (): CheckInRecord[] => {
    const data = localStorage.getItem(CHECKINS_KEY);
    return data ? JSON.parse(data) : [];
  },

  getTodayCheckIns: (): CheckInRecord[] => {
    const checkIns = storageUtils.getCheckIns();
    const today = new Date().toDateString();
    return checkIns.filter((c) => new Date(c.timestamp).toDateString() === today);
  },

  addCheckIn: (checkIn: Omit<CheckInRecord, "id" | "timestamp">) => {
    const checkIns = storageUtils.getCheckIns();
    const today = new Date().toDateString();
    
    // Check for duplicate check-in today based on nama
    const existingCheckIn = checkIns.find(
      (c) => c.nama === checkIn.nama && 
             new Date(c.timestamp).toDateString() === today
    );
    
    if (existingCheckIn) {
      return null; // Already checked in today
    }
    
    const newCheckIn: CheckInRecord = {
      ...checkIn,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
    };
    checkIns.push(newCheckIn);
    localStorage.setItem(CHECKINS_KEY, JSON.stringify(checkIns));
    return newCheckIn;
  },

  deleteCheckIn: (id: string) => {
    const checkIns = storageUtils.getCheckIns();
    const filteredCheckIns = checkIns.filter((c) => c.id !== id);
    localStorage.setItem(CHECKINS_KEY, JSON.stringify(filteredCheckIns));
  },

  removeDuplicateCheckIns: () => {
    const checkIns = storageUtils.getCheckIns();
    const seen = new Map<string, CheckInRecord>();
    
    checkIns.forEach((checkIn) => {
      const date = new Date(checkIn.timestamp).toDateString();
      const key = `${checkIn.nama}_${date}`;
      
      if (!seen.has(key)) {
        seen.set(key, checkIn);
      }
    });
    
    const uniqueCheckIns = Array.from(seen.values());
    localStorage.setItem(CHECKINS_KEY, JSON.stringify(uniqueCheckIns));
    return checkIns.length - uniqueCheckIns.length; // Return number of duplicates removed
  },

  // Thesis attendance management
  getThesisAttendances: (): ThesisAttendance[] => {
    const data = localStorage.getItem(THESIS_ATTENDANCE_KEY);
    return data ? JSON.parse(data) : [];
  },

  getTodayThesisAttendances: (): ThesisAttendance[] => {
    const attendances = storageUtils.getThesisAttendances();
    const today = new Date().toDateString();
    return attendances.filter((a) => new Date(a.checkInTime).toDateString() === today);
  },

  addThesisAttendance: (attendance: Omit<ThesisAttendance, "id">) => {
    const attendances = storageUtils.getThesisAttendances();
    const today = new Date().toDateString();
    
    // Check if student already checked in today
    const existingCheckIn = attendances.find(
      (a) => a.studentId === attendance.studentId && 
             new Date(a.checkInTime).toDateString() === today
    );
    
    if (existingCheckIn) {
      return null; // Already checked in
    }
    
    const newAttendance: ThesisAttendance = {
      ...attendance,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
    attendances.push(newAttendance);
    localStorage.setItem(THESIS_ATTENDANCE_KEY, JSON.stringify(attendances));
    return newAttendance;
  },

  updateThesisCheckOut: (studentId: string): boolean => {
    const attendances = storageUtils.getThesisAttendances();
    const today = new Date().toDateString();
    const attendance = attendances.find(
      (a) => a.studentId === studentId && 
             new Date(a.checkInTime).toDateString() === today &&
             !a.checkOutTime
    );
    
    if (attendance) {
      attendance.checkOutTime = new Date().toISOString();
      localStorage.setItem(THESIS_ATTENDANCE_KEY, JSON.stringify(attendances));
      return true;
    }
    return false;
  },

  removeDuplicateThesisAttendances: () => {
    const attendances = storageUtils.getThesisAttendances();
    const seen = new Map<string, ThesisAttendance>();
    
    attendances.forEach((attendance) => {
      const date = new Date(attendance.checkInTime).toDateString();
      const key = `${attendance.studentId}_${date}`;
      
      if (!seen.has(key)) {
        seen.set(key, attendance);
      }
    });
    
    const uniqueAttendances = Array.from(seen.values());
    localStorage.setItem(THESIS_ATTENDANCE_KEY, JSON.stringify(uniqueAttendances));
    return attendances.length - uniqueAttendances.length; // Return number of duplicates removed
  },

  // Clear all data (for testing)
  clearAll: () => {
    localStorage.removeItem(MEMBERS_KEY);
    localStorage.removeItem(CHECKINS_KEY);
    localStorage.removeItem(THESIS_ATTENDANCE_KEY);
  },

  // Settings management
  getSettings: (): Settings => {
    const data = localStorage.getItem(SETTINGS_KEY);
    return data ? JSON.parse(data) : {
      adminUsername: "Admin",
      adminPassword: "admin123",
      footerText: "Powered by INLISLite Perpusnas"
    };
  },

  updateSettings: (settings: Partial<Settings>) => {
    const currentSettings = storageUtils.getSettings();
    const newSettings = { ...currentSettings, ...settings };
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings));
    return newSettings;
  },
};
