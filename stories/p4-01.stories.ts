import p5 from 'p5';
import imgP_4_0_01 from './assets/P_4_0_01/image.jpg';
import imgP_4_1_1_01 from './assets/P_4_1_1_01/image.jpg';
import imgP_4_1_2_01 from './assets/P_4_1_2_01/pic.png';
import imgP4_2_1_01_01 from './assets/P_4_2_1_01/layer1_01.png';
import imgP4_2_1_01_02 from './assets/P_4_2_1_01/layer1_02.png';
import imgP4_2_1_01_03 from './assets/P_4_2_1_01/layer1_03.png';
import imgP4_2_1_01_04 from './assets/P_4_2_1_01/layer1_04.png';
import imgP4_2_1_01_05 from './assets/P_4_2_1_01/layer1_05.png';
import imgP4_2_1_01_06 from './assets/P_4_2_1_01/layer1_06.png';
import imgP4_2_1_01_07 from './assets/P_4_2_1_01/layer1_07.png';
import imgP4_2_1_01_08 from './assets/P_4_2_1_01/layer1_08.png';
import imgP4_2_1_01_09 from './assets/P_4_2_1_01/layer1_09.png';
import imgP4_2_1_01_10 from './assets/P_4_2_1_01/layer1_10.png';
import imgP4_2_1_01_11 from './assets/P_4_2_1_01/layer1_10.png';
import imgP4_2_1_02_01 from './assets/P_4_2_1_01/layer2_01.png';
import imgP4_2_1_02_02 from './assets/P_4_2_1_01/layer2_02.png';
import imgP4_2_1_02_03 from './assets/P_4_2_1_01/layer2_03.png';
import imgP4_2_1_02_04 from './assets/P_4_2_1_01/layer2_04.png';
import imgP4_2_1_02_05 from './assets/P_4_2_1_01/layer2_05.png';
import imgP4_2_1_03_01 from './assets/P_4_2_1_01/layer3_01.png';
import imgP4_2_1_03_02 from './assets/P_4_2_1_01/layer3_02.png';
import imgP4_2_1_03_03 from './assets/P_4_2_1_01/layer3_03.png';
import imgP4_2_1_03_04 from './assets/P_4_2_1_01/layer3_04.png';
import imgP4_2_1_03_05 from './assets/P_4_2_1_01/layer3_05.png';
import imgP4_2_1_03_06 from './assets/P_4_2_1_01/layer3_06.png';
import imgP4_2_1_03_07 from './assets/P_4_2_1_01/layer3_07.png';
import imgP4_2_1_03_08 from './assets/P_4_2_1_01/layer3_08.png';
import imgP4_2_1_03_09 from './assets/P_4_2_1_01/layer3_09.png';
import imgP4_2_1_03_10 from './assets/P_4_2_1_01/layer3_10.png';
import imgP4_2_1_03_11 from './assets/P_4_2_1_01/layer3_11.png';
import imgP4_2_1_03_12 from './assets/P_4_2_1_01/layer3_12.png';
import imgP4_2_1_03_13 from './assets/P_4_2_1_01/layer3_13.png';
import imgP4_2_1_03_14 from './assets/P_4_2_1_01/layer3_14.png';
import imgP4_2_1_03_15 from './assets/P_4_2_1_01/layer3_15.png';
import imgP4_2_1_03_16 from './assets/P_4_2_1_01/layer3_16.png';
import imgP4_2_1_03_17 from './assets/P_4_2_1_01/layer3_17.png';
import imgP4_2_1_03_18 from './assets/P_4_2_1_01/layer3_18.png';
import imgP4_2_1_03_19 from './assets/P_4_2_1_01/layer3_19.png';
import imgP4_2_1_03_20 from './assets/P_4_2_1_01/layer3_20.png';
import imgP4_2_1_03_21 from './assets/P_4_2_1_01/layer3_21.png';
import imgP4_2_1_03_22 from './assets/P_4_2_1_01/layer3_22.png';
export default { title: 'P4：Image' };

declare let globalP5Instance: p5;

/**
 * HELLO, IMAGE
 * [マウス]
 * x座標：水平方向のタイル数
 * y座標：垂直方向のタイル数
 */
export const P_4_0_01 = () => {
  if (!!globalP5Instance) globalP5Instance.remove();
  let img: p5.Image;

  globalP5Instance = new p5((p: p5) => {
    p.preload = () => {
      img = p.loadImage(imgP_4_0_01);
    };
    p.setup = () => {
      p.createCanvas(650, 450);
    };
    p.draw = () => {
      if (p.mouseX < 0 || p.mouseY < 0) return; // ←　フリーズ防止

      const tileCountX = p.mouseX / 3 + 1;
      const tileCountY = p.mouseY / 3 + 1;
      const stepX = p.width / tileCountX;
      const stepY = p.height / tileCountY;
      for (let gridY = 0; gridY < p.height; gridY += stepY) {
        for (let gridX = 0; gridX < p.width; gridX += stepX) {
          p.image(img, gridX, gridY, stepX, stepY);
        }
      }
    };
  });
  return '';
};

/**
 * グリッド状に配置した切り抜き
 * [マウス]
 * x/y座標：切り抜き部分の位置
 * 左クリック：切り抜き部分のクリック
 * [キー]
 * 1-3：切り抜きサイズの切り替え
 * r：ランダム on/off
 */
export const P_4_1_1_01 = () => {
  if (!!globalP5Instance) globalP5Instance.remove();
  let img: p5.Image;
  let tileCountX = 4;
  let tileCountY = 4;
  let imgTiles: p5.Image[] = [];
  let tileWidth: number;
  let tileHeight: number;
  let cropX: number;
  let cropY: number;
  let selectMode = true;
  let randomMode = false;

  globalP5Instance = new p5((p: p5) => {
    p.preload = () => {
      img = p.loadImage(imgP_4_1_1_01);
    };
    p.setup = () => {
      p.createCanvas(800, 600);

      p.image(img, 0, 0);
      tileWidth = p.width / tileCountY;
      tileHeight = p.height / tileCountX;

      p.noCursor();
      p.noFill();
      p.stroke(255);
    };
    p.draw = () => {
      if (selectMode) {
        // in selection mode, a white selection rectangle is drawn over the image
        cropX = p.constrain(p.mouseX, 0, p.width - tileWidth);
        cropY = p.constrain(p.mouseY, 0, p.height - tileHeight);
        p.image(img, 0, 0);
        p.rect(cropX, cropY, tileWidth, tileHeight);
      } else {
        // reassemble image
        let imgIndex = 0;
        for (let gridY = 0; gridY < tileCountY; gridY++) {
          for (let gridX = 0; gridX < tileCountX; gridX++) {
            p.image(imgTiles[imgIndex], gridX * tileWidth, gridY * tileHeight);
            imgIndex++;
          }
        }
      }
    };
    p.mouseMoved = () => {
      selectMode = true;
    };
    const cropTiles = () => {
      tileWidth = p.width / tileCountY;
      tileHeight = p.height / tileCountX;
      imgTiles = [];

      for (let gridY = 0; gridY < tileCountY; gridY++) {
        for (let gridX = 0; gridX < tileCountX; gridX++) {
          if (randomMode) {
            cropX = p.int(
              p.random(p.mouseX - tileWidth / 2, p.mouseX + tileWidth / 2)
            );
            cropY = p.int(
              p.random(p.mouseY - tileHeight / 2, p.mouseY + tileHeight / 2)
            );
          }
          cropX = p.constrain(cropX, 0, p.width - tileWidth);
          cropY = p.constrain(cropY, 0, p.height - tileHeight);
          imgTiles.push(img.get(cropX, cropY, tileWidth, tileHeight));
        }
      }
    };
    p.mouseReleased = () => {
      selectMode = false;
      cropTiles();
    };
    p.keyReleased = () => {
      if (p.key === 'r' || p.key === 'R') {
        randomMode = !randomMode;
        cropTiles();
      }
      if (p.key === '1') {
        tileCountX = 4;
        tileCountY = 4;
        cropTiles();
      }
      if (p.key === '2') {
        tileCountX = 10;
        tileCountY = 10;
        cropTiles();
      }
      if (p.key === '3') {
        tileCountX = 20;
        tileCountY = 20;
        cropTiles();
      }
    };
  });
  return '';
};

/**
 * 切り抜きのフィードバック　～その１
 * [キー]
 * Delete/Backspace：リセット
 */
export const P_4_1_2_01 = () => {
  if (!!globalP5Instance) globalP5Instance.remove();
  let img: p5.Image;

  globalP5Instance = new p5((p: p5) => {
    p.preload = () => {
      img = p.loadImage(imgP_4_1_2_01);
    };
    p.setup = () => {
      p.createCanvas(1024, 780);
      p.image(img, 0, 100);
    };
    p.draw = () => {
      const x1 = p.floor(p.random(p.width));
      const y1 = 50;
      const x2 = p.round(x1 + p.random(-7, 7));
      const y2 = p.round(y1 + p.random(-5, 5));
      const w = p.floor(p.random(10, 40));
      const h = p.height - 100;
      p.set(x2, y2, p.get(x1, y1, w, h));
    };
    p.keyReleased = () => {
      if (p.keyCode === p.DELETE || p.keyCode === p.BACKSPACE) {
        p.clear();
        p.image(img, 0, 100);
      }
    };
  });
  return '';
};

/**
 * 切り抜きのフィードバック　～その２
 * [キー]
 * Delete/Backspace：リセット
 */
export const P_4_1_2_02 = () => {
  if (!!globalP5Instance) globalP5Instance.remove();
  let img: p5.Image;

  globalP5Instance = new p5((p: p5) => {
    p.preload = () => {
      img = p.loadImage(imgP_4_1_2_01);
    };
    p.setup = () => {
      p.createCanvas(1024, 780);
      p.image(img, 0, 0);
    };
    p.draw = () => {
      const x1 = p.random(p.width);
      const y1 = p.random(p.height);
      const x2 = p.round(x1 + p.random(-10, 10));
      const y2 = p.round(y1 + p.random(-10, 10));
      const w = 150;
      const h = 50;
      p.set(x2, y2, p.get(x1, y1, w, h));
    };
    p.keyReleased = () => {
      if (p.keyCode === p.DELETE || p.keyCode === p.BACKSPACE) {
        p.clear();
        p.image(img, 0, 0);
      }
    };
  });
  return '';
};

/**
 * 画像の集合で作るコラージュ　～その１
 * [キー]
 * 1-3：3つのレイヤーの中の1レイヤーをランダムに再配置
 */
export const P_4_2_1_01 = () => {
  if (!!globalP5Instance) globalP5Instance.remove();
  class CollageItem {
    image: p5.Image;
    x: number;
    y: number;
    rotation: number;
    scaling: number;

    constructor(image: p5.Image) {
      this.image = image;
      this.x = 0;
      this.y = 0;
      this.rotation = 0;
      this.scaling = 1;
    }
  }

  const layer1Images: p5.Image[] = [];
  const layer2Images: p5.Image[] = [];
  const layer3Images: p5.Image[] = [];

  let layer1Items: CollageItem[] = [];
  let layer2Items: CollageItem[] = [];
  let layer3Items: CollageItem[] = [];

  globalP5Instance = new p5((p: p5) => {
    const generateCollageItems = (
      layerImages: p5.Image[],
      count: number,
      posX: number,
      posY: number,
      rangeX: number,
      rangeY: number,
      scaleStart: number,
      scaleEnd: number,
      rotationStart: number,
      rotationEnd: number
    ) => {
      const layerItems: CollageItem[] = [];
      for (let i = 0; i < count; i++) {
        const index = i % layerImages.length;
        const item = new CollageItem(layerImages[index]);
        item.x = posX + p.random(-rangeX / 2, rangeX / 2);
        item.y = posY + p.random(-rangeY / 2, rangeY / 2);
        item.scaling = p.random(scaleStart, scaleEnd);
        item.rotation = p.random(rotationStart, rotationEnd);
        layerItems.push(item);
      }
      return layerItems;
    };
    const drawCollageItems = (layerItems: CollageItem[]) => {
      layerItems.forEach(item => {
        p.push();
        p.translate(item.x, item.y);
        p.rotate(item.rotation);
        p.scale(item.scaling);
        p.image(item.image, 0, 0);
        p.pop();
      });
    };

    p.preload = () => {
      layer1Images.push(p.loadImage(imgP4_2_1_01_01));
      layer1Images.push(p.loadImage(imgP4_2_1_01_02));
      layer1Images.push(p.loadImage(imgP4_2_1_01_03));
      layer1Images.push(p.loadImage(imgP4_2_1_01_04));
      layer1Images.push(p.loadImage(imgP4_2_1_01_05));
      layer1Images.push(p.loadImage(imgP4_2_1_01_06));
      layer1Images.push(p.loadImage(imgP4_2_1_01_07));
      layer1Images.push(p.loadImage(imgP4_2_1_01_08));
      layer1Images.push(p.loadImage(imgP4_2_1_01_09));
      layer1Images.push(p.loadImage(imgP4_2_1_01_10));
      layer1Images.push(p.loadImage(imgP4_2_1_01_11));

      layer2Images.push(p.loadImage(imgP4_2_1_02_01));
      layer2Images.push(p.loadImage(imgP4_2_1_02_02));
      layer2Images.push(p.loadImage(imgP4_2_1_02_03));
      layer2Images.push(p.loadImage(imgP4_2_1_02_04));
      layer2Images.push(p.loadImage(imgP4_2_1_02_05));

      layer3Images.push(p.loadImage(imgP4_2_1_03_01));
      layer3Images.push(p.loadImage(imgP4_2_1_03_02));
      layer3Images.push(p.loadImage(imgP4_2_1_03_03));
      layer3Images.push(p.loadImage(imgP4_2_1_03_04));
      layer3Images.push(p.loadImage(imgP4_2_1_03_05));
      layer3Images.push(p.loadImage(imgP4_2_1_03_06));
      layer3Images.push(p.loadImage(imgP4_2_1_03_07));
      layer3Images.push(p.loadImage(imgP4_2_1_03_08));
      layer3Images.push(p.loadImage(imgP4_2_1_03_09));
      layer3Images.push(p.loadImage(imgP4_2_1_03_10));
      layer3Images.push(p.loadImage(imgP4_2_1_03_11));
      layer3Images.push(p.loadImage(imgP4_2_1_03_12));
      layer3Images.push(p.loadImage(imgP4_2_1_03_13));
      layer3Images.push(p.loadImage(imgP4_2_1_03_14));
      layer3Images.push(p.loadImage(imgP4_2_1_03_15));
      layer3Images.push(p.loadImage(imgP4_2_1_03_16));
      layer3Images.push(p.loadImage(imgP4_2_1_03_17));
      layer3Images.push(p.loadImage(imgP4_2_1_03_18));
      layer3Images.push(p.loadImage(imgP4_2_1_03_19));
      layer3Images.push(p.loadImage(imgP4_2_1_03_20));
      layer3Images.push(p.loadImage(imgP4_2_1_03_21));
      layer3Images.push(p.loadImage(imgP4_2_1_03_22));
    };
    p.setup = () => {
      p.createCanvas(1024, 768);
      p.imageMode(p.CENTER);

      layer1Items = generateCollageItems(
        layer1Images,
        100,
        p.width / 2,
        p.height / 2,
        p.width,
        p.height,
        0.1,
        0.5,
        0,
        0
      );
      layer2Items = generateCollageItems(
        layer2Images,
        150,
        p.width / 2,
        p.height / 2,
        p.width,
        p.height,
        0.1,
        0.3,
        -p.HALF_PI,
        p.HALF_PI
      );
      layer3Items = generateCollageItems(
        layer3Images,
        110,
        p.width / 2,
        p.height / 2,
        p.width,
        p.height,
        0.1,
        0.4,
        0,
        0
      );

      drawCollageItems(layer1Items);
      drawCollageItems(layer2Items);
      drawCollageItems(layer3Items);
    };
    p.keyReleased = () => {
      if (p.key === '1')
        layer1Items = generateCollageItems(
          layer1Images,
          p.random(50, 200),
          p.width / 2,
          p.height / 2,
          p.width,
          p.height,
          0.1,
          0.5,
          0,
          0
        );
      if (p.key === '2')
        layer2Items = generateCollageItems(
          layer2Images,
          p.random(25, 300),
          p.width / 2,
          p.height / 2,
          p.width,
          p.height,
          0.1,
          p.random(0.3, 0.8),
          -p.HALF_PI,
          p.HALF_PI
        );
      if (p.key === '3')
        layer3Items = generateCollageItems(
          layer3Images,
          p.random(50, 300),
          p.width / 2,
          p.height / 2,
          p.width,
          p.height,
          0.1,
          p.random(0.2, 0.6),
          -0.05,
          0.05
        );

      p.clear();

      drawCollageItems(layer1Items);
      drawCollageItems(layer2Items);
      drawCollageItems(layer3Items);
    };
  });
  return '';
};

/**
 * 画像の集合で作るコラージュ　～その２
 * [キー]
 * 1-3：3つのレイヤーの中の1レイヤーをランダムに再配置
 */
export const P_4_2_1_02 = () => {
  if (!!globalP5Instance) globalP5Instance.remove();
  const layer1Images: p5.Image[] = [];
  const layer2Images: p5.Image[] = [];
  const layer3Images: p5.Image[] = [];

  let layer1Items: CollageItem[] = [];
  let layer2Items: CollageItem[] = [];
  let layer3Items: CollageItem[] = [];

  class CollageItem {
    image: p5.Image;
    a: number;
    l: number;
    rotation: number;
    scaling: number;

    constructor(image: p5.Image) {
      this.image = image;
      this.a = 0;
      this.l = 0;
      this.rotation = 0;
      this.scaling = 1;
    }
  }

  globalP5Instance = new p5((p: p5) => {
    const generateCollageItems = (
      layerImages: p5.Image[],
      count: number,
      angle: number,
      length: number,
      rangeA: number,
      rangeL: number,
      scaleStart: number,
      scaleEnd: number,
      rotationStart: number,
      rotationEnd: number
    ) => {
      const layerItems: CollageItem[] = [];
      for (let i = 0; i < layerImages.length; i++) {
        for (let j = 0; j < count; j++) {
          const collageItem = new CollageItem(layerImages[i]);
          collageItem.a = angle + p.random(-rangeA / 2, rangeA / 2);
          collageItem.l = length + p.random(-rangeL / 2, rangeL / 2);
          collageItem.scaling = p.random(scaleStart, scaleEnd);
          collageItem.rotation =
            collageItem.a + p.HALF_PI + p.random(rotationStart, rotationEnd);
          layerItems.push(collageItem);
        }
      }
      return layerItems;
    };
    const drawCollageItems = (layerItems: CollageItem[]) => {
      layerItems.forEach(item => {
        p.push();
        p.translate(
          p.width / 2 + p.cos(item.a) * item.l,
          p.height / 2 + p.sin(item.a) * item.l
        );
        p.rotate(item.rotation);
        p.scale(item.scaling);
        p.image(item.image, 0, 0);
        p.pop();
      });
    };

    p.preload = () => {
      layer1Images.push(p.loadImage(imgP4_2_1_01_01));
      layer1Images.push(p.loadImage(imgP4_2_1_01_02));
      layer1Images.push(p.loadImage(imgP4_2_1_01_03));
      layer1Images.push(p.loadImage(imgP4_2_1_01_04));
      layer1Images.push(p.loadImage(imgP4_2_1_01_05));
      layer1Images.push(p.loadImage(imgP4_2_1_01_06));
      layer1Images.push(p.loadImage(imgP4_2_1_01_07));
      layer1Images.push(p.loadImage(imgP4_2_1_01_08));
      layer1Images.push(p.loadImage(imgP4_2_1_01_09));
      layer1Images.push(p.loadImage(imgP4_2_1_01_10));
      layer1Images.push(p.loadImage(imgP4_2_1_01_11));

      layer2Images.push(p.loadImage(imgP4_2_1_02_01));
      layer2Images.push(p.loadImage(imgP4_2_1_02_02));
      layer2Images.push(p.loadImage(imgP4_2_1_02_03));
      layer2Images.push(p.loadImage(imgP4_2_1_02_04));
      layer2Images.push(p.loadImage(imgP4_2_1_02_05));

      layer3Images.push(p.loadImage(imgP4_2_1_03_01));
      layer3Images.push(p.loadImage(imgP4_2_1_03_02));
      layer3Images.push(p.loadImage(imgP4_2_1_03_03));
      layer3Images.push(p.loadImage(imgP4_2_1_03_04));
      layer3Images.push(p.loadImage(imgP4_2_1_03_05));
      layer3Images.push(p.loadImage(imgP4_2_1_03_06));
      layer3Images.push(p.loadImage(imgP4_2_1_03_07));
      layer3Images.push(p.loadImage(imgP4_2_1_03_08));
      layer3Images.push(p.loadImage(imgP4_2_1_03_09));
      layer3Images.push(p.loadImage(imgP4_2_1_03_10));
      layer3Images.push(p.loadImage(imgP4_2_1_03_11));
      layer3Images.push(p.loadImage(imgP4_2_1_03_12));
      layer3Images.push(p.loadImage(imgP4_2_1_03_13));
      layer3Images.push(p.loadImage(imgP4_2_1_03_14));
      layer3Images.push(p.loadImage(imgP4_2_1_03_15));
      layer3Images.push(p.loadImage(imgP4_2_1_03_16));
      layer3Images.push(p.loadImage(imgP4_2_1_03_17));
      layer3Images.push(p.loadImage(imgP4_2_1_03_18));
      layer3Images.push(p.loadImage(imgP4_2_1_03_19));
      layer3Images.push(p.loadImage(imgP4_2_1_03_20));
      layer3Images.push(p.loadImage(imgP4_2_1_03_21));
      layer3Images.push(p.loadImage(imgP4_2_1_03_22));
    };
    p.setup = () => {
      p.createCanvas(1024, 768);
      p.imageMode(p.CENTER);

      layer1Items = generateCollageItems(
        layer1Images,
        10,
        0,
        p.height / 2,
        p.TAU,
        p.height,
        0.1,
        0.5,
        0,
        0
      );
      layer2Items = generateCollageItems(
        layer2Images,
        15,
        0,
        p.height / 2,
        p.TAU,
        p.height,
        0.1,
        0.3,
        -p.PI / 6,
        p.PI / 6
      );
      layer3Items = generateCollageItems(
        layer3Images,
        11,
        0,
        p.height / 2,
        p.TAU,
        p.height,
        0.1,
        0.2,
        0,
        0
      );

      drawCollageItems(layer1Items);
      drawCollageItems(layer2Items);
      drawCollageItems(layer3Items);
    };
    p.keyReleased = () => {
      if (p.key === '1')
        layer1Items = generateCollageItems(
          layer1Images,
          p.random(2, 10),
          0,
          p.height / 2,
          p.PI * 5,
          p.height,
          0.1,
          0.5,
          0,
          0
        );
      if (p.key === '2')
        layer2Items = generateCollageItems(
          layer2Images,
          p.random(10, 25),
          0,
          p.height * 0.15,
          p.PI * 5,
          150,
          0.1,
          p.random(0.3, 0.8),
          -p.PI / 6,
          p.PI / 6
        );
      if (p.key === '3')
        layer3Items = generateCollageItems(
          layer3Images,
          p.random(10, 25),
          0,
          p.height * 0.66,
          p.PI * 5,
          p.height * 0.66,
          0.1,
          p.random(0.2, 0.5),
          -0.05,
          0.05
        );

      p.clear();

      drawCollageItems(layer1Items);
      drawCollageItems(layer2Items);
      drawCollageItems(layer3Items);
    };
  });
  return '';
};
