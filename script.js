document.getElementById("upload-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const width = document.getElementById("width").value;
  const height = document.getElementById("height").value;
  const files = document.getElementById("image-input").files;
  const zip = new JSZip();

  Array.from(files).forEach((file, index) => {
    resizeAndAddToZip(file, width, height, zip, index, files.length);
  });
});

function resizeAndAddToZip(file, width, height, zip, index, totalFiles) {
  const reader = new FileReader();
  reader.onload = function (e) {
    const img = new Image();
    img.onload = function () {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(function (blob) {
        zip.file(file.name, blob);
        // When all files are processed, generate the zip
        if (index === totalFiles - 1) {
          zip.generateAsync({ type: "blob" }).then(function (content) {
            saveAs(content, "resized-images.zip");
          });
        }
      }, "image/png");
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}
