import p5 from 'p5';
export default { title: 'P2：Shape' };

declare let globalP5Instance: p5;

/**
 * グリッドと複合モジュール　～その１
 * [マウス]
 * x座標：円の数とサイズ
 * y座標：円の位置
 * 左クリック：位置のランダム値の更新
 */
export const P_2_1_3_01 = () => {
  if (!!globalP5Instance) globalP5Instance.remove();
  const tileCountX = 10;
  const tileCountY = 10;

  let tileWidth = 0;
  let tileHeight = 0;
  let circleCount = 0;
  let endSize = 0;
  let endOffset = 0;
  let actRandomSeed = 0;

  globalP5Instance = new p5((p: p5) => {
    p.setup = () => {
      p.createCanvas(800, 800);
      tileWidth = p.width / tileCountX;
      tileHeight = p.height / tileCountY;
      p.noFill();
      p.stroke(0, 128);
    };
    p.draw = () => {
      p.background(255);
      p.randomSeed(actRandomSeed);
      p.translate(tileWidth / 2, tileHeight / 2);

      circleCount = p.mouseX / 30 + 1;
      endSize = p.map(p.mouseX, 0, p.max(p.width, p.mouseX), tileWidth / 2, 0);
      endOffset = p.map(
        p.mouseY,
        0,
        p.max(p.height, p.mouseY),
        0,
        (tileWidth - endSize) / 2
      );

      for (let gridY = 0; gridY <= tileCountY; gridY++) {
        for (let gridX = 0; gridX <= tileCountX; gridX++) {
          p.push();
          p.translate(tileWidth * gridX, tileHeight * gridY);
          p.scale(1, tileHeight / tileWidth);

          const toggle = p.int(p.random(0, 4));
          if (toggle === 0) p.rotate(-p.HALF_PI);
          if (toggle === 1) p.rotate(0);
          if (toggle === 2) p.rotate(p.HALF_PI);
          if (toggle === 3) p.rotate(p.PI);

          // draw module
          for (let i = 0; i < circleCount; i++) {
            const diameter = p.map(i, 0, circleCount, tileWidth, endSize);
            const offset = p.map(i, 0, circleCount, 0, endOffset);
            p.ellipse(offset, 0, diameter, diameter);
          }
          p.pop();
        }
      }
    };
    p.mousePressed = () => {
      actRandomSeed = p.random(100000);
    };
  });
  return '';
};

/**
 * グリッドと複合モジュール　～その２
 * [マウス]
 * x/y座標：グリッドサイズ
 * [キー]
 * 1-3：線の太さ・色
 */
export const P_2_1_3_02 = () => {
  if (!!globalP5Instance) globalP5Instance.remove();
  const count = 10;

  let lineWeight = 0;
  let strokeColor = 0;
  let backgroundColor = 0;
  let drawMode = 1;

  globalP5Instance = new p5((p: p5) => {
    p.setup = () => {
      p.createCanvas(p.windowWidth, p.windowHeight);
    };
    p.draw = () => {
      p.background(backgroundColor);

      const tileCountX = p.mouseX / 30 + 1;
      const tileCountY = p.mouseY / 30 + 1;
      const tileWidth = p.width / tileCountX;
      const tileHeight = p.height / tileCountY;

      for (let gridY = 0; gridY <= tileCountY; gridY++) {
        for (let gridX = 0; gridX <= tileCountX; gridX++) {
          const posX = tileWidth * gridX;
          const posY = tileHeight * gridY;

          const x1 = tileWidth / 2;
          const y1 = tileHeight / 2;
          let x2 = 0;
          let y2 = 0;

          p.push();
          p.translate(posX, posY);

          for (let side = 0; side < 4; side++) {
            for (let i = 0; i < count; i++) {
              // move end point around the four sides of the tile
              switch (side) {
                case 0:
                  x2 += tileWidth / count;
                  y2 = 0;
                  break;
                case 1:
                  x2 = tileWidth;
                  y2 += tileHeight / count;
                  break;
                case 2:
                  x2 -= tileWidth / count;
                  y2 = tileHeight;
                  break;
                case 3:
                  x2 = 0;
                  y2 -= tileHeight / count;
                  break;
              }

              // adjust weight and color of the line
              if (i < count / 2) {
                lineWeight += 1;
                strokeColor += 60;
              } else {
                lineWeight -= 1;
                strokeColor -= 60;
              }

              // set colors depending on draw mode
              switch (drawMode) {
                case 1:
                  backgroundColor = 255;
                  p.stroke(0);
                  break;
                case 2:
                  backgroundColor = 255;
                  p.stroke(0);
                  p.strokeWeight(lineWeight);
                  break;
                case 3:
                  backgroundColor = 0;
                  p.stroke(strokeColor);
                  p.strokeWeight(p.mouseX / 100);
                  break;
              }

              // draw the line
              p.line(x1, y1, x2, y2);
            }
          }
          p.pop();
        }
      }
    };
    p.keyReleased = () => {
      if (p.key === '1') drawMode = 1;
      if (p.key === '2') drawMode = 2;
      if (p.key === '3') drawMode = 3;
    };
  });
  return '';
};

/**
 * グリッドと複合モジュール　～その３
 * [マウス]
 * x/y座標：線の向き
 * [キー]
 * 1-3：模様の種類
 * ↑↓←→：グリッドサイズ
 */
export const P_2_1_3_03 = () => {
  if (!!globalP5Instance) globalP5Instance.remove();
  let tileCountX = 6;
  let tileCountY = 6;
  let drawMode = 1;

  globalP5Instance = new p5((p: p5) => {
    p.setup = () => {
      p.createCanvas(p.windowWidth, p.windowHeight);
      p.rectMode(p.CENTER);
      p.noFill();
    };
    p.draw = () => {
      p.background(255);

      const count = p.mouseX / 20 + 5;
      const para = p.min(p.height, p.mouseY) / p.height - 0.5;

      const tileWidth = p.width / tileCountX;
      const tileHeight = p.height / tileCountY;

      for (let gridY = 0; gridY <= tileCountY; gridY++) {
        for (let gridX = 0; gridX <= tileCountX; gridX++) {
          const posX = tileWidth * gridX + tileWidth / 2;
          const posY = tileHeight * gridY + tileHeight / 2;

          p.push();
          p.translate(posX, posY);

          // switch between modules
          switch (drawMode) {
            case 1:
              p.translate(-tileWidth / 2, -tileHeight / 2);
              for (let i = 0; i < count; i++) {
                p.line(
                  0,
                  (para + 0.5) * tileHeight,
                  tileWidth,
                  (i * tileHeight) / count
                );
                p.line(
                  0,
                  (i * tileHeight) / count,
                  tileWidth,
                  tileHeight - (para + 0.5) * tileHeight
                );
              }
              break;
            case 2:
              for (let i = 0; i <= count; i++) {
                p.line(
                  para * tileWidth,
                  para * tileHeight,
                  tileWidth / 2,
                  (i / count - 0.5) * tileHeight
                );
                p.line(
                  para * tileWidth,
                  para * tileHeight,
                  -tileWidth / 2,
                  (i / count - 0.5) * tileHeight
                );
                p.line(
                  para * tileWidth,
                  para * tileHeight,
                  (i / count - 0.5) * tileWidth,
                  tileHeight / 2
                );
                p.line(
                  para * tileWidth,
                  para * tileHeight,
                  (i / count - 0.5) * tileWidth,
                  -tileHeight / 2
                );
              }
              break;
            case 3:
              for (let i = 0; i <= count; i++) {
                p.line(
                  0,
                  para * tileHeight,
                  tileWidth / 2,
                  (i / count - 0.5) * tileHeight
                );
                p.line(
                  0,
                  para * tileHeight,
                  -tileWidth / 2,
                  (i / count - 0.5) * tileHeight
                );
                p.line(
                  0,
                  para * tileHeight,
                  (i / count - 0.5) * tileWidth,
                  tileHeight / 2
                );
                p.line(
                  0,
                  para * tileHeight,
                  (i / count - 0.5) * tileWidth,
                  -tileHeight / 2
                );
              }
              break;
          }
          p.pop();
        }
      }
    };
    p.keyPressed = () => {
      if (p.key === '1') drawMode = 1;
      if (p.key === '2') drawMode = 2;
      if (p.key === '3') drawMode = 3;
      if (p.keyCode === p.DOWN_ARROW) tileCountY = p.max(tileCountY - 1, 1);
      if (p.keyCode === p.UP_ARROW) tileCountY += 1;
      if (p.keyCode === p.LEFT_ARROW) tileCountX = p.max(tileCountX - 1, 1);
      if (p.keyCode === p.RIGHT_ARROW) tileCountX += 1;
    };
  });
  return '';
};

/**
 * グリッドと複合モジュール　～その４
 * [マウス]
 * x/y座標：模様を回転
 * [キー]
 * 1-3：模様の種類
 * ↑↓←→：グリッドサイズ
 */
export const P_2_1_3_04 = () => {
  if (!!globalP5Instance) globalP5Instance.remove();
  let tileCountX = 6;
  let tileCountY = 6;
  let drawMode = 1;

  globalP5Instance = new p5((p: p5) => {
    p.setup = () => {
      p.createCanvas(p.windowWidth, p.windowHeight);
      p.rectMode(p.CENTER);
    };
    p.draw = () => {
      p.clear();
      p.noFill();

      const count = p.mouseX / 10 + 10;
      const para = p.mouseY / p.height;
      const tileWidth = p.width / tileCountX;
      const tileHeight = p.height / tileCountY;

      for (let gridY = 0; gridY <= tileCountY; gridY++) {
        for (let gridX = 0; gridX <= tileCountX; gridX++) {
          const posX = tileWidth * gridX + tileWidth / 2;
          const posY = tileHeight * gridY + tileHeight / 2;

          p.push();
          p.translate(posX, posY);

          // switch between modules
          switch (drawMode) {
            case 1:
              p.stroke(0);
              for (let i = 0; i < count; i++) {
                p.rect(0, 0, tileWidth, tileHeight);
                p.scale(1 - 3 / count);
                p.rotate(para * 0.1);
              }
              break;
            case 2:
              p.noStroke();
              for (let i = 0; i < count; i++) {
                const gradient = p.lerpColor(
                  p.color(0, 0),
                  p.color(166, 141, 5),
                  i / count
                );
                p.fill(gradient as any, (i / count) * 200);
                p.rotate(p.QUARTER_PI);
                p.rect(0, 0, tileWidth, tileHeight);
                p.scale(1 - 3 / count);
                p.rotate(para * 1.5);
              }
              break;
            case 3:
              p.noStroke();
              for (let i = 0; i < count; i++) {
                const gradient = p.lerpColor(
                  p.color(0, 130, 164),
                  p.color(255),
                  i / count
                );
                p.fill(gradient as any, 170);

                p.push();
                p.translate(4 * i, 0);
                p.ellipse(0, 0, tileWidth / 4, tileHeight / 4);
                p.pop();

                p.push();
                p.translate(-4 * i, 0);
                p.ellipse(0, 0, tileWidth / 4, tileHeight / 4);
                p.pop();

                p.scale(1 - 1.5 / count);
                p.rotate(para * 1.5);
              }
              break;
          }
          p.pop();
        }
      }
    };
    p.keyReleased = () => {
      if (p.key === '1') drawMode = 1;
      if (p.key === '2') drawMode = 2;
      if (p.key === '3') drawMode = 3;
      if (p.keyCode === p.DOWN_ARROW) tileCountY = p.max(tileCountY - 1, 1);
      if (p.keyCode === p.UP_ARROW) tileCountY += 1;
      if (p.keyCode === p.LEFT_ARROW) tileCountX = p.max(tileCountX - 1, 1);
      if (p.keyCode === p.RIGHT_ARROW) tileCountX += 1;
    };
  });
  return '';
};

/**
 * グリッドと複合モジュール　～その５
 * [マウス]
 * x/y座標：黒円のサイズ
 * 左クリック：ランダム値の更新
 */
export const P_2_1_3_05 = () => {
  if (!!globalP5Instance) globalP5Instance.remove();
  const tileCountX = 10;
  const tileCountY = 10;
  const colorStep = 6;

  let tileWidth: number;
  let tileHeight: number;
  let actRandomSeed = 0;

  globalP5Instance = new p5((p: p5) => {
    p.setup = () => {
      p.createCanvas(600, 600);
      p.noStroke();
      tileWidth = p.width / tileCountX;
      tileHeight = p.height / tileCountY;
    };
    p.draw = () => {
      p.background(255);
      p.randomSeed(actRandomSeed);

      const stepSize = p.min(p.mouseX, p.width) / 10;
      const endSize = p.min(p.mouseY, p.height) / 10;

      for (let gridY = 0; gridY <= tileCountY; gridY++) {
        for (let gridX = 0; gridX <= tileCountX; gridX++) {
          const posX = tileWidth * gridX;
          const posY = tileHeight * gridY;

          // modules
          const heading = p.int(p.random(4));
          for (let i = 0; i < stepSize; i++) {
            const diameter = p.map(i, 0, stepSize, tileWidth, endSize);
            p.fill(255 - i * colorStep);
            switch (heading) {
              case 0:
                p.ellipse(posX + i, posY, diameter, diameter);
                break;
              case 1:
                p.ellipse(posX, posY + i, diameter, diameter);
                break;
              case 2:
                p.ellipse(posX - i, posY, diameter, diameter);
                break;
              case 3:
                p.ellipse(posX, posY - i, diameter, diameter);
                break;
            }
          }
        }
      }
    };
    p.mousePressed = () => {
      actRandomSeed = p.random(100000);
    };
  });
  return '';
};
