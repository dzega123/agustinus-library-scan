interface StoredMember {
  idAnggota: string;
  nama: string;
  tipeKeanggotaan: string;
  institusi: string;
  registeredAt: string;
  photoUrl?: string;
}

interface CheckInRecord {
  id: string;
  nama: string;
  type: string;
  timestamp: string;
  tujuanKunjungan?: string;
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
    
    // Check if member ID already exists
    const exists = members.find(m => m.idAnggota === member.idAnggota);
    if (exists) {
      return null; // Return null if member already exists
    }
    
    const newMember: StoredMember = {
      ...member,
      registeredAt: new Date().toISOString(),
    };
    members.push(newMember);
    localStorage.setItem(MEMBERS_KEY, JSON.stringify(members));
    return newMember;
  },

  addMembersBulk: (newMembers: Omit<StoredMember, "registeredAt">[]) => {
    const existingMembers = storageUtils.getMembers();
    const existingIds = new Set(existingMembers.map(m => m.idAnggota));
    
    const membersToAdd: StoredMember[] = [];
    const duplicates: string[] = [];
    
    newMembers.forEach(member => {
      if (existingIds.has(member.idAnggota)) {
        duplicates.push(member.idAnggota);
      } else {
        membersToAdd.push({
          ...member,
          registeredAt: new Date().toISOString(),
        });
        existingIds.add(member.idAnggota);
      }
    });
    
    if (membersToAdd.length > 0) {
      const updatedMembers = [...existingMembers, ...membersToAdd];
      localStorage.setItem(MEMBERS_KEY, JSON.stringify(updatedMembers));
    }
    
    return {
      added: membersToAdd.length,
      duplicates: duplicates,
    };
  },

  findMemberById: (idAnggota: string): StoredMember | undefined => {
    const members = storageUtils.getMembers();
    return members.find((m) => m.idAnggota === idAnggota);
  },

  updateMember: (idAnggota: string, updates: Partial<Omit<StoredMember, "idAnggota" | "registeredAt">>) => {
    const members = storageUtils.getMembers();
    const memberIndex = members.findIndex((m) => m.idAnggota === idAnggota);
    
    if (memberIndex === -1) {
      return null;
    }
    
    members[memberIndex] = {
      ...members[memberIndex],
      ...updates,
    };
    
    localStorage.setItem(MEMBERS_KEY, JSON.stringify(members));
    return members[memberIndex];
  },

  deleteMember: (idAnggota: string) => {
    const members = storageUtils.getMembers();
    const filteredMembers = members.filter((m) => m.idAnggota !== idAnggota);
    localStorage.setItem(MEMBERS_KEY, JSON.stringify(filteredMembers));
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

  deleteThesisAttendance: (id: string) => {
    const attendances = storageUtils.getThesisAttendances();
    const filteredAttendances = attendances.filter((a) => a.id !== id);
    localStorage.setItem(THESIS_ATTENDANCE_KEY, JSON.stringify(filteredAttendances));
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

  // Statistics - Monthly data
  getMonthlyCheckIns: (year: number): { month: number; count: number }[] => {
    const checkIns = storageUtils.getCheckIns();
    const monthlyCounts: { [key: number]: number } = {};
    
    // Initialize all months with 0
    for (let i = 0; i < 12; i++) {
      monthlyCounts[i] = 0;
    }
    
    checkIns.forEach((checkIn) => {
      const date = new Date(checkIn.timestamp);
      if (date.getFullYear() === year) {
        const month = date.getMonth();
        monthlyCounts[month]++;
      }
    });
    
    return Object.entries(monthlyCounts).map(([month, count]) => ({
      month: parseInt(month),
      count,
    }));
  },

  // Get weekly check-ins for a specific week
  getWeeklyCheckIns: (weekStart: Date): { date: string; count: number }[] => {
    const checkIns = storageUtils.getCheckIns();
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 7);
    
    const dayCounts: { [key: string]: number } = {};
    
    // Initialize all days in the week
    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStart);
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      dayCounts[dateStr] = 0;
    }
    
    checkIns.forEach((checkIn) => {
      const checkInDate = new Date(checkIn.timestamp);
      const dateStr = checkInDate.toISOString().split('T')[0];
      
      if (dayCounts[dateStr] !== undefined) {
        dayCounts[dateStr]++;
      }
    });
    
    return Object.entries(dayCounts).map(([date, count]) => ({
      date,
      count,
    }));
  },
};
