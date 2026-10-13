'use client';
import { useLang } from '@/lib/i18n/useLang';

export default function LanguageSwitcher() {
  const { lang, setLang, langs } = useLang();
  return (
    <select
      value={lang}
      onChange={(e) => setLang(e.target.value as any)}
      className="text-sm border border-gray-300 rounded-lg px-2 py-1.5 bg-white"
    >
      {langs.map((l) => (
        <option key={l.code} value={l.code}>{l.native}</option>
      ))}
    </select>
  );
}
