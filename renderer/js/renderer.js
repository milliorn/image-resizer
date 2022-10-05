// Some JavaScript to load the image and show the form. There is no actual backend functionality. This is just the UI

const form = document.querySelector("#img-form");
const img = document.querySelector("#img");
const outputPath = document.querySelector("#output-path");
const filename = document.querySelector("#filename");
const heightInput = document.querySelector("#height");
const widthInput = document.querySelector("#width");

//console.log(versions.node());

function loadImage(e) {
  /* get the image */
  const file = e.target.files[0];

  if (!isFileImage(file)) {
    alert("Select an image file");
    return;
  }

  // get dimensions
  const image = new Image();
  image.src = URL.createObjectURL(file);
  image.onload = function () {
    heightInput.value = this.height;
    widthInput.value = this.width;
  };

  form.style.display = "block";
  /* document.querySelector("#filename") */ filename.innerHTML = file.name;
}

function isFileImage(file) {
  const acceptedImageTypes = ["image/gif", "image/jpeg", "image/png"];
  return file && acceptedImageTypes.includes(file["type"]);
}

img.addEventListener("change", loadImage);

document.querySelector("#img").addEventListener("change", loadImage);
