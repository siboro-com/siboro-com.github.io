const CATALOG_I18N = {
  en: {
    people: "People",
    source: "Source",
    openSource: "Open source record",
    openExternal: "Open publication/media",
    verified: "Verified",
    pending: "Pending Verification",
  },
  id: {
    people: "Tokoh",
    source: "Sumber",
    openSource: "Buka catatan sumber",
    openExternal: "Buka publikasi/media",
    verified: "Terverifikasi",
    pending: "Menunggu Verifikasi",
  },
  ja: {
    people: "人物",
    source: "出典",
    openSource: "出典情報を開く",
    openExternal: "公開資料/メディアを開く",
    verified: "確認済み",
    pending: "確認待ち",
  },
};

function currentLang() {
  const lang = (document.documentElement.lang || "en").toLowerCase();
  if (lang.startsWith("id")) return "id";
  if (lang.startsWith("ja")) return "ja";
  return "en";
}

function statusBadge(status, t) {
  if (status === "verified") {
    return `<span class="badge status-verified">${t.verified}</span>`;
  }
  return `<span class="badge status-pending">${t.pending}</span>`;
}

function renderCatalog(items, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const t = CATALOG_I18N[currentLang()];
  container.innerHTML = items
    .map(
      (item) => `
      <article class="card">
        <h3>${item.title}</h3>
        <p class="meta">${item.type} • ${item.date || item.year || "Undated"}</p>
        <p>${item.summary}</p>
        <p class="meta"><strong>${t.people}:</strong> ${(item.people || []).join(", ")}</p>
        <p class="meta"><strong>${t.source}:</strong> ${item.source}</p>
        ${item.sourceUrl ? `<p class="meta"><a href="${item.sourceUrl}" target="_blank" rel="noopener noreferrer">${t.openSource}</a></p>` : ""}
        ${item.externalUrl ? `<p class="meta"><a href="${item.externalUrl}" target="_blank" rel="noopener noreferrer">${t.openExternal}</a></p>` : ""}
        ${statusBadge(item.verificationStatus, t)}
      </article>
    `
    )
    .join("");
}
