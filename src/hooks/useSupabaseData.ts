import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import * as supabaseStorage from "@/utils/supabaseStorage";
import type { Member, CheckInData, ThesisAttendance, LibrarySettings } from "@/utils/supabaseStorage";

// Hook for members data
export const useMembers = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const loadMembers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await supabaseStorage.getMembers();
      setMembers(data);
    } catch (error) {
      console.error("Error loading members:", error);
      toast({
        title: "Error",
        description: "Gagal memuat data anggota",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadMembers();
  }, [loadMembers]);

  const addMember = async (member: Member) => {
    try {
      const result = await supabaseStorage.addMember(member);
      if (result) {
        await loadMembers();
        return result;
      }
      return null;
    } catch (error) {
      console.error("Error adding member:", error);
      throw error;
    }
  };

  const deleteMember = async (memberId: string) => {
    try {
      await supabaseStorage.deleteMember(memberId);
      await loadMembers();
    } catch (error) {
      console.error("Error deleting member:", error);
      throw error;
    }
  };

  const findMemberById = async (memberId: string) => {
    try {
      return await supabaseStorage.findMemberById(memberId);
    } catch (error) {
      console.error("Error finding member:", error);
      return null;
    }
  };

  return {
    members,
    loading,
    loadMembers,
    addMember,
    deleteMember,
    findMemberById,
  };
};

// Hook for check-ins data
export const useCheckIns = () => {
  const [checkIns, setCheckIns] = useState<CheckInData[]>([]);
  const [todayCheckIns, setTodayCheckIns] = useState<CheckInData[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const loadCheckIns = useCallback(async () => {
    try {
      setLoading(true);
      const [allData, todayData] = await Promise.all([
        supabaseStorage.getCheckIns(),
        supabaseStorage.getTodayCheckIns(),
      ]);
      setCheckIns(allData);
      setTodayCheckIns(todayData);
    } catch (error) {
      console.error("Error loading check-ins:", error);
      toast({
        title: "Error",
        description: "Gagal memuat data check-in",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const loadTodayCheckIns = useCallback(async () => {
    try {
      const data = await supabaseStorage.getTodayCheckIns();
      setTodayCheckIns(data);
      return data;
    } catch (error) {
      console.error("Error loading today check-ins:", error);
      return [];
    }
  }, []);

  useEffect(() => {
    loadCheckIns();
  }, [loadCheckIns]);

  const addCheckIn = async (checkIn: Partial<CheckInData>) => {
    try {
      const result = await supabaseStorage.addCheckIn(checkIn);
      if (result) {
        await loadTodayCheckIns();
        return result;
      }
      return null;
    } catch (error) {
      console.error("Error adding check-in:", error);
      throw error;
    }
  };

  const deleteCheckIn = async (id: string) => {
    try {
      await supabaseStorage.deleteCheckIn(id);
      await loadCheckIns();
    } catch (error) {
      console.error("Error deleting check-in:", error);
      throw error;
    }
  };

  return {
    checkIns,
    todayCheckIns,
    loading,
    loadCheckIns,
    loadTodayCheckIns,
    addCheckIn,
    deleteCheckIn,
  };
};

// Hook for thesis attendance data
export const useThesisAttendance = () => {
  const [attendances, setAttendances] = useState<ThesisAttendance[]>([]);
  const [todayAttendances, setTodayAttendances] = useState<ThesisAttendance[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const loadAttendances = useCallback(async () => {
    try {
      setLoading(true);
      const [allData, todayData] = await Promise.all([
        supabaseStorage.getThesisAttendances(),
        supabaseStorage.getTodayThesisAttendances(),
      ]);
      setAttendances(allData);
      setTodayAttendances(todayData);
    } catch (error) {
      console.error("Error loading thesis attendances:", error);
      toast({
        title: "Error",
        description: "Gagal memuat data absensi",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadAttendances();
  }, [loadAttendances]);

  const addOrUpdateAttendance = async (
    studentId: string,
    studentName: string,
    type: 'checkin' | 'checkout'
  ) => {
    try {
      const result = await supabaseStorage.addOrUpdateThesisAttendance(studentId, studentName, type);
      await loadAttendances();
      return result;
    } catch (error) {
      console.error("Error updating thesis attendance:", error);
      throw error;
    }
  };

  const deleteAttendance = async (id: string) => {
    try {
      await supabaseStorage.deleteThesisAttendance(id);
      await loadAttendances();
    } catch (error) {
      console.error("Error deleting thesis attendance:", error);
      throw error;
    }
  };

  return {
    attendances,
    todayAttendances,
    loading,
    loadAttendances,
    addOrUpdateAttendance,
    deleteAttendance,
  };
};

// Hook for settings
export const useSettings = () => {
  const [settings, setSettings] = useState<LibrarySettings | null>(null);
  const [loading, setLoading] = useState(true);

  const loadSettings = useCallback(async () => {
    try {
      setLoading(true);
      const data = await supabaseStorage.getSettings();
      setSettings(data);
    } catch (error) {
      console.error("Error loading settings:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const updateSettings = async (newSettings: Partial<LibrarySettings>) => {
    try {
      const result = await supabaseStorage.updateSettings(newSettings);
      setSettings(result);
      return result;
    } catch (error) {
      console.error("Error updating settings:", error);
      throw error;
    }
  };

  return {
    settings,
    loading,
    loadSettings,
    updateSettings,
  };
};

// Hook for dashboard statistics
export const useDashboardStats = () => {
  const [stats, setStats] = useState({
    totalMembers: 0,
    todayVisitors: 0,
    totalVisitors: 0,
  });
  const [loading, setLoading] = useState(true);

  const loadStats = useCallback(async () => {
    try {
      setLoading(true);
      const [members, todayCheckIns, allCheckIns] = await Promise.all([
        supabaseStorage.getMembers(),
        supabaseStorage.getTodayCheckIns(),
        supabaseStorage.getCheckIns(),
      ]);
      setStats({
        totalMembers: members.length,
        todayVisitors: todayCheckIns.length,
        totalVisitors: allCheckIns.length,
      });
    } catch (error) {
      console.error("Error loading stats:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  return { stats, loading, loadStats };
};
