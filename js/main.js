const API = "https://api.github.com/repos/mcbedl/apk/releases";

function formatSize(bytes) {
  const gb = bytes / 1024 ** 3;
  const mb = bytes / 1024 ** 2;
  return gb >= 1 ? gb.toFixed(2) + " GB" : mb.toFixed(1) + " MB";
}

function formatDate(date) {
  const d = new Date(date);
  return d.toISOString().slice(0, 10);
}
fetch(API)
  .then((r) => r.json())
  .then((data) => {
    const allowed = {
      latest: true,
      beta: true,
    };
    data.forEach((release) => {
      const prefix = allowed[release.tag_name];
      if (!prefix) return;
      const tag = release.tag_name;
      document.getElementById(tag + "Version").textContent =
        release.name.replace(/^v/, "");
      document.getElementById(tag + "Date").textContent = formatDate(
        release.published_at,
      );
      release.assets.forEach((asset) => {
        const arch = asset.name.includes("Arm64")
          ? "Arm64"
          : asset.name.includes("Arm32")
            ? "Arm32"
            : "";
        if (!arch) return;
        const btn = document.getElementById(tag + arch + "Btn");
        const link = document.getElementById(tag + arch + "Link");
        if (!btn || !link) return;
        const size = formatSize(asset.size);
        btn.innerHTML = `
					<span>Download ${arch} (${size})</span>`;
        btn.disabled = false;
        link.href = asset.browser_download_url;
      });
    });
  });
