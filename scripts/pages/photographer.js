const currentUrl = new URL(window.location.href);
const photographerId = parseInt(currentUrl.searchParams.get("id"));
const totalLikeCount = document.getElementById("total-like-count");
const previewSection = document.getElementById("preview-section");
const sortOptions = document.getElementById("sort-options");
const lightbox = document.getElementById("lightbox");

function displayArtistMedia(jsonData, photographerName) {
  previewSection.innerHTML = null;
  for (let jsonMedia of jsonData) {
    const media = new MediaFactory(jsonMedia, photographerName);
    previewSection.innerHTML += media.getPreviewDOM();
  }
}

function likeMedia(likeButton) {
  likeButton.children[0].innerText =
    parseInt(likeButton.children[0].innerText) + 1;
  likeButton.classList.add("liked");
  likeButton.setAttribute("aria-label", "Je n'aime plus ce contenu");
  totalLikeCount.innerText = parseInt(totalLikeCount.innerText) + 1;
}

function unlikeMedia(likeButton) {
  likeButton.children[0].innerText =
    parseInt(likeButton.children[0].innerText) - 1;
  likeButton.classList.remove("liked");
  likeButton.setAttribute("aria-label", "J'aime ce contenu");
  totalLikeCount.innerText = parseInt(totalLikeCount.innerText) - 1;
}

function setupLikeButtons() {
  for (let likeButton of document.getElementsByClassName("like-section")) {
    likeButton.addEventListener("click", () => {
      if (!likeButton.classList.contains("liked")) {
        likeMedia(likeButton);
      } else {
        unlikeMedia(likeButton);
      }
    });
    likeButton.addEventListener("keyup", (event) => {
      if (event.key === "Enter") {
        if (!likeButton.classList.contains("liked")) {
          likeMedia(likeButton);
        } else {
          unlikeMedia(likeButton);
        }
      }
    });
  }
}

function setupSort(photographerName) {
  document
    .getElementById("sort-options")
    .addEventListener("change", (event) => {
      if (event.target.value === "popularity") {
        displayArtistMedia(
          DataManager.getPhotographerMediaByPopularity(photographerId),
          photographerName
        );
      }
      if (event.target.value === "date") {
        displayArtistMedia(
          DataManager.getPhotographerMediaByDate(photographerId),
          photographerName
        );
      }
      if (event.target.value === "title") {
        displayArtistMedia(
          DataManager.getPhotographerMediaByTitle(photographerId),
          photographerName
        );
      }
      setupLikeButtons();
      setupSlideshow(photographerName);
    });
}

function calculateLikeTotal() {
  let newLikeCount = 0;
  for (let likeCount of document.getElementsByClassName("like-count")) {
    newLikeCount += parseInt(likeCount.innerText);
  }
  totalLikeCount.innerText = newLikeCount;
}

function setupSlideshow(photographerName) {
  let slideshow;
  switch (sortOptions.value) {
    case "date":
      slideshow = new Slideshow(
        DataManager.getPhotographerMediaByDate(photographerId),
        photographerName
      );
    case "popularity":
      slideshow = new Slideshow(
        DataManager.getPhotographerMediaByPopularity(photographerId),
        photographerName
      );
    case "title":
      slideshow = new Slideshow(
        DataManager.getPhotographerMediaByTitle(photographerId),
        photographerName
      );
  }

  slideshow.setupControls();
  for (let thumbnail of document.querySelectorAll(
    "article img, article video"
  )) {
    thumbnail.addEventListener("click", (event) => {
      slideshow.show(event.currentTarget.dataset.id);
    });
    thumbnail.addEventListener("keyup", (event) => {
      if (event.key === "Enter" && !slideshow.isVisible)
        slideshow.show(event.currentTarget.dataset.id);
    });
  }
}

async function init() {
  await DataManager.loadJson("../../data/photographers.json");
  const photographer = new Photographer(
    DataManager.getPhotographer(photographerId)
  );
  photographer.displayPage();
  displayArtistMedia(
    DataManager.getPhotographerMediaByPopularity(photographerId),
    photographer.name
  );
  setupSort(photographer.name);
  setupLikeButtons();
  calculateLikeTotal();
  setupSlideshow(photographer.name);
}

init();
