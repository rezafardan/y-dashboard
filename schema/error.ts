export interface ApiErrorResponse {
  message: string;
  // Tambahkan properti lain jika ada dari struktur error backend Anda
  status?: number;
  code?: string;
}
