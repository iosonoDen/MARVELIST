import * as XLSX from 'xlsx';
import { MCUEntry } from '@/types/mcu';

/**
 * Layout del foglio "MCU":
 *   righe 0-4  intestazioni e metriche
 *   riga 5     intestazioni colonne
 *   righe 6+   dati: ID | Visto | Poster | Titolo | Timeline | Fase | Voto (numero, passi 0.5) | Stelle (solo visuale)
 * L'import legge le colonne per nome di intestazione, quindi tollera colonne spostate.
 */
const COLUMNS = ['ID', 'Visto', 'Poster', 'Titolo', 'Timeline', 'Fase', 'Voto', 'Stelle'] as const;

const starsLabel = (rating: number) => {
  if (rating <= 0) return '';
  const full = Math.floor(rating);
  return '★'.repeat(full) + (rating - full >= 0.5 ? '½' : '');
};

const normalize = (s: unknown) =>
  String(s ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

const clampRating = (n: number) => Math.min(5, Math.max(0, Math.round(n * 2) / 2));

export const exportToMCUExcel = (entries: MCUEntry[], filename = 'MCU-Checklist-Sync.xlsx') => {
  const watchedCount = entries.filter((e) => e.watched).length;
  const totalCount = entries.length;
  const progressRatio = totalCount > 0 ? watchedCount / totalCount : 0;

  const aoa: (string | number | boolean)[][] = [
    [],
    ['', 'MARVEL CINEMATIC UNIVERSE • VISION CHECKLIST'],
    ['', 'PROGRESS', '', '', '', 'COUNTER', '', 'TOTALE'],
    ['', progressRatio, '', '', '', watchedCount, '', totalCount],
    [],
    [...COLUMNS],
    ...entries.map((e) => [e.id, e.watched, '', e.title.en, e.timelineYear, e.phase, e.rating, starsLabel(e.rating)]),
  ];

  const ws = XLSX.utils.aoa_to_sheet(aoa);

  // Formula IMAGE() reale (Excel 365 / Google Sheets) al posto del testo.
  entries.forEach((e, i) => {
    if (!e.posterUrl) return;
    const ref = XLSX.utils.encode_cell({ r: 6 + i, c: 2 });
    ws[ref] = { t: 's', v: '', f: `IMAGE("${e.posterUrl.replace(/"/g, '""')}")` };
  });
  ws['B4'] = { t: 'n', v: progressRatio, z: '0%' };

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'MCU');
  XLSX.writeFile(wb, filename);
};

const parseBool = (v: unknown) => {
  if (typeof v === 'boolean') return v;
  if (typeof v === 'number') return v !== 0;
  return ['true', 'vero', 'si', 'sì', 'x', '1', 'yes'].includes(String(v ?? '').trim().toLowerCase());
};

const parseRating = (numeric: unknown, stars: unknown): number | null => {
  if (numeric !== undefined && numeric !== null && String(numeric).trim() !== '') {
    const n = Number(String(numeric).replace(',', '.'));
    if (Number.isFinite(n)) return clampRating(n);
  }
  const s = String(stars ?? '');
  if (!s) return null;
  // Compatibilità con file vecchi (⭐ ripetute) e nuovi (★ + ½)
  const full = (s.match(/[★⭐]/g) || []).length;
  const half = s.includes('½') ? 0.5 : 0;
  return full + half > 0 ? clampRating(full + half) : null;
};

export interface ImportResult {
  entries: MCUEntry[];
  matched: number;
}

export const parseMCUExcel = async (file: File, baseEntries: MCUEntry[]): Promise<ImportResult> => {
  const buffer = await file.arrayBuffer();
  const wb = XLSX.read(new Uint8Array(buffer), { type: 'array' });
  const sheet = wb.Sheets['MCU'] || wb.Sheets[wb.SheetNames[0]];
  if (!sheet) throw new Error('Nessun foglio trovato');
  const rows = XLSX.utils.sheet_to_json<unknown[]>(sheet, { header: 1, defval: '' });

  // Trova la riga di intestazione (nuovo formato) oppure usa il layout legacy.
  const headerIdx = rows.findIndex((r) => r.some((c) => normalize(c) === 'titolo'));
  let col: Record<string, number>;
  let start: number;
  if (headerIdx >= 0) {
    const h = rows[headerIdx].map(normalize);
    const find = (name: string) => h.indexOf(normalize(name));
    col = { id: find('ID'), watched: find('Visto'), title: find('Titolo'), rating: find('Voto'), stars: find('Stelle') };
    start = headerIdx + 1;
  } else {
    col = { id: -1, watched: 1, title: 3, rating: -1, stars: 6 };
    start = 5;
  }

  const byId = new Map(baseEntries.map((e, i) => [e.id, i]));
  const byTitle = new Map<string, number>();
  baseEntries.forEach((e, i) => {
    byTitle.set(normalize(e.title.en), i);
    byTitle.set(normalize(e.title.it), i);
  });

  const updated = [...baseEntries];
  let matched = 0;

  for (let r = start; r < rows.length; r++) {
    const row = rows[r];
    if (!row || row.every((c) => String(c).trim() === '')) continue;
    const idx =
      (col.id >= 0 ? byId.get(String(row[col.id]).trim()) : undefined) ??
      (col.title >= 0 ? byTitle.get(normalize(row[col.title])) : undefined);
    if (idx === undefined) continue;

    const rating = parseRating(col.rating >= 0 ? row[col.rating] : undefined, col.stars >= 0 ? row[col.stars] : undefined);
    updated[idx] = {
      ...updated[idx],
      watched: col.watched >= 0 ? parseBool(row[col.watched]) : updated[idx].watched,
      rating: rating ?? 0,
    };
    matched++;
  }

  return { entries: updated, matched };
};
