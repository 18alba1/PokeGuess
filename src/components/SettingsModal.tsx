import { Modal } from './Modal';
import type { AppSettings, ThemePreference } from '../types/game';

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
  settings: AppSettings;
  onUpdateTheme: (t: ThemePreference) => void;
  onToggleColorblind: () => void;
  onToggleReducedMotion: () => void;
  onToggleSound: () => void;
}

export function SettingsModal({
  open,
  onClose,
  settings,
  onUpdateTheme,
  onToggleColorblind,
  onToggleReducedMotion,
  onToggleSound,
}: SettingsModalProps) {
  return (
    <Modal open={open} onClose={onClose} title="Settings">
      <div className="flex flex-col gap-5">
        {/* Theme */}
        <SettingRow label="Theme" description="Choose your preferred color scheme">
          <div className="flex gap-1 rounded-xl p-1" style={{ background: 'var(--bg-secondary)' }}>
            {(['system', 'light', 'dark'] as ThemePreference[]).map((t) => (
              <button
                key={t}
                onClick={() => onUpdateTheme(t)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition-all ${
                  settings.theme === t ? 'bg-poke-yellow text-navy-950 shadow' : ''
                }`}
                style={settings.theme === t ? undefined : { color: 'var(--text-secondary)' }}
                aria-pressed={settings.theme === t}
              >
                {t}
              </button>
            ))}
          </div>
        </SettingRow>

        <Divider />

        {/* Colorblind mode */}
        <SettingRow label="Colorblind Mode" description="Adds icons and patterns so clues don't rely on color alone">
          <Toggle on={settings.colorblindMode} onToggle={onToggleColorblind} label="Toggle colorblind mode" />
        </SettingRow>

        <Divider />

        {/* Reduced motion */}
        <SettingRow label="Reduced Motion" description="Minimize animations and transitions">
          <Toggle on={settings.reducedMotion} onToggle={onToggleReducedMotion} label="Toggle reduced motion" />
        </SettingRow>

        <Divider />

        {/* Sound */}
        <SettingRow label="Sound Effects" description="Play sounds on guess and reveal (coming soon)">
          <Toggle on={settings.sound} onToggle={onToggleSound} label="Toggle sound" />
        </SettingRow>
      </div>
    </Modal>
  );
}

function SettingRow({ label, description, children }: { label: string; description: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-bold" style={{ color: 'var(--text)' }}>{label}</span>
        <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{description}</span>
      </div>
      {children}
    </div>
  );
}

function Divider() {
  return <div className="h-px" style={{ background: 'var(--border)' }} />;
}

function Toggle({ on, onToggle, label }: { on: boolean; onToggle: () => void; label: string }) {
  return (
    <button
      onClick={onToggle}
      role="switch"
      aria-checked={on}
      aria-label={label}
      className={`relative h-7 w-12 shrink-0 rounded-full transition-colors duration-200 ${on ? 'bg-poke-yellow' : ''}`}
      style={!on ? { background: 'var(--border)' } : undefined}
    >
      <span
        className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-md transition-all duration-200 ${on ? 'left-6' : 'left-1'}`}
      />
    </button>
  );
}
