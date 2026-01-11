import { describe, it, expect } from 'vitest';
import { lightTheme, darkTheme, funkyTheme, themes, theme } from '../theme';

describe('theme.js', () => {
  describe('lightTheme', () => {
    it('has light mode', () => {
      expect(lightTheme.palette.mode).toBe('light');
    });

    it('has correct primary color', () => {
      expect(lightTheme.palette.primary.main).toBe('#1F5460');
    });

    it('has correct secondary color', () => {
      expect(lightTheme.palette.secondary.main).toBe('#F2B26C');
    });

    it('has correct background default', () => {
      expect(lightTheme.palette.background.default).toBe('#F6F1EC');
    });

    it('has correct border radius', () => {
      expect(lightTheme.shape.borderRadius).toBe(20);
    });

    it('has Manrope font family', () => {
      expect(lightTheme.typography.fontFamily).toContain('Manrope');
    });

    it('has Sora font for headings', () => {
      expect(lightTheme.typography.h1.fontFamily).toContain('Sora');
    });
  });

  describe('darkTheme', () => {
    it('has dark mode', () => {
      expect(darkTheme.palette.mode).toBe('dark');
    });

    it('has correct primary color', () => {
      expect(darkTheme.palette.primary.main).toBe('#4DD0E1');
    });

    it('has correct background default', () => {
      expect(darkTheme.palette.background.default).toBe('#121212');
    });

    it('has correct text primary color', () => {
      expect(darkTheme.palette.text.primary).toBe('#E0E0E0');
    });
  });

  describe('funkyTheme', () => {
    it('has dark mode', () => {
      expect(funkyTheme.palette.mode).toBe('dark');
    });

    it('has neon cyan primary color', () => {
      expect(funkyTheme.palette.primary.main).toBe('#00F5D4');
    });

    it('has hot pink secondary color', () => {
      expect(funkyTheme.palette.secondary.main).toBe('#F72585');
    });

    it('has dark purple background', () => {
      expect(funkyTheme.palette.background.default).toBe('#0A0A12');
    });

    it('has white text primary', () => {
      expect(funkyTheme.palette.text.primary).toBe('#FFFFFF');
    });

    it('has text shadow on h1', () => {
      expect(funkyTheme.typography.h1.textShadow).toBeDefined();
    });

    it('has neon button styling', () => {
      expect(funkyTheme.components.MuiButton.styleOverrides.contained.textShadow).toBeDefined();
    });

    it('has progress bar with rainbow gradient', () => {
      expect(funkyTheme.components.MuiLinearProgress.styleOverrides.bar.backgroundImage).toContain(
        '#F72585'
      );
    });
  });

  describe('themes object', () => {
    it('contains light theme', () => {
      expect(themes.light).toBe(lightTheme);
    });

    it('contains dark theme', () => {
      expect(themes.dark).toBe(darkTheme);
    });

    it('contains funky theme', () => {
      expect(themes.funky).toBe(funkyTheme);
    });
  });

  describe('default export', () => {
    it('exports lightTheme as default', () => {
      expect(theme).toBe(lightTheme);
    });
  });
});
