/**
 * @type {HTMLCanvasElement}
 */
const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");

const image1 = new Image();
image1.src = 'png-clipart-rick-and-morty-hq-resource-rick-and-morty.png';
const inputSlider = document.getElementById("resolution");
const inputLabel = document.getElementById("resolutionLabel");
inputSlider.addEventListener("change", handleSlider);

let originalWidth, originalHeight; // Хранение оригинальных размеров изображения

class Cell {
  constructor(x, y, symbol, color) {
    this.x = x;
    this.y = y;
    this.symbol = symbol;
    this.color = color;
  }
  draw(ctx) {
    ctx.fillStyle = 'white';
    ctx.fillStyle = this.color;
    ctx.fillText(this.symbol, this.x + 0.5, this.y + 0.5);
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 0.5;
    ctx.strokeText(this.symbol, this.x, this.y);
    ctx.fillText(this.symbol, this.x, this.y);
  }
}

class AsciiEffect {
  #imageCellArray = [];
  #pixels = [];
  #ctx;
  #width;
  #height;
  constructor(ctx, width, height) {
    this.#ctx = ctx;
    this.#width = width;
    this.#height = height;
    this.#ctx.drawImage(image1, 0, 0, this.#width, this.#height);
    this.#pixels = this.#ctx.getImageData(0, 0, this.#width, this.#height);
    // console.log(this.#pixels.data);
  }
  #convertToSymbol(g) {
    
    if (g > 250) return "@";
    else if (g > 240) return "*";
    else if (g > 220) return "+";
    else if (g > 200) return "#";
    else if (g > 180) return "&";
    else if (g > 160) return "%";
    else if (g > 140) return "Q";
    else if (g > 120) return "M";
    else if (g > 100) return "$";
    else if (g > 80) return "X";
    else if (g > 60) return "G";
    else if (g > 40) return "X";
    else if (g > 20) return "W";
    else return "";
  }
  #scanImage(cellSize) {
    this.#imageCellArray = [];
    for (let y = 0; y < this.#pixels.height; y += cellSize) {
      for (let x = 0; x < this.#pixels.width; x += cellSize) {
        //  вычисляются координаты пикселя в массиве данных изображения.
        // Поскольку каждый пиксель представлен четырьмя значениями (красный, зеленый, синий и альфа-канал), координаты умножаются на 4.
        // pos — это индекс в массиве данных пикселей, который указывает на начало данных текущего пикселя.
        const posX = x * 4;
        const posY = y * 4;
        const pos = posY * this.#pixels.width + posX;

        if (this.#pixels.data[pos + 3] > 128) {
          //Проверяется альфа-канал (прозрачность) текущего пикселя.
          // Если значение альфа-канала больше 128, это означает, что пиксель не полностью прозрачный и может быть включен в анализ.

          const red = this.#pixels.data[pos];
          const green = this.#pixels.data[pos + 1];
          const blue = this.#pixels.data[pos + 2];
          const total = red + green + blue;
          const averageColorValue = total / 3;
          const color = "rgb(" + red + ", " + green + ", " + blue + ")";
          const symbol = this.#convertToSymbol(averageColorValue);
          if (total > 200)
            this.#imageCellArray.push(new Cell(x, y, symbol, color));
        }
      }
    }
    // console.log(this.#imageCellArray);
  }
  #drawAscii() {
    this.#ctx.clearRect(0, 0, this.#width, this.#height);
    for (let i = 0; i < this.#imageCellArray.length; i++) {
      this.#imageCellArray[i].draw(this.#ctx);
    }
  }
  draw(cellSize) {
    this.#scanImage(cellSize);
    this.#drawAscii();
  }
}
let effect;

function handleSlider() {
  if(inputSlider.value == 1){
    inputLabel.innerHTML = 'Original Image';
    ctx.drawImage(image1, 0, 0, canvas.width, canvas.height)
  } else {
     inputLabel.innerHTML = 'Resolution: ' + inputSlider.value + ' px';
     ctx.font = parseInt(inputSlider.value) + 'px Verdana';
     effect.draw(parseInt(inputSlider.value));
  }
}

image1.onload = function initialize() {

image1.src = 'png-clipart-rick-and-morty-hq-resource-rick-and-morty.png';
  canvas.width = image1.width;
  canvas.height = image1.height;
  effect = new AsciiEffect(ctx, canvas.width, canvas.height);
  handleSlider();
};
window.addEventListener("resize", function () {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

});
window.addEventListener("load", function () {
  initialize();

});





