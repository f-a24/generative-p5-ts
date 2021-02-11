import p5 from 'p5';
import * as gd from './lib/generative-design-library';
import pic1 from './assets/P_1_2_2_01/pic1.jpg';
import pic2 from './assets/P_1_2_2_01/pic2.jpg';
import pic3 from './assets/P_1_2_2_01/pic3.jpg';
import pic4 from './assets/P_1_2_2_01/pic4.jpg';
export default { title: 'P1：Color' };

declare let globalP5Instance: p5;

/**
 * HELLO, COLOR
 * [マウス]
 * x座標：短形のサイズ
 * y座標：色相
 */
export const P_1_0_01 = () => {
  if (!!globalP5Instance) globalP5Instance.remove();
  globalP5Instance = new p5((p: p5) => {
    p.setup = () => {
      p.createCanvas(720, 720);
      p.noCursor();

      p.colorMode(p.HSB, 360, 100, 100);
      p.rectMode(p.CENTER);
      p.noStroke();
    };

    p.draw = () => {
      p.background(p.mouseY / 2, 100, 100);
      p.fill(360 - p.mouseY / 2, 100, 100);
      p.rect(360, 360, p.mouseX + 1, p.mouseX + 1);
    };
  });
  return '';
};

/**
 * グリッド状に配置した色のスペクトル
 * [マウス]
 * x座標：水平方向（色相）グリッドの解像度
 * y座標：垂直方向（彩度）グリッドの解像度
 */
export const P_1_1_1_01 = () => {
  if (!!globalP5Instance) globalP5Instance.remove();
  let stepX: number;
  let stepY: number;

  globalP5Instance = new p5((p: p5) => {
    p.setup = () => {
      p.createCanvas(800, 400);
      p.noStroke();
      p.colorMode(p.HSB, p.width, p.height, 100);
    };

    p.draw = () => {
      if (p.mouseX < 0 || p.mouseY < 0) return; // ←　フリーズ防止
      stepX = p.mouseX + 2;
      stepY = p.mouseY + 2;

      for (let gridY = 0; gridY < p.height; gridY += stepY) {
        for (let gridX = 0; gridX < p.width; gridX += stepX) {
          p.fill(gridX, p.height - gridY, 100);
          p.rect(gridX, gridY, stepX, stepY);
        }
      }
    };
  });
  return '';
};

/**
 * 円形に配置した色のスペクトル
 * [マウス]
 * x座標：彩度
 * y座標：明度
 * [キー]
 * 1-5：分割数
 */
export const P_1_1_2_01 = () => {
  if (!!globalP5Instance) globalP5Instance.remove();
  const RADIUS = 300;
  let segmentCount = 360;

  globalP5Instance = new p5((p: p5) => {
    p.setup = () => {
      p.createCanvas(800, 800);
      p.noStroke();
    };

    p.draw = () => {
      p.colorMode(p.HSB, 360, p.width, p.height);
      p.background(360, 0, p.height);

      const angleStep = 360 / segmentCount;

      p.beginShape(p.TRIANGLE_FAN);
      p.vertex(p.width / 2, p.height / 2);

      for (let angle = 0; angle <= 360; angle += angleStep) {
        const vx = p.width / 2 + p.cos(p.radians(angle)) * RADIUS;
        const vy = p.height / 2 + p.sin(p.radians(angle)) * RADIUS;
        p.vertex(vx, vy);
        p.fill(angle, p.mouseX, p.mouseY);
      }

      p.endShape();
    };

    p.keyPressed = () => {
      switch (p.key) {
        case '1':
          segmentCount = 360;
          break;
        case '2':
          segmentCount = 45;
          break;
        case '3':
          segmentCount = 24;
          break;
        case '4':
          segmentCount = 12;
          break;
        case '5':
          segmentCount = 6;
          break;
      }
    };
  });
  return '';
};

/**
 * 補間で作るカラーパレット
 * [マウス]
 * 左クリック：ランダムな色のセットの更新
 * x座標：解像度
 * y座標：行数
 * [キー]
 * 1-2：補間のスタイル
 */
export const P_1_2_1_01 = () => {
  if (!!globalP5Instance) globalP5Instance.remove();
  let tileCountX = 2;
  let tileCountY = 10;

  let colorsLeft: p5.Color[] = [];
  let colorsRight: p5.Color[] = [];

  let interpolateShortest = true;

  globalP5Instance = new p5((p: p5) => {
    const shakeColors = () => {
      for (let i = 0; i < tileCountY; i++) {
        colorsLeft[i] = p.color(p.random(0, 60), p.random(0, 100), 100);
        colorsRight[i] = p.color(p.random(160, 190), 100, p.random(0, 100));
      }
    };

    p.setup = () => {
      p.createCanvas(800, 800);
      p.colorMode(p.HSB);
      p.noStroke();
      shakeColors();
      // colorsRight.forEach(c => { console.log(c.toString('hsb'));})
      // console.log(p.map(7, 0, 24, 0, 24 * 60));
    };

    p.draw = () => {
      tileCountX = p.int(p.map(p.mouseX, 0, p.width, 2, 100));
      tileCountY = p.int(p.map(p.mouseY, 0, p.height, 2, 10));
      const tileWidth = p.width / tileCountX;
      const tileHeight = p.height / tileCountY;
      let interCol: p5.Color;

      for (let gridY = 0; gridY < tileCountY; gridY++) {
        const col1 = colorsLeft[gridY];
        const col2 = colorsRight[gridY];

        for (let gridX = 0; gridX < tileCountX; gridX++) {
          const amount = p.map(gridX, 0, tileCountX - 1, 0, 1);

          if (interpolateShortest) {
            // switch to rgb
            p.colorMode(p.RGB);
            interCol = p.lerpColor(col1, col2, amount);
            // switch back
            p.colorMode(p.HSB);
          } else {
            interCol = p.lerpColor(col1, col2, amount);
          }

          p.fill(interCol);

          const posX = tileWidth * gridX;
          const posY = tileHeight * gridY;
          p.rect(posX, posY, tileWidth, tileHeight);
        }
      }
    };

    p.mouseReleased = () => {
      shakeColors();
    };

    p.keyPressed = () => {
      if (p.key === '1') interpolateShortest = true;
      if (p.key === '2') interpolateShortest = false;
    };
  });
  return '';
};

/**
 * 画像で作るカラーパレット
 * [マウス]
 * x座標：解像度
 * [キー]
 * 1-4：サンプル画像の切り替え
 * 5-9：並び替えモードの切り替え
 */
export const P_1_2_2_01 = () => {
  if (!!globalP5Instance) globalP5Instance.remove();
  let img: p5.Image;
  let colors: p5.Color[] = [];
  let sortMode: string = null;
  const setImage = (loadedImageFile: p5.Image) => {
    img = loadedImageFile;
  };

  globalP5Instance = new p5((p: p5) => {
    p.preload = () => {
      p.loadImage(pic1, setImage);
    };

    p.setup = () => {
      p.createCanvas(600, 600);
      p.noCursor();
      p.noStroke();
    };

    p.draw = () => {
      const tileCount = p.floor(p.width / p.max(p.mouseX, 5));
      const rectSize = p.width / p.max(tileCount, 1);

      img.loadPixels();
      colors = [];

      for (let gridY = 0; gridY < tileCount; gridY++) {
        for (let gridX = 0; gridX < tileCount; gridX++) {
          const px = p.int(gridX * rectSize);
          const py = p.int(gridY * rectSize);
          const i = (py * img.width + px) * 4;
          const c = p.color(
            img.pixels[i],
            img.pixels[i + 1],
            img.pixels[i + 2],
            img.pixels[i + 3]
          );
          colors.push(c);
        }
      }

      gd.sortColors(p, colors, sortMode);

      let i = 0;
      for (let gridY = 0; gridY < tileCount; gridY++) {
        for (let gridX = 0; gridX < tileCount; gridX++) {
          p.fill(colors[i]);
          p.rect(gridX * rectSize, gridY * rectSize, rectSize, rectSize);
          i++;
        }
      }
    };

    p.keyPressed = () => {
      if (p.key === '1') p.loadImage(pic1, setImage);
      if (p.key === '2') p.loadImage(pic2, setImage);
      if (p.key === '3') p.loadImage(pic3, setImage);
      if (p.key === '4') p.loadImage(pic4, setImage);

      if (p.key === '5') sortMode = null;
      if (p.key === '6') sortMode = gd.HUE;
      if (p.key === '7') sortMode = gd.SATURATION;
      if (p.key === '8') sortMode = gd.BRIGHTNESS;
      if (p.key === '9') sortMode = gd.GRAYSCALE;
    };
  });
  return '';
};
