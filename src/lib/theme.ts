import { createSystem, defaultConfig, defineConfig, defineRecipe } from '@chakra-ui/react';

const buttonRecipe = defineRecipe({
  base: {
    borderRadius: 'xl',
    fontWeight: 'bold',
    px: 6,
    py: 5,
  },
  variants: {
    variant: {
      solid: {
        bg: 'brand.300',
        color: 'white',
        _hover: { bg: 'brand.400' },
        _active: { bg: 'brand.500' },
      },
      secondary: {
        bg: { base: 'white', _dark: 'black' },
        color: { base: 'black', _dark: 'white' },
        _hover: { bg: { base: 'gray.100', _dark: 'gray.800' } },
        _active: { bg: { base: 'gray.200', _dark: 'gray.700' } },
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
        },
      },
    },
    recipes: {
      button: buttonRecipe,
    },
  },
});

export const system = createSystem(defaultConfig, config);
