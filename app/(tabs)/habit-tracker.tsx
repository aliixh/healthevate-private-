/**
 * File: app/(tabs)/habit-tracker.tsx
 * npx expo install expo-image-picker expo-screen-orientation
 */
import { getHabits } from '@/api/habits';
import { type HabitListItem } from '@/components/habit-list-filter-modal';
import {
  ButtonStyles, Colors, FontFamily, FontSize,
  PopupStyles, Radius, Spacing,
} from '@/constants/theme';
import * as ImagePicker from 'expo-image-picker';
import * as ScreenOrientation from 'expo-screen-orientation';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert, Animated, Image, KeyboardAvoidingView, Modal,
  PanResponder, Platform, SafeAreaView, ScrollView,
  StyleSheet, Text, TextInput, TouchableOpacity,
  useWindowDimensions, View,
} from 'react-native';

// ─── TYPES ───────────────────────────────────────────────────────────────────
export type Habit = { id: string; label: string; coins: number | null };
type CheckedEntry = { photoUri: string | null };
type Props = {
  navigation?: any;
  habits?: Habit[];
  onHabitsChange?: (h: Habit[]) => void;
  playerCoins?: number;
  playerXP?: number;
  onAddCoins?: (n: number) => void;
};

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const CAL_COLLAPSED = 280;
const DRAG_THRESH   = 50;
const COIN_W        = 56;
const COIN_IMG: any = null;
const MAX_MAIN      = 3;
let   NEXT_ID       = 100;

const DEFAULT_HABITS: Habit[] = [
  { id:'1',  label:'drink water',        coins:50   },
  { id:'2',  label:'journal',            coins:50   },
  { id:'3',  label:'go to gym',          coins:50   },
  { id:'4',  label:'walk 10,000 steps',  coins:null },
  { id:'5',  label:'eat 100g of protein',coins:null },
  { id:'6',  label:'meditate 10 mins',   coins:null },
  { id:'7',  label:'read 20 pages',      coins:null },
  { id:'8',  label:'cold shower',        coins:null },
  { id:'9',  label:'no sugar today',     coins:null },
  { id:'10', label:'stretch / mobility', coins:null },
];

// Always fresh — never cached from bundle parse time
function getToday() {
  const d = new Date();
  return { day: d.getDate(), month: d.getMonth(), year: d.getFullYear() };
}

function buildMonths() {
  const { month, year } = getToday();
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(year, month + i - 3, 1);
    return { year: d.getFullYear(), month: d.getMonth() };
  });
  // index 0-2 = past, 3 = current, 4-6 = future
}

// ─── SMALL UI ─────────────────────────────────────────────────────────────────
function BackBtn({ onPress }: { onPress: () => void }) {
  return (
    <TouchableOpacity activeOpacity={0.85} onPress={onPress}>
      <View style={ButtonStyles.wrapper}>
        <View style={ButtonStyles.backShadow} />
        <View style={ButtonStyles.back}><Text style={s.backChevron}>{'<'}</Text></View>
      </View>
    </TouchableOpacity>
  );
}

function StatsPill({ coins, xp }: { coins: number; xp: number }) {
  return (
    <View style={s.statsPill}>
      <View style={s.statsRow}>
        {COIN_IMG ? <Image source={COIN_IMG} style={s.coinImg16} /> : <View style={s.coinDot} />}
        <Text style={s.statsCoinVal}>{coins}</Text>
      </View>
      <View style={s.statsSep} />
      <View style={s.statsRow}>
        <Text style={s.xpLbl}>XP</Text>
        <Text style={s.statsXpVal}>{xp}</Text>
      </View>
    </View>
  );
}

function CoinBadge({ amount }: { amount: number }) {
  return (
    <View style={s.coinBadge}>
      {COIN_IMG ? <Image source={COIN_IMG} style={s.coinImg16} /> : <View style={s.coinDot} />}
      <Text style={s.coinAmt}>{amount}</Text>
    </View>
  );
}

// ─── HABIT ROW (view mode) ────────────────────────────────────────────────────
function HabitRow({ habit, selected, checked, onSelect, onCheck }: {
  habit: Habit; selected: boolean; checked: boolean;
  onSelect: (id: string) => void;
  onCheck: (h: Habit) => void;
}) {
  return (
    <TouchableOpacity activeOpacity={0.8} onPress={() => onSelect(habit.id)}>
      <View style={s.habitRow}>
        <TouchableOpacity
          onPress={() => { if (!checked) onCheck(habit); }}
          style={[s.checkbox, checked && s.checkboxOn]}
        >
          {checked && <Text style={s.checkmark}>✓</Text>}
        </TouchableOpacity>
        <View style={[s.pill, selected && s.pillSelected]}>
          <Text style={s.pillText}>{habit.label}</Text>
        </View>
        {habit.coins != null ? <CoinBadge amount={habit.coins} /> : <View style={{ width: COIN_W }} />}
      </View>
    </TouchableOpacity>
  );
}

// ─── MONTH BLOCK ──────────────────────────────────────────────────────────────
function MonthBlock({ year, month, habitId, checkedMap, todayRef }: {
  year: number; month: number;
  habitId: string | undefined;
  checkedMap: Record<string, CheckedEntry>;
  todayRef: (el: View | null) => void;
}) {
  const { day: TODAY, month: CUR_M, year: CUR_Y } = getToday();
  const isCurrent  = year === CUR_Y && month === CUR_M;
  const firstDay   = new Date(year, month, 1).getDay();
  const daysInMon  = new Date(year, month + 1, 0).getDate();
  const name       = new Date(year, month, 1).toLocaleString('default', { month: 'long' });
  const entry      = habitId ? checkedMap[habitId] : undefined;

  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMon }, (_, i) => i + 1),
  ];

  return (
    <View style={s.monthBlock}>
      <Text style={s.monthLabel}>{name} {year}</Text>
      <View style={s.calGrid}>
        {['S','M','T','W','T','F','S'].map((d, i) => (
          <Text key={i} style={s.dayHdr}>{d}</Text>
        ))}
        {cells.map((d, i) => {
          const isToday = isCurrent && d === TODAY;
          const done    = isToday && !!entry;
          const photo   = done ? entry!.photoUri : null;
          return (
            <View key={i}
              ref={isToday ? todayRef : undefined}
              style={[s.cell, isToday && s.cellToday, done && s.cellDone]}
            >
              {photo && <Image source={{ uri: photo }} style={StyleSheet.absoluteFillObject} borderRadius={3} />}
              <Text style={[s.cellTxt, (isToday || done) && s.cellTxtLight, !!photo && s.cellTxtPhoto]}>
                {d ?? ''}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

// ─── PROGRESS CALENDAR ───────────────────────────────────────────────────────
function ProgressCalendar({ habit, checkedMap, todayRef }: {
  habit: Habit | undefined;
  checkedMap: Record<string, CheckedEntry>;
  todayRef: (el: View | null) => void;
}) {
  const scrollRef  = useRef<ScrollView>(null);
  const MONTHS     = buildMonths();           // rebuilt fresh each render
  const yOffsets   = useRef<number[]>([]);    // y positions of each month block
  const readyCount = useRef(0);               // how many onLayout callbacks fired

  // Once all 7 month blocks have reported their y, scroll to current (index 3)
  const onMonthLayout = (idx: number, y: number) => {
    yOffsets.current[idx] = y;
    readyCount.current += 1;
    if (readyCount.current === MONTHS.length) {
      const target = yOffsets.current[3];
      if (target !== undefined) {
        scrollRef.current?.scrollTo({ y: target, animated: false });
      }
    }
  };

  return (
    <View style={s.calPanel}>
      <Text style={s.calTitle}>Progress Calendar</Text>
      <View style={s.calNameBox}>
        <Text style={s.calName} numberOfLines={1}>{habit?.label ?? '—'}</Text>
      </View>
      <ScrollView
        ref={scrollRef}
        style={s.calScroll}
        showsVerticalScrollIndicator
        contentContainerStyle={{ paddingBottom: Spacing.md }}
        nestedScrollEnabled
      >
        {MONTHS.map(({ year, month }, idx) => (
          <View key={`${year}-${month}`} onLayout={e => onMonthLayout(idx, e.nativeEvent.layout.y)}>
            <MonthBlock
              year={year} month={month}
              habitId={habit?.id}
              checkedMap={checkedMap}
              todayRef={todayRef}
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

// ─── CONFIRM MODAL ────────────────────────────────────────────────────────────
function ConfirmModal({ visible, title, body, note, buttons }: {
  visible: boolean; title: string; body?: string; note?: string;
  buttons: { label: string; onPress: () => void }[];
}) {
  if (!visible) return null;
  return (
    <Modal transparent animationType="fade" visible>
      <View style={PopupStyles.overlay}>
        <View style={s.confirmBox}>
          <Text style={s.confirmTitle}>{title}</Text>
          {body ? <Text style={s.confirmBody}>{body}</Text> : null}
          {note ? <Text style={s.confirmNote}>{note}</Text> : null}
          <View style={s.confirmRow}>
            {buttons.map((btn, i) => (
              <TouchableOpacity key={i} activeOpacity={0.85} onPress={btn.onPress}>
                <View style={ButtonStyles.wrapper}>
                  <View style={ButtonStyles.popupPrimaryShadow} />
                  <View style={ButtonStyles.popupPrimary}>
                    <Text style={ButtonStyles.popupPrimaryText}>{btn.label}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
}

// ─── PHOTO MODAL ─────────────────────────────────────────────────────────────
function PhotoModal({ visible, habitName, onCamera, onGallery, onSkip }: {
  visible: boolean; habitName: string;
  onCamera: () => void; onGallery: () => void; onSkip: () => void;
}) {
  if (!visible) return null;
  return (
    <Modal transparent animationType="fade" visible>
      <View style={PopupStyles.overlay}>
        <View style={s.photoBox}>
          <View style={s.photoNameRow}><Text style={s.photoName} numberOfLines={1}>{habitName}</Text></View>
          <View style={s.photoDivider} />
          <TouchableOpacity style={s.photoItem} onPress={onCamera}><Text style={s.photoItemTxt}>take photo</Text></TouchableOpacity>
          <View style={s.photoDivider} />
          <TouchableOpacity style={s.photoItem} onPress={onGallery}><Text style={s.photoItemTxt}>choose from gallery</Text></TouchableOpacity>
          <View style={s.photoDivider} />
          <TouchableOpacity style={s.photoItem} onPress={onSkip}><Text style={s.photoItemTxt}>skip photo</Text></TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

// ─── HABIT LIBRARY SIDEBAR ───────────────────────────────────────────────────
// Embeds the HabitListFilterModal UI as an inline sidebar panel (not a popup).
// Same search + category filter + list behaviour, just rendered in-place.
function HabitLibrarySidebar({ items, categories, loading, addedLabels, onSelect }: {
  items: HabitListItem[];
  categories: string[];
  loading: boolean;
  addedLabels: string[];
  onSelect: (name: string) => void;
}) {
  const [query, setQuery]                   = useState('');
  const [filterOpen, setFilterOpen]         = useState(false);
  const [appliedCats, setAppliedCats]       = useState<string[]>([]);
  const [draftCats, setDraftCats]           = useState<string[]>([]);

  const filtered = items.filter(h => {
    const matchesCat = appliedCats.length === 0 || appliedCats.includes(h.category ?? 'Other');
    const matchesQ   = !query.trim() || h.name.toLowerCase().includes(query.trim().toLowerCase());
    return matchesCat && matchesQ;
  });

  const toggleDraft = (cat: string) =>
    setDraftCats(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]);

  const applyFilter = () => { setAppliedCats(draftCats); setFilterOpen(false); };
  const openFilter  = () => { setDraftCats(appliedCats); setFilterOpen(true); };

  return (
    <View style={s.editRight}>
      <Text style={s.editRightTitle}>habit list</Text>

      {/* Search row */}
      <View style={s.libSearchRow}>
        <View style={s.libSearchWrap}>
          <TextInput
            style={s.libSearchInput}
            placeholder="search..."
            placeholderTextColor={Colors.greyOutText}
            value={query}
            onChangeText={setQuery}
            autoCorrect={false}
            autoCapitalize="none"
          />
        </View>
        <TouchableOpacity style={s.libFilterBtn} onPress={openFilter}>
          <View style={[s.libFilterCircle, appliedCats.length > 0 && s.libFilterCircleActive]}>
            <View style={s.libFilterLine} />
            <View style={[s.libFilterLine, { width: 8 }]} />
            <View style={s.libFilterLine} />
          </View>
        </TouchableOpacity>
      </View>

      {/* Habit list */}
      {loading ? (
        <View style={{ flex:1, alignItems:'center', justifyContent:'center' }}>
          <Text style={s.libCat}>loading...</Text>
        </View>
      ) : (
        <ScrollView style={{ flex:1 }} showsVerticalScrollIndicator>
          {filtered.length === 0 ? (
            <Text style={s.libEmpty}>no habits found</Text>
          ) : (
            filtered.map((item, idx) => {
              const added = addedLabels.includes(item.name.toLowerCase());
              return (
                <React.Fragment key={item.id}>
                  {idx > 0 && <View style={s.libSep} />}
                  <TouchableOpacity
                    style={[s.libRow, added && s.libRowAdded]}
                    activeOpacity={0.7}
                    onPress={() => !added && onSelect(item.name)}
                    disabled={added}
                  >
                    
                    <Text style={[s.libRowTxt, added && s.libRowAdded]}>{item.name}</Text>
                    {added && <Text style={s.libCheck}>✓</Text>}
                  </TouchableOpacity>
                </React.Fragment>
              );
            })
          )}
        </ScrollView>
      )}

      {/* Category filter overlay */}
      {filterOpen && (
        <View style={s.libFilterOverlay}>
          <View style={s.libFilterPopup}>
            <View style={s.libFilterHeader}>
              <TouchableOpacity onPress={() => setFilterOpen(false)}>
                <Text style={s.libFilterClose}>✕</Text>
              </TouchableOpacity>
              <Text style={s.libFilterTitle}>filter by category</Text>
            </View>
            <View style={s.libFilterBody}>
              {categories.map(cat => {
                const checked = draftCats.includes(cat);
                return (
                  <TouchableOpacity key={cat} style={s.libFilterRow} onPress={() => toggleDraft(cat)}>
                    <View style={[s.libCheckbox, checked && s.libCheckboxOn]} />
                    <Text style={s.libFilterRowTxt}>{cat}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            <View style={s.libFilterFooter}>
              <TouchableOpacity activeOpacity={0.85} onPress={applyFilter}>
                <View style={ButtonStyles.wrapper}>
                  <View style={ButtonStyles.nextShadow} />
                  <View style={ButtonStyles.next}>
                    <Text style={ButtonStyles.nextText}>apply</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

// ─── EDIT SCREEN ─────────────────────────────────────────────────────────────
function EditScreen({ initialHabits, onSave, onDismiss }: {
  initialHabits: Habit[];
  onSave: (h: Habit[]) => void;
  onDismiss: () => void;
}) {
  // Use a ref as the source of truth for the habit list — no stale closures
  const habitsRef  = useRef<Habit[]>(initialHabits.map(h => ({ ...h })));
  const [render, setRender] = useState(0); // bump to trigger re-render
  const forceUpdate = () => setRender(n => n + 1);

  const [customText, setCustomText] = useState('');
  const inputRef = useRef<TextInput>(null);

  // Delete state
  const [deleteTarget, setDeleteTarget] = useState<Habit | null>(null);
  const [showExit, setShowExit]         = useState(false);
  const [showGoalType, setShowGoalType] = useState(false);
  const [showOops, setShowOops]         = useState(false);
  const [showNewHabit, setShowNewHabit] = useState(false);
  const [saving, setSaving]             = useState(false);
  const [progress, setProgress]         = useState(0);

  const pendingLib      = useRef('');
  const pendingGoalType = useRef<'main'|'side'>('side');
  const unsaved         = useRef(false);

  // ── Supabase habit library ──
  const [libItems, setLibItems]         = useState<HabitListItem[]>([]);
  const [libCategories, setLibCategories] = useState<string[]>([]);
  const [libLoading, setLibLoading]     = useState(false);

  useEffect(() => {
    const load = async () => {
      setLibLoading(true);
      try {
        const data = await getHabits();
        const rows = Array.isArray(data) ? data : [];
        const items: HabitListItem[] = rows
          .map((row: any) => {
            const name = typeof row?.name === 'string' ? row.name : null;
            if (!name) return null;
            const category = typeof row?.category === 'string' ? row.category : 'Other';
            const id = String(row?.id ?? row?.habit_id ?? `${category}:${name}`);
            return { id, name, category };
          })
          .filter(Boolean) as HabitListItem[];
        const cats = Array.from(new Set(items.map(h => h.category ?? 'Other')));
        setLibItems(items);
        setLibCategories(cats);
      } catch (e) {
        console.error('Failed to load habit library', e);
      } finally {
        setLibLoading(false);
      }
    };
    load();
  }, []);

  const editHabits = habitsRef.current; // convenience alias for rendering

  // ── helpers ──
  const addHabit = (h: Habit) => {
    habitsRef.current = [...habitsRef.current, h];
    unsaved.current = true;
    forceUpdate();
  };

  const removeHabit = (id: string) => {
    habitsRef.current = habitsRef.current.filter(h => h.id !== id);
    unsaved.current = true;
    forceUpdate();
  };

  const insertMainHabit = (h: Habit) => {
    const arr  = [...habitsRef.current];
    const last = arr.reduce((a, x, i) => x.coins != null ? i : a, -1);
    arr.splice(last + 1, 0, h);
    habitsRef.current = arr;
    unsaved.current = true;
    forceUpdate();
  };

  // ── custom habit ──
  const submitCustom = () => {
    const val = customText.trim();
    if (!val) return;
    addHabit({ id: String(NEXT_ID++), label: val, coins: null });
    setCustomText('');
    // Don't blur — let keyboard stay open so user can type more habits
  };

  // ── library ──
  const onLibTap = (label: string) => {
    pendingLib.current = label;
    setShowGoalType(true);
  };
  const onGoalType = (type: 'main'|'side') => {
    setShowGoalType(false);
    pendingGoalType.current = type;
    const mainCount = habitsRef.current.filter(h => h.coins != null).length;
    if (type === 'main' && mainCount >= MAX_MAIN) { setShowOops(true); return; }
    setShowNewHabit(true);
  };
  const confirmAdd = () => {
    setShowNewHabit(false);
    const isMain = pendingGoalType.current === 'main';
    const newH: Habit = { id: String(NEXT_ID++), label: pendingLib.current, coins: isMain ? 50 : null };
    if (isMain) insertMainHabit(newH); else addHabit(newH);
  };

  // ── save ──
  const isSavingRef = useRef(false);
  const doSave = (after: () => void) => {
    if (isSavingRef.current) return; // prevent double-trigger
    isSavingRef.current = true;
    inputRef.current?.blur();
    setSaving(true);
    setProgress(0);
    let pct = 0;
    const tick = () => {
      pct = Math.min(100, pct + 6 + Math.random() * 10);
      setProgress(pct);
      if (pct < 100) { setTimeout(tick, 40); }
      else setTimeout(() => {
        setSaving(false);
        isSavingRef.current = false;
        unsaved.current = false;
        onSave([...habitsRef.current]);
        after(); // () => {} for save-in-place, onDismiss for save-and-exit
      }, 200);
    };
    setTimeout(tick, 40);
  };

  const onBack = () => { if (unsaved.current) setShowExit(true); else onDismiss(); };

  const addedLabels = editHabits.map(h => h.label.toLowerCase());

  return (
    <View style={s.editScreen}>
      {/* LEFT */}
      <KeyboardAvoidingView
        style={s.editLeft}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={s.editHeader}>
          <BackBtn onPress={onBack} />
          <Text style={s.editTitle}>Edit Habits</Text>
        </View>

        <View style={s.editListWrap}>
          <ScrollView
            style={s.editScroll}
            contentContainerStyle={{ gap: 8, paddingBottom: 4 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {editHabits.map(h => (
              <View key={h.id} style={s.editRow}>
                <View style={s.editPill}>
                  <Text style={s.editPillTxt}>{h.label}</Text>
                </View>
                <TouchableOpacity style={s.delBtn} onPress={() => setDeleteTarget(h)}>
                  <Text style={s.delBtnTxt}>del</Text>
                </TouchableOpacity>
                {h.coins != null ? (
                  <View style={s.editCoinBadge}><View style={s.coinDot} /><Text style={s.editCoinAmt}>{h.coins}</Text></View>
                ) : (
                  <View style={{ width: 40 }} />
                )}
              </View>
            ))}
          </ScrollView>

          {/* Custom input always at bottom */}
          <View style={s.customRow}>
            <View style={s.customPill}>
              <TextInput
                ref={inputRef}
                style={s.customInput}
                placeholder="type custom habit..."
                placeholderTextColor={Colors.greenOutline + '88'}
                value={customText}
                onChangeText={setCustomText}
                onSubmitEditing={submitCustom}
                returnKeyType="done"
                blurOnSubmit={false}
                maxLength={40}
              />
            </View>
          </View>
        </View>

        <View style={s.saveBtnWrap}>
          <TouchableOpacity activeOpacity={0.85} onPress={() => doSave(() => {})}>
            <View style={ButtonStyles.wrapper}>
              <View style={ButtonStyles.popupPrimaryShadow} />
              <View style={ButtonStyles.popupPrimary}>
                <Text style={ButtonStyles.popupPrimaryText}>save</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* RIGHT — habit library sidebar (HabitListFilterModal UI embedded inline) */}
      <HabitLibrarySidebar
        items={libItems}
        categories={libCategories}
        loading={libLoading}
        addedLabels={addedLabels}
        onSelect={onLibTap}
      />

      {/* Save progress overlay */}
      {saving && (
        <View style={s.saveOverlay}>
          <Text style={s.saveLabel}>saving...</Text>
          <View style={s.saveBg}>
            <View style={[s.saveBar, { width: `${Math.round(progress)}%` as any }]} />
          </View>
        </View>
      )}

      {/* Modals */}
      <ConfirmModal visible={!!deleteTarget} title="Warning!"
        body={`Deleting "${deleteTarget?.label ?? ''}" will archive your progress calendar.\n\nDo you wish to proceed?`}
        buttons={[
          { label: 'no',  onPress: () => setDeleteTarget(null) },
          { label: 'yes', onPress: () => { const id = deleteTarget!.id; setDeleteTarget(null); removeHabit(id); } },
        ]}
      />
      <ConfirmModal visible={showGoalType} title="what type of goal is this?"
        note="main goals (up to 3) can earn coins!"
        buttons={[
          { label: 'side', onPress: () => onGoalType('side') },
          { label: 'main', onPress: () => onGoalType('main') },
        ]}
      />
      <ConfirmModal visible={showOops} title="Oops!"
        body="You've reached the limit of 3 main habits. Delete existing main habits to make space or add a custom habit!"
        buttons={[{ label: 'got it', onPress: () => setShowOops(false) }]}
      />
      <ConfirmModal visible={showNewHabit} title="New habit"
        body={`Add "${pendingLib.current}" to habit list?`}
        buttons={[
          { label: 'cancel', onPress: () => setShowNewHabit(false) },
          { label: 'yes',    onPress: confirmAdd },
        ]}
      />
      <ConfirmModal visible={showExit} title="Exit without saving?"
        buttons={[
          { label: "don't save",   onPress: () => { setShowExit(false); onDismiss(); } },
          { label: 'save and exit', onPress: () => { setShowExit(false); doSave(onDismiss); } },
        ]}
      />
    </View>
  );
}

// ─── MAIN SCREEN ─────────────────────────────────────────────────────────────
export default function HabitsScreen({
  navigation,
  habits: propHabits = DEFAULT_HABITS,
  onHabitsChange,
  playerCoins = 0,
  playerXP    = 0,
  onAddCoins  = () => {},
}: Props) {
  const { width: SW } = useWindowDimensions();

  useEffect(() => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    return () => { ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.DEFAULT); };
  }, []);

  const [habits, setHabits]           = useState<Habit[]>(propHabits);
  const [selId, setSelId]             = useState(propHabits[0]?.id ?? '');
  const [checkedMap, setCheckedMap]   = useState<Record<string,CheckedEntry>>({});
  const [coins, setCoins]             = useState(playerCoins);
  const [editOpen, setEditOpen]       = useState(false);
  const [showPhoto, setShowPhoto]     = useState(false);
  const [showSkip, setShowSkip]       = useState(false);
  const [flyCoins, setFlyCoins]       = useState<any[]>([]);
  const [toastAmt, setToastAmt]       = useState(0);

  // Pending habit stored in ref — never stale in async callbacks
  const pendingHabit = useRef<Habit | null>(null);

  const todayRef    = useRef<View | null>(null);
  const pillRef     = useRef<View | null>(null);
  const rootRef     = useRef<View | null>(null);

  const toastY   = useRef(new Animated.Value(0)).current;
  const toastOpa = useRef(new Animated.Value(0)).current;

  // Calendar drag
  const calAnim = useRef(new Animated.Value(0)).current;
  const fullRef = useRef(false);
  const calW    = calAnim.interpolate({ inputRange:[0,1], outputRange:[CAL_COLLAPSED, SW], extrapolate:'clamp' });

  const pan = useRef(PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 6,
    onPanResponderMove: (_, g) => {
      const drag = -g.dx, base = fullRef.current ? 1 : 0;
      calAnim.setValue(Math.max(0, Math.min(1, base + drag / (SW - CAL_COLLAPSED))));
    },
    onPanResponderRelease: (_, g) => {
      const go = fullRef.current ? -g.dx > -DRAG_THRESH : -g.dx > DRAG_THRESH;
      fullRef.current = go;
      Animated.spring(calAnim, { toValue: go ? 1 : 0, useNativeDriver: false, bounciness: 4, speed: 16 }).start();
    },
  })).current;

  const selHabit = habits.find(h => h.id === selId) ?? habits[0];

  // ── coin animation ──
  const animateCoins = (amount: number) => {
    const measure = (r: React.MutableRefObject<View|null>) =>
      new Promise<{x:number;y:number;w:number;h:number}>(res =>
        r.current?.measureInWindow((x,y,w,h) => res({x,y,w,h})));
    Promise.all([measure(todayRef as any), measure(pillRef as any), measure(rootRef as any)])
      .then(([cell, pill, root]) => {
        const sx = cell.x - root.x + cell.w/2 - 10;
        const sy = cell.y - root.y + cell.h/2 - 10;
        const ex = pill.x - root.x + pill.w/2 - 10;
        const ey = pill.y - root.y + pill.h/2 - 10;
        setFlyCoins(Array.from({length:5},(_,i)=>({
          id: Date.now()+i,
          sx: sx+(Math.random()-.5)*24, sy: sy+(Math.random()-.5)*24,
          ex, ey, delay: i*60,
        })));
        setTimeout(() => {
          setFlyCoins([]);
          setCoins(p => p + amount);
          onAddCoins(amount);
          setToastAmt(amount);
          toastY.setValue(0); toastOpa.setValue(1);
          Animated.parallel([
            Animated.timing(toastY,   { toValue:-20, duration:700, useNativeDriver:true }),
            Animated.sequence([Animated.delay(400), Animated.timing(toastOpa, { toValue:0, duration:300, useNativeDriver:true })]),
          ]).start();
        }, 5*60+520);
      });
  };

  // ── complete habit ──
  const completeHabit = (habit: Habit, uri: string|null) => {
    setCheckedMap(prev => ({ ...prev, [habit.id]: { photoUri: uri } }));
    pendingHabit.current = null;
    if (habit.coins) animateCoins(habit.coins);
  };

  const onCheck = (habit: Habit) => { pendingHabit.current = habit; setShowPhoto(true); };

  const handleCamera = async () => {
    setShowPhoto(false);
    const h = pendingHabit.current; if (!h) return;
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') { Alert.alert('Camera permission needed'); return; }
      const r = await ImagePicker.launchCameraAsync({ quality:0.6, allowsEditing:true, aspect:[1,1] });
      if (!r.canceled && r.assets?.[0]) completeHabit(h, r.assets[0].uri);
    } catch(e) { console.error(e); }
  };

  const handleGallery = async () => {
    setShowPhoto(false);
    const h = pendingHabit.current; if (!h) return;
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') { Alert.alert('Gallery permission needed'); return; }
      const r = await ImagePicker.launchImageLibraryAsync({ quality:0.6, allowsEditing:true, aspect:[1,1] });
      if (!r.canceled && r.assets?.[0]) completeHabit(h, r.assets[0].uri);
    } catch(e) { console.error(e); }
  };

  const handleSkip    = () => { setShowPhoto(false); setShowSkip(true); };
  const confirmSkip   = () => { setShowSkip(false); const h=pendingHabit.current; if(h) completeHabit(h,null); };
  const cancelSkip    = () => { setShowSkip(false); pendingHabit.current=null; };

  const onHabitsSaved = (updated: Habit[]) => {
    setHabits(updated);
    onHabitsChange?.(updated);
    if (!updated.find(h => h.id === selId)) setSelId(updated[0]?.id ?? '');
  };

  return (
    <View ref={rootRef} style={{flex:1}}>
      <SafeAreaView style={s.safe}>
        <View style={s.screen}>

          {/* LEFT */}
          <View style={s.left}>
            <View style={s.header}>
              <BackBtn onPress={() => navigation?.goBack?.()} />
              <View ref={pillRef}><StatsPill coins={coins} xp={playerXP} /></View>
              <Text style={s.title}>Habits</Text>
              <Animated.Text style={[s.toast,{transform:[{translateY:toastY}],opacity:toastOpa}]}>+{toastAmt}</Animated.Text>
            </View>

            <ScrollView style={s.listScroll} contentContainerStyle={s.listContent}
              showsVerticalScrollIndicator indicatorStyle="black">
              {habits.map(h => (
                <HabitRow key={h.id} habit={h}
                  selected={h.id === selId} checked={!!checkedMap[h.id]}
                  onSelect={setSelId} onCheck={onCheck} />
              ))}
            </ScrollView>

            <View style={s.editBtnWrap}>
              <TouchableOpacity activeOpacity={0.85} onPress={() => setEditOpen(true)}>
                <View style={ButtonStyles.wrapper}>
                  <View style={ButtonStyles.popupPrimaryShadow} />
                  <View style={ButtonStyles.popupPrimary}>
                    <Text style={ButtonStyles.popupPrimaryText}>edit</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* CALENDAR — animated width, fills full screen when expanded */}
          <Animated.View style={[s.calWrap, { width: calW }]} {...pan.panHandlers}>
            <View style={s.dragEdge} pointerEvents="none" />
            <ProgressCalendar
              key={selId}
              habit={selHabit}
              checkedMap={checkedMap}
              todayRef={el => { (todayRef as any).current = el; }}
            />
          </Animated.View>

          {flyCoins.map(c => (
            <FlyingCoin key={c.id} sx={c.sx} sy={c.sy} ex={c.ex} ey={c.ey} delay={c.delay} />
          ))}
        </View>
      </SafeAreaView>

      {editOpen && (
        <EditScreen
          initialHabits={habits}
          onSave={onHabitsSaved}
          onDismiss={() => setEditOpen(false)}
        />
      )}

      <PhotoModal
        visible={showPhoto}
        habitName={pendingHabit.current?.label ?? ''}
        onCamera={handleCamera} onGallery={handleGallery} onSkip={handleSkip}
      />
      <ConfirmModal visible={showSkip} title="skip the photo?"
        body="Are you sure you want to skip adding a photo?"
        buttons={[{ label:'no', onPress:cancelSkip }, { label:'yes', onPress:confirmSkip }]}
      />
    </View>
  );
}

// ─── FLYING COIN ─────────────────────────────────────────────────────────────
function FlyingCoin({ sx, sy, ex, ey, delay }: { sx:number;sy:number;ex:number;ey:number;delay:number }) {
  const pos = useRef(new Animated.ValueXY({ x:sx, y:sy })).current;
  const opa = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    const t = setTimeout(() => {
      Animated.parallel([
        Animated.timing(pos, { toValue:{x:ex,y:ey}, duration:500, useNativeDriver:true }),
        Animated.timing(opa, { toValue:0, duration:500, useNativeDriver:true }),
      ]).start();
    }, delay);
    return () => clearTimeout(t);
  }, []);
  return (
    <Animated.View style={[s.flyingCoin,{transform:[{translateX:pos.x},{translateY:pos.y}],opacity:opa}]}>
      <Text style={s.flyingCoinTxt}>¢</Text>
    </Animated.View>
  );
}

// ─── STYLES ──────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  safe:   { flex:1, backgroundColor:Colors.background },
  screen: { flex:1, flexDirection:'row', backgroundColor:Colors.background },

  left:   { flex:1, minWidth:0, paddingHorizontal:Spacing.md, paddingTop:Spacing.sm, paddingBottom:Spacing.sm },
  header: { flexDirection:'row', alignItems:'center', gap:Spacing.sm, marginBottom:Spacing.sm },
  title:  { fontFamily:FontFamily.pixelBold, fontSize:FontSize.xl, color:Colors.textGreen, marginLeft:Spacing.xs },
  backChevron: { fontFamily:FontFamily.pixelBold, fontSize:FontSize.lg, color:Colors.offWhite },
  toast:  { position:'absolute', top:0, left:60, fontFamily:FontFamily.pixelBold, fontSize:FontSize.sm, color:Colors.yellowCoin },

  statsPill:   { backgroundColor:Colors.offWhite, borderRadius:Radius.md, borderWidth:2.5, borderColor:Colors.greenOutline, paddingHorizontal:Spacing.sm, paddingVertical:Spacing.xs+2, flexDirection:'row', alignItems:'center', gap:Spacing.xs+2 },
  statsRow:    { flexDirection:'row', alignItems:'center', gap:Spacing.xs },
  statsSep:    { width:1.5, height:16, backgroundColor:Colors.lightGrey, borderRadius:1 },
  statsCoinVal:{ fontFamily:FontFamily.pixelBold, fontSize:FontSize.sm, color:Colors.textDark, width:44 },
  statsXpVal:  { fontFamily:FontFamily.pixelBold, fontSize:FontSize.sm, color:Colors.textDark, width:52 },
  xpLbl:       { fontFamily:FontFamily.pixelBold, fontSize:FontSize.xs, color:Colors.purple },
  coinDot:     { width:16, height:16, borderRadius:8, backgroundColor:Colors.yellowCoin, borderWidth:1.5, borderColor:Colors.orange },
  coinImg16:   { width:16, height:16 },

  listScroll:  { flex:1 },
  listContent: { gap:Spacing.sm, paddingBottom:Spacing.sm, paddingRight:Spacing.xs },
  habitRow:    { flexDirection:'row', alignItems:'center', gap:Spacing.xs+2 },
  checkbox:    { width:22, height:22, borderRadius:Radius.sm, borderWidth:2.5, borderColor:Colors.greenOutline, backgroundColor:Colors.offWhite, alignItems:'center', justifyContent:'center' },
  checkboxOn:  { backgroundColor:Colors.greenButton, borderColor:Colors.greenButton },
  checkmark:   { color:Colors.offWhite, fontSize:13, fontFamily:FontFamily.pixel },
  pill:        { flex:1, backgroundColor:Colors.textbox, borderRadius:Radius.full, borderWidth:2.5, borderColor:Colors.greenOutline, paddingVertical:Spacing.xs+8, paddingHorizontal:Spacing.md, justifyContent:'center' },
  pillSelected:{ borderColor:Colors.purple },
  pillText:    { fontFamily:FontFamily.handwriting, fontSize:FontSize.md, color:Colors.textGreen },
  coinBadge:   { width:COIN_W, flexDirection:'row', alignItems:'center', gap:4 },
  coinAmt:     { fontFamily:FontFamily.pixel, fontSize:FontSize.sm, color:Colors.textMid },
  editBtnWrap: { alignItems:'center', paddingTop:Spacing.sm },

  // Calendar — position absolute so it truly overlays and fills the screen
  calWrap:  { position:'absolute', top:0, right:0, bottom:0, backgroundColor:Colors.offWhite, borderLeftWidth:2, borderLeftColor:Colors.greenOutline, overflow:'hidden' },
  dragEdge: { position:'absolute', left:0, top:0, bottom:0, width:5, backgroundColor:Colors.greenOutline, opacity:0.12, zIndex:10 },
  calPanel: { flex:1, paddingTop:Spacing.md, paddingHorizontal:Spacing.md },
  calTitle: { fontFamily:FontFamily.pixelBold, fontSize:FontSize.lg, color:Colors.textGreen, marginBottom:Spacing.sm, textAlign:'center' },
  calNameBox:{ backgroundColor:Colors.textbox, borderRadius:Radius.sm, borderWidth:1.5, borderColor:Colors.greenOutline, paddingVertical:Spacing.sm, paddingHorizontal:Spacing.sm, marginBottom:Spacing.sm, alignItems:'center' },
  calName:  { fontFamily:FontFamily.pixel, fontSize:FontSize.md, color:Colors.textGreen, textAlign:'center' },
  calScroll:{ flex:1 },

  monthBlock:{ marginBottom:Spacing.lg },
  monthLabel:{ fontFamily:FontFamily.pixelBold, fontSize:FontSize.sm, color:Colors.textGreen, textAlign:'center', marginBottom:Spacing.xs },
  calGrid:   { flexDirection:'row', flexWrap:'wrap', marginTop:Spacing.xs },
  dayHdr:    { width:'14.28%', textAlign:'center', fontFamily:FontFamily.pixelBold, fontSize:FontSize.xs, color:Colors.textGreen, paddingBottom:2 },
  cell:      { width:'14.28%', aspectRatio:1, alignItems:'center', justifyContent:'center', borderRadius:Radius.sm, overflow:'hidden' },
  cellToday: { backgroundColor:Colors.greenButton },
  cellDone:  { backgroundColor:Colors.greenButton },
  cellTxt:   { fontFamily:FontFamily.pixel, fontSize:FontSize.xs, color:Colors.textGreen, zIndex:2 },
  cellTxtLight:{ color:Colors.offWhite },
  cellTxtPhoto:{ color:'rgba(255,255,255,0.6)', fontSize:8 },

  flyingCoin:   { position:'absolute', width:20, height:20, borderRadius:10, backgroundColor:Colors.yellowCoin, borderWidth:2, borderColor:Colors.orange, alignItems:'center', justifyContent:'center' },
  flyingCoinTxt:{ fontSize:9, fontFamily:FontFamily.pixelBold, color:Colors.darkBrown },

  photoBox:     { backgroundColor:Colors.offWhite, borderRadius:Radius.xl, borderWidth:3, borderColor:Colors.greenOutline, overflow:'hidden', width:'55%' },
  photoNameRow: { paddingVertical:Spacing.sm, paddingHorizontal:Spacing.lg, alignItems:'center', justifyContent:'center' },
  photoName:    { fontFamily:FontFamily.handwriting, fontSize:FontSize.md, fontWeight:'700', color:Colors.textGreen, textAlign:'center' },
  photoItem:    { paddingVertical:Spacing.md, paddingHorizontal:Spacing.lg, alignItems:'center', justifyContent:'center' },
  photoItemTxt: { fontFamily:FontFamily.pixelBold, fontSize:FontSize.lg, color:Colors.textGreen },
  photoDivider: { height:1.5, backgroundColor:Colors.greenOutline },

  confirmBox:  { backgroundColor:Colors.offWhite, borderRadius:Radius.xl, borderWidth:3, borderColor:Colors.greenOutline, padding:Spacing.md, width:'55%', alignItems:'center', gap:Spacing.xs+2 },
  confirmTitle:{ fontFamily:FontFamily.pixelBold, fontSize:FontSize.lg, color:Colors.textGreen, textAlign:'center' },
  confirmBody: { fontFamily:FontFamily.pixel, fontSize:FontSize.sm, color:Colors.textGreen, textAlign:'center', lineHeight:18 },
  confirmNote: { fontFamily:FontFamily.pixel, fontSize:FontSize.xs, color:Colors.textMid, textAlign:'center', fontStyle:'italic' },
  confirmRow:  { flexDirection:'row', gap:Spacing.sm, flexWrap:'wrap', justifyContent:'center' },

  editScreen:  { position:'absolute', top:0, left:0, right:0, bottom:0, backgroundColor:Colors.background, flexDirection:'row', zIndex:30 },
  editLeft:    { flex:1, minWidth:0, padding:Spacing.md, flexDirection:'column' },
  editHeader:  { flexDirection:'row', alignItems:'center', gap:Spacing.sm, marginBottom:Spacing.sm },
  editTitle:   { fontFamily:FontFamily.pixelBold, fontSize:FontSize.xl, color:Colors.textGreen },
  editListWrap:{ flex:1, minHeight:0 },
  editScroll:  { flex:1 },
  editRow:     { flexDirection:'row', alignItems:'center', gap:Spacing.xs+2 },
  editPill:    { flex:1, backgroundColor:Colors.textbox, borderRadius:Radius.full, borderWidth:2.5, borderColor:Colors.greenOutline, paddingVertical:Spacing.xs+8, paddingHorizontal:Spacing.md, justifyContent:'center' },
  editPillTxt: { fontFamily:FontFamily.handwriting, fontSize:FontSize.md, color:Colors.textGreen },
  editCoinBadge:{ width:40, flexDirection:'row', alignItems:'center', gap:3 },
  editCoinAmt: { fontFamily:FontFamily.pixel, fontSize:FontSize.xs, color:Colors.textMid },
  delBtn:      { width:28, height:28, borderRadius:Radius.sm, borderWidth:2, borderColor:Colors.darkGreenShadow, backgroundColor:Colors.greenButton, alignItems:'center', justifyContent:'center' },
  delBtnTxt:   { fontSize:11, color:Colors.offWhite, fontFamily:FontFamily.pixelBold },
  customRow:   { paddingTop:Spacing.xs, flexDirection:'row', alignItems:'center' },
  customPill:  { flex:1, backgroundColor:Colors.textbox, borderRadius:Radius.full, borderWidth:2, borderColor:Colors.greenOutline, borderStyle:'dashed', paddingVertical:Spacing.xs+1, paddingHorizontal:Spacing.md },
  customInput: { fontFamily:FontFamily.handwriting, fontSize:FontSize.md, color:Colors.textGreen },
  saveBtnWrap: { alignItems:'center', paddingTop:Spacing.sm },

  editRight:      { width:220, borderLeftWidth:2, borderLeftColor:Colors.greenOutline, backgroundColor:Colors.offWhite, padding:Spacing.md, position:'relative' },
  editRightTitle: { fontFamily:FontFamily.pixelBold, fontSize:FontSize.md, color:Colors.textGreen, textAlign:'center', marginBottom:Spacing.sm },
  libSearchRow:   { flexDirection:'row', alignItems:'center', gap:Spacing.xs, marginBottom:Spacing.sm },
  libSearchWrap:  { flex:1, backgroundColor:Colors.greyOutLight, borderRadius:Radius.full, paddingHorizontal:Spacing.sm, paddingVertical:Spacing.xs },
  libSearchInput: { fontFamily:FontFamily.pixel, fontSize:FontSize.xs, color:Colors.textGreen, paddingVertical:0 },
  libFilterBtn:   { width:28, height:28, alignItems:'center', justifyContent:'center' },
  libFilterCircle:       { width:22, height:22, borderRadius:11, borderWidth:2, borderColor:Colors.greenOutline, alignItems:'center', justifyContent:'center', gap:2 },
  libFilterCircleActive: { borderColor:Colors.orange },
  libFilterLine:  { width:12, height:2, backgroundColor:Colors.greenOutline, borderRadius:2 },
  libRow:         { paddingVertical:8, paddingHorizontal:4, flexDirection:'row', alignItems:'center', justifyContent:'space-between' },
  libRowAdded:    { opacity:0.4 },
  libRowTxt:      { fontFamily:FontFamily.handwriting, fontSize:FontSize.sm, color:Colors.textGreen },
  libSep:         { height:1.5, backgroundColor:Colors.greenOutline, opacity:0.2 },
  libEmpty:       { fontFamily:FontFamily.pixel, fontSize:FontSize.xs, color:Colors.textGreen, textAlign:'center', paddingTop:Spacing.md, opacity:0.6 },
  libCheck:       { fontSize:11, color:Colors.textGreen },
  libCat:         { fontFamily:FontFamily.pixelBold, fontSize:FontSize.xs, color:Colors.textGreen, paddingVertical:4, paddingHorizontal:4, opacity:0.7 },
  libFilterOverlay:{ position:'absolute', top:0, left:0, right:0, bottom:0, backgroundColor:'rgba(255,250,241,0.97)', zIndex:20, padding:Spacing.sm },
  libFilterPopup:  { flex:1 },
  libFilterHeader: { flexDirection:'row', alignItems:'center', gap:Spacing.xs, marginBottom:Spacing.sm },
  libFilterClose:  { fontFamily:FontFamily.pixelBold, fontSize:FontSize.md, color:Colors.orange, paddingHorizontal:4 },
  libFilterTitle:  { fontFamily:FontFamily.pixelBold, fontSize:FontSize.sm, color:Colors.textGreen },
  libFilterBody:   { gap:Spacing.sm, paddingLeft:4, marginBottom:Spacing.md },
  libFilterRow:    { flexDirection:'row', alignItems:'center', gap:Spacing.sm },
  libCheckbox:     { width:14, height:14, borderWidth:2, borderColor:Colors.greenOutline, backgroundColor:Colors.transparent },
  libCheckboxOn:   { backgroundColor:Colors.greenOutline },
  libFilterRowTxt: { fontFamily:FontFamily.pixel, fontSize:FontSize.sm, color:Colors.textGreen },
  libFilterFooter: { alignItems:'flex-end' },

  saveOverlay: { position:'absolute', top:0, left:0, right:0, bottom:0, backgroundColor:'rgba(43,26,14,0.5)', alignItems:'center', justifyContent:'center', zIndex:80, gap:Spacing.sm },
  saveLabel:   { fontFamily:FontFamily.pixelBold, fontSize:FontSize.md, color:Colors.offWhite },
  saveBg:      { width:200, height:14, backgroundColor:'rgba(255,255,255,0.2)', borderRadius:999, overflow:'hidden', borderWidth:1.5, borderColor:'rgba(255,255,255,0.3)' },
  saveBar:     { height:14, backgroundColor:Colors.yellowCoin, borderRadius:999 },
});
