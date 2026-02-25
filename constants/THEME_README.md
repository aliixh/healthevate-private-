# Healthevate Theme — `constants/theme.ts`

This file is the single source of truth for all visual styles in the app.
Import from it instead of hardcoding colors, fonts, or sizes anywhere.

---

## How to Import

```ts
import { Colors, FontFamily, FontSize, Spacing, Radius, ButtonStyles, PopupStyles, ComponentStyles } from '@/constants/theme';
```

---

## Colors

| Name             | Hex       | Use                                      |
|------------------|-----------|------------------------------------------|
| background       | #F3D3B5   | Main app background (warm tan)           |
| textbox          | #E5BD99   | Input fields, darker tan cards           |
| purple           | #916FD0   | Highlight / primary accent               |
| greenOutline     | #2D603D   | Borders, outlines, success states        |
| greenButton      | #2D603D   | Solid green button fill                  |
| orange           | #CE6832   | CTAs, icon buttons                       |
| yellowCoin       | #F9C983   | Coins, rewards, XP indicators            |
| offWhite         | #FFFAF1   | Modals, light surfaces, button text      |
| darkGrey         | #74675E   | Chevron icon, dropdown shadow            |
| lightGrey        | #C5BBB1   | Dropdown button background               |
| greyOutLight     | #E5E0DB   | Disabled button background               |
| greyOutText      | #C5BBB0   | Disabled button text                     |
| darkBrown        | #61412D   | Shadow for orange buttons                |
| darkGreenShadow  | #1A3D25   | Shadow for green buttons                 |
| textDark         | #2B1A0E   | Primary body text                        |
| textMid          | #6B4226   | Secondary / label text                   |
| textLight        | #FFFAF1   | Text on dark/colored backgrounds         |
| textGreen        | #2D603D   | Text on light backgrounds (green tint)   |

---

## Fonts

Two custom Google Fonts are used. Both must be loaded in `app/_layout.tsx` via `expo-font`.

| Key              | Font Name                  | Use                        |
|------------------|----------------------------|----------------------------|
| pixel            | PixelifySans_400Regular     | Main UI text               |
| pixelBold        | PixelifySans_700Bold        | Headings, emphasis         |
| handwriting      | Gluten_400Regular           | Decorative / fun text      |
| handwritingBold  | Gluten_700Bold              | Bold decorative text       |

### Font Sizes

| Key   | Size |
|-------|------|
| xs    | 10   |
| sm    | 12   |
| md    | 16   |
| lg    | 20   |
| xl    | 26   |
| xxl   | 34   |
| title | 42   |

---

## Spacing

Used for padding, margin, and gap values.

| Key | Value |
|-----|-------|
| xs  | 4     |
| sm  | 8     |
| md  | 16    |
| lg  | 24    |
| xl  | 32    |
| xxl | 48    |

---

## Border Radius

| Key  | Value |
|------|-------|
| sm   | 4     |
| md   | 8     |
| lg   | 16    |
| xl   | 24    |
| full | 999   |

---

## Buttons — `ButtonStyles`

All buttons use a **stacked shadow** pattern: a darker View sits behind the button, offset 5px downward to simulate a raised pixel-art effect.

### Usage pattern (same for every button):
```tsx
<TouchableOpacity activeOpacity={0.85} onPress={onPress}>
  <View style={ButtonStyles.wrapper}>
    <View style={ButtonStyles.nextShadow} />
    <View style={ButtonStyles.next}>
      <Text style={ButtonStyles.nextText}>next</Text>
    </View>
  </View>
</TouchableOpacity>
```

### Available Buttons

| Button            | Style key(s)                                      | Description                              |
|-------------------|---------------------------------------------------|------------------------------------------|
| Next (active)     | `next`, `nextShadow`, `nextText`                  | Orange, full-width CTA                   |
| Next (disabled)   | `nextDisabled`, `nextDisabledShadow`, `nextDisabledText` | Greyed out, non-interactive        |
| Back              | `back`, `backShadow`                              | Orange square icon button, add ‹ inside  |
| Help              | `help`, `helpShadow`                              | Orange square icon button, add ? inside  |
| Profile           | `profile`, `profileShadow`, `profileIconWrap`, `profileHead`, `profileBody` | Orange, person silhouette icon |
| Popup Primary     | `popupPrimary`, `popupPrimaryShadow`, `popupPrimaryText`   | Green, e.g. "yes"           |
| Popup Secondary   | `popupSecondary`, `popupSecondaryShadow`, `popupSecondaryText` | Green, e.g. "edit"       |
| Dropdown          | `dropdown`, `dropdownShadow`, `dropdownChevron`   | Grey, flat top, rounded bottom, chevron  |

### Profile button icon usage:
```tsx
<View style={ButtonStyles.profile}>
  <View style={ButtonStyles.profileIconWrap}>
    <View style={ButtonStyles.profileHead} />
    <View style={ButtonStyles.profileBody} />
  </View>
</View>
```

### Dropdown usage (flush to top of screen):
```tsx
<View style={ButtonStyles.wrapper}>
  <View style={ButtonStyles.dropdownShadow} />
  <TouchableOpacity style={ButtonStyles.dropdown} onPress={onPress}>
    <View style={ButtonStyles.dropdownChevron} />
  </TouchableOpacity>
</View>
```

---

## Popup / Modal — `PopupStyles`

Off-white card with green border, dimmed background overlay.

```tsx
<Modal transparent animationType="fade" visible={visible}>
  <View style={PopupStyles.overlay}>
    <View style={PopupStyles.container}>
      <Text style={PopupStyles.title}>Title here</Text>
      <Text style={PopupStyles.body}>Body text here</Text>
      <View style={PopupStyles.buttonRow}>
        {/* add popupSecondary and popupPrimary buttons here */}
      </View>
    </View>
  </View>
</Modal>
```

---

## Component Styles — `ComponentStyles`

| Key              | Description                                 |
|------------------|---------------------------------------------|
| screenContainer  | Full screen wrapper with background + padding |
| card             | Off-white card with green border            |
| input            | Tan input field with green border           |

---

## Icons / Images — `Icons`

Placeholder slots for app icons. Replace `null` with your asset path when ready.

```ts
coin:   null, // → require('../assets/icons/coin.png')
xp:     null, // → require('../assets/icons/xp.png')
streak: null,
gift:  null,
indrani: null,
indra: null
```