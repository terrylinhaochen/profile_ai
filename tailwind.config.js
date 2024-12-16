/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      './src/**/*.{js,jsx}',  // Updated path to catch all files in src
      './src/app/**/*.{js,jsx}',
      './src/components/**/*.{js,jsx}',
    ],
    theme: {
      extend: {
        colors: {
          background: 'rgb(var(--background-start-rgb))',
        },
      },
    },
    plugins: [],
  }