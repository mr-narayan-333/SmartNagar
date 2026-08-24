export const fontFamily = {
  notoSansRegular: 'NotoSans_400Regular',
  notoSansMedium: 'NotoSans_500Medium',
  notoSansSemiBold: 'NotoSans_600SemiBold',
  notoSansBold: 'NotoSans_700Bold',
  interRegular: 'Inter_400Regular',
  interMedium: 'Inter_500Medium',
  interSemiBold: 'Inter_600SemiBold',
} as const;

export const typography = {
  headlineLg: {
    fontFamily: fontFamily.notoSansBold,
    fontSize: 32,
    lineHeight: 40,
  },
  headlineLgMobile: {
    fontFamily: fontFamily.notoSansBold,
    fontSize: 24,
    lineHeight: 32,
  },
  headlineMd: {
    fontFamily: fontFamily.notoSansSemiBold,
    fontSize: 24,
    lineHeight: 32,
  },
  bodyLg: {
    fontFamily: fontFamily.notoSansRegular,
    fontSize: 18,
    lineHeight: 28,
  },
  bodyMd: {
    fontFamily: fontFamily.notoSansRegular,
    fontSize: 16,
    lineHeight: 24,
  },
  labelMd: {
    fontFamily: fontFamily.interMedium,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.14,
  },
  labelSm: {
    fontFamily: fontFamily.interSemiBold,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.6,
  },
} as const;
