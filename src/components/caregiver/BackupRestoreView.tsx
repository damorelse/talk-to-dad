import React, { useState } from 'react';
import { backupService } from '../../services/db/backupService';
import { DebouncedTouchable } from '../common/DebouncedTouchable';
import { Download, Upload, RotateCcw, CheckCircle2, AlertTriangle } from 'lucide-react';

interface BackupRestoreViewProps {
  onDataChanged: () => void;
}

export const BackupRestoreView: React.FC<BackupRestoreViewProps> = ({ onDataChanged }) => {
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleExport = async () => {
    try {
      setIsProcessing(true);
      const json = await backupService.exportToJsonString();
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);

      const dateStr = new Date().toISOString().slice(0, 10);
      const filename = `talkwithdad-backup-${dateStr}.talkwithdad`;

      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setStatusMessage({
        type: 'success',
        text: `Export successful! Saved as "${filename}".`,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setStatusMessage({ type: 'error', text: `Export failed: ${msg}` });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const text = event.target?.result as string;
        const result = await backupService.importFromJson(text);
        if (result.success) {
          setStatusMessage({ type: 'success', text: result.message });
          onDataChanged();
        } else {
          setStatusMessage({ type: 'error', text: result.message });
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        setStatusMessage({ type: 'error', text: `Import failed: ${msg}` });
      } finally {
        setIsProcessing(false);
      }
    };
    reader.readAsText(file);
  };

  const handleFactoryReset = async () => {
    const confirmed = window.confirm(
      'WARNING: Are you sure you want to reset all AAC cards, scenes, and settings back to factory clinical defaults? This will erase custom cards.'
    );
    if (!confirmed) return;

    try {
      setIsProcessing(true);
      await backupService.factoryReset();
      setStatusMessage({
        type: 'success',
        text: 'Factory reset completed successfully. Starter AAC vocabulary restored.',
      });
      onDataChanged();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setStatusMessage({ type: 'error', text: `Factory reset failed: ${msg}` });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-4 max-w-2xl mx-auto select-none p-1">
      {statusMessage && (
        <div
          className={`
            w-full p-4 rounded-2xl border flex items-center gap-3 text-sm font-bold shadow-md
            ${
              statusMessage.type === 'success'
                ? 'bg-emerald-950/70 border-emerald-500 text-emerald-200'
                : 'bg-rose-950/70 border-rose-500 text-rose-200'
            }
          `}
        >
          {statusMessage.type === 'success' ? (
            <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
          ) : (
            <AlertTriangle className="w-6 h-6 text-rose-400 shrink-0" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* 1-Click JSON Export Card */}
      <div className="bg-slate-900 border-2 border-slate-700 rounded-3xl p-5 flex flex-col gap-3 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/50 flex items-center justify-center text-blue-400 shrink-0">
            <Download className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-white">1-Click Full Backup (.talkwithdad)</h3>
            <p className="text-xs text-slate-400">
              Exports all AAC cards, categories, visual scenes, recorded voice clips, and settings into a single file.
            </p>
          </div>
        </div>

        <DebouncedTouchable
          onPress={handleExport}
          disabled={isProcessing}
          minTouchSize="lg"
          className="w-full bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white py-3.5 rounded-2xl font-black flex items-center justify-center gap-2 shadow-lg shadow-blue-900/40 text-base"
        >
          <Download className="w-5 h-5 stroke-[2.5]" />
          <span>Download .talkwithdad Backup File</span>
        </DebouncedTouchable>
      </div>

      {/* Restore Backup Card */}
      <div className="bg-slate-900 border-2 border-slate-700 rounded-3xl p-5 flex flex-col gap-3 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600/20 border border-emerald-500/50 flex items-center justify-center text-emerald-400 shrink-0">
            <Upload className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-white">Restore Backup</h3>
            <p className="text-xs text-slate-400">
              Upload a previously saved `.talkwithdad` or `.json` configuration file to restore cards and voice clips.
            </p>
          </div>
        </div>

        <label className="w-full bg-slate-800 hover:bg-slate-700 active:bg-slate-900 text-slate-200 py-3.5 rounded-2xl font-black flex items-center justify-center gap-2 border-2 border-slate-600 cursor-pointer shadow-md text-base transition-all">
          <Upload className="w-5 h-5" />
          <span>Choose Backup File to Restore</span>
          <input
            type="file"
            accept=".talkwithdad,.json"
            onChange={handleFileUpload}
            disabled={isProcessing}
            className="hidden"
          />
        </label>
      </div>

      {/* Factory Preset Reset Card */}
      <div className="bg-slate-900 border-2 border-rose-900/60 rounded-3xl p-5 flex flex-col gap-3 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-rose-600/20 border border-rose-500/50 flex items-center justify-center text-rose-400 shrink-0">
            <RotateCcw className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-white">Factory Preset Reset</h3>
            <p className="text-xs text-slate-400">
              Restores standard clinical starter categories, 35+ core vocabulary cards, and sample scenes.
            </p>
          </div>
        </div>

        <DebouncedTouchable
          onPress={handleFactoryReset}
          disabled={isProcessing}
          minTouchSize="md"
          className="w-full bg-rose-950/70 hover:bg-rose-900 active:bg-rose-950 text-rose-300 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 border border-rose-800 shadow-md text-sm"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset to Factory Defaults</span>
        </DebouncedTouchable>
      </div>
    </div>
  );
};
