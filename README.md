# Profil-Webseite

Statische Webseite mit [Zensical](https://zensical.org/docs/). Die Konfiguration steht in `mkdocs.yml`, die Inhalte in `docs/`.

```bash
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt
.venv/bin/zensical serve   # Vorschau auf http://localhost:8000
.venv/bin/zensical build   # fertige Seite nach site/
```

## Veröffentlichen

```bash
./deploy.sh --dry-run   # zeigt nur, was sich auf dem Server ändern würde
./deploy.sh             # baut die Seite und überträgt sie per rsync
```

Das Skript baut `site/` neu und überträgt es nach `milos:/opt/www/profile/`. Es nutzt `rsync --delete`: Dateien auf dem Server, die lokal nicht mehr existieren, werden dort gelöscht. Der Host `milos` muss per SSH erreichbar sein (z. B. über einen Eintrag in `~/.ssh/config`).

Weiterführend: [Get started](https://zensical.org/docs/get-started/), [Grundeinstellungen](https://zensical.org/docs/setup/basics/), [Navigation](https://zensical.org/docs/setup/navigation/).

## Ordnerstruktur

| Ordner/Datei | Inhalt |
| --- | --- |
| `docs/` | Die Seiten, die veröffentlicht werden |
| `docs/javascripts/`, `docs/stylesheets/` | Skript und Stil für die Glossar-Links |
| `docs/kontakt.md`, `docs/impressum.md`, `docs/datenschutz.md` | Seiten, die nur über die Fußzeile erreichbar sind (nicht in der Navigation) |
| `includes/` | Wiederverwendbare Bausteine, werden **nicht** als Seiten veröffentlicht |
| `mkdocs.yml` | Konfiguration (Navigation, Theme, Fußzeile, Erweiterungen) |

## Inhalte wiederverwenden (Snippets)

Ein Baustein liegt einmal in `includes/` und wird mit `--8<--` an beliebig vielen Stellen eingebunden. Die Erweiterung `pymdownx.snippets` (siehe [Markdown-Erweiterungen in Zensical](https://zensical.org/docs/setup/extensions/python-markdown-extensions/) und die [Dokumentation von Snippets](https://facelessuser.github.io/pymdown-extensions/extensions/snippets/)) ist in `mkdocs.yml` so eingestellt, dass sie in `includes/` sucht.

Die Marke `--8<--` muss am Zeilenanfang stehen. Sie funktioniert deshalb für ganze Zeilen und Absätze, aber nicht mitten im Satz.

**Beispiel 1: eine wiederkehrende Aufgabenzeile.** Die Datei `includes/training-ms-office.md` enthält:

```markdown
- Training für MS-Office
```

In `docs/berufserfahrung.md` steht bei vier Stationen in der Aufzählung:

```markdown
--8<-- "training-ms-office.md"
```

Ändert sich der Text, genügt eine Änderung in `includes/training-ms-office.md`.

**Beispiel 2: dieselbe Zeile auf mehreren Seiten.** `includes/uml.md` enthält:

```markdown
- Visualisierung von Prozessen nach UML-Standard
```

Der Baustein ist in `docs/berufserfahrung.md` (Station Digistore24) und in `docs/kenntnisse.md` (Visuelle Kommunikation) eingebunden, jeweils mit `--8<-- "uml.md"`.

Vorhandene Bausteine: `kurzprofil.md`, `training-ms-office.md`, `windows-netze-betreuung.md`, `windows-netze-administration.md`, `ux-writing.md`, `uml.md`. Die Kontaktdaten sind kein Baustein, sie stehen nur auf der Seite `docs/kontakt.md`.

## Fußzeile, Kontakt, Impressum und Datenschutz

Die Fußzeile zeigt links die Links **Kontakt**, **Impressum** und **Datenschutz** und rechts das LinkedIn-Symbol. Die drei Seiten liegen in `docs/`, stehen aber bewusst nicht in der `nav` von `mkdocs.yml`. Sie sind nur über die Fußzeile erreichbar.

| Was | Wo | Hinweis |
| --- | --- | --- |
| Links zu Kontakt, Impressum, Datenschutz | `mkdocs.yml` unter `copyright` | HTML-Links, weil die Fußzeile kein Markdown kennt. Die Pfade beginnen mit `/` und stimmen nur, wenn die Seite auf oberster Ebene einer Domain liegt (z. B. `benjaminbruecker.de/`). Liegt sie in einem Unterordner, müssen die Pfade angepasst werden. |
| LinkedIn und weitere Profile | `mkdocs.yml` unter `extra.social` | Pro Profil ein Eintrag mit `icon`, `link` und `name` (siehe [Fußzeile in Zensical](https://zensical.org/docs/setup/footer/)). |
| Aussehen der Links | `docs/stylesheets/extra.css` | Abschnitt „Fußzeile“. |
| Kontaktdaten | `docs/kontakt.md` | Einzige Stelle, an der die Kontaktdaten stehen. |
| Impressum, Datenschutz | `docs/impressum.md`, `docs/datenschutz.md` | Inhalt orientiert sich an der Seite kiglossar. Prüfe nach einem Umzug des Hostings vor allem den Abschnitt „Hosting und Server-Logfiles“. |

## Tooltips und Glossar

Fachbegriffe im Text zeigen beim Darüberfahren eine Kurzbeschreibung (Tooltip) und führen per Klick zum Eintrag auf der Glossarseite. Das Tooltip stammt aus den [Abkürzungen von Zensical](https://zensical.org/docs/authoring/tooltips/). Eine Abkürzungsliste (`includes/abbreviations.md`) wird über `auto_append` automatisch an **jede** Seite angehängt. Du musst die Begriffe im Text nicht markieren. Der Link zum Glossar kommt aus einem eigenen Skript, weil ein Tooltip selbst keinen Link enthalten kann. Das Skript wird über `extra_javascript` eingebunden (siehe [Anpassung in Zensical](https://zensical.org/docs/customization/)). In Überschriften werden Tooltips bewusst entfernt.

### Neuen Begriff anlegen: was ist zu ändern?

| Datei | Aufgabe | Pflicht? |
| --- | --- | --- |
| `includes/abbreviations.md` | Kurzbeschreibung eintragen: `*[Begriff]: Kurzbeschreibung.` Jede Schreibform braucht eine eigene Zeile, z. B. Einzahl und Mehrzahl (`Topic`, `Topics`), und die Groß- und Kleinschreibung muss stimmen. | Ja, sonst gibt es kein Tooltip |
| `docs/glossar.md` | Ausführlichen Eintrag als `## Begriff` mit Beschreibung ergänzen, alphabetisch einsortiert. Die Überschrift bestimmt den Anker (z. B. `## Topic` wird `#topic`). | Ja, wenn der Begriff im Glossar stehen soll |
| `docs/javascripts/glossar-links.js` | Liste `GLOSSAR` um eine Zeile ergänzen, die den Begriff dem Anker zuordnet: `[/^Begriff/, "anker"]`. Der Anker ist die Überschrift in Kleinbuchstaben mit Bindestrichen, Umlaute werden vereinfacht (`Übersetzung` wird `ubersetzung`). Mit `/^Topic/` passen Einzahl und Mehrzahl. | Ja, sonst hat der Begriff nur ein Tooltip und keinen Link |
| `docs/*.md` (Seiten mit dem Begriff) | Nichts. Der Begriff wird automatisch erkannt. | Nein |
| `mkdocs.yml` | Nichts. | Nein |

Nach dem Anlegen prüfst du mit `.venv/bin/zensical serve`, ob Tooltip und Link auf der Seite funktionieren. Falls nach einer Änderung am Skript nichts passiert, lade mit `Cmd+Shift+R` neu, damit der Browser das alte Skript nicht aus dem Cache nimmt.

### Einschränkungen

- Ein Tooltip erscheint nur bei **exakter** Schreibweise des Begriffs (Groß- und Kleinschreibung, Beugung).
- Begriffe ohne Eintrag in `glossar-links.js` bleiben reine Tooltips ohne Link.
- Auf Überschriften und im Glossar-Titel gibt es bewusst keine Tooltips.
