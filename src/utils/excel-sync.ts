import * as XLSX from 'xlsx';
import { MCUEntry } from '@/types/mcu';

export const exportToMCUExcel = (entries: MCUEntry[], filename = 'MCU-Checklist-Sync.xlsx') => {
  const headers = ['', '🎬 MARVEL CINEMATIC UNIVERSE • VISION CHECKLIST', '', '', '', '', ''];
  const subHeaders = ['', 'PROGRESS', '', '', '', 'COUNTER', '', 'TOT FILM'];

  const watchedCount = entries.filter((e) => e.watched).length;
  const totalCount = entries.length;
  const progressRatio = totalCount > 0 ? watchedCount / totalCount : 0;

  const metricRow = ['', progressRatio, '', '', '', watchedCount, '', totalCount];

  const dataRows = entries.map((entry) => [
    '',
    entry.watched,
    `IMAGE("${entry.posterUrl}")`,
    entry.title.en,
    entry.timelineYear,
    entry.phase,
    entry.rating > 0 ? '⭐'.repeat(Math.round(entry.rating)) : ''
  ]);

  const worksheetData = [[], headers, subHeaders, metricRow, [], ...dataRows];
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'MCU');
  XLSX.writeFile(workbook, filename);
};

export const parseMCUExcel = async (file: File, baseEntries: MCUEntry[]): Promise<MCUEntry[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheet = workbook.Sheets['MCU'] || workbook.Sheets[workbook.SheetNames[0]];
        const rows: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        const updatedEntries = [...baseEntries];

        for (let i = 5; i < rows.length; i++) {
          const row = rows[i];
          if (!row || row.length < 4) continue;

          const isWatched = Boolean(row[1]);
          const rawTitle = String(row[3] || '').trim().toLowerCase();
          const starStr = String(row[6] || '');
          const starCount = (starStr.match(/⭐/g) || []).length;

          const entryIndex = updatedEntries.findIndex(
            (e) => e.title.en.toLowerCase() === rawTitle || e.title.it.toLowerCase() === rawTitle
          );

          if (entryIndex !== -1) {
            updatedEntries[entryIndex] = {
              ...updatedEntries[entryIndex],
              watched: isWatched,
              rating: starCount > 0 ? starCount : updatedEntries[entryIndex].rating
            };
          }
        }

        resolve(updatedEntries);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });
};