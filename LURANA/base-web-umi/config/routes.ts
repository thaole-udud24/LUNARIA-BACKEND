export default [
  {
    path: '/auth',
    layout: false,
    routes: [
      { path: '/auth/login',
        component: './auth/Login',
        layout: false,
       },
      { path: '/auth/register',
        component: './auth/Register',
        layout: false, 
      },
      { path: '/auth/forgot-password',
        component: './auth/ForgotPassword', 
        layout: false, 
      },
      { path: '/auth/verify-code', 
        component: './auth/VerifyCode' 
      },
      { path: '/auth/reset-password', 
        component: './auth/ResetPassword', 
        layout: false, 
      },
      { path: '/auth/reset-success', 
        component: './auth/ResetSuccess' 
      },
      { redirect: '/auth/login' },
    ],
  },
  
  {
    path: '/admin',
    layout: false,
    component: '@/layouts/AdminLayout',
    routes: [
      {
        path: '/admin/dashboard',
        component: '@/pages/admin/Dashboard',
      },
      {
        path: '/admin/products',
        component: '@/pages/admin/Products',
      },
      {
        path: '/admin/categories',
        component: '@/pages/admin/Categories',
      },
      {
        path: '/admin/skintypes',
        component: '@/pages/admin/SkinTypes',
      },
    ],
  },

  {
    path: '/',
    component: '@/layouts/ShopLayout',
    layout: false,
    routes: [
      { path: '/home', component: '@/pages/shop/Home' },
      { path: '/about', component: '@/pages/shop/About' },
      { path: '/products', component: '@/pages/shop/Products' },
      { path: '/products/:id', component: '@/pages/shop/ProductDetail' },
      { path: '/productdetail', component: '@/pages/shop/ProductDetail' },
      { path: '/blog/:id', component: '@/pages/shop/BlogDetail' },
      { path: '/blog', component: '@/pages/shop/Blog' },
      { path: '/contact', component: '@/pages/shop/Contact' },
      { path: '/cart', component: '@/pages/shop/Cart' },
      { path: '/checkout', component: '@/pages/shop/Checkout' },
      { path: '/account', component: '@/pages/shop/Account' },
      { path: '/notifications', component: '@/pages/shop/Notifications' },
      { path: '/orders', component: '@/pages/shop/Orders' },
      { path: '/orderdetail', component: '@/pages/shop/OrderDetail' },
      { path: '/', redirect: '/home' },
    ],
  },
  // { component: './404' },
];
