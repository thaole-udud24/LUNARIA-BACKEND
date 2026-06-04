
export default {
  dev: {
    '/v1/': {
      target: 'http://203.162.10.108:8099',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
    '/api/': {
      target: 'http://localhost:3000',
      changeOrigin: true,
    },
  },
  test: {
    '/v2.2/': {
      target: 'https://apidev.sotaydangvien.com',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
  pre: {
    '/v2.2/': {
      target: 'https://apidev.sotaydangvien.com',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
};