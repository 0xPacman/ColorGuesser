import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Volume2, VolumeX, Vibrate, Eye, EyeOff, Sparkles, Trash2 } from 'lucide-react';
import { getSettings, saveSettings, clearLeaderboard } from '@/utils/storage';

interface SettingsScreenProps {
  onBack: () => void;
}

export function SettingsScreen({ onBack }: SettingsScreenProps) {
  const [settings, setSettings] = useState(getSettings());

  const updateSetting = (key: keyof typeof settings, value: boolean) => {
    const updated = { ...settings, [key]: value };
    setSettings(updated);
    saveSettings(updated);
  };

  const handleClearData = () => {
    if (confirm('Are you sure you want to clear all leaderboard data? This cannot be undone.')) {
      clearLeaderboard();
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={onBack} className="p-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold gradient-text">Settings</h1>
        </div>

        <div className="space-y-4">
          <SettingRow
            icon={settings.soundEnabled ? <Volume2 className="w-5 h-5 text-emerald-400" /> : <VolumeX className="w-5 h-5 text-red-400" />}
            label="Sound Effects"
            description="Play sounds during gameplay"
            enabled={settings.soundEnabled}
            onToggle={() => updateSetting('soundEnabled', !settings.soundEnabled)}
          />

          <SettingRow
            icon={<Vibrate className="w-5 h-5 text-violet-400" />}
            label="Haptics"
            description="Vibration feedback (on supported devices)"
            enabled={settings.hapticsEnabled}
            onToggle={() => updateSetting('hapticsEnabled', !settings.hapticsEnabled)}
          />

          <SettingRow
            icon={settings.showHints ? <Eye className="w-5 h-5 text-blue-400" /> : <EyeOff className="w-5 h-5 text-white/40" />}
            label="Warmth Hints"
            description="Show &quot;warm/cold&quot; hints after guesses"
            enabled={settings.showHints}
            onToggle={() => updateSetting('showHints', !settings.showHints)}
          />

          <SettingRow
            icon={<Sparkles className="w-5 h-5 text-yellow-400" />}
            label="Animations"
            description="Enable animations and particle effects"
            enabled={settings.animationsEnabled}
            onToggle={() => updateSetting('animationsEnabled', !settings.animationsEnabled)}
          />

          <div className="pt-6 border-t border-white/10">
            <button
              onClick={handleClearData}
              className="w-full glass-card p-4 flex items-center gap-3 text-red-400 hover:bg-red-400/10 transition-colors"
            >
              <Trash2 className="w-5 h-5" />
              <div className="text-left">
                <p className="font-semibold">Clear All Data</p>
                <p className="text-xs text-red-400/60">Reset leaderboard and all progress</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SettingRow({ icon, label, description, enabled, onToggle }: {
  icon: React.ReactNode;
  label: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="glass-card p-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
          {icon}
        </div>
        <div>
          <p className="font-semibold text-white">{label}</p>
          <p className="text-xs text-white/50">{description}</p>
        </div>
      </div>
      <button
        onClick={onToggle}
        className={`relative w-12 h-7 rounded-full transition-colors ${
          enabled ? 'bg-emerald-500/30' : 'bg-white/10'
        }`}
      >
        <motion.div
          animate={{ x: enabled ? 20 : 2 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className={`absolute top-1 w-5 h-5 rounded-full shadow-md ${
            enabled ? 'bg-emerald-400' : 'bg-white/60'
          }`}
        />
      </button>
    </div>
  );
}
