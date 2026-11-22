# Changelog

## Non rilasciato
### Fixed
- ID dei titoli ora stabili (slug) invece che posizionali: aggiungere titoli non sposta più i progressi salvati. I vecchi salvataggi e file Excel (`mcu-NN`) vengono migrati in automatico.
- Route `/api/tmdb/credits`: validazione dell'`id` numerico e cast nella lingua scelta (IT/EN).
- Foto del cast e poster in inglese: le route TMDB accettano sia la API Key v3 sia il Read Access Token v4.
- Etichetta della fase tradotta ("Fase 1" / "Phase 1") nel dettaglio e nel filtro delle fasi.
### Changed
- Pulsante trailer: link diretto al video ufficiale su YouTube (Marvel Italia in IT, Marvel Entertainment in EN) per 54 titoli su 57, verificati uno per uno. Se manca la versione italiana si usa quella inglese. Per Iron Man, L'incredibile Hulk e Iron Man 2 resta la ricerca su YouTube.
- README completo in inglese, con le istruzioni per configurare TMDB.
- Video di sfondo ricompresso a 720p (11,1 MB → 4,7 MB) con `faststart` e immagine di anteprima.

## 1.6.0
### Added
- Vista a lista oltre alla griglia estesa, con scelta salvata (`marvelist:view-mode:v1`).
- Pulsante testuale "Da guardare/Guardato" (IT) e "To Watch/Watched" (EN), a larghezza costante.
- Animazione verde su locandina e riga quando un titolo è guardato (griglia e lista).
### Changed
- Il cerchio con spunta sulla locandina è sostituito dal pulsante testuale nel footer della card.

## 1.5.0
### Added
- Volume e visibilità del video di sfondo salvati in localStorage (`marvelist:background-settings`).
### Changed
- L'audio parte sempre muto; il video parte sempre in riproduzione.

## 1.4.0
### Added
- Autoplay del video di sfondo a ogni caricamento (audio disattivato di default).
- Controllo audio con slider del volume e controllo video con play/pausa, ±10s e slider di visibilità, al passaggio del mouse.
### Changed
- Video più visibile: sfocatura e scurimento ridotti.

## 1.3.1
### Fixed
- Controlli audio/video dello sfondo cliccabili, distanziati dall'header e accessibili.

## 1.3.0
- Versione di partenza di questa cronologia.