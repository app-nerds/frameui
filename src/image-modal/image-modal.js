/**
 * attachImageModals searches for images with the provided selector and
 * attaches a click event to load a modal display of the larger image.
 * The image's attribute 'data-largeimageurl' is used. If that is not
 * provided, the 'src' attribute is used.
 *
 * Example:
 *   <img class="viewMe" src="image.jpg" data-largeimageurl="image.jpeg?fullSize=true" />
 *   <img class="viewMe" src="image2.jpg" data-largeimageurl="image2.jpeg?fullSize=true" />
 *   <script>
 *     attachImageModals(".viewMe");
 *   </script>
 */
export function attachImageModals(elementSelector) {
  const els = document.querySelectorAll(elementSelector);

  els.forEach((el) => {
    let src = el.src;
    let alt = el.alt;
    let title = el.title;

    if (el.dataset.largeimageurl) {
      src = el.dataset.largeimageurl;
    }

    el.addEventListener("click", showModal.bind(el, src, alt, title));
  });
}

function showModal(src, alt, title) {
  const dialog = Object.assign(document.createElement("dialog"), {
    className: "image-modal",
  });

  dialog.addEventListener("click", (e) => {
    e.stopPropagation();
    dialog.remove();
  });

  const image = Object.assign(document.createElement("img"), {
    src: src,
    alt: alt,
    title: title,
    onclick: (e) => {
      e.stopPropagation();
    },
  });

  const close = Object.assign(document.createElement("i"), {
    className: "close",
    onclick: () => {
      dialog.remove();
    },
  });

  dialog.appendChild(image);
  dialog.appendChild(close);
  document.body.appendChild(dialog);
}
