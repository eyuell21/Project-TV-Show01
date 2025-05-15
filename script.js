function setup() {
  const allEpisodes = getAllEpisodes();
  const root = document.getElementById("root");

  // Created and added search input
  const searchInput = document.createElement("input");
  searchInput.type = "text";
  searchInput.placeholder = "Search episodes...";
  root.prepend(searchInput);

  // Created and added dropdown
  const select = document.createElement("select");
  const defaultOption = document.createElement("option");
  defaultOption.value = "all";
  defaultOption.textContent = "Select an episode...";
  select.appendChild(defaultOption);
  allEpisodes.forEach((ep) => {
    const option = document.createElement("option");
    const season = ep.season.toString().padStart(2, "0");
    const number = ep.number.toString().padStart(2, "0");
    option.value = ep.id;
    option.textContent = `S${season}E${number} - ${ep.name}`;
    select.appendChild(option);
  });
  root.prepend(select);

  // Created and added episode count display
  const countDisplay = document.createElement("p");
  root.insertBefore(countDisplay, root.children[2]); // Insert below search
  updateEpisodeCount(allEpisodes.length, allEpisodes.length);

  function updateEpisodeCount(visible, total) {
    countDisplay.textContent = `Displaying ${visible}/${total} episodes.`;
  }

  function filterEpisodes(searchTerm) {
    const lower = searchTerm.toLowerCase();
    const filtered = allEpisodes.filter((ep) =>
      ep.name.toLowerCase().includes(lower) ||
      ep.summary.toLowerCase().includes(lower)
    );
    makePageForEpisodes(filtered);
    updateEpisodeCount(filtered.length, allEpisodes.length);
  }

  // Search listener
  searchInput.addEventListener("input", () => {
    select.value = "all"; // Reset dropdown
    filterEpisodes(searchInput.value);
  });

  // Dropdown listener
  select.addEventListener("change", () => {
    const selectedId = select.value;
    if (selectedId === "all") {
      makePageForEpisodes(allEpisodes);
      updateEpisodeCount(allEpisodes.length, allEpisodes.length);
    } else {
      const selectedEpisode = allEpisodes.find((ep) => ep.id == selectedId);
      makePageForEpisodes([selectedEpisode]);
      updateEpisodeCount(1, allEpisodes.length);
    }
    searchInput.value = ""; // Clear search
  });

  // Initial page load
  makePageForEpisodes(allEpisodes);
  updateEpisodeCount(allEpisodes.length, allEpisodes.length);
}

const filmCardContainer = document.getElementById("filmCard-container");

function makePageForEpisodes(episodeList) {
  filmCardContainer.innerHTML = "";

  episodeList.forEach(filmData => {
    const filmCard = document.createElement('div');
    filmCard.classList.add("film-card");

    const bannerImg = document.createElement('img');
    bannerImg.src = filmData.image.medium;
    bannerImg.alt = `${filmData.name} poster`;
    filmCard.appendChild(bannerImg);

    const titleElement = document.createElement('h3');
    titleElement.textContent = `${filmData.name} - S${filmData.season.toString().padStart(2, "0")}E${filmData.number.toString().padStart(2, "0")}`;
    filmCard.appendChild(titleElement);

    const summaryElement = document.createElement('p');
    summaryElement.textContent = filmData.summary.replace(/<[^>]*>/g, '');
    filmCard.appendChild(summaryElement);

    const linkElement = document.createElement('a');
    linkElement.href = filmData.url;
    linkElement.textContent = "Re-direct to www.tvmaze.com";
    linkElement.classList.add('redirect');
    linkElement.target = "_blank";
    filmCard.appendChild(linkElement);

    filmCardContainer.appendChild(filmCard);
  });
}

document.addEventListener("DOMContentLoaded", setup);
