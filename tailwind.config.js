const { nextui } = require("@nextui-org/react");

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './index.html',
        './src/**/*.{html,ts,tsx,js,jsx}',
        './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        extend: {
            spacing: {
                '8xl': '96rem',
                '9xl': '128rem',
            },
            borderRadius: {
                '4xl': '2rem',
            },
        },
    },
    darkMode: 'class',
    plugins: [nextui()],
}
