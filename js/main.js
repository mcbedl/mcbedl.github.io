const API = "https://api.github.com/repos/mcbedl/apk/releases";

function formatSize(bytes) {
  const gb = bytes / 1024 ** 3;
  const mb = bytes / 1024 ** 2;
  return gb >= 1 ? gb.toFixed(2) + " GB" : mb.toFixed(1) + " MB";
}

fetch(API)
  .then(res => res.json())
  .then(data => {

    data.forEach(release => {

      if (release.tag_name !== "release" && release.tag_name !== "beta") return;

      const tag = release.tag_name;

      document.getElementById(tag + "Version").textContent =
        release.name.replace(/^v/, "");

      const body = release.body || "";

      const dateMatch = body.match(/Release Date:\s*([0-9\-]+)/);
      if (dateMatch) {
        document.getElementById(tag + "Date").textContent = dateMatch[1];
      }

      const changelogMatch = body.match(/Changelogs:\s*\[(.*?)\]\((.*?)\)/);

      if (changelogMatch) {

        const text = changelogMatch[1];
        const url = changelogMatch[2];

        const link = document.getElementById(tag + "Changelog");

        link.textContent = text;
        link.href = url;

        if (tag === "release") {
          link.classList.add("release-link");
        }

        if (tag === "beta") {
          link.classList.add("beta-link");
        }

      }

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