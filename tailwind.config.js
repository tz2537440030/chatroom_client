/** @type {import('tailwindcss').Config} */
export default {
  important: true,
  content: ["./src/**/*.{html,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontSize: {
        sm: '0.8rem',
        base: '1rem',
        xl: '1.25rem',
        '2xl': '1.563rem',
        '3xl': '1.953rem',
        '4xl': '2.441rem',
        '5xl': '3.052rem',
      },
      colors: {
        primary: '#198CFF',        // 主蓝色，按钮、链接等主色调
        primaryDark: '#147DEB',    // 深一点的蓝，hover 状态用
        background: '#F5F7FA',     // 页面背景灰白
        card: '#FFFFFF',           // 卡片白底
        border: '#E6E8EB',         // 边框线颜色

        success: '#00C777',        // 成功/通过：绿色
        warning: '#FF9C19',        // 警告：橙色
        danger: '#F24849',         // 错误：红色

        textMain: '#1A1A1A',       // 主文字：高对比黑灰
        textSecondary: '#666666',  // 次文字
        textMuted: '#999999',      // 弱提示文字  
      },
    },
  },
  plugins: [],
}

