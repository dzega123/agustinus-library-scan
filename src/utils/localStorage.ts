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

const MEMBERS_KEY = "library_members";
const CHECKINS_KEY = "library_checkins";

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
    const newCheckIn: CheckInRecord = {
      ...checkIn,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
    };
    checkIns.push(newCheckIn);
    localStorage.setItem(CHECKINS_KEY, JSON.stringify(checkIns));
    return newCheckIn;
  },

  // Clear all data (for testing)
  clearAll: () => {
    localStorage.removeItem(MEMBERS_KEY);
    localStorage.removeItem(CHECKINS_KEY);
  },
};
