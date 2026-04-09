import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  FlatList,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';

import {
  ButtonStyles,
  Colors,
  FontFamily,
  FontSize,
  Radius,
  Spacing,
} from '../constants/theme';

export type HabitListItem = {
  id: string;
  name: string;
  category?: string;
};

type AnimatedPressableProps = React.ComponentProps<typeof Pressable> & {
  disabled?: boolean;
};

function AnimatedPressable({ disabled, style, children, ...props }: AnimatedPressableProps) {
  const AnimatedPressableBase = useMemo(
    () => Animated.createAnimatedComponent(Pressable),
    []
  );
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    if (disabled) return;
    Animated.spring(scale, { toValue: 0.96, useNativeDriver: true, speed: 30, bounciness: 6 }).start();
  };

  const onPressOut = () => {
    if (disabled) return;
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 30, bounciness: 6 }).start();
  };

  return (
    <AnimatedPressableBase
      {...props}
      disabled={disabled}
      onPressIn={(event) => {
        onPressIn();
        props.onPressIn?.(event);
      }}
      onPressOut={(event) => {
        onPressOut();
        props.onPressOut?.(event);
      }}
      style={[style, { transform: [{ scale }] }]}
    >
      {children}
    </AnimatedPressableBase>
  );
}

type Props = {
  visible: boolean;
  habits: HabitListItem[];
  title?: string;
  onRequestClose: () => void;
  onConfirm: (habit: HabitListItem) => void;
  helpLabel?: string;
  onHelpPress?: () => void;
  loading?: boolean;
  emptyText?: string;
  categories?: string[];
  initialSelectedCategories?: string[];
  onCategoriesChange?: (categories: string[]) => void;
};

export function HabitListFilterModal({
  visible,
  habits,
  title = 'Habit list',
  onRequestClose,
  onConfirm,
  helpLabel = '?',
  onHelpPress,
  loading = false,
  emptyText = 'No habits found.',
  categories,
  initialSelectedCategories = [],
  onCategoriesChange,
}: Props) {
  const { height: windowHeight } = useWindowDimensions();
  const modalMaxHeight = Math.min(520, Math.max(360, Math.round(windowHeight * 0.72)));

  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [appliedCategories, setAppliedCategories] = useState<string[]>(
    initialSelectedCategories
  );
  const [draftCategories, setDraftCategories] = useState<string[]>(
    initialSelectedCategories
  );

  useEffect(() => {
    if (!visible) return;
    setSelectedId(null);
    setFilterOpen(false);
  }, [visible]);

  const categoryOptions = useMemo(() => {
    if (categories && categories.length > 0) return categories;
    const fromHabits = new Set(
      habits.map((h) => (h.category ? h.category : 'Uncategorized'))
    );
    return Array.from(fromHabits);
  }, [categories, habits]);

  const filteredHabits = useMemo(() => {
    const q = query.trim().toLowerCase();
    return habits
      .filter((h) => {
        if (appliedCategories.length === 0) return true;
        const cat = h.category ? h.category : 'Uncategorized';
        return appliedCategories.includes(cat);
      })
      .filter((h) => (q ? h.name.toLowerCase().includes(q) : true));
  }, [habits, appliedCategories, query]);

  const selectedHabit = useMemo(
    () => habits.find((h) => h.id === selectedId) ?? null,
    [habits, selectedId]
  );

  const openFilter = () => {
    setDraftCategories(appliedCategories);
    setSelectedId(null);
    setFilterOpen(true);
  };

  const closeFilter = () => setFilterOpen(false);

  const toggleDraftCategory = (category: string) => {
    setDraftCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  const applyCategoryFilter = () => {
    setAppliedCategories(draftCategories);
    onCategoriesChange?.(draftCategories);
    setFilterOpen(false);
  };

  const confirm = () => {
    if (!selectedHabit) return;
    onConfirm(selectedHabit);
    setSelectedId(null);
    setFilterOpen(false);
  };

  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onRequestClose}
    >
        <View style={styles.overlay}>
          <View style={styles.modalWrap}>
            <View style={styles.modalShadow} />
            <View style={[styles.modal, { maxHeight: modalMaxHeight }]}>
              <View style={styles.header}>
                <AnimatedPressable
                  accessibilityRole="button"
                  accessibilityLabel="Close"
                  onPress={onRequestClose}
                  style={styles.iconButtonWrap}
                >
                  <View style={styles.iconButtonShadow} />
                  <View style={styles.iconButton}>
                    <Text style={styles.iconButtonText}>x</Text>
                  </View>
                </AnimatedPressable>

                <Text style={styles.title}>{title}</Text>

                <AnimatedPressable
                  accessibilityRole="button"
                  accessibilityLabel="Help"
                  onPress={
                    onHelpPress ??
                    (() =>
                      Alert.alert(
                        'Help',
                        'Temporary: wire this to your help/FAQ later.'
                      ))
                  }
                  style={styles.iconButtonWrap}
                >
                  <View style={styles.iconButtonShadow} />
                  <View style={styles.iconButton}>
                    <Text style={styles.iconButtonText}>{helpLabel}</Text>
                  </View>
                </AnimatedPressable>
              </View>

            <View style={styles.searchRow}>
              <View style={styles.searchWrap}>
                <View style={styles.searchIcon}>
                  <View style={styles.searchIconHandle} />
                </View>
                <TextInput
                  value={query}
                  onChangeText={setQuery}
                  placeholder="Begin typing"
                  placeholderTextColor={Colors.greyOutText}
                  style={styles.searchInput}
                  autoCorrect={false}
                  autoCapitalize="none"
                  clearButtonMode={Platform.OS === 'ios' ? 'while-editing' : 'never'}
                />
              </View>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Filter"
                onPress={openFilter}
                style={styles.filterButton}
              >
                <View style={styles.filterCircle}>
                  <View style={styles.filterLine} />
                  <View style={[styles.filterLine, styles.filterLineMid]} />
                  <View style={styles.filterLine} />
                </View>
                {appliedCategories.length > 0 ? <View style={styles.filterDot} /> : null}
              </Pressable>
            </View>

            <View style={styles.listWrap}>
              <FlatList
                data={filteredHabits}
                keyExtractor={(item) => item.id}
                style={styles.list}
                renderItem={({ item }) => {
                  const active = item.id === selectedId;
                  return (
                    <Pressable
                      accessibilityRole="button"
                      onPress={() => setSelectedId((prev) => (prev === item.id ? null : item.id))}
                      style={[styles.row, active && styles.rowActive]}
                    >
                      <Text style={[styles.rowText, active && styles.rowTextActive]}>
                        {item.name}
                      </Text>
                    </Pressable>
                  );
                }}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                contentContainerStyle={[
                  styles.listContent,
                  filteredHabits.length === 0 ? styles.listEmptyContent : null,
                ]}
                ListEmptyComponent={
                  <Text style={styles.emptyText}>
                    {loading ? 'Loading habits...' : emptyText}
                  </Text>
                }
              />
            </View>

            <View style={styles.footer}>
              <AnimatedPressable
                accessibilityRole="button"
                accessibilityLabel="Set habit"
                onPress={confirm}
                disabled={!selectedHabit}
                style={ButtonStyles.wrapper}
              >
                <View
                  style={selectedHabit ? ButtonStyles.nextShadow : ButtonStyles.nextDisabledShadow}
                />
                <View style={selectedHabit ? ButtonStyles.next : ButtonStyles.nextDisabled}>
                  <Text style={selectedHabit ? ButtonStyles.nextText : ButtonStyles.nextDisabledText}>
                    set
                  </Text>
                </View>
              </AnimatedPressable>
            </View>

            {filterOpen ? (
              <View style={styles.filterPopupWrap} pointerEvents="box-none">
                <View style={styles.filterPopup}>
                  <View style={styles.filterHeader}>
                    <AnimatedPressable
                      accessibilityRole="button"
                      accessibilityLabel="Close filter"
                      onPress={closeFilter}
                      style={styles.filterClose}
                    >
                      <Text style={styles.filterCloseText}>x</Text>
                    </AnimatedPressable>
                    <Text style={styles.filterTitle}>Filter by Category</Text>
                  </View>

                  <View style={styles.filterBody}>
                    {categoryOptions.map((cat) => {
                      const checked = draftCategories.includes(cat);
                      return (
                        <Pressable
                          key={cat}
                          accessibilityRole="checkbox"
                          accessibilityState={{ checked }}
                          onPress={() => toggleDraftCategory(cat)}
                          style={styles.filterRow}
                        >
                          <View style={[styles.checkboxBox, checked && styles.checkboxBoxChecked]} />
                          <Text style={styles.filterRowText}>{cat}</Text>
                        </Pressable>
                      );
                    })}
                  </View>

                  <View style={styles.filterFooter}>
                    <AnimatedPressable
                      accessibilityRole="button"
                      accessibilityLabel="Apply filter"
                      onPress={applyCategoryFilter}
                      style={styles.applyWrap}
                    >
                      <View style={styles.applyShadow} />
                      <View style={styles.apply}>
                        <Text style={styles.applyText}>apply</Text>
                      </View>
                    </AnimatedPressable>
                  </View>
                </View>
              </View>
            ) : null}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(43, 26, 14, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalWrap: {
    width: '92%',
    maxWidth: 760,
    position: 'relative',
  },
  modalShadow: {
    position: 'absolute',
    top: 12,
    left: 12,
    right: -2,
    bottom: -2,
    backgroundColor: Colors.greenOutline,
    borderRadius: 44,
  },
  modal: {
    backgroundColor: Colors.offWhite,
    borderRadius: 44,
    borderWidth: 3,
    borderColor: Colors.greenOutline,
    paddingTop: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.lg,
    minHeight: 360,
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  title: {
    fontFamily: FontFamily.pixelBold,
    fontSize: 22,
    color: Colors.textGreen,
    textAlign: 'center',
  },
  iconButtonWrap: {
    position: 'relative',
    width: 46,
    height: 46,
    marginBottom: 5,
  },
  iconButtonShadow: {
    position: 'absolute',
    bottom: -5,
    left: 0,
    right: 0,
    height: '100%',
    backgroundColor: Colors.darkBrown,
    borderRadius: Radius.lg,
  },
  iconButton: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.orange,
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconButtonText: {
    fontFamily: FontFamily.pixelBold,
    fontSize: 18,
    color: Colors.offWhite,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  searchWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: Colors.greyOutLight,
    borderRadius: Radius.full,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  searchIcon: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: Colors.lightGrey,
    position: 'relative',
    overflow: 'visible',
  },
  searchIconHandle: {
    position: 'absolute',
    width: 9,
    height: 2,
    backgroundColor: Colors.lightGrey,
    right: -7,
    bottom: -1,
    transform: [{ rotate: '45deg' }],
    borderRadius: 2,
  },
  searchInput: {
    flex: 1,
    fontFamily: FontFamily.pixel,
    fontSize: FontSize.md,
    color: Colors.textGreen,
    paddingVertical: 0,
  },
  filterButton: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: Colors.greenOutline,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  filterLine: {
    width: 12,
    height: 2,
    backgroundColor: Colors.greenOutline,
    borderRadius: 2,
  },
  filterLineMid: {
    width: 8,
  },
  filterDot: {
    position: 'absolute',
    top: 3,
    right: 3,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.orange,
    borderWidth: 1.5,
    borderColor: Colors.offWhite,
  },
  listWrap: {
    flex: 1,
    borderTopWidth: 2,
    borderTopColor: Colors.greenOutline,
    marginBottom: Spacing.md,
    minHeight: 180,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.sm,
  },
  listEmptyContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: Spacing.lg,
  },
  emptyText: {
    fontFamily: FontFamily.pixel,
    fontSize: 14,
    color: Colors.textGreen,
    textAlign: 'center',
    opacity: 0.85,
  },
  row: {
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  rowActive: {
    backgroundColor: Colors.greenButton,
  },
  rowText: {
    fontFamily: FontFamily.pixel,
    fontSize: 18,
    color: Colors.textGreen,
  },
  rowTextActive: {
    color: Colors.offWhite,
  },
  separator: {
    height: 2,
    backgroundColor: Colors.greenOutline,
  },
  footer: {
    alignItems: 'flex-end',
    paddingTop: Spacing.sm,
  },
  filterPopupWrap: {
    position: 'absolute',
    top: 92,
    left: 86,
    right: 86,
    alignItems: 'center',
  },
  filterPopup: {
    width: '78%',
    maxWidth: 360,
    backgroundColor: Colors.offWhite,
    borderRadius: Radius.md,
    borderWidth: 2,
    borderColor: Colors.lightGrey,
    padding: Spacing.md,
  },
  filterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: Spacing.sm,
  },
  filterClose: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: Colors.orange,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterCloseText: {
    fontFamily: FontFamily.pixelBold,
    fontSize: 14,
    color: Colors.orange,
    marginTop: -1,
  },
  filterTitle: {
    fontFamily: FontFamily.pixelBold,
    fontSize: 16,
    color: Colors.textGreen,
  },
  filterBody: {
    gap: 10,
    paddingLeft: 4,
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  checkboxBox: {
    width: 14,
    height: 14,
    borderWidth: 2,
    borderColor: Colors.greenOutline,
    backgroundColor: Colors.transparent,
  },
  checkboxBoxChecked: {
    backgroundColor: Colors.greenOutline,
  },
  filterRowText: {
    fontFamily: FontFamily.pixel,
    fontSize: 14,
    color: Colors.textGreen,
  },
  filterFooter: {
    alignItems: 'flex-end',
    marginTop: Spacing.md,
  },
  applyWrap: {
    position: 'relative',
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  applyShadow: {
    position: 'absolute',
    bottom: -4,
    left: 0,
    right: 0,
    height: '100%',
    backgroundColor: Colors.darkBrown,
    borderRadius: 999,
  },
  apply: {
    backgroundColor: Colors.orange,
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyText: {
    fontFamily: FontFamily.pixel,
    fontSize: 12,
    color: Colors.offWhite,
  },
});
