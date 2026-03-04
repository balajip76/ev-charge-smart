import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import type { EvVehicle, GasVehicle } from '../types';

interface StoredPreferences {
  selectedEvId: string;
  selectedGasId: string;
  monthlyMiles: number;
}

const STORAGE_KEY = 'ev-charge-smart-preferences';
const DEFAULT_MILES = 1000;

export function useVehicleSelection(
  evs: EvVehicle[],
  gasVehicles: GasVehicle[],
) {
  const defaultEvId = evs[0]?.id ?? '';
  const defaultGasId = gasVehicles[0]?.id ?? '';

  const [prefs, setPrefs] = useLocalStorage<StoredPreferences>(STORAGE_KEY, {
    selectedEvId: defaultEvId,
    selectedGasId: defaultGasId,
    monthlyMiles: DEFAULT_MILES,
  });

  // Validate stored IDs still exist in catalog; fall back to defaults
  const selectedEvId = evs.some((v) => v.id === prefs.selectedEvId)
    ? prefs.selectedEvId
    : defaultEvId;
  const selectedGasId = gasVehicles.some((v) => v.id === prefs.selectedGasId)
    ? prefs.selectedGasId
    : defaultGasId;
  const monthlyMiles = prefs.monthlyMiles || DEFAULT_MILES;

  const selectedEv = evs.find((v) => v.id === selectedEvId) ?? evs[0]!;
  const selectedGas =
    gasVehicles.find((v) => v.id === selectedGasId) ?? gasVehicles[0]!;

  const setSelectedEvId = useCallback(
    (id: string) => setPrefs((prev) => ({ ...prev, selectedEvId: id })),
    [setPrefs],
  );

  const setSelectedGasId = useCallback(
    (id: string) => setPrefs((prev) => ({ ...prev, selectedGasId: id })),
    [setPrefs],
  );

  const setMonthlyMiles = useCallback(
    (miles: number) => setPrefs((prev) => ({ ...prev, monthlyMiles: miles })),
    [setPrefs],
  );

  return {
    selectedEv,
    selectedGas,
    selectedEvId,
    selectedGasId,
    monthlyMiles,
    setSelectedEvId,
    setSelectedGasId,
    setMonthlyMiles,
  };
}
