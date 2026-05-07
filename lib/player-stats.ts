import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useMemo, useState } from 'react';

const COINS_KEY = 'userCoins';
const XP_KEY = 'userXP';

function toInt(value: string | null) {
  if (value == null) return null;
  const parsed = parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : null;
}

export async function getStoredCoins() {
  return toInt(await AsyncStorage.getItem(COINS_KEY)) ?? 0;
}

export async function getStoredXP() {
  return toInt(await AsyncStorage.getItem(XP_KEY)) ?? 0;
}

export async function setStoredCoins(coins: number) {
  await AsyncStorage.setItem(COINS_KEY, String(Math.max(0, Math.floor(coins))));
}

export async function setStoredXP(xp: number) {
  await AsyncStorage.setItem(XP_KEY, String(Math.max(0, Math.floor(xp))));
}

export async function incrementStoredCoins(delta: number) {
  const current = await getStoredCoins();
  const next = current + Math.floor(delta);
  await setStoredCoins(next);
  return next;
}

export async function incrementStoredXP(delta: number) {
  const current = await getStoredXP();
  const next = current + Math.floor(delta);
  await setStoredXP(next);
  return next;
}

export function usePlayerStats(initial?: { coins?: number; xp?: number }) {
  const initialCoins = initial?.coins;
  const initialXP = initial?.xp;

  const [loading, setLoading] = useState(true);
  const [coins, setCoinsState] = useState(0);
  const [xp, setXPState] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const storedCoins = toInt(await AsyncStorage.getItem(COINS_KEY));
        const storedXP = toInt(await AsyncStorage.getItem(XP_KEY));

        const nextCoins =
          storedCoins ?? (typeof initialCoins === 'number' ? Math.floor(initialCoins) : 0);
        const nextXP =
          storedXP ?? (typeof initialXP === 'number' ? Math.floor(initialXP) : 0);

        if (storedCoins == null && typeof initialCoins === 'number') {
          await setStoredCoins(nextCoins);
        }
        if (storedXP == null && typeof initialXP === 'number') {
          await setStoredXP(nextXP);
        }

        if (!cancelled) {
          setCoinsState(nextCoins);
          setXPState(nextXP);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [initialCoins, initialXP]);

  const api = useMemo(() => {
    return {
      loading,
      coins,
      xp,
      setCoins: async (next: number) => {
        const val = Math.max(0, Math.floor(next));
        setCoinsState(val);
        await setStoredCoins(val);
      },
      setXP: async (next: number) => {
        const val = Math.max(0, Math.floor(next));
        setXPState(val);
        await setStoredXP(val);
      },
      incrementCoins: async (delta: number) => {
        const next = coins + Math.floor(delta);
        const val = Math.max(0, next);
        setCoinsState(val);
        await setStoredCoins(val);
        return val;
      },
      incrementXP: async (delta: number) => {
        const next = xp + Math.floor(delta);
        const val = Math.max(0, next);
        setXPState(val);
        await setStoredXP(val);
        return val;
      },
    };
  }, [coins, loading, xp]);

  return api;
}

