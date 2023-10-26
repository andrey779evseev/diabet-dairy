/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ['class'],
	content: [
		'./pages/**/*.{ts,tsx}',
		'./components/**/*.{ts,tsx}',
		'./app/**/*.{ts,tsx}',
		'./src/**/*.{ts,tsx}',
	],
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px',
			},
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))',
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))',
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))',
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))',
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))',
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))',
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))',
				},
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
			},
			keyframes: {
				'accordion-down': {
					from: { height: 0 },
					to: { height: 'var(--radix-accordion-content-height)' },
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: 0 },
				},
				'slide-in-blurred-right': {
					from: {
						transform: 'translateX(100px) scaleX(2.5) scaleY(0.2)',
						transformOrigin: '0% 50%',
						filter: 'blur(40px)',
						opacity: 0,
					},
					to: {
						transform: 'translateX(0) scaleY(1) scaleX(1)',
						transformOrigin: '50% 50%',
						filter: 'blur(0)',
						opacity: 1,
					},
				},
				'slide-out-blurred-right': {
					from: {
						transform: 'translateX(0) scaleY(1) scaleX(1)',
						transformOrigin: '50% 50%',
						filter: 'blur(0)',
						opacity: 1,
					},
					to: {
						transform: 'translateX(100px) scaleX(2.5) scaleY(0.2)',
						transformOrigin: '0% 50%',
						filter: 'blur(40px)',
						opacity: 0,
					},
				},
				'slide-in-blurred-br': {
					from: {
						transform: 'translate(100px, 100px) skew(80deg, 10deg)',
						transformOrigin: '0% 100%',
						filter: 'blur(40px)',
						opacity: 0,
					},
					to: {
						transform: 'translate(0, 0) skew(0deg, 0deg)',
						transformOrigin: '50% 50%',
						filter: 'blur(0)',
						opacity: 1,
					},
				},
				'slide-out-blurred-br': {
					from: {
						transform: 'translate(0, 0) skew(0deg, 0deg)',
						transformOrigin: '50% 50%',
						filter: 'blur(0)',
						opacity: 1,
					},
					to: {
						transform: 'translate(100px, 100px) skew(80deg, 10deg)',
						transformOrigin: '0% 100%',
						filter: 'blur(40px)',
						opacity: 0,
					},
				},
				'slide-in-blurred-bottom': {
					from: {
						transform: 'translateY(200px) scaleY(2.5) scaleX(0.2)',
						transformOrigin: '50% 100%',
						filter: 'blur(40px)',
						opacity: 0,
					},
					to: {
						transform: 'translateY(0) scaleY(1) scaleX(1)',
						transformOrigin: '50% 50%',
						filter: 'blur(0)',
						opacity: 1,
					},
				},
				'slide-out-blurred-bottom': {
					from: {
						transform: 'translateY(0) scaleY(1) scaleX(1)',
						transformOrigin: '50% 50%',
						filter: 'blur(0)',
						opacity: 1,
					},
					to: {
						transform: 'translateY(200px) scaleY(2.5) scaleX(0.2)',
						transformOrigin: '50% 100%',
						filter: 'blur(40px)',
						opacity: 0,
					},
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'slide-in-blurred-right':
					'slide-in-blurred-right 0.6s cubic-bezier(0.230, 1.000, 0.320, 1.000) both',
				'slide-out-blurred-right':
					'slide-out-blurred-right 0.6s cubic-bezier(0.230, 1.000, 0.320, 1.000) both',
				'slide-in-blurred-br':
					'slide-in-blurred-br 0.6s cubic-bezier(0.230, 1.000, 0.320, 1.000) both',
				'slide-out-blurred-br':
					'slide-out-blurred-br 0.6s cubic-bezier(0.230, 1.000, 0.320, 1.000) both',
				'slide-in-blurred-bottom':
					'slide-in-blurred-bottom 0.6s cubic-bezier(0.230, 1.000, 0.320, 1.000) both',
				'slide-out-blurred-bottom':
					'slide-out-blurred-bottom 0.6s cubic-bezier(0.230, 1.000, 0.320, 1.000) both',
			},
		},
	},
	plugins: [require('tailwindcss-animate')],
}
