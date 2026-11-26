# Sezione editoriale Welora

Le pagine pubbliche sono HTML statico e si servono con il routing Apache esistente. URL: /risorse, /academy/, /guide/ e /guide/<slug> (file .html senza estensione nell'URL). Per Academy gli episodi andranno in academy/<slug>.html. Gli hub sono directory con index.html: usare slash finale in canonical e link. Le nuove pagine usano asset/link assoluti alla radice e il tema calm esistente; avviare l'anteprima tramite server HTTP, non file://.

Il repo privato welora-social è la fonte editoriale; il runner genera o aggiorna i file HTML in questo repo con commit su main dopo i controlli previsti. Non copiare qui manifest privati, log o sorgenti con dati sensibili. Aggiungere una guida solo quando il testo è verificato; aggiungere video e link social soltanto dopo pubblicazione effettiva. Aggiornare le card degli hub, link contestuali e sitemap; per un video disponibile, inserire link YouTube effettivo, Facebook effettivo se pubblicato e Article/VideoObject con metadati reali. Mai placeholder URL, video finti o pagine di episodio vuote.

In questa fase nessun iframe, SDK o pixel social: solo link esterni, nessuna richiesta ai social prima del click. Eventuali embed futuri richiedono un meccanismo esplicito di consenso e aggiornamento privacy/cookie. Per gli articoli normativi verificare fonti ufficiali e data di aggiornamento.

Prima del deploy: verificare su Apache/preview URL e redirect, navigazione con e senza JS, visualizzazione desktop/mobile, tastiera, canonical, sitemap, JSON-LD, link, no richieste a social prima del click. Non modificare prezzi/claim commerciali in questo intervento. Prima pubblicazione video e accessi social sono fasi separate.
