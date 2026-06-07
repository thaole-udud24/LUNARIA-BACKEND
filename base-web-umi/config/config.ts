// https://umijs.org/config/
import { defineConfig } from 'umi';
import defaultSettings from './defaultSettings';
import routes from './routes';
import proxy from './proxy';
const { REACT_APP_ENV } = process.env;

export default defineConfig({
    hash: true,
    antd: {},
    mock: false,
    dva: {
        hmr: true,
    },
    layout: {
        // https://umijs.org/zh-CN/plugins/plugin-layout
        locale: true,
        ...defaultSettings,
    },
    // https://umijs.org/zh-CN/plugins/plugin-locale
    locale: {
        // enable: true,
        default: 'vi-VN',
        antd: true,
        // default true, when it is true, will use `navigator.language` overwrite default
        baseNavigator: false,
        // baseSeparator: '_',
    },
    dynamicImport: {
        loading: '@ant-design/pro-layout/es/PageLoading',
    },
    targets: {
        ie: 11,
    },
    routes,
    // Theme for antd: https://ant.design/docs/react/customize-theme-cn
    theme: {
        'primary-color': defaultSettings.primaryColor,
        'border-radius-base': defaultSettings.borderRadiusBase,
    },
    // esbuild is father build tools
    // https://umijs.org/plugins/plugin-esbuild
    esbuild: {},
    title: false,
    ignoreMomentLocale: true,
    
    // Đã fix ép kiểu tại đây để chiều lòng TypeScript
    proxy: proxy[(REACT_APP_ENV || 'dev') as keyof typeof proxy],
    
    manifest: {
        basePath: '/',
    },
    // Fast Refresh 热更新
    fastRefresh: {},

    nodeModulesTransform: {
        type: 'none',
    },
    // mfsu: {},
    webpack5: {},
    // exportStatic tạo thư mục dist/* trên Windows với catch-all route — dùng server fallback thay vì SSG
    // exportStatic: {},
    define: {
        ...Object.entries(process.env).reduce((result, [key, value]) => {
            if (key.startsWith('APP_CONFIG_')) {
                return {
                    ...result,
                    [key]: value,
                };
            }
            return result;
        }, {} as Record<string, string | undefined>),
        API_URL: process.env.API_URL || 'http://localhost:3000',
    },
});