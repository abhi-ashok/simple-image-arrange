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

function operateBreakImage(canvasElement, newDivElement, image, newWidth, newHeight, numOfWidthPcs, i, j) {
  canvasElement.id = `canvasid${(i * numOfWidthPcs) + (j + 1)}`;
  canvasElement.width = Number(newWidth) + 5;
  canvasElement.height = Number(newHeight) + 2.5;
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

function randomizeImage() {
  const { numOfWidthPcs, numOfHeightPcs } = getNewImageAttributes();
  for (let i = 0; i < numOfHeightPcs; i++) {
    for (let j = 0; j < numOfWidthPcs; j++) {
      const currentImageId = `canvasid${(i * numOfWidthPcs) + (j + 1)}`;
      const randomNumber = Math.ceil(Math.random() * numOfHeightPcs * numOfWidthPcs);
      const randomCanvasImage = document.getElementById(`canvasid${randomNumber}`);
      const currentCanvasImage = document.getElementById(currentImageId);
      swapTiles(currentCanvasImage, randomCanvasImage);
    }
  }
  updateBreakButton();
  document.getElementById('swap-operation').style.display = 'block';
}

function swapTiles(tile1, tile2) {
  if (tile1.id !== tile2.id) {
    const parent1 = tile1.parentNode;
    const parent2 = tile2.parentNode;
  
    const temp1 = document.createElement('span');
    const temp2 = document.createElement('span');
  
    parent1.replaceChild(temp1, tile1);
    parent2.replaceChild(temp2, tile2);
  
    parent1.replaceChild(tile2, temp1);
    parent2.replaceChild(tile1, temp2);
  }
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

function checkError(x1, x2, y1, y2) {
  const { numOfHeightPcs, numOfWidthPcs } = getNewImageAttributes();
  if ((x1 > numOfWidthPcs || x2 > numOfWidthPcs || x1 < 1 || x2 < 1) && !document.getElementById('error1')) {
    const errorCaption = document.createElement('h4');
    errorCaption.id = 'error1';
    errorCaption.innerHTML = `Value of x1 and x2 must be within 1 and ${numOfWidthPcs}`;
    errorCaption.style.color = 'red';
    document.body.append(errorCaption);
    return true;
  } else if ((x1 <= numOfWidthPcs && x2 <= numOfWidthPcs && x1 >= 1 && x2 >= 1) && document.getElementById('error1')) {
    document.body.removeChild(document.getElementById('error1'));
  } else if (document.getElementById('error1')) {
    return true;
  }

  if ((y1 > numOfHeightPcs || y2 > numOfHeightPcs || y1 < 1 || y2 < 1) && !document.getElementById('error2')) {
    const errorCaption = document.createElement('h4');
    errorCaption.id = 'error2';
    errorCaption.innerHTML = `Value of y1 and y2 must be within 1 and ${numOfHeightPcs}`;
    errorCaption.style.color = 'red';
    document.body.append(errorCaption);
    return true;
  } else if ((y1 <= numOfHeightPcs && y2 <= numOfHeightPcs && y1 >= 1 && y2 >= 1) && document.getElementById('error2')) {
    document.body.removeChild(document.getElementById('error2'));
  } else if (document.getElementById('error2')) {
    return true;
  }
}

function onSwap() {
  const x1 = document.getElementById('x1').value;
  const y1 = document.getElementById('y1').value;
  const x2 = document.getElementById('x2').value;
  const y2 = document.getElementById('y2').value;

  if (checkError(x1, x2, y1, y2)) return;
  const div1 = document.getElementById(`div${y1}`);
  const tile1 = div1.children[x1 - 1];
  const div2 = document.getElementById(`div${y2}`);
  const tile2 = div2.children[x2 - 1];
  swapTiles(tile1, tile2);
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
  if (isCorrect) {
    onCorrectAnswer();
  }
}
