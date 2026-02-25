/**
 * Global Theme — Healthevate
 * Colors, typography, spacing, radius, shadows, and component styles.
 */

import { StyleSheet } from 'react-native';

// ─────────────────────────────────────────
// COLORS
// ─────────────────────────────────────────
export const Colors = {
  // Core palette
  background:      '#F3D3B5', // main app background (warm tan)
  textbox:         '#E5BD99', // darker tan for input fields / cards
  purple:          '#916FD0', // highlight / primary accent
  greenOutline:    '#2D603D', // borders, outlines, success
  greenButton:     '#2D603D', // solid green button fill
  orange:          '#CE6832', // dark orange accent / CTAs
  yellowCoin:      '#F9C983', // coin / reward color
  offWhite:        '#FFFAF1', // light surfaces, modals

  // Greys
  darkGrey:        '#74675E',
  lightGrey:       '#C5BBB1',
  greyOutLight:    '#E5E0DB', // greyed-out button background
  greyOutText:     '#C5BBB0', // greyed-out button text

  // Shadows
  darkBrown:       '#61412D', // shadow for orange/tan buttons
  darkGreenShadow: '#1A3D25', // shadow for green buttons

  // Text
  textDark:        '#2B1A0E',
  textMid:         '#6B4226',
  textLight:       '#FFFAF1', // text on dark/green/orange backgrounds
  textGreen:       '#2D603D',

  // Utility
  white:           '#FFFFFF',
  black:           '#000000',
  transparent:     'transparent',
};

// ─────────────────────────────────────────
// TYPOGRAPHY
// ─────────────────────────────────────────
export const FontFamily = {
  pixel:           'PixelifySans_400Regular',
  pixelBold:       'PixelifySans_700Bold',
  handwriting:     'Gluten_400Regular',
  handwritingBold: 'Gluten_700Bold',
};

export const FontSize = {
  xs:    10,
  sm:    12,
  md:    16,
  lg:    20,
  xl:    26,
  xxl:   34,
  title: 42,
};

// ─────────────────────────────────────────
// SPACING
// ─────────────────────────────────────────
export const Spacing = {
  xs:  4,
  sm:  8,
  md:  16,
  lg:  24,
  xl:  32,
  xxl: 48,
};

// ─────────────────────────────────────────
// BORDER RADIUS
// ─────────────────────────────────────────
export const Radius = {
  sm:   4,
  md:   8,
  lg:   16,
  xl:   24,
  full: 999,
};

// ─────────────────────────────────────────
// ICONS / IMAGES
// Paste your image require() paths below.
// ─────────────────────────────────────────
export const Icons = {
  coin:   null, // TODO: require('../assets/icons/coin.png')
  xp:     null, // TODO: require('../assets/icons/xp.png')
  star:   null, // TODO: require('../assets/icons/star.png')
  heart:  null, // TODO: require('../assets/icons/heart.png')
  streak: null, // TODO: require('../assets/icons/streak.png')
  badge:  null, // TODO: require('../assets/icons/badge.png')
  avatar: null, // TODO: require('../assets/icons/avatar.png')
};

// ─────────────────────────────────────────
// BUTTON STYLES
//
// Each button uses a solid "stacked shadow" — a darker View
// behind the button, offset 4-5px downward.
//
// Usage pattern:
//
//   <TouchableOpacity activeOpacity={0.85} onPress={onPress}>
//     <View style={ButtonStyles.wrapper}>
//       <View style={ButtonStyles.nextShadow} />
//       <View style={ButtonStyles.next}>
//         <Text style={ButtonStyles.nextText}>next</Text>
//       </View>
//     </View>
//   </TouchableOpacity>
//
// ─────────────────────────────────────────
export const ButtonStyles = StyleSheet.create({

  // Shared wrapper — gives the shadow room to show below
  wrapper: {
    position: 'relative',
    alignSelf: 'flex-start',
    marginBottom: 5, // leaves space for the shadow
  },

  // ── NEXT button (orange) ──────────────────
  next: {
    backgroundColor: Colors.orange,
    borderRadius: Radius.md,
    paddingVertical: Spacing.sm + 2,
    paddingHorizontal: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  nextShadow: {
    position: 'absolute',
    bottom: -5,
    left: 0,
    right: 0,
    height: '100%',
    backgroundColor: Colors.darkBrown,
    borderRadius: Radius.md,
    zIndex: 0,
  },
  nextText: {
    fontFamily: FontFamily.pixel,
    fontSize: FontSize.md,
    color: Colors.offWhite,
  },

  // ── NEXT button — disabled / greyed out ──
  nextDisabled: {
    backgroundColor: Colors.greyOutLight,
    borderRadius: Radius.md,
    paddingVertical: Spacing.sm + 2,
    paddingHorizontal: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  nextDisabledShadow: {
    position: 'absolute',
    bottom: -5,
    left: 0,
    right: 0,
    height: '100%',
    backgroundColor: Colors.darkGrey,
    borderRadius: Radius.md,
    zIndex: 0,
  },
  nextDisabledText: {
    fontFamily: FontFamily.pixel,
    fontSize: FontSize.md,
    color: Colors.greyOutText,
  },

  // ── BACK button ( < arrow icon, square-ish orange) ──
  back: {
    backgroundColor: Colors.orange,
    borderRadius: Radius.lg,
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  backShadow: {
    position: 'absolute',
    bottom: -5,
    left: 0,
    right: 0,
    height: '100%',
    backgroundColor: Colors.darkBrown,
    borderRadius: Radius.lg,
    zIndex: 0,
  },

  // ── HELP / QUESTION button ( ? icon, orange) ──
  help: {
    backgroundColor: Colors.orange,
    borderRadius: Radius.lg,
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  helpShadow: {
    position: 'absolute',
    bottom: -5,
    left: 0,
    right: 0,
    height: '100%',
    backgroundColor: Colors.darkBrown,
    borderRadius: Radius.lg,
    zIndex: 0,
  },

  // ── PROFILE / AVATAR button (orange, person silhouette) ──
  // Inside the button, render:
  //   <View style={ButtonStyles.profileIconWrap}>
  //     <View style={ButtonStyles.profileHead} />
  //     <View style={ButtonStyles.profileBody} />
  //   </View>
  profile: {
    backgroundColor: Colors.orange,
    borderRadius: Radius.lg,
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  profileShadow: {
    position: 'absolute',
    bottom: -5,
    left: 0,
    right: 0,
    height: '100%',
    backgroundColor: Colors.darkBrown,
    borderRadius: Radius.lg,
    zIndex: 0,
  },
  profileIconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  profileHead: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2.5,
    borderColor: Colors.offWhite,
    backgroundColor: Colors.transparent,
  },
  profileBody: {
    width: 26,
    height: 13,
    borderTopLeftRadius: 13,
    borderTopRightRadius: 13,
    borderWidth: 2.5,
    borderBottomWidth: 0,
    borderColor: Colors.offWhite,
    backgroundColor: Colors.transparent,
  },

  // ── POPUP green primary button (e.g. "yes") ──
  popupPrimary: {
    backgroundColor: Colors.greenButton,
    borderRadius: Radius.md,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  popupPrimaryShadow: {
    position: 'absolute',
    bottom: -5,
    left: 0,
    right: 0,
    height: '100%',
    backgroundColor: Colors.darkGreenShadow,
    borderRadius: Radius.md,
    zIndex: 0,
  },
  popupPrimaryText: {
    fontFamily: FontFamily.pixel,
    fontSize: FontSize.md,
    color: Colors.offWhite,
  },

  // ── POPUP green secondary button (e.g. "edit") ──
  popupSecondary: {
    backgroundColor: Colors.greenButton,
    borderRadius: Radius.md,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  popupSecondaryShadow: {
    position: 'absolute',
    bottom: -5,
    left: 0,
    right: 0,
    height: '100%',
    backgroundColor: Colors.darkGreenShadow,
    borderRadius: Radius.md,
    zIndex: 0,
  },
  popupSecondaryText: {
    fontFamily: FontFamily.pixel,
    fontSize: FontSize.md,
    color: Colors.offWhite,
  },

  // ── DROPDOWN (grey, flat top / rounded bottom, chevron only) ──
  // Sits flush at the top of the screen — use with no top margin.
  // Render a down-pointing triangle as the chevron child:
  //   <View style={ButtonStyles.dropdownChevron} />
  dropdown: {
    backgroundColor: 'rgba(197, 187, 177, 0.7)', // lightGrey at 70% opacity
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: Radius.md,
    borderBottomRightRadius: Radius.md,
    paddingTop: 3,
    paddingBottom: Spacing.sm,
    paddingHorizontal: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
    minWidth: 44,
  },
  dropdownShadow: {
    position: 'absolute',
    bottom: -4,
    left: 0,
    right: 0,
    height: '100%',
    backgroundColor: 'rgba(116, 103, 94, 0.5)', // darkGrey at 50% opacity
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: Radius.md,
    borderBottomRightRadius: Radius.md,
    zIndex: 0,
  },
  // CSS triangle chevron — render as a plain View, no children needed
  dropdownChevron: {
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 9,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: Colors.darkGrey,
  },
});

// ─────────────────────────────────────────
// POPUP / MODAL STYLES
//
// Usage example:
//
//   <Modal transparent animationType="fade" visible={visible}>
//     <View style={PopupStyles.overlay}>
//       <View style={PopupStyles.container}>
//         <Text style={PopupStyles.title}>New custom habit</Text>
//         <Text style={PopupStyles.body}>Add "run 1 mile" to habit list?</Text>
//         <View style={PopupStyles.buttonRow}>
//           // popupSecondary ("edit") and popupPrimary ("yes") go here
//         </View>
//       </View>
//     </View>
//   </Modal>
//
// ─────────────────────────────────────────
export const PopupStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(43, 26, 14, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    backgroundColor: Colors.offWhite,
    borderRadius: Radius.xl,
    borderWidth: 3,
    borderColor: Colors.greenOutline,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    width: '80%',
    alignItems: 'center',
  },
  title: {
    fontFamily: FontFamily.pixelBold,
    fontSize: FontSize.lg,
    color: Colors.textGreen,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  body: {
    fontFamily: FontFamily.pixel,
    fontSize: FontSize.md,
    color: Colors.textGreen,
    marginBottom: Spacing.lg,
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    justifyContent: 'center',
  },
});

// ─────────────────────────────────────────
// COMMON COMPONENT STYLES
// ─────────────────────────────────────────
export const ComponentStyles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.md,
  },
  card: {
    backgroundColor: Colors.offWhite,
    borderRadius: Radius.md,
    padding: Spacing.md,
    borderWidth: 1.5,
    borderColor: Colors.greenOutline,
  },
  input: {
    backgroundColor: Colors.textbox,
    borderRadius: Radius.sm,
    borderWidth: 1.5,
    borderColor: Colors.greenOutline,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontFamily: FontFamily.pixel,
    fontSize: FontSize.md,
    color: Colors.textDark,
  },
});