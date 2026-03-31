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
  .then(res => res.json())
  .then(data => {

    data.forEach(release => {

      if (release.tag_name !== "release" && release.tag_name !== "beta") return;

      const tag = release.tag_name;

      document.getElementById(tag + "Version").textContent =
        release.name.replace(/^v/, "");

      document.getElementById(tag + "Date").textContent =
        formatDate(release.published_at);

      release.assets.forEach(asset => {

        const size = formatSize(asset.size);

        if (asset.name.includes("No_Music")) {

          const btn = document.getElementById(tag + "NoMusicBtn");
          const link = document.getElementById(tag + "NoMusicLink");

          btn.innerHTML = `<span>Download No Music (${size})</span>`;
          btn.disabled = false;

          link.href = asset.browser_download_url;

        } else {

          const btn = document.getElementById(tag + "MainBtn");
          const link = document.getElementById(tag + "MainLink");

          btn.innerHTML = `<span>Download Full (${size})</span>`;
          btn.disabled = false;

          link.href = asset.browser_download_url;

        }

      });

    });

  })
  .catch(err => console.error(err));