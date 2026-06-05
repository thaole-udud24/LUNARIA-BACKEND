export default {
  // 'POST /api/auth/login'    → ĐÃ XÓA
  // 'POST /api/auth/register' → ĐÃ XÓA
  // Cả 2 đều để proxy forward đến BE thật

  'POST /api/auth/forgot-password': (req: any, res: any) => {
    const { email } = req.body;
    return res.send({
      success: true,
      message: `Email reset đã gửi tới ${email}`,
    });
  },

  'POST /api/auth/verify-code': (req: any, res: any) => {
    const body = req.body || req.query;
    const { email, code } = body;
    const cleanCode = Array.isArray(code)
      ? code.join('')
      : String(code || '').trim();

    if (!email || !cleanCode) {
      return res.send({ success: false, message: 'Thiếu email hoặc code' });
    }
    if (cleanCode === '1234') {
      return res.send({ success: true, message: 'Xác thực thành công' });
    }
    return res.send({ success: false, message: `Mã không đúng (${cleanCode})` });
  },

  'POST /api/auth/resend-code': (req: any, res: any) => {
    return res.send({ success: true, message: 'Đã gửi lại mã' });
  },

  'POST /api/auth/reset-password': (req: any, res: any) => {
    const { password } = req.body;
    if (!password) {
      return res.send({ success: false, message: 'Thiếu mật khẩu' });
    }
    return res.send({ success: true, message: 'Đổi mật khẩu thành công' });
  },
};