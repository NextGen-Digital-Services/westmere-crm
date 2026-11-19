/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0B1F3A',
          deep: '#061224',
          surface: '#0E2342',
          light: '#16335C',
          border: '#1E3E6B',
        },
        gold: {
          DEFAULT: 'var(--accent-color, #C9A24B)',
          hover: '#B58E38',
          light: '#F8F3E6',
          dark: '#9E7928',
        },
        offwhite: '#F5F1E8',
        ink: {
          DEFAULT: '#101828',
          secondary: '#344054',
          muted: '#667085',
          light: '#98A2B3',
        },
        success: {
          DEFAULT: '#1F8A5B',
          light: '#E8F5EE',
          dark: '#166543',
        },
        warning: {
          DEFAULT: '#D98A1B',
          light: '#FDF4E7',
          dark: '#A6660F',
        },
        danger: {
          DEFAULT: '#C23B3B',
          light: '#FAECEC',
          dark: '#932727',
        },
        info: {
          DEFAULT: '#2F6FB5',
          light: '#EAF1F9',
          dark: '#215187',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        heading: ['Manrope', 'Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'card': '14px',
        'modal': '16px',
        'button': '10px',
        'badge': '6px',
      },
      boxShadow: {
        'solid-sm': '0 1px 2px 0 rgba(11, 31, 58, 0.05)',
        'solid': '0 2px 4px 0 rgba(11, 31, 58, 0.08), 0 1px 2px -1px rgba(11, 31, 58, 0.05)',
        'solid-md': '0 4px 8px -1px rgba(11, 31, 58, 0.1), 0 2px 4px -2px rgba(11, 31, 58, 0.06)',
        'solid-lg': '0 10px 15px -3px rgba(11, 31, 58, 0.12), 0 4px 6px -4px rgba(11, 31, 58, 0.08)',
        'solid-lift': '0 14px 28px -5px rgba(11, 31, 58, 0.15)',
      },
    },
  },
  plugins: [],
}
