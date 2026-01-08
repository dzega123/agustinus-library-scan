import { z } from "zod";

// Member registration schema
export const memberSchema = z.object({
  idAnggota: z
    .string()
    .trim()
    .min(1, "ID Anggota wajib diisi")
    .max(50, "ID Anggota maksimal 50 karakter")
    .regex(/^[a-zA-Z0-9-_]+$/, "ID Anggota hanya boleh berisi huruf, angka, dash, atau underscore"),
  nama: z
    .string()
    .trim()
    .min(1, "Nama wajib diisi")
    .max(200, "Nama maksimal 200 karakter")
    .regex(/^[a-zA-Z\s'.,-]+$/, "Nama hanya boleh berisi huruf dan spasi"),
  tipeKeanggotaan: z
    .string()
    .min(1, "Tipe keanggotaan wajib dipilih"),
  institusi: z
    .string()
    .trim()
    .min(1, "Institusi wajib diisi")
    .max(200, "Institusi maksimal 200 karakter"),
  photoUrl: z.string().optional(),
});

export type MemberFormData = z.infer<typeof memberSchema>;

// Non-member visitor schema
export const nonMemberSchema = z.object({
  nama: z
    .string()
    .trim()
    .min(1, "Nama wajib diisi")
    .max(200, "Nama maksimal 200 karakter"),
  pekerjaan: z.string().min(1, "Pekerjaan wajib dipilih"),
  pendidikan: z.string().min(1, "Pendidikan wajib dipilih"),
  jenisKelamin: z.string().min(1, "Jenis kelamin wajib dipilih"),
  alamat: z.string().max(500, "Alamat maksimal 500 karakter").optional(),
  tujuanKunjungan: z.string().max(500, "Tujuan kunjungan maksimal 500 karakter").optional(),
});

export type NonMemberFormData = z.infer<typeof nonMemberSchema>;

// Group visitor schema
export const groupVisitorSchema = z.object({
  namaKetuaRombongan: z
    .string()
    .trim()
    .min(1, "Nama ketua rombongan wajib diisi")
    .max(200, "Nama maksimal 200 karakter"),
  nomorTeleponKetua: z
    .string()
    .max(20, "Nomor telepon maksimal 20 karakter")
    .regex(/^[0-9+\-\s]*$/, "Format nomor telepon tidak valid")
    .optional()
    .or(z.literal("")),
  namaInstansi: z
    .string()
    .trim()
    .min(1, "Nama instansi wajib diisi")
    .max(200, "Nama instansi maksimal 200 karakter"),
  alamatInstansi: z.string().max(500, "Alamat maksimal 500 karakter").optional(),
  nomorTeleponInstansi: z
    .string()
    .max(20, "Nomor telepon maksimal 20 karakter")
    .regex(/^[0-9+\-\s]*$/, "Format nomor telepon tidak valid")
    .optional()
    .or(z.literal("")),
  emailInstansi: z
    .string()
    .email("Format email tidak valid")
    .max(255, "Email maksimal 255 karakter")
    .optional()
    .or(z.literal("")),
  jumlahPersonil: z
    .number()
    .min(1, "Jumlah personil minimal 1")
    .max(10000, "Jumlah personil maksimal 10000"),
  jenisKelamin: z.record(z.string(), z.number().min(0).max(10000)).optional(),
  pekerjaan: z.record(z.string(), z.number().min(0).max(10000)).optional(),
  pendidikan: z.record(z.string(), z.number().min(0).max(10000)).optional(),
  tujuanKunjungan: z.string().max(500, "Tujuan kunjungan maksimal 500 karakter").optional(),
});

export type GroupVisitorFormData = z.infer<typeof groupVisitorSchema>;

// Thesis attendance check-in schema
export const thesisCheckInSchema = z.object({
  studentId: z
    .string()
    .trim()
    .min(1, "ID Mahasiswa wajib diisi")
    .max(50, "ID maksimal 50 karakter"),
});

export type ThesisCheckInData = z.infer<typeof thesisCheckInSchema>;

// Auth login schema
export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email wajib diisi")
    .email("Format email tidak valid")
    .max(255, "Email maksimal 255 karakter"),
  password: z
    .string()
    .min(6, "Password minimal 6 karakter")
    .max(128, "Password maksimal 128 karakter"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// Auth signup schema
export const signupSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email wajib diisi")
    .email("Format email tidak valid")
    .max(255, "Email maksimal 255 karakter"),
  password: z
    .string()
    .min(6, "Password minimal 6 karakter")
    .max(128, "Password maksimal 128 karakter"),
  confirmPassword: z.string().min(1, "Konfirmasi password wajib diisi"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Password tidak cocok",
  path: ["confirmPassword"],
});

export type SignupFormData = z.infer<typeof signupSchema>;

// File validation utilities
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
export const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3MB

export const validateImageFile = (file: File): { valid: boolean; error?: string } => {
  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: "Ukuran file maksimal 3MB" };
  }
  
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return { valid: false, error: "Format file harus JPEG, PNG, GIF, atau WebP" };
  }
  
  return { valid: true };
};

// Sanitize text input to prevent XSS
export const sanitizeText = (text: string): string => {
  return text
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
};
