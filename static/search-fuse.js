// Based on https://codeberg.org/daudix/duckquill/issues/101#issuecomment-2377169
let searchSetup = false;
let fuse;

async function initIndex() {
  if (searchSetup) return;

  const url = document.getElementById("search-index").textContent;
  const response = await fetch(url);

  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

  const options = {
    includeScore: false,
    includeMatches: true,
    ignoreLocation: true,
    minMatchCharLength: 2,
    threshold: 0.05,
    keys: [
      { name: "title", weight: 3 },
      { name: "description", weight: 2 },
      { name: "body", weight: 1 },
    ],
  };

  fuse = new Fuse(await response.json(), options);
  searchSetup = true;

  console.log("Search index initialized successfully");
}

function toggleSearch() {
  initIndex();
  const searchBar = document.getElementById("search-bar");
  const searchContainer = document.getElementById("search-container");
  const searchResults = document.getElementById("search-results");
  searchContainer.classList.toggle("active");
  searchBar.toggleAttribute("disabled");
  if (searchContainer.classList.contains("active")) {
    searchBar.focus();
  } else {
    searchBar.value = "";
    searchResults.innerHTML = "";
    searchResults.style.display = "none";
  }
}

function debounce(actual_fn, wait) {
  let timeoutId;

  return (...args) => {
    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      actual_fn(...args);
    }, wait);
  };
}

function initSearch() {
  const searchBar = document.getElementById("search-bar");
  const searchResults = document.getElementById("search-results");
  const searchContainer = document.getElementById("search-container");
  const MAX_ITEMS = 10;
  const MAX_RESULTS = 3;

  let currentTerm = "";

  searchBar.addEventListener("keyup", (e) => {
    const searchVal = searchBar.value.trim();
    const results = fuse.search(searchVal, { limit: MAX_ITEMS });

    let html = "";
    for (const result of results) {
      html += makeTeaser(result, searchVal);
    }
    searchResults.innerHTML = html;

    if (html) {
      searchResults.style.display = "flex";
    } else {
      searchResults.style.display = "none";
    }
  });

  function makeTeaser(result, searchVal) {
    const TEASER_SIZE = 100;
    let output = `<div class="search-result item"><a class="result-title" href=${result.item.url}>${result.item.title}</a>`;

    for (const match of result.matches) {
      if (match.key === "title") continue;

      const value = match.value;
      const indices = match.indices
        .sort((a, b) => {
          const aValue = value.substring(a[0], a[1] + 1);
          const bValue = value.substring(b[0], b[1] + 1);
          if (aValue === searchVal) return -1;
          if (bValue === searchVal) return 1;

          const aLower = aValue.toLowerCase();
          const bLower = bValue.toLowerCase();
          const searchLower = searchVal.toLowerCase();
          if (aLower === searchLower) return -1;
          if (bLower === searchLower) return 1;

          const aNoDash = aLower.replace(/-/g, "");
          const bNoDash = bLower.replace(/-/g, "");
          const searchNoDash = searchLower.replace(/-/g, "");
          if (aNoDash === searchNoDash) return -1;
          if (bNoDash === searchNoDash) return 1;

          return (
            Math.abs(a[1] - a[0] - searchVal.length) -
            Math.abs(b[1] - b[0] - searchVal.length)
          );
        })
        .slice(0, MAX_RESULTS);

      for (const ind of indices) {
        let start = Math.max(0, ind[0] - TEASER_SIZE);
        let end = Math.min(value.length, ind[1] + TEASER_SIZE);

        const prevNewline = value.lastIndexOf("\n", ind[0]);
        if (prevNewline >= start) {
          start = prevNewline + 1;
        }

        const nextNewline = value.indexOf("\n", ind[1]);
        if (nextNewline !== -1 && nextNewline < end) {
          end = nextNewline;
        }

        output +=
          "<span>" +
          (start > 0 ? "…" : "") +
          value.substring(start, ind[0]) +
          `<strong>${value.substring(ind[0], ind[1] + 1)}</strong>` +
          value.substring(ind[1] + 1, end) +
          (end < value.length ? "…" : "") +
          "</span>";
      }
    }
    return output + "</div>";
  }

  /*window.addEventListener("click", function (event) {
			if (searchSetup && searchBar.getAttribute("disabled") === null && !searchContainer.contains(event.target)) {
				toggleSearch();
			}
		}, { passive: true });*/

  document.addEventListener("keydown", function (event) {
    if (event.key === "/" && document.activeElement !== searchBar) {
      event.preventDefault();
      toggleSearch();
    } else if (event.key === "Escape") {
      if (searchContainer.classList.contains("active")) {
        toggleSearch();
      }
    }
  });

  document.addEventListener("click", function (event) {
    const searchToggle = document.getElementById("search-toggle");
    // Check if search is active
    if (searchContainer && searchContainer.classList.contains("active")) {
      // If click is outside search container and not on the toggle button
      if (
        !searchContainer.contains(event.target) &&
        searchToggle &&
        !searchToggle.contains(event.target)
      ) {
        toggleSearch();
      }
    }
  });

  document
    .getElementById("search-toggle")
    .addEventListener("click", toggleSearch);
}

if (
  document.readyState === "complete" ||
  (document.readyState !== "loading" && !document.documentElement.doScroll)
)
  initSearch();
else document.addEventListener("DOMContentLoaded", initSearch);
