import p5 from 'p5';
import module_1 from './assets/P_2_1_1_04/module_1.svg';
import module_2 from './assets/P_2_1_1_04/module_2.svg';
import module_3 from './assets/P_2_1_1_04/module_3.svg';
import module_4 from './assets/P_2_1_1_04/module_4.svg';
import module_5 from './assets/P_2_1_1_04/module_5.svg';
import module_6 from './assets/P_2_1_1_04/module_6.svg';
import module_7 from './assets/P_2_1_1_04/module_7.svg';
export default { title: 'P2：Shape' };

declare let globalP5Instance: p5;

/**
 * HELLO, SHAPE　～その１
 * [マウス]
 * x座標：直線の長さ
 * y座標：直線の太さ
 */
export const P_2_0_01 = () => {
  if (!!globalP5Instance) globalP5Instance.remove();
  globalP5Instance = new p5((p: p5) => {
    p.setup = () => {
      p.createCanvas(550, 550);
      p.strokeCap(p.SQUARE);
    };
    p.draw = () => {
      p.background(255);
      p.translate(p.width / 2, p.height / 2);

      const circleResolution = p.int(p.map(p.mouseY, 0, p.height, 2, 80));
      const radius = p.mouseX - p.width / 2;
      const angle = p.TAU / circleResolution;

      p.strokeWeight(p.mouseY / 20);

      for (let i = 0; i <= circleResolution; i++) {
        const x = p.cos(angle * i) * radius;
        const y = p.sin(angle * i) * radius;
        p.line(0, 0, x, y);
      }
    };
  });
  return '';
};

/**
 * HELLO, SHAPE　～その２
 * [マウス：左クリックを押した状態で]
 * x座標：多角形の大きさ
 * y座標：多角形の角数
 * [キー]
 * Delete/Backspace：リセット
 */
export const P_2_0_02 = () => {
  if (!!globalP5Instance) globalP5Instance.remove();
  globalP5Instance = new p5((p: p5) => {
    p.setup = () => {
      p.createCanvas(720, 720);
      p.noFill();
      p.background(255);
      p.strokeWeight(2);
      p.stroke(0, 25);
    };
    p.draw = () => {
      if (p.mouseIsPressed && p.mouseButton === p.LEFT) {
        p.push();
        p.translate(p.width / 2, p.height / 2);

        const circleResolution = p.int(
          p.map(p.mouseY + 100, 0, p.height, 2, 10)
        );
        const radius = p.mouseX - p.width / 2;
        const angle = p.TAU / circleResolution;

        p.beginShape();
        for (let i = 0; i <= circleResolution; i++) {
          const x = p.cos(angle * i) * radius;
          const y = p.sin(angle * i) * radius;
          p.vertex(x, y);
        }
        p.endShape();

        p.pop();
      }
    };
    p.keyReleased = () => {
      if (p.keyCode === p.DELETE || p.keyCode === p.BACKSPACE)
        p.background(255);
    };
  });
  return '';
};

/**
 * HELLO, SHAPE　～その３
 * [マウス：左クリックを押した状態で]
 * x座標：多角形の大きさ
 * y座標：多角形の角数
 * [キー]
 * Delete/Backspace：リセット
 * 1-3：線の色変更
 */
export const P_2_0_03 = () => {
  if (!!globalP5Instance) globalP5Instance.remove();
  let strokeColor: p5.Color;

  globalP5Instance = new p5((p: p5) => {
    p.setup = () => {
      p.createCanvas(720, 720);
      p.colorMode(p.HSB, 360, 100, 100, 100);
      p.noFill();
      p.strokeWeight(2);
      strokeColor = p.color(0, 10);
    };
    p.draw = () => {
      if (p.mouseIsPressed && p.mouseButton === p.LEFT) {
        p.push();
        p.translate(p.width / 2, p.height / 2);

        const circleResolution = p.int(
          p.map(p.mouseY + 100, 0, p.height, 2, 10)
        );
        const radius = p.mouseX - p.width / 2;
        const angle = p.TAU / circleResolution;

        p.stroke(strokeColor);

        p.beginShape();
        for (let i = 0; i <= circleResolution; i++) {
          const x = p.cos(angle * i) * radius;
          const y = p.sin(angle * i) * radius;
          p.vertex(x, y);
        }
        p.endShape();

        p.pop();
      }
    };
    p.keyReleased = () => {
      if (p.keyCode === p.DELETE || p.keyCode === p.BACKSPACE)
        p.background(0, 0, 100);

      if (p.key === '1') strokeColor = p.color(0, 10);
      if (p.key === '2') strokeColor = p.color(192, 100, 64, 10);
      if (p.key === '3') strokeColor = p.color(52, 100, 71, 10);
    };
  });
  return '';
};

/**
 * グリッドと整列　～その１
 * [マウス]
 * x座標：右下がりの斜線の太さ
 * y座標：右上がりの斜線の太さ
 * 左クリック：ランダム値の更新
 * [キー]
 * 1-3：線端の形状の切替
 */
export const P_2_1_1_01 = () => {
  if (!!globalP5Instance) globalP5Instance.remove();
  const tileCount = 20;

  let actRandomSeed = 0;
  let actStrokeCap: p5.STROKE_CAP;

  globalP5Instance = new p5((p: p5) => {
    p.setup = () => {
      p.createCanvas(600, 600);
      actStrokeCap = p.ROUND;
    };
    p.draw = () => {
      p.clear();
      p.strokeCap(actStrokeCap);

      p.randomSeed(actRandomSeed);

      for (let gridY = 0; gridY < tileCount; gridY++) {
        for (let gridX = 0; gridX < tileCount; gridX++) {
          const posX = (p.width / tileCount) * gridX;
          const posY = (p.height / tileCount) * gridY;

          const toggle = p.int(p.random(0, 2));

          if (toggle === 0) {
            p.strokeWeight(p.mouseX / 20);
            p.line(
              posX,
              posY,
              posX + p.width / tileCount,
              posY + p.height / tileCount
            );
          }
          if (toggle === 1) {
            p.strokeWeight(p.mouseY / 20);
            p.line(
              posX,
              posY + p.width / tileCount,
              posX + p.height / tileCount,
              posY
            );
          }
        }
      }
    };
    p.mousePressed = () => {
      actRandomSeed = p.random(100000);
    };
    p.keyReleased = () => {
      if (p.key === '1') actStrokeCap = p.ROUND;
      if (p.key === '2') actStrokeCap = p.SQUARE;
      if (p.key === '3') actStrokeCap = p.PROJECT;
    };
  });
  return '';
};

/**
 * グリッドと整列　～その２
 * [マウス]
 * x座標：右下がりの斜線の太さ
 * y座標：右上がりの斜線の太さ
 * 左クリック：ランダム値の更新
 * [キー]
 * 1-3：線端の形状の切替
 * 4-5：線の色変更
 * 6-7：線の透明度変更
 * 0：線を黒に変更
 */
export const P_2_1_1_02 = () => {
  if (!!globalP5Instance) globalP5Instance.remove();
  const tileCount = 20;

  let actRandomSeed = 0;
  let actStrokeCap: p5.STROKE_CAP;

  let colorLeft: p5.Color;
  let colorRight: p5.Color;
  let alphaLeft = 255;
  let alphaRight = 255;

  globalP5Instance = new p5((p: p5) => {
    p.setup = () => {
      p.createCanvas(600, 600);
      actStrokeCap = p.ROUND;
      colorLeft = p.color(197, 0, 123, alphaLeft);
      colorRight = p.color(87, 35, 129, alphaRight);
    };
    p.draw = () => {
      p.clear();
      p.strokeCap(actStrokeCap);

      p.randomSeed(actRandomSeed);

      for (let gridY = 0; gridY < tileCount; gridY++) {
        for (let gridX = 0; gridX < tileCount; gridX++) {
          const posX = (p.width / tileCount) * gridX;
          const posY = (p.height / tileCount) * gridY;

          const toggle = p.int(p.random(0, 2));

          if (toggle === 0) {
            p.stroke(colorLeft);
            p.strokeWeight(p.mouseX / 10);
            p.line(
              posX,
              posY,
              posX + p.width / tileCount,
              posY + p.height / tileCount
            );
          }
          if (toggle === 1) {
            p.stroke(colorRight);
            p.strokeWeight(p.mouseY / 10);
            p.line(
              posX,
              posY + p.width / tileCount,
              posX + p.height / tileCount,
              posY
            );
          }
        }
      }
    };
    p.mousePressed = () => {
      actRandomSeed = p.random(100000);
    };

    const colorsEqual = (col1: p5.Color, col2: p5.Color) =>
      col1.toString() === col2.toString();

    p.keyReleased = () => {
      if (p.key === '1') actStrokeCap = p.ROUND;
      if (p.key === '2') actStrokeCap = p.SQUARE;
      if (p.key === '3') actStrokeCap = p.PROJECT;

      const black = p.color(0, 0, 0, 255);
      if (p.key === '4') {
        if (colorsEqual(colorLeft, black)) {
          colorLeft = p.color(197, 0, 123, alphaLeft);
        } else {
          colorLeft = p.color(0, 0, 0, alphaLeft);
        }
      }
      if (p.key === '5') {
        if (colorsEqual(colorRight, black)) {
          colorRight = p.color(87, 35, 129, alphaRight);
        } else {
          colorRight = p.color(0, 0, 0, alphaRight);
        }
      }

      if (p.key === '6') {
        if (alphaLeft === 255) {
          alphaLeft = 127;
        } else {
          alphaLeft = 255;
        }
        colorLeft = p.color(
          p.red(colorLeft),
          p.green(colorLeft),
          p.blue(colorLeft),
          alphaLeft
        );
      }
      if (p.key === '7') {
        if (alphaRight === 255) {
          alphaRight = 127;
        } else {
          alphaRight = 255;
        }
        colorRight = p.color(
          p.red(colorRight),
          p.green(colorRight),
          p.blue(colorRight),
          alphaRight
        );
      }

      if (p.key === '0') {
        actStrokeCap = p.ROUND;
        alphaLeft = 255;
        alphaRight = 255;
        colorLeft = p.color(0, 0, 0, alphaLeft);
        colorRight = p.color(0, 0, 0, alphaRight);
      }
    };
  });
  return '';
};

/**
 * グリッドと整列　～その３
 * [マウス]
 * x座標：斜線の太さ
 * y座標：グリッドの解像度
 * 左クリック：ランダム値の更新
 * [キー]
 * 1-2：線の色変更
 * 3-4：線の透明度変更
 * 0：線を黒に変更
 */
export const P_2_1_1_03 = () => {
  if (!!globalP5Instance) globalP5Instance.remove();
  let tileCount = 1;
  let actRandomSeed = 0;

  let colorLeft: p5.Color;
  let colorRight: p5.Color;
  let alphaLeft = 0;
  let alphaRight = 100;
  let transparentLeft = false;
  let transparentRight = false;

  globalP5Instance = new p5((p: p5) => {
    p.setup = () => {
      p.createCanvas(600, 600);
      p.colorMode(p.HSB, 360, 100, 100, 100);

      colorRight = p.color(0, 0, 0, alphaRight);
      colorLeft = p.color(323, 100, 77, alphaLeft);
    };
    p.draw = () => {
      p.clear();
      p.strokeWeight(p.mouseX / 15);

      p.randomSeed(actRandomSeed);

      tileCount = p.mouseY / 15;

      for (let gridY = 0; gridY < tileCount; gridY++) {
        for (let gridX = 0; gridX < tileCount; gridX++) {
          const posX = (p.width / tileCount) * gridX;
          const posY = (p.height / tileCount) * gridY;

          alphaLeft = transparentLeft ? gridY * 10 : 100;

          colorLeft = p.color(
            p.hue(colorLeft),
            p.saturation(colorLeft),
            p.brightness(colorLeft),
            alphaLeft
          );

          alphaRight = transparentRight ? 100 - gridY * 10 : 100;

          colorRight = p.color(
            p.hue(colorRight),
            p.saturation(colorRight),
            p.brightness(colorRight),
            alphaRight
          );

          const toggle = p.int(p.random(0, 2));

          if (toggle === 0) {
            p.stroke(colorLeft);
            p.line(
              posX,
              posY,
              posX + p.width / tileCount / 2,
              posY + p.height / tileCount
            );
            p.line(
              posX + p.width / tileCount / 2,
              posY,
              posX + p.width / tileCount,
              posY + p.height / tileCount
            );
          }
          if (toggle === 1) {
            p.stroke(colorRight);
            p.line(
              posX,
              posY + p.width / tileCount,
              posX + p.height / tileCount / 2,
              posY
            );
            p.line(
              posX + p.height / tileCount / 2,
              posY + p.width / tileCount,
              posX + p.height / tileCount,
              posY
            );
          }
        }
      }
    };
    p.mousePressed = () => {
      actRandomSeed = p.random(100000);
    };

    const colorsEqual = (col1: p5.Color, col2: p5.Color) =>
      col1.toString() === col2.toString();

    p.keyReleased = () => {
      if (p.key === '1') {
        if (colorsEqual(colorLeft, p.color(273, 73, 51, alphaLeft))) {
          colorLeft = p.color(323, 100, 77, alphaLeft);
        } else {
          colorLeft = p.color(273, 73, 51, alphaLeft);
        }
      }
      if (p.key === '2') {
        if (colorsEqual(colorRight, p.color(0, 0, 0, alphaRight))) {
          colorRight = p.color(192, 100, 64, alphaRight);
        } else {
          colorRight = p.color(0, 0, 0, alphaRight);
        }
      }
      if (p.key === '3') {
        transparentLeft = !transparentLeft;
      }
      if (p.key === '4') {
        transparentRight = !transparentRight;
      }

      if (p.key === '0') {
        transparentLeft = false;
        transparentRight = false;
        colorLeft = p.color(323, 100, 77, alphaLeft);
        colorRight = p.color(0, 0, 0, alphaRight);
      }
    };
  });
  return '';
};

/**
 * グリッドと整列　～その４
 * [マウス]
 * x/y座標：SVG画像の向き
 * [キー]
 * d：サイズ変更モードの切替
 * g：グリッドの解像度変更
 * 1-7：SVG画像の変更
 * ↑↓：SVG画像のサイズ変更
 * ←→：SVG画像の向き変更
 */
export const P_2_1_1_04 = () => {
  if (!!globalP5Instance) globalP5Instance.remove();
  let tileCount = 10;

  let tileWidth: number;
  let tileHeight: number;
  let shapeSize = 50;
  let newShapeSize = shapeSize;
  let shapeAngle = 0;
  let currentShape: p5.Image;
  let shapes: p5.Image[];

  let sizeMode = 0;

  globalP5Instance = new p5((p: p5) => {
    p.preload = () => {
      shapes = [];
      shapes.push(p.loadImage(module_1));
      shapes.push(p.loadImage(module_2));
      shapes.push(p.loadImage(module_3));
      shapes.push(p.loadImage(module_4));
      shapes.push(p.loadImage(module_5));
      shapes.push(p.loadImage(module_6));
      shapes.push(p.loadImage(module_7));
    };
    p.setup = () => {
      p.createCanvas(600, 600);
      p.imageMode(p.CENTER);
      // set the current shape to the first in the array
      currentShape = shapes[0];
      tileWidth = p.width / tileCount;
      tileHeight = p.height / tileCount;
    };
    p.draw = () => {
      p.clear();

      for (let gridY = 0; gridY < tileCount; gridY++) {
        for (let gridX = 0; gridX < tileCount; gridX++) {
          const posX = tileWidth * gridX + tileWidth / 2;
          const posY = tileHeight * gridY + tileWidth / 2;

          // calculate angle between mouse position and actual position of the shape
          const angle =
            p.atan2(p.mouseY - posY, p.mouseX - posX) +
            shapeAngle * (p.PI / 180);

          if (sizeMode === 0) newShapeSize = shapeSize;
          if (sizeMode === 1)
            newShapeSize =
              shapeSize * 1.5 -
              p.map(
                p.dist(p.mouseX, p.mouseY, posX, posY),
                0,
                500,
                5,
                shapeSize
              );
          if (sizeMode === 2)
            newShapeSize = p.map(
              p.dist(p.mouseX, p.mouseY, posX, posY),
              0,
              500,
              5,
              shapeSize
            );

          p.push();
          p.translate(posX, posY);
          p.rotate(angle);
          p.noStroke();
          p.image(currentShape, 0, 0, newShapeSize, newShapeSize);
          p.pop();
        }
      }
    };
    p.keyReleased = () => {
      if (p.key === 'd' || p.key === 'D') sizeMode = (sizeMode + 1) % 3;
      if (p.key === 'g' || p.key === 'G') {
        tileCount += 5;
        if (tileCount > 20) {
          tileCount = 10;
        }
        tileWidth = p.width / tileCount;
        tileHeight = p.height / tileCount;
      }

      if (p.key === '1') currentShape = shapes[0];
      if (p.key === '2') currentShape = shapes[1];
      if (p.key === '3') currentShape = shapes[2];
      if (p.key === '4') currentShape = shapes[3];
      if (p.key === '5') currentShape = shapes[4];
      if (p.key === '6') currentShape = shapes[5];
      if (p.key === '7') currentShape = shapes[6];

      if (p.keyCode === p.UP_ARROW) shapeSize += 5;
      if (p.keyCode === p.DOWN_ARROW) shapeSize = p.max(shapeSize - 5, 5);
      if (p.keyCode === p.LEFT_ARROW) shapeAngle += 5;
      if (p.keyCode === p.RIGHT_ARROW) shapeAngle -= 5;
    };
  });
  return '';
};
