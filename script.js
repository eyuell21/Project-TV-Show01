const showSelect = document.getElementById("show-select");
const episodeSelect = document.getElementById("episode-select");
const searchInput = document.getElementById("search-input");
const searchCount = document.getElementById("search-count");
const filmCardContainer = document.getElementById("filmCardContainer");

const cache = {
  shows: [],
  episodesByShowId: {}
};

let currentEpisodes = [];

async function setup() {
  await fetchAndPopulateShows();

  // Event listeners
  showSelect.addEventListener("change", onShowChange);
  episodeSelect.addEventListener("change", onEpisodeChange);
  searchInput.addEventListener("input", onSearchInput);
}

async function fetchAndPopulateShows() {
  try {
    const res = await fetch("https://api.tvmaze.com/shows");
    const shows = await res.json();

    // Sort alphabetically, case insensitive
    shows.sort((a, b) =>
      a.name.toLowerCase().localeCompare(b.name.toLowerCase())
    );

    cache.shows = shows;

    showSelect.innerHTML = `<option value="">Select a TV show</option>`;
    for (const show of shows) {
      const option = document.createElement("option");
      option.value = show.id;
      option.textContent = show.name;
      showSelect.appendChild(option);
    }
  } catch (error) {
    showSelect.innerHTML = `<option value="">Failed to load shows</option>`;
    console.error("Error fetching shows:", error);
  }
}

async function onShowChange() {
  const showId = showSelect.value;
  searchInput.value = "";
  episodeSelect.innerHTML = `<option value="all">Loading episodes...</option>`;
  searchCount.textContent = "";
  filmCardContainer.innerHTML = "";

  if (!showId) {
    episodeSelect.innerHTML = `<option value="all">Show all episodes</option>`;
    currentEpisodes = [];
    updateCount(0, 0);
    return;
  }

  if (cache.episodesByShowId[showId]) {
    currentEpisodes = cache.episodesByShowId[showId];
    populateEpisodeSelect(currentEpisodes);
    renderEpisodes(currentEpisodes);
    updateCount(currentEpisodes.length, currentEpisodes.length);
  } else {
    try {
      const res = await fetch(`https://api.tvmaze.com/shows/${showId}/episodes`);
      const episodes = await res.json();
      cache.episodesByShowId[showId] = episodes;
      currentEpisodes = episodes;
      populateEpisodeSelect(episodes);
      renderEpisodes(episodes);
      updateCount(episodes.length, episodes.length);
    } catch (error) {
      episodeSelect.innerHTML = `<option value="all">Failed to load episodes</option>`;
      console.error("Error fetching episodes:", error);
    }
  }
}

function populateEpisodeSelect(episodes) {
  episodeSelect.innerHTML = `<option value="all">Show all episodes</option>`;
  for (const ep of episodes) {
    const option = document.createElement("option");
    option.value = ep.id;
    option.textContent = `S${ep.season.toString().padStart(2, "0")}E${ep.number
      .toString()
      .padStart(2, "0")} - ${ep.name}`;
    episodeSelect.appendChild(option);
  }
}

function onEpisodeChange() {
  searchInput.value = "";
  const selectedId = episodeSelect.value;

  if (selectedId === "all") {
    renderEpisodes(currentEpisodes);
    updateCount(currentEpisodes.length, currentEpisodes.length);
  } else {
    const selectedEp = currentEpisodes.find(ep => ep.id.toString() === selectedId);
    renderEpisodes(selectedEp ? [selectedEp] : []);
    updateCount(selectedEp ? 1 : 0, currentEpisodes.length);
  }
}

function onSearchInput() {
  episodeSelect.value = "all";
  const term = searchInput.value.toLowerCase();
  const filtered = currentEpisodes.filter(ep =>
    ep.name.toLowerCase().includes(term) ||
    (ep.summary && ep.summary.toLowerCase().replace(/<[^>]*>/g, '').includes(term))
  );
  renderEpisodes(filtered);
  updateCount(filtered.length, currentEpisodes.length);
}

function renderEpisodes(episodes) {
  filmCardContainer.innerHTML = "";

  if (episodes.length === 0) {
    filmCardContainer.textContent = "No episodes found.";
    return;
  }

  episodes.forEach(ep => {
    const card = document.createElement("div");
    card.className = "card";

    const title = document.createElement("h3");
    title.textContent = `${ep.name} - S${ep.season.toString().padStart(2, "0")}E${ep.number.toString().padStart(2, "0")}`;

    const image = document.createElement("img");
    image.src = ep.image ? ep.image.medium : "";
    image.alt = ep.name;

    const summary = document.createElement("p");
    summary.innerHTML = ep.summary || "No summary available.";

    const link = document.createElement("a");
    link.href = ep.url;
    link.textContent = "View on TVmaze";
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.className = "redirect";

    card.appendChild(title);
    card.appendChild(image);
    card.appendChild(summary);
    card.appendChild(link);

    filmCardContainer.appendChild(card);
  });
}

function updateCount(visible, total) {
  searchCount.textContent = `Displaying ${visible} of ${total} episodes.`;
}

document.addEventListener("DOMContentLoaded", setup);
