const status = document.getElementById('status');
const output = document.getElementById('output');
if (window.FileList && window.File && window.FileReader) {
  document.getElementById('file-selector').addEventListener('change', event => {
    output.src = '';
    status.textContent = '';
    const file = event.target.files[0];
    if (!file.type) {
      status.textContent =
        'Error: The File.type property does not appear to be supported on this browser.';
      return;
    }
    if (!file.type.match('image.*')) {
      status.textContent = 'Error: The selected file does not appear to be an image.'
      return;
    }
    const reader = new FileReader();

    reader.addEventListener('load', event => {
      let array_buffer = new Uint8Array(event.target.result);
      Jimp.read(event.target.result)
        .then(async (image) => {
          const mask = await Jimp.read('mask.png');
          const border = await Jimp.read('black_border.png');
          let offsetX = 0
          let offsetY = 0
          if (image.getHeight() < image.getWidth()) {
            ratio = 400 / image.getHeight()
            image.scale(ratio)
            offsetX = image.getWidth() / 2 - 200
          } else {
            ratio = 400 / image.getWidth()
            image.scale(ratio)
            offsetY = image.getHeight() / 2 - 200
          }
          image.crop(offsetX, offsetY, 400, 400)
          image.mask(mask);
          image.composite(border, 0, 0)
          image.getBase64('image/png', (err, res) => {
            output.src = res
          })
        })
        .catch((error) => {
          console.log(`Error loading image -> ${error}`)
        })
    });

    let file2 = reader.readAsArrayBuffer(file);

    console.log(file)

  });
}