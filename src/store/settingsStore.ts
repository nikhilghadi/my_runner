import { create } from 'zustand';
import { PaceAlertConfig } from '../engine/PaceAlertChecker';
import { settingsRepo } from '../db/settingsRepo';

export const DEFAULT_ALERT: PaceAlertConfig = {
  enabled: false,
  fastLimitSec: 330,   // 5:30 /km
  slowLimitSec: 390,   // 6:30 /km
  source: 'average',
};

type SettingsState = {
  loaded: boolean;
  alert: PaceAlertConfig;
  load: () => Promise<void>;
  updateAlert: (patch: Partial<PaceAlertConfig>) => void;
};

export const useSettingsStore = create<SettingsState>((set, get) => ({
  loaded: false,
  alert: DEFAULT_ALERT,

  load: async () => {
    try {
      const raw = await settingsRepo.get('alert');
      if (raw) set({ alert: { ...DEFAULT_ALERT, ...JSON.parse(raw) } });
    } catch (e) {
      console.warn('Could not load settings', e);
    }
    set({ loaded: true });
  },

  updateAlert: (patch) => {
    const alert = { ...get().alert, ...patch };
    set({ alert });
    settingsRepo
      .set('alert', JSON.stringify(alert))
      .catch((e) => console.warn('Could not save settings', e));
  },
}));