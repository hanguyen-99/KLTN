module.exports = {
  purge: {
    content:[
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './layouts/**/*.{js,ts,jsx,tsx}',
    './containers/**/*.{js,ts,jsx,tsx}',
    './package/**/*.{js,ts,jsx,tsx}'
  ],
    safelist: [
      'bg-background-login',
      'text-center',
      'hover:opacity-100',
      'lg:text-right',
      'grid-cols-3',
      'gap-5'
    ]
  
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      backgroundImage:{
        'background-login': "url('../public/static/img/bg-login.jpg')"
      },
      minWidth: {
        '0': '0',
        '1/3':'33.33%',
        '1/4': '25%',
        '1/2': '50%',
        '3/4': '75%',
        'full': '100%',
      },
      backgroundColor: {
        'primary': '#3490dc',
        'secondary': '#ffed4a',
        'danger': '#e3342f',
        'success':'#22bb33'
      },
      keyframes: {
        wiggle: {
          '0%': { transform: 'translateY(0px)'},
          '100%': { transform: 'translateY(50%)'},
        }
      },
      animation: {
        wiggle: 'wiggle 1s ease-in-out',
      }


    },
  },
  variants: {
    extend: {
      textColor: ['responsive', 'hover', 'focus', 'group-hover'],
      opacity:['responsive', 'hover', 'focus', 'group-hover','disabled'],
      gradientColorStops: ['responsive', 'hover', 'focus','active', 'group-hover'],
      cursor:['responsive', 'hover', 'focus', 'group-hover','disabled'],
      visibility:['responsive', 'hover', 'focus', 'group-hover','disabled'],
      outline:['focus'],
      backgroundOpacity:['responsive', 'hover', 'focus', 'group-hover','disabled']
    },
  },
  plugins: [],
  
}
