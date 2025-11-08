"use client";

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

interface FeedPreferences {
  algorithm: 'latest' | 'popular';
  showProjects: boolean;
  showTeams: boolean;
  showCars: boolean;
  hideSponsored: boolean;
  language: 'tr' | 'en';
}

const DEFAULT_PREFS: FeedPreferences = {
  algorithm: 'latest',
  showProjects: true,
  showTeams: true,
  showCars: true,
  hideSponsored: false,
  language: 'tr',
};

export default function FeedSettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [prefs, setPrefs] = useState<FeedPreferences>(DEFAULT_PREFS);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, router]);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/feed/preferences');
        if (!res.ok) throw new Error('Failed to fetch preferences');
        const json = await res.json();
        setPrefs(json.preferences || DEFAULT_PREFS);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function save() {
    setSaving(true); setError(null); setSaved(false);
    try {
      const res = await fetch('/api/feed/preferences', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(prefs) });
      if (!res.ok) throw new Error('Save failed');
      setSaved(true);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
      setTimeout(() => setSaved(false), 3000);
    }
  }

  function toggle<K extends keyof FeedPreferences>(key: K) {
    setPrefs(prev => ({ ...prev, [key]: typeof prev[key] === 'boolean' ? !prev[key] : prev[key] }));
  }

  if (loading) return <div className="p-8 text-white">Yükleniyor...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-r from-slate-800 to-emerald-900 p-6">
      <div className="max-w-3xl mx-auto bg-black/30 backdrop-blur-lg rounded-xl p-6 border border-white/10">
        <h1 className="text-3xl font-bold text-white mb-6">Feed Ayarları</h1>
        {error && <div className="mb-4 text-red-400">Hata: {error}</div>}

        <div className="space-y-6">
          <section>
            <h2 className="text-xl font-semibold text-white mb-2">Algoritma</h2>
            <div className="flex gap-4">
              {['latest','popular'].map(opt => (
                <button key={opt} onClick={() => setPrefs(p => ({ ...p, algorithm: opt as FeedPreferences['algorithm'] }))} className={`px-4 py-2 rounded-md border ${prefs.algorithm === opt ? 'bg-emerald-600 border-emerald-500 text-white' : 'bg-slate-700 border-slate-600 text-gray-200'}`}>{opt === 'latest' ? 'En Yeni' : 'Popüler'}</button>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-2">İçerik Görünürlüğü</h2>
            <div className="space-y-2">
              <ToggleRow label="Projeleri Göster" value={prefs.showProjects} onClick={() => toggle('showProjects')} />
              <ToggleRow label="Takımları Göster" value={prefs.showTeams} onClick={() => toggle('showTeams')} />
              <ToggleRow label="Arabaları Göster" value={prefs.showCars} onClick={() => toggle('showCars')} />
              <ToggleRow label="Sponsorlu İçeriği Gizle" value={prefs.hideSponsored} onClick={() => toggle('hideSponsored')} />
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-2">Dil</h2>
            <div className="flex gap-4">
              {['tr','en'].map(lang => (
                <button key={lang} onClick={() => setPrefs(p => ({ ...p, language: lang as FeedPreferences['language'] }))} className={`px-4 py-2 rounded-md border ${prefs.language === lang ? 'bg-emerald-600 border-emerald-500 text-white' : 'bg-slate-700 border-slate-600 text-gray-200'}`}>{lang.toUpperCase()}</button>
              ))}
            </div>
          </section>
        </div>

        <div className="mt-8 flex items-center gap-4">
          <Button disabled={saving} onClick={save} className="bg-emerald-600 hover:bg-emerald-700">
            {saving ? 'Kaydediliyor...' : 'Kaydet'}
          </Button>
          {saved && <span className="text-emerald-400">Kaydedildi!</span>}
        </div>
      </div>
    </div>
  );
}

function ToggleRow({ label, value, onClick }: { label: string; value: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className="w-full flex items-center justify-between px-4 py-2 rounded-md bg-slate-700 hover:bg-slate-600 text-gray-100 border border-slate-600">
      <span>{label}</span>
      <span className={`inline-block w-10 h-5 rounded-full transition-colors ${value ? 'bg-emerald-500' : 'bg-gray-500'}`}></span>
    </button>
  );
}
