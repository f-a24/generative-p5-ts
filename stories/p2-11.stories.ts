import p5 from 'p5';
import P_2_3_1_0202 from './assets/P_2_3_1_02/02.svg';
import P_2_3_1_0203 from './assets/P_2_3_1_02/03.svg';
import P_2_3_1_0204 from './assets/P_2_3_1_02/04.svg';
import P_2_3_1_0205 from './assets/P_2_3_1_02/05.svg';
import P_2_3_4_0101 from './assets/P_2_3_4_01/01.svg';
import P_2_3_4_0102 from './assets/P_2_3_4_01/02.svg';
import P_2_3_4_0103 from './assets/P_2_3_4_01/03.svg';
import P_2_3_4_0104 from './assets/P_2_3_4_01/04.svg';
import P_2_3_4_0105 from './assets/P_2_3_4_01/05.svg';
import P_2_3_4_0106 from './assets/P_2_3_4_01/06.svg';
import P_2_3_4_0107 from './assets/P_2_3_4_01/07.svg';
import P_2_3_4_0108 from './assets/P_2_3_4_01/08.svg';
import P_2_3_4_0109 from './assets/P_2_3_4_01/09.svg';
export default { title: 'P2：Shape' };

declare let globalP5Instance: p5;

/**
 * 動きのあるブラシでドローイング　～その１
 * [マウス]
 * ドラッグ：ドローイング
 * [キー]
 * 1-4：色設定の切り替え
 * space：ランダム色の更新
 * d：回転方向と角度の反転
 * ↑↓：直線の長さ
 * ←→：回転速度
 * Delete/Backspace：リセット
 */
export const P_2_3_1_01 = () => {
  if (!!globalP5Instance) globalP5Instance.remove();
  let c: p5.Color;
  let lineLength = 0;
  let angle = 0;
  let angleSpeed = 1;

  globalP5Instance = new p5((p: p5) => {
    p.setup = () => {
      p.createCanvas(p.windowWidth, p.windowHeight);
      p.background(255);
      p.cursor(p.CROSS);
      p.strokeWeight(1);
      c = p.color(181, 157, 0);
    };
    p.draw = () => {
      if (p.mouseIsPressed && p.mouseButton === p.LEFT) {
        p.push();
        p.translate(p.mouseX, p.mouseY);
        p.rotate(p.radians(angle));
        p.stroke(c);
        p.line(0, 0, lineLength, 0);
        p.pop();
        angle += angleSpeed;
      }
    };
    p.mousePressed = () => {
      lineLength = p.random(70, 200);
    };
    p.keyPressed = () => {
      if (p.keyCode === p.UP_ARROW) lineLength += 5;
      if (p.keyCode === p.DOWN_ARROW) lineLength -= 5;
      if (p.keyCode === p.LEFT_ARROW) angleSpeed -= 0.5;
      if (p.keyCode === p.RIGHT_ARROW) angleSpeed += 0.5;
    };
    p.keyReleased = () => {
      if (p.keyCode === p.DELETE || p.keyCode === p.BACKSPACE)
        p.background(255);

      // reverse direction and mirror angle
      if (p.key === 'd' || p.key === 'D') {
        angle += 180;
        angleSpeed *= -1;
      }

      // change color
      if (p.key === ' ')
        c = p.color(
          p.random(255),
          p.random(255),
          p.random(255),
          p.random(80, 100)
        );
      // default colors from 1 to 4
      if (p.key === '1') c = p.color(181, 157, 0);
      if (p.key === '2') c = p.color(0, 130, 164);
      if (p.key === '3') c = p.color(87, 35, 129);
      if (p.key === '4') c = p.color(197, 0, 123);
    };
  });
  return '';
};

/**
 * 動きのあるブラシでドローイング　～その２
 * [マウス]
 * ドラッグ：ドローイング
 * [キー]
 * ドラッグ中にshift：ドラッグ開始時のxまたy座標にドローイング
 * 1-4：色設定の切り替え
 * 5-9：線の形状
 * space：ランダム色の更新
 * d：回転方向と角度の反転
 * ↑↓：直線の長さ
 * ←→：回転速度
 * Delete/Backspace：リセット
 */
export const P_2_3_1_02 = () => {
  if (!!globalP5Instance) globalP5Instance.remove();
  const lineModule: p5.Image[] = [];

  let c: p5.Color;
  let lineModuleSize = 0;
  let angle = 0;
  let angleSpeed = 1;
  let lineModuleIndex = 0;
  let clickPosX = 0;
  let clickPosY = 0;

  globalP5Instance = new p5((p: p5) => {
    p.preload = () => {
      lineModule[1] = p.loadImage(P_2_3_1_0202);
      lineModule[2] = p.loadImage(P_2_3_1_0203);
      lineModule[3] = p.loadImage(P_2_3_1_0204);
      lineModule[4] = p.loadImage(P_2_3_1_0205);
    };
    p.setup = () => {
      p.createCanvas(p.windowWidth, p.windowHeight);
      p.background(255);
      p.cursor(p.CROSS);
      p.strokeWeight(0.75);
      c = p.color(181, 157, 0);
    };
    p.windowResized = () => {
      p.resizeCanvas(p.windowWidth, p.windowHeight);
    };
    p.draw = () => {
      if (p.mouseIsPressed && p.mouseButton === p.LEFT) {
        let x = p.mouseX;
        let y = p.mouseY;
        if (p.keyIsPressed && p.keyCode === p.SHIFT) {
          if (p.abs(clickPosX - x) > p.abs(clickPosY - y)) {
            y = clickPosY;
          } else {
            x = clickPosX;
          }
        }
        p.push();
        p.translate(x, y);
        p.rotate(p.radians(angle));
        if (lineModuleIndex !== 0) {
          p.tint(c);
          p.image(
            lineModule[lineModuleIndex],
            0,
            0,
            lineModuleSize,
            lineModuleSize
          );
        } else {
          p.stroke(c);
          p.line(0, 0, lineModuleSize, lineModuleSize);
        }
        angle += angleSpeed;
        p.pop();
      }
    };
    p.mousePressed = () => {
      // create a new random color and line length
      lineModuleSize = p.random(50, 160);

      // remember click position
      clickPosX = p.mouseX;
      clickPosY = p.mouseY;
    };
    p.keyPressed = () => {
      if (p.keyCode === p.UP_ARROW) lineModuleSize += 5;
      if (p.keyCode === p.DOWN_ARROW) lineModuleSize -= 5;
      if (p.keyCode === p.LEFT_ARROW) angleSpeed -= 0.5;
      if (p.keyCode === p.RIGHT_ARROW) angleSpeed += 0.5;
    };
    p.keyReleased = () => {
      if (p.keyCode === p.DELETE || p.keyCode === p.BACKSPACE)
        p.background(255);

      // reverse direction and mirror angle
      if (p.key === 'd' || p.key === 'D') {
        angle += 180;
        angleSpeed *= -1;
      }

      // change color
      if (p.key === ' ')
        c = p.color(
          p.random(255),
          p.random(255),
          p.random(255),
          p.random(80, 100)
        );
      // default colors from 1 to 4
      if (p.key === '1') c = p.color(181, 157, 0);
      if (p.key === '2') c = p.color(0, 130, 164);
      if (p.key === '3') c = p.color(87, 35, 129);
      if (p.key === '4') c = p.color(197, 0, 123);

      // load svg for line module
      if (p.key === '5') lineModuleIndex = 0;
      if (p.key === '6') lineModuleIndex = 1;
      if (p.key === '7') lineModuleIndex = 2;
      if (p.key === '8') lineModuleIndex = 3;
      if (p.key === '9') lineModuleIndex = 4;
    };
  });
  return '';
};

/**
 * ドローイングの回転と距離
 * [マウス]
 * ドラッグ：ドローイング
 * [キー]
 * 1-2：描画モード
 * ↑↓：直線の長さ
 * Delete/Backspace：リセット
 */
export const P_2_3_2_01 = () => {
  if (!!globalP5Instance) globalP5Instance.remove();
  const stepSize = 5.0;
  let drawMode = 1;
  let col: p5.Color;
  let x = 0;
  let y = 0;
  let lineLength = 25;

  globalP5Instance = new p5((p: p5) => {
    p.setup = () => {
      // use full screen size
      p.createCanvas(p.displayWidth, p.displayHeight);
      p.background(255);
      col = p.color(p.random(255), p.random(255), p.random(255), p.random(100));
      x = p.mouseX;
      y = p.mouseY;
      p.cursor(p.CROSS);
    };
    p.draw = () => {
      if (p.mouseIsPressed && p.mouseButton === p.LEFT) {
        const d = p.dist(x, y, p.mouseX, p.mouseY);

        if (d > stepSize) {
          const angle = p.atan2(p.mouseY - y, p.mouseX - x);

          p.push();
          p.translate(x, y);
          p.rotate(angle);
          p.stroke(col);
          if (p.frameCount % 2 === 0) p.stroke(150);
          p.line(0, 0, 0, (lineLength * p.random(0.95, 1) * d) / 10);
          p.pop();

          if (drawMode === 1) {
            x = x + p.cos(angle) * stepSize;
            y = y + p.sin(angle) * stepSize;
          } else {
            x = p.mouseX;
            y = p.mouseY;
          }
        }
      }
    };
    p.mousePressed = () => {
      x = p.mouseX;
      y = p.mouseY;
      col = p.color(p.random(255), p.random(255), p.random(255), p.random(100));
      // lineLength = random(15, 50);
    };
    p.keyReleased = () => {
      if (p.keyCode === p.DELETE || p.keyCode === p.BACKSPACE)
        p.background(255);

      if (p.key === '1') drawMode = 1;
      if (p.key === '2') drawMode = 2;
    };
    p.keyPressed = () => {
      // lineLength ctrls arrowkeys up/down
      if (p.keyCode === p.UP_ARROW) lineLength += 5;
      if (p.keyCode === p.DOWN_ARROW) lineLength -= 5;
    };
  });
  return '';
};

/**
 * 文字でドローイング
 * [マウス]
 * ドラッグ：テキストのドローイング
 * [キー]
 * ↑↓：文字の回転の調節
 * Delete/Backspace：リセット
 */
export const P_2_3_3_01 = () => {
  if (!!globalP5Instance) globalP5Instance.remove();
  const font = 'Georgia';
  const letters =
    "All the world's a stage, and all the men and women merely players. They have their exits and their entrances.";
  const fontSizeMin = 3;

  let x = 0;
  let y = 0;
  let stepSize = 5.0;
  let angleDistortion = 0.0;
  let counter = 0;

  globalP5Instance = new p5((p: p5) => {
    p.setup = () => {
      // use full screen size
      p.createCanvas(p.displayWidth, p.displayHeight);
      p.background(255);
      p.cursor(p.CROSS);

      x = p.mouseX;
      y = p.mouseY;

      p.textFont(font);
      p.textAlign(p.LEFT);
      p.fill(0);
    };
    p.draw = () => {
      if (p.mouseIsPressed && p.mouseButton === p.LEFT) {
        const d = p.dist(x, y, p.mouseX, p.mouseY);
        p.textSize(fontSizeMin + d / 2);
        const newLetter = letters.charAt(counter);
        stepSize = p.textWidth(newLetter);

        if (d > stepSize) {
          const angle = p.atan2(p.mouseY - y, p.mouseX - x);

          p.push();
          p.translate(x, y);
          p.rotate(angle + p.random(angleDistortion));
          p.text(newLetter, 0, 0);
          p.pop();

          counter++;
          if (counter >= letters.length) counter = 0;

          x = x + p.cos(angle) * stepSize;
          y = y + p.sin(angle) * stepSize;
        }
      }
    };
    p.mousePressed = () => {
      x = p.mouseX;
      y = p.mouseY;
    };
    p.keyReleased = () => {
      if (p.keyCode === p.DELETE || p.keyCode === p.BACKSPACE)
        p.background(255);
    };
    p.keyPressed = () => {
      // angleDistortion ctrls arrowkeys up/down
      if (p.keyCode === p.UP_ARROW) angleDistortion += 0.1;
      if (p.keyCode === p.DOWN_ARROW) angleDistortion -= 0.1;
    };
  });
  return '';
};

/**
 * 動的なブラシでドローイング
 * [マウス]
 * ドラッグ：描画
 * [キー]
 * 1-9：モジュールの切り替え
 * ↑↓：モジュールのサイズ
 * ←→：ステップごとの移動量
 * Delete/Backspace：リセット
 */
export const P_2_3_4_01 = () => {
  if (!!globalP5Instance) globalP5Instance.remove();
  const elements: p5.Image[] = [];

  let lineModule: p5.Image;
  let x = 0;
  let y = 0;
  let stepSize = 5.0;
  let moduleSize = 25;

  globalP5Instance = new p5((p: p5) => {
    p.preload = () => {
      // preload svg for line module
      elements[0] = p.loadImage(P_2_3_4_0101);
      elements[1] = p.loadImage(P_2_3_4_0102);
      elements[2] = p.loadImage(P_2_3_4_0103);
      elements[3] = p.loadImage(P_2_3_4_0104);
      elements[4] = p.loadImage(P_2_3_4_0105);
      elements[5] = p.loadImage(P_2_3_4_0106);
      elements[6] = p.loadImage(P_2_3_4_0107);
      elements[7] = p.loadImage(P_2_3_4_0108);
      elements[8] = p.loadImage(P_2_3_4_0109);
    };
    p.setup = () => {
      // use full screen size
      p.createCanvas(p.displayWidth, p.displayHeight);
      p.background(255);
      p.cursor(p.CROSS);
      x = p.mouseX;
      y = p.mouseY;
      lineModule = elements[0];
    };
    p.draw = () => {
      if (p.mouseIsPressed && p.mouseButton === p.LEFT) {
        const d = p.dist(x, y, p.mouseX, p.mouseY);

        if (d > stepSize) {
          const angle = p.atan2(p.mouseY - y, p.mouseX - x);

          p.push();
          p.translate(p.mouseX, p.mouseY);
          p.rotate(angle + p.PI);
          p.image(lineModule, 0, 0, d, moduleSize);
          p.pop();

          x = x + p.cos(angle) * stepSize;
          y = y + p.sin(angle) * stepSize;
        }
      }
    };
    p.mousePressed = () => {
      x = p.mouseX;
      y = p.mouseY;
    };
    p.keyReleased = () => {
      if (p.keyCode === p.DELETE || p.keyCode === p.BACKSPACE)
        p.background(255);

      if (p.key === '1') lineModule = elements[0];
      if (p.key === '2') lineModule = elements[1];
      if (p.key === '3') lineModule = elements[2];
      if (p.key === '4') lineModule = elements[3];
      if (p.key === '5') lineModule = elements[4];
      if (p.key === '6') lineModule = elements[5];
      if (p.key === '7') lineModule = elements[6];
      if (p.key === '8') lineModule = elements[7];
      if (p.key === '9') lineModule = elements[8];
    };
    p.keyPressed = () => {
      // moduleSize arrowkeys up/down
      if (p.keyCode === p.UP_ARROW) moduleSize += 5;
      if (p.keyCode === p.DOWN_ARROW) moduleSize -= 5;
      // stepSize arrowkeys left/right
      stepSize = p.max(stepSize, 0.5);
      if (p.keyCode === p.LEFT_ARROW) stepSize -= 0.5;
      if (p.keyCode === p.RIGHT_ARROW) stepSize += 0.5;
      p.print(`moduleSize: ${moduleSize} stepSize: ${stepSize}`);
    };
  });
  return '';
};
