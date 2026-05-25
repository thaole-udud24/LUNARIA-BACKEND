
export default {
  // Login 
  'POST /api/auth/login': (req: any, res: any) => {
  const body: any = req.body;
  const email = String(body.email || '').trim();
  const password = String(body.password || '').trim();

  console.log('LOGIN INPUT:', { email, password });

  // fake account
  if (email === 'admin@gmail.com' && password === '123456') {
    return res.send({
      success: true,
      message: 'Đăng nhập thành công',
      data: {
        user: { id: 1, email, name: 'Admin' },
        access_token: 'fake-token-123',
      },
    });
  }

  if (email === 'user@gmail.com' && password === '123456') {
    return res.send({
      success: true,
      message: 'Đăng nhập thành công',
      data: {
        user: { id: 2, email, name: 'Khách hàng Lunaria' },
        access_token: 'fake-user-token-456',
      },
    });
  }

  return res.send({
    success: false,
    message: 'Sai email hoặc mật khẩu',
  });
},

  // Register 

  'POST /api/auth/register': (req: any, res: any) => {
    const { name, email } = req.body;

    return res.send({
      success: true,
      message: 'Đăng ký thành công',
      data: {
        id: 1,
        name,
        email,
      },
    });
  },

  // forgot password 
  'POST /api/auth/forgot-password': (req: any, res: any) => {
    const { email } = req.body;

    return res.send({
      success: true,
      message: `Email reset đã gửi tới ${email}`,
    });
  },

  // otp 
  
  'POST /api/auth/verify-code': (req: any, res: any) => {
    const body = req.body || req.query;

    console.log("VERIFY BODY:", body);

    const { email, code } = body;

    // chuẩn hóa code
    const cleanCode = Array.isArray(code)
    ? code.join('')
    : String(code || '').trim();

    if (!email || !cleanCode) {
      return res.send({
        success: false,
        message: 'Thiếu email hoặc code',
      });
    }


    if (cleanCode === '1234') {
      return res.send({
        success: true,
        message: 'Xác thực thành công',
      });
    }

    return res.send({
      success: false,
      message: `Mã không đúng (${cleanCode})`,
    });
  },

  'POST /api/auth/resend-code': (req: any, res: any) => {
    return res.send({
      success: true,
      message: 'Đã gửi lại mã',
    });
  },

  //  reset password
  'POST /api/auth/reset-password': (req : any, res : any ) => {
    const { password } = req.body;

    if (!password) {
      return res.send({
        success: false,
        message: 'Thiếu mật khẩu',
      });
    }

    return res.send({
      success: true,
      message: 'Đổi mật khẩu thành công',
    });
  },
};