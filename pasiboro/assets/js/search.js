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

function renderSearchResults(results, targetId) {
  const target = document.getElementById(targetId);
  if (!target) return;
  if (results.length === 0) {
    target.innerHTML = `<p class="meta">No results found. Try broader keywords like "mission", "book", or "2020".</p>`;
    return;
  }
  target.innerHTML = results
    .map(
      (item) => `
      <article class="card">
        <h3>${item.title}</h3>
        <p class="meta">${item.section} • ${item.type} • ${item.date || item.year || "Undated"}</p>
        <p>${item.summary}</p>
        <p class="meta"><strong>People:</strong> ${(item.people || []).join(", ")}</p>
      </article>
    `
    )
    .join("");
}

async function initSearch() {
  const input = document.getElementById("search-input");
  const resultCount = document.getElementById("result-count");
  if (!input) return;

  const [works, archive] = await Promise.all([
    loadJson("../data/works.json"),
    loadJson("../data/archive.json"),
  ]);

  const merged = [
    ...works.map((i) => ({ ...i, section: "Works" })),
    ...archive.map((i) => ({ ...i, section: "Archive" })),
  ];

  const run = () => {
    const q = normalize(input.value.trim());
    if (!q) {
      resultCount.textContent = "Type to search works and archive.";
      renderSearchResults([], "search-results");
      return;
    }
    const results = merged.filter((item) => matches(item, q));
    resultCount.textContent = `${results.length} result(s)`;
    renderSearchResults(results, "search-results");
  };

  input.addEventListener("input", run);
  run();
}

initSearch().catch((err) => {
  const target = document.getElementById("search-results");
  if (target) {
    target.innerHTML = `<p class="meta">Search data failed to load: ${err.message}</p>`;
  }
});
