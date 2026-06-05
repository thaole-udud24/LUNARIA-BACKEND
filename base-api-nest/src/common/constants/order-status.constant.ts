export enum OrderStatus {
  PENDING = 'pending',     // Chờ duyệt
  CONFIRMED = 'confirmed', // Đã duyệt
  PROCESSING = 'PROCESSING',
  CANCELLED = 'cancelled', // Đã hủy
  COMPLETED = 'completed', // Thành công
}