function randomizeImage() {
  const { image, newWidth, newHeight, numOfWidthPcs, numOfHeightPcs } = getNewImageAttributes();
  for (let i = 0; i < numOfHeightPcs; i++) {
    for (let j = 0; j < numOfWidthPcs; j++) {
      const currentImageId = `canvasid${(i * numOfWidthPcs) + (j + 1)}`;
      const randomNumber = Math.ceil(Math.random() * numOfHeightPcs * numOfWidthPcs);
      const randomCanvasImage = document.getElementById(`canvasid${randomNumber}`);
      const randomImageContext = randomCanvasImage.getContext('2d');
      randomImageContext.drawImage(image, j * newWidth, i * newHeight, newWidth, newHeight, 0, 0, newWidth, newHeight);

      const currentCanvasImage = document.getElementById(currentImageId);
      const currentImageContext = currentCanvasImage.getContext('2d');
      currentImageContext.drawImage(
        image,
        ((randomNumber % numOfWidthPcs) - 1) * newWidth,
        parseInt(randomNumber / numOfWidthPcs) * newHeight,
        newWidth,
        newHeight,
        0,
        0,
        newWidth,
        newHeight,
      );
      randomCanvasImage.id = currentImageId;
      currentCanvasImage.id = `canvasid${randomNumber}`;
    }
  }
  updateBreakButton();
  document.getElementById('swap-operation').style.display = 'block';
}

function updateBreakButton() {
  const breakButton = document.getElementById('break');
  breakButton.textContent = 'Back to default tiles';
  breakButton.disabled = false;
  breakButton.onclick = function() {
    const { image, newWidth, newHeight, numOfWidthPcs, numOfHeightPcs } = getNewImageAttributes();
    for (let i = 0; i < numOfHeightPcs; i++) {
      const divElement = document.getElementById(`div${i + 1}`);
      const childrenCanvas = divElement.children;
      for (let j = 0; j < numOfWidthPcs; j++) {
        operateBreakImage(childrenCanvas[j], divElement, image, newWidth, newHeight, numOfWidthPcs, i, j);
      }
    }
    disableBreakButton();
  }
}

function disableBreakButton() {
  const breakButton = document.getElementById('break');
  breakButton.disabled = true;
}

function insertRandomizeButton() {
  const randomizeButton = document.createElement('button');
  randomizeButton.textContent = 'Randomize';
  randomizeButton.onclick = function() {
    randomizeImage();
  }
  const buttonsDiv = document.getElementById('buttons');
  buttonsDiv.appendChild(randomizeButton);
  disableBreakButton();
}

function operateBreakImage(canvasElement, newDivElement, image, newWidth, newHeight, numOfWidthPcs, i, j) {
  canvasElement.id = `canvasid${(i * numOfWidthPcs) + (j + 1)}`;
  canvasElement.width = Number(newWidth) + 5;
  canvasElement.height = Number(newHeight) + 5;
  const divHavingCanvas = (newDivElement.childElementCount === numOfWidthPcs);
  if (divHavingCanvas) {
    newDivElement.children[j] = canvasElement;
  } else if (!divHavingCanvas) {
    newDivElement.appendChild(canvasElement);
  }
  const newImagesDiv = document.getElementById('new-images');
  newImagesDiv.appendChild(newDivElement);
  newImagesDiv.style.padding = '40px';
  const context = canvasElement.getContext('2d');
  const sx = j * newWidth;
  const sy = i * newHeight;
  context.drawImage(image, sx, sy, newWidth, newHeight, 0, 0, newWidth, newHeight);
  document.getElementById('swap-operation').style.display = 'none';
}

function breakImage() {
  const { image, newWidth, newHeight, numOfWidthPcs, numOfHeightPcs } = getNewImageAttributes();
  for (let i = 0; i < numOfHeightPcs; i++) {
    const newDivElement = document.createElement('div');
    newDivElement.id = `div${i + 1}`;
    for (let j = 0; j < numOfWidthPcs; j++) {
      const canvasElement = document.createElement('canvas');
      operateBreakImage(canvasElement, newDivElement, image, newWidth, newHeight, numOfWidthPcs, i, j);
    }
  }
  insertRandomizeButton();
  image.style.display = 'none';
}

function getNewImageAttributes() {
  const image = document.getElementById("original-image");
  // const numOfHeightPcs = parseInt(image.height / 75);
  // const numOfWidthPcs = parseInt(image.width / 75);
  const numOfHeightPcs = 5;
  const numOfWidthPcs = 5;
  const newHeight = (image.height / numOfHeightPcs).toFixed(2);
  const newWidth = (image.width / numOfWidthPcs).toFixed(2);
  return { image, newWidth, newHeight, numOfWidthPcs, numOfHeightPcs };
}

function onCorrectAnswer() {
  alert('Successful!');
}

function verifyAnswer() {
  const { numOfWidthPcs, numOfHeightPcs } = getNewImageAttributes();
  const isCorrect = true;
  for (let i = 0; i < numOfHeightPcs; i++) {
    const divElement = document.getElementById(`div${i + 1}`);
    const childrenCanvas = divElement.children;
    for (let j = 0; j < numOfWidthPcs; j++) {
      if (`canvasid${(i * numOfWidthPcs) + (j + 1)}` !== childrenCanvas[j].id) {
        isCorrect = false;
        break;
      }
    }
    if (!isCorrect) {
      break;
    }
  }
  // if (isCorrect) {

  // }
}
