/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans:     ['Open Sans', 'sans-serif'],
        headline: ['Manrope', 'sans-serif'],
      },
      colors: {
        'primary':                   '#1b6d24',
        'primary-dim':               '#076019',
        'primary-fixed':             '#a3f69c',
        'primary-fixed-dim':         '#95e88f',
        'primary-container':         '#a3f69c',
        'on-primary':                '#e5ffdd',
        'on-primary-container':      '#065f18',
        'surface':                   '#f8f9fa',
        'surface-container':         '#eaeff1',
        'surface-container-low':     '#f1f4f6',
        'surface-container-high':    '#e3e9ec',
        'on-surface':                '#2b3437',
        'on-surface-variant':        '#586064',
        'outline-variant':           '#abb3b7',
        'outline':                   '#737c7f',
        'error':                     '#9e422c',
        'tertiary':                  '#4b6551',
        'on-tertiary-fixed-variant': '#4e6954',
      },
      zIndex: {
        map:    '0',
        marker: '30',
        canvas: '35',
        ui:     '50',
        modal:  '1000',
      },
    },
  },
  plugins: [],
}
