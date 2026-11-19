import assert from 'node:assert/strict';
import test from 'node:test';
import { filterMovies, getChecklist, getTotals, readProgress } from '../src/checklist.ts';

const defaults = { query: '', phase: 0, status: 'all', order: 'sheet' };

test('riproduce conteggio, titoli ai due estremi e voto iniziale del foglio', () => {
  const list = getChecklist({});
  assert.deepEqual(getTotals(list), { total: 40, watched: 22, remaining: 18, percent: 55 });
  assert.equal(list[0].title, 'Captain America: The First Avenger');
  assert.equal(list[0].rating, 3);
  assert.equal(list.at(-1).title, 'Avengers: Secret Wars');
});

test('ripristina visione, voto rimosso e note senza alterare il seed', () => {
  const raw = JSON.stringify({ 'mcu-01': { watched: false, rating: 0, notes: 'Rivedere' } });
  const list = getChecklist(readProgress(raw));
  assert.equal(list[0].rating, 0);
  assert.equal(list[0].notes, 'Rivedere');
  assert.equal(getTotals(list).watched, 21);
  assert.equal(getChecklist({})[0].watched, true);
});

test('valida i tipi e scarta voti fuori intervallo', () => {
  const invalid = '{"mcu-01":{"watched":"no","rating":8,"notes":22},"other":{"rating":1}}';
  assert.deepEqual(readProgress(invalid), { 'mcu-01': {} });
  assert.throws(() => readProgress('[]'));
});

test('combina filtri e lascia invariato il totale del catalogo', () => {
  const list = getChecklist({});
  const results = filterMovies(list, { ...defaults, query: '  AVENGERS ', phase: 3, status: 'unwatched' });
  assert.deepEqual(results.map((movie) => movie.title), ['Avengers: Infinity War', 'Avengers: Endgame']);
  assert.equal(getTotals(list).total, 40);
  assert.equal(filterMovies(list, { ...defaults, order: 'rating' })[0].rating, 5);
  assert.equal(list[0].rating, 3);
});
