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
export function attachImageModals(elementSelector: any): void;
