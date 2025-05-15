function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
}

const filmCardContainer = document.getElementById("filmCard-container");

function makePageForEpisodes(episodeList) {

  // Clear previous cards before rendering new ones
  filmCardContainer.innerHTML = "";

  episodeList.forEach(filmData => {
    const filmCard = document.createElement('div');
    filmCard.classList.add("film-card");

    const bannerImg = document.createElement('img');
    bannerImg.src = filmData.image.medium;
    bannerImg.alt = `${filmData.name} poster`;
    filmCard.appendChild(bannerImg);

    const titleElement = document.createElement('h3');
    titleElement.textContent = filmData.name;
    filmCard.appendChild(titleElement);

    const summaryElement = document.createElement('p');
    // Strip HTML tags from summary
    summaryElement.textContent = filmData.summary.replace(/<[^>]*>/g, '');
    filmCard.appendChild(summaryElement);

    const linkElement = document.createElement('a');
    linkElement.href = filmData.url;
    linkElement.textContent = "Re-direct to www.tvmaze.com";
    linkElement.classList.add('redirect');
    linkElement.target = "_blank"; // open link in new tab
    filmCard.appendChild(linkElement);

    filmCardContainer.appendChild(filmCard);
  });
}

window.onload = setup;
