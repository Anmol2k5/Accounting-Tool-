import {StyleSheet} from 'react-native';

// ─── Color Palette ─────────────────────────────────────
export const Colors = {
  // Dark theme
  dark: {
    background: '#0F0F14',
    surface: '#1A1A24',
    surfaceElevated: '#22222E',
    card: '#1E1E2A',
    border: '#2A2A3A',
    borderLight: '#333348',
    textPrimary: '#F0F0F5',
    textSecondary: '#9898AC',
    textMuted: '#6B6B80',
    gold: '#F5A623',
    goldLight: 'rgba(245, 166, 35, 0.15)',
    success: '#10B981',
    successBg: 'rgba(16, 185, 129, 0.12)',
    danger: '#EF4444',
    dangerBg: 'rgba(239, 68, 68, 0.12)',
    warning: '#F59E0B',
    warningBg: 'rgba(245, 158, 11, 0.12)',
    info: '#3B82F6',
    infoBg: 'rgba(59, 130, 246, 0.12)',
    accent: '#8B5CF6',
    tabBar: '#14141C',
    tabBarBorder: '#1E1E2A',
    inputBg: '#1A1A24',
  },
};

export const C = Colors.dark;

// ─── Spacing ───────────────────────────────────────────
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

// ─── Font Sizes ────────────────────────────────────────
export const FontSize = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18,
  xxl: 22,
  xxxl: 28,
  hero: 34,
};

// ─── Shared Styles ─────────────────────────────────────
export const SharedStyles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: C.background,
  },
  screenPadding: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: C.card,
    borderRadius: 16,
    padding: Spacing.xl,
    borderWidth: 1,
    borderColor: C.border,
    marginBottom: Spacing.lg,
  },
  cardElevated: {
    backgroundColor: C.surfaceElevated,
    borderRadius: 16,
    padding: Spacing.xl,
    borderWidth: 1,
    borderColor: C.borderLight,
    marginBottom: Spacing.lg,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  sectionTitle: {
    fontSize: FontSize.xl,
    fontWeight: '700',
    color: C.textPrimary,
    marginBottom: Spacing.sm,
  },
  sectionSubtitle: {
    fontSize: FontSize.md,
    color: C.textSecondary,
    marginBottom: Spacing.lg,
    lineHeight: 20,
  },
  label: {
    fontSize: FontSize.sm,
    fontWeight: '700',
    color: C.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Spacing.xs,
  },
  input: {
    backgroundColor: C.inputBg,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: C.border,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    color: C.textPrimary,
    fontSize: FontSize.md,
  },
  primaryButton: {
    backgroundColor: C.gold,
    borderRadius: 12,
    paddingVertical: Spacing.md + 2,
    paddingHorizontal: Spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  primaryButtonText: {
    color: '#000',
    fontWeight: '700',
    fontSize: FontSize.md,
  },
  secondaryButton: {
    backgroundColor: C.surfaceElevated,
    borderRadius: 12,
    paddingVertical: Spacing.md + 2,
    paddingHorizontal: Spacing.xl,
    borderWidth: 1,
    borderColor: C.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  secondaryButtonText: {
    color: C.textPrimary,
    fontWeight: '600',
    fontSize: FontSize.md,
  },
  dangerButton: {
    backgroundColor: C.dangerBg,
    borderRadius: 12,
    paddingVertical: Spacing.md + 2,
    paddingHorizontal: Spacing.xl,
    borderWidth: 1,
    borderColor: C.danger,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  dangerButtonText: {
    color: C.danger,
    fontWeight: '700',
    fontSize: FontSize.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: C.border,
    marginVertical: Spacing.lg,
  },
  badge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: 20,
    backgroundColor: C.goldLight,
  },
  badgeText: {
    fontSize: FontSize.xs,
    fontWeight: '800',
    color: C.gold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxxl * 2,
    paddingHorizontal: Spacing.xl,
  },
  emptyStateText: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: C.textSecondary,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  emptyStateSubtext: {
    fontSize: FontSize.md,
    color: C.textMuted,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: Spacing.xl,
  },
});
