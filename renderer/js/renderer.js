// Some JavaScript to load the image and show the form. There is no actual backend functionality. This is just the UI
const filename = document.querySelector("#filename");
const form = document.querySelector("#img-form");
const heightInput = document.querySelector("#height");
const img = document.querySelector("#img");
const outputPath = document.querySelector("#output-path");
const widthInput = document.querySelector("#width");

//console.log(versions.node());

function sendImage(e) {
  e.preventDefault();
  /* add properties to the file object */
  const height = heightInput.value;
  const imgPath = img.files[0].path;
  const width = widthInput.value;

  if (!img.files[0]) {
    alertError("Upload an image.");
  }

  if (width === "" || height === "") {
    alertError("Fill in height and width");
    return;
  }

  //send to main with ipcRenderer
  ipcRenderer.send("image:resize", {
    imgPath,
    width,
    height,
  });
}

function loadImage(e) {
  /* get the image */
  const file = e.target.files[0];

  if (!isFileImage(file)) {
    alertError("Select an image");
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
  outputPath.innerText = path.join(os.homedir(), "image-resizer");
}

function isFileImage(file) {
  const acceptedImageTypes = ["image/gif", "image/jpeg", "image/png"];
  return file && acceptedImageTypes.includes(file["type"]);
}

function alertSuccess(message) {
  Toastify.toast({
    text: message,
    duration: 5000,
    close: false,
    style: {
      background: "green",
      color: "white",
      textAlign: "center",
    },
  });
}

function alertError(message) {
  Toastify.toast({
    text: message,
    duration: 5000,
    close: false,
    style: {
      background: "red",
      color: "white",
      textAlign: "center",
    },
  });
}

/*  File select listener */
img.addEventListener("change", loadImage);

/* Form submit listener */
form.addEventListener("submit", sendImage);
