import { createSystem, defaultConfig, defineConfig, defineRecipe } from '@chakra-ui/react';

const buttonRecipe = defineRecipe({
  base: {
    borderRadius: 'xl',
    fontWeight: 'bold',
  },
  variants: {
    variant: {
      secondary: {
        bg: { base: 'white', _dark: 'black' },
        color: { base: 'black', _dark: 'white' },
        _hover: { bg: { base: 'gray.100', _dark: 'gray.800' } },
        _active: { bg: { base: 'gray.200', _dark: 'gray.700' } },
      },
    },
    size: {
      xs: {
        px: 3,
        py: 4,
      },
      sm: {
        px: 6,
        py: 5,
      },
    },
  },
});

const config = defineConfig({
  theme: {
    tokens: {
      colors: {
        brand: {
          50: { value: '#e6fffa' },
          100: { value: '#b2f5ea' },
          200: { value: '#81e6d9' },
          300: { value: '#4fd1c5' },
          400: { value: '#38b2ac' },
          500: { value: '#319795' },
          600: { value: '#2c7a7b' },
          700: { value: '#285e61' },
          800: { value: '#234e52' },
          900: { value: '#1d4044' },
          950: { value: '#153e3d' },
        },
      },
    },
    semanticTokens: {
      shadows: {
        subtle: {
          value: {
            _light: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px',
            // dont show shadow in dark mode for now
            _dark: 'rgba(99, 99, 99, 0) 0px 2px 8px 0px',
          },
        },
      },
      colors: {
        brand: {
          solid: { value: '{colors.brand.400}' },
          contrast: { value: '{colors.white}' },
          fg: { value: '{colors.brand.700}' },
          muted: { value: '{colors.brand.100}' },
          subtle: { value: '{colors.brand.200}' },
          emphasized: { value: '{colors.brand.300}' },
          focusRing: { value: '{colors.brand.500}' },
        },
      },
    },
    recipes: {
      button: buttonRecipe,
    },
  },
});

export const system = createSystem(defaultConfig, config);
