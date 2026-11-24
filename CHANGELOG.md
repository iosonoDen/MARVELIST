# Changelog

## 2.1.0
### Fixed
- VisionQuest: data di uscita 14 ottobre 2026 (fonte marvel.com).
- Captain America (1990): data della prima uscita, al cinema nel Regno Unito il 14 dicembre 1990 (prima: uscita in home video negli USA nel 1992).

### Changed
- Nuovo blocco progresso: percentuale grande a sinistra; al centro grado (stemma + nome), frase, barra a 5 segmenti (uno per grado) con gli stemmi sotto e "Condividi"; a destra "Prossimo da vedere". Il posto del grado attuale sotto la barra resta vuoto: lo stemma sale accanto a "Grado" con un'animazione.

## 2.0.2
### Fixed
- Pagine di accesso: alcune locandine del muro restavano vuote. Ora sono caricate subito in versione piccola dal CDN di TMDB (senza ottimizzatore Vercel), con una tessera scura e una dissolvenza finché non sono pronte.

## 2.0.1
### Changed
- Pagine di accesso: le locandine scorrono senza mai ripetersi (120 titoli distribuiti su 5 file, ognuno una sola volta); tolto il titolo sulle locandine; modulo e logo centrati, con una linea di divisione tra logo e modulo.
- Node.js fissato a 24.x (`engines` in package.json).

## 2.0.0
Login facoltativo con Google, 120 titoli Marvel (MCU e non solo) con timeline ufficiale, gradi, condivisione e nuovo footer. Export/import Excel rimossi.

### Added
- Statistiche anonime delle visite con Vercel Web Analytics, attive solo con "Accetta tutti".
- Avviso cookie "biscotto" in basso a destra: si riduce dopo 7 secondi e pulsa; dopo la scelta esce con un'animazione. Le preferenze si cambiano da `/privacy`.
- Nuovo footer "titoli di coda" con contatti, crediti TMDB e scena post-crediti: da Vendicatore si sblocca la Laurea in Multiversologia da scaricare e condividere.
- Email di contatto e sezione cookie nell'informativa privacy.
- 54 titoli Marvel fuori dall'MCU: Spider-Man Sony (Tobey e Andrew), universo Sony, X-Men Fox, Fantastici 4 Fox, serie Netflix, Marvel Television e altri film. Contano nella percentuale e nei gradi.
- 9 titoli MCU della timeline ufficiale: Eyes of Wakanda, I Am Groot, i 5 One-Shot, The Punisher: One Last Kill, VisionQuest. Totale: 120 titoli.
- Filtro "Universo" (MCU, fuori MCU, Netflix, X-Men Fox, Spider-Man Sony…).
- Login facoltativo con Google (Clerk): pulsante utente nell'header con menu Accedi / Registrati, pagine `/login-page` e `/signup-page` con locandine in movimento.
- Sincronizzazione dei progressi nell'account: al primo accesso unisce browser e account, poi salva ogni modifica.
- Avviso "Hai segnato 3 titoli!" sotto il pulsante utente (5 secondi, una sola volta, solo senza account).
- Bozza dell'informativa privacy (`/privacy`).
- Blocco "Progresso saga" tra header e filtri: percentuale grande, barra con tappe 20/40/60/80% e riquadro "Prossimo da vedere" (primo titolo non visto in ordine di timeline) con pulsante "Visto".
- 5 gradi con stemmi disegnati a mano: Cadetto (0–20%), Recluta (20–40%), Agente (40–60%), Eroe (60–80%), Vendicatore (80–100%). Animazione quando si sale di grado.
- Pulsante "Condividi il tuo grado": crea un'immagine 1080×1920 da storia e apre il menu di condivisione del telefono; dal computer la scarica e copia il link.
- Link sfida `/s/<lingua>-<visti>-<totale>` con anteprima personale per le chat (grado e percentuale) e banner "Il tuo amico è …" per chi lo apre.
### Fixed
- I progressi non vengono più cancellati ricaricando la pagina in sviluppo (React Strict Mode).
- ID dei titoli ora stabili (slug) invece che posizionali: aggiungere titoli non sposta più i progressi salvati. I vecchi salvataggi e file Excel (`mcu-NN`) vengono migrati in automatico.
- Route `/api/tmdb/credits`: validazione dell'`id` numerico e cast nella lingua scelta (IT/EN).
- Foto del cast e poster in inglese: le route TMDB accettano sia la API Key v3 sia il Read Access Token v4.
- Etichetta della fase tradotta ("Fase 1" / "Phase 1") nel dettaglio e nel filtro delle fasi.
### Removed
- Export e import Excel (`.xlsx`) e la libreria `xlsx`: i progressi si sincronizzano con il login.

### Changed
- Timeline canonica: ordine ufficiale Marvel/Disney+ per l'MCU (serie Netflix incluse); i titoli fuori MCU sono inseriti per anno di ambientazione.
- Barra: niente "100%", tappe 20/40/60/80 più tenui; frase centrata; "Prossimo da vedere" più grande.
- La barra di progresso non è più nell'header.
- I controlli del video di sfondo sono in basso a sinistra.
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