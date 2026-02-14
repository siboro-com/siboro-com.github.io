const SEARCH_I18N = {
  en: {
    typeToSearch: "Type to search heritage works.",
    noResults: 'No results found. Try broader keywords like "mission", "book", or "2020".',
    section: "Works",
    people: "People",
    openSource: "Open source",
    results: (n) => `${n} result(s)`,
    dataError: (msg) => `Search data failed to load: ${msg}`,
  },
  id: {
    typeToSearch: "Ketik untuk mencari karya warisan.",
    noResults: 'Tidak ada hasil. Coba kata kunci yang lebih umum seperti "misi", "buku", atau "2020".',
    section: "Karya",
    people: "Tokoh",
    openSource: "Buka sumber",
    results: (n) => `${n} hasil`,
    dataError: (msg) => `Data pencarian gagal dimuat: ${msg}`,
  },
  ja: {
    typeToSearch: "遺産関連作品を検索するキーワードを入力してください。",
    noResults: '結果が見つかりません。"mission"、"book"、"2020" などでも試してください。',
    section: "作品",
    people: "人物",
    openSource: "出典を開く",
    results: (n) => `${n} 件`,
    dataError: (msg) => `検索データの読み込みに失敗しました: ${msg}`,
  },
};

function currentLang() {
  const lang = (document.documentElement.lang || "en").toLowerCase();
  if (lang.startsWith("id")) return "id";
  if (lang.startsWith("ja")) return "ja";
  return "en";
}

async function loadJson(path) {
  const response = await fetch(path);
  if (!response.ok) throw new Error("Failed to load " + path);
  return response.json();
}

function normalize(text) {
  return String(text || "").toLowerCase();
}

function matches(item, q) {
  const haystack = [
    item.title,
    item.type,
    item.summary,
    (item.people || []).join(" "),
    (item.tags || []).join(" "),
    item.source,
    item.date,
    item.year,
  ]
    .map(normalize)
    .join(" ");
  return haystack.includes(q);
}

function renderSearchResults(results, targetId, t) {
  const target = document.getElementById(targetId);
  if (!target) return;
  if (results.length === 0) {
    target.innerHTML = `<p class="meta">${t.noResults}</p>`;
    return;
  }
  target.innerHTML = results
    .map(
      (item) => `
      <article class="card">
        <h3>${item.title}</h3>
        <p class="meta">${item.section} • ${item.type} • ${item.date || item.year || "Undated"}</p>
        <p>${item.summary}</p>
        <p class="meta"><strong>${t.people}:</strong> ${(item.people || []).join(", ")}</p>
        ${item.sourceUrl ? `<p class="meta"><a href="${item.sourceUrl}" target="_blank" rel="noopener noreferrer">${t.openSource}</a></p>` : ""}
      </article>
    `
    )
    .join("");
}

async function initSearch() {
  const input = document.getElementById("search-input");
  const resultCount = document.getElementById("result-count");
  if (!input) return;

  const lang = currentLang();
  const t = SEARCH_I18N[lang];
  const works = await loadJson(`/pasiboro/data/works.${lang}.json`);
  const merged = works.map((i) => ({ ...i, section: t.section }));

  const run = () => {
    const q = normalize(input.value.trim());
    if (!q) {
      resultCount.textContent = t.typeToSearch;
      renderSearchResults([], "search-results", t);
      return;
    }
    const results = merged.filter((item) => matches(item, q));
    resultCount.textContent = t.results(results.length);
    renderSearchResults(results, "search-results", t);
  };

  input.addEventListener("input", run);
  run();
}

initSearch().catch((err) => {
  const t = SEARCH_I18N[currentLang()];
  const target = document.getElementById("search-results");
  if (target) {
    target.innerHTML = `<p class="meta">${t.dataError(err.message)}</p>`;
  }
});
