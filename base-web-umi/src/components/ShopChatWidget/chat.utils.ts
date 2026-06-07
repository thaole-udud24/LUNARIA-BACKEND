export type ChatRole = 'user' | 'shop';

export interface ChatMessage {
  id: string;
  role: ChatRole;
  text: string;
  time: string;
}

const STORAGE_KEY = 'lurana_support_chat_v1';

export const QUICK_REPLIES = [
  'Theo dõi đơn hàng',
  'Chính sách đổi trả',
  'Voucher & khuyến mãi',
  'Tư vấn sản phẩm',
];

export const WELCOME_MESSAGE: ChatMessage = {
  id: 'welcome',
  role: 'shop',
  text: 'Xin chào! Mình là Luna — trợ lý LURANA. Bạn cần hỗ trợ gì hôm nay? Mình sẽ phản hồi ngay nhé.',
  time: formatNow(),
};

export function formatNow() {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
}

export function createMessage(role: ChatRole, text: string): ChatMessage {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    role,
    text,
    time: formatNow(),
  };
}

export function loadChatMessages(): ChatMessage[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [WELCOME_MESSAGE];
    const parsed = JSON.parse(raw) as ChatMessage[];
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : [WELCOME_MESSAGE];
  } catch {
    return [WELCOME_MESSAGE];
  }
}

export function saveChatMessages(messages: ChatMessage[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  } catch {
    // ignore quota errors
  }
}

export function getBotReply(input: string): string {
  const text = input.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  if (text.includes('don hang') || text.includes('theo doi') || text.includes('order')) {
    return 'Bạn có thể xem đơn hàng tại mục Tài khoản → Đơn hàng hoặc trang /orders. Nếu cần tra cứu nhanh, gửi mình mã đơn (vd: LRN...) nhé!';
  }

  if (text.includes('doi tra') || text.includes('hoan tien') || text.includes('doi hang')) {
    return 'LURANA hỗ trợ đổi trả trong 7 ngày với sản phẩm còn nguyên tem, chưa qua sử dụng. Bạn chụp ảnh sản phẩm + hóa đơn rồi nhắn lại, mình hướng dẫn chi tiết ngay.';
  }

  if (text.includes('voucher') || text.includes('ma giam') || text.includes('khuyen mai') || text.includes('uu dai')) {
    return 'Mã giảm giá áp dụng tại bước Thanh toán. Bạn cũng có thể xem voucher đã lưu trong Tài khoản → Voucher. Hiện shop đang có freeship cho đơn từ 300K!';
  }

  if (text.includes('tu van') || text.includes('san pham') || text.includes('da ') || text.includes('skincare')) {
    return 'Bạn cho mình biết loại da (dầu / khô / hỗn hợp / nhạy cảm) và vấn đề cần cải thiện nhé. Mình sẽ gợi ý combo phù hợp từ bộ sưu tập LURANA.';
  }

  if (text.includes('giao hang') || text.includes('ship') || text.includes('van chuyen')) {
    return 'Thời gian giao nội thành 1–2 ngày, ngoại tỉnh 2–5 ngày. Phí ship mặc định 40.000đ, miễn phí với đơn đủ điều kiện khuyến mãi.';
  }

  if (text.includes('cam on') || text.includes('thanks')) {
    return 'Dạ không có gì ạ! Chúc bạn một ngày đẹp da cùng LURANA.';
  }

  if (/lrn\d+/i.test(input)) {
    return `Mình đã ghi nhận mã đơn ${input.match(/lrn\d+/i)?.[0]?.toUpperCase()}. Đơn đang được xử lý — bạn kiểm tra cập nhật realtime tại trang Đơn hàng nhé!`;
  }

  return 'Cảm ơn bạn đã nhắn LURANA! Mình đã chuyển yêu cầu cho team CSKH. Bạn chờ chút nhé — thường phản hồi trong 5–10 phút trong giờ hành chính (8h–21h).';
}

export function getReplyDelay(text: string) {
  const base = 700 + Math.min(text.length * 18, 900);
  return base + Math.random() * 400;
}
