function statusBadge(status) {
  if (status === "verified") {
    return '<span class="badge status-verified">Verified</span>';
  }
  return '<span class="badge status-pending">Pending Verification</span>';
}

function renderCatalog(items, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = items
    .map(
      (item) => `
      <article class="card">
        <h3>${item.title}</h3>
        <p class="meta">${item.type} • ${item.date || item.year || "Undated"}</p>
        <p>${item.summary}</p>
        <p class="meta"><strong>People:</strong> ${item.people.join(", ")}</p>
        <p class="meta"><strong>Source:</strong> ${item.source}</p>
        ${statusBadge(item.verificationStatus)}
      </article>
    `
    )
    .join("");
}
