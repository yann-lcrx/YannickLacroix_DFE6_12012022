class Video {
  constructor(jsonVideo, photographerName) {
    jsonVideo && Object.assign(this, jsonVideo);
    this.photographerName = photographerName;
  }

  //generate a thumbnail
  getPreviewDOM() {
    return `<article class="media-preview">
          <video data-id=${this.id}>
            <source src="/assets/Sample Photos/${this.photographerName}/${this.video}">
          </video>
          <div>
          <p class="media-title">${this.title}</p>
          <div class="like-section" role="button" tabindex="0" aria-label="J'aime ce contenu">
            <p class="like-count">
            ${this.likes}
            </p>
            <i class="fa fa-heart" aria-hidden="true"></i>
          </div>
        </div>
        </article>`;
  }

  //generate a version suited for the slideshow and update its title
  getDOM() {
    document.getElementById("focused-media-title").innerText = this.title;
    return `<video 
              src="/assets/Sample Photos/${this.photographerName}/${this.video}"
              controls="true"></video>`;
  }

  focus() {
    document.querySelector("#focused-media video").focus();
  }
}
