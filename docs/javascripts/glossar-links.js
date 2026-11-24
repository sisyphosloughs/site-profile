// Macht jede Abkürzung (abbr) mit Tooltip zusätzlich zu einem Link auf den
// passenden Glossareintrag. Der Tooltip bleibt erhalten.
const GLOSSAR = [
  [/^auftragsspezifische/, "auftragsspezifische-betriebsanleitung"],
  [/^CCMS$/, "component-content-management-system-ccms"],
  [/^Content-Delivery-Portal/, "content-delivery-portal"],
  [/^Docs-as-Code$/, "docs-as-code"],
  [/^Dokumentationsstrategie/, "dokumentationsstrategie"],
  [/^Elevio$/, "elevio"],
  [/^GIS$/, "geographisches-informationssystem-gis"],
  [/^Hilfe-Autorentool/, "hilfe-autorentool-hat"],
  [/^Knowledge-Base-System$/, "knowledge-base-system"],
  [/^KI$/, "kunstliche-intelligenz-ki-in-der-redaktion"],
  [/^MadCap Flare$/, "madcap-flare"],
  [/^Markup und Stylesheet/, "markup-und-stylesheet"],
  [/^Onlinehilfe/, "onlinehilfe"],
  [/^Paligo$/, "paligo"],
  [/^Peer-Review$/, "peer-review"],
  [/^Pflichtenheft/, "pflichtenheft"],
  [/^Projektmanagement-Tool/, "projektmanagement-tool"],
  [/^Redaktionsleitf/, "redaktionsleitfaden"],
  [/^Redaktionssystem/, "redaktionssystem"],
  [/^Scrum$/, "scrum"],
  [/^Shell-?[Ss]kript/, "skriptsprache"],
  [/^Single-Source-Publishing$/, "single-source-publishing"],
  [/^Snippet/, "snippet"],
  [/^Topic/, "topic"],
  [/^Übersetzungsmanagement$/, "ubersetzungsmanagement"],
  [/^UML$/, "unified-modeling-language-uml"],
  [/^UX-Writing$/, "ux-writing"],
  [/^Versionsverwaltung/, "versionsverwaltungssystem"],
  [/^Wasserfallmethode$/, "wasserfallmethode"],
  [/^Whitepaper/, "whitepaper"],
];

function verlinkeGlossar() {
  // In Überschriften kein Tooltip: Abkürzung durch reinen Text ersetzen.
  document.querySelectorAll("article :is(h1, h2, h3, h4, h5, h6) abbr").forEach((abbr) => {
    abbr.replaceWith(document.createTextNode(abbr.textContent));
  });
  const base = new URL("glossar/", typeof __md_scope !== "undefined" ? __md_scope : document.baseURI);
  document.querySelectorAll("article abbr[title]").forEach((abbr) => {
    if (abbr.closest("a")) return;
    const treffer = GLOSSAR.find(([muster]) => muster.test(abbr.textContent.trim()));
    if (!treffer) return;
    const a = document.createElement("a");
    a.href = `${base.href}#${treffer[1]}`;
    a.className = "glossar-link";
    abbr.replaceWith(a);
    a.appendChild(abbr);
  });
}

if (typeof document$ !== "undefined") {
  document$.subscribe(verlinkeGlossar);
} else {
  document.addEventListener("DOMContentLoaded", verlinkeGlossar);
}
