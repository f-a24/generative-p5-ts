import p5 from 'p5';
import opentype from 'opentype.js';
import { Path, resampleByLength } from './lib/generative-design-library';
import FreeSansFont from './assets/P_3_2_1_01/FreeSans.otf';
import FreeSansNoPunch from './assets/P_3_2_3_01/FreeSansNoPunch.otf';
import NotoSansBold from './assets/P_3_2_4_01/NotoSans-Bold.ttf';
export default { title: 'P3：Type' };

declare let globalP5Instance: p5;

/**
 * フォントアウトラインの変形
 * [マウス]
 * x座標：カーブの回転
 * y座標：カーブの高さ
 * [キー]
 * キーボード：テキスト入力
 * Delete/Backspace：文字の削除
 * Alt：塗りのモードの切り替え
 */
export const P_3_2_2_01 = () => {
  if (!!globalP5Instance) globalP5Instance.remove();
  let textTyped = 'Charles Mingus';
  let font: opentype.Font;
  let filled = false;

  globalP5Instance = new p5((p: p5) => {
    p.setup = () => {
      p.createCanvas(p.windowWidth, p.windowHeight);
      p.noLoop();

      opentype.load(FreeSansFont, (err, f) => {
        if (err) p.print(err);
        else {
          font = f;
          p.loop();
        }
      });
    };
    p.draw = () => {
      if (!font) return;

      p.background(255);
      if (filled) {
        p.noStroke();
        p.fill(0);
      } else {
        p.noFill();
        p.stroke(0);
        p.strokeWeight(2);
      }

      // margin border
      p.translate(20, 260);

      if (textTyped.length > 0) {
        // get a path from OpenType.js
        const fontPath = font.getPath(textTyped, 0, 0, 200);
        // convert it to a g.Path object
        let path = new Path(fontPath.commands);
        // resample it with equidistant points
        path = resampleByLength(path, 11);
        // path = g.resampleByAmount(path, 500);

        // map mouse axis
        const addToAngle = p.map(p.mouseX, 0, p.width, -p.PI, p.PI);
        const curveHeight = p.map(p.mouseY, 0, p.height, 0.1, 2);

        for (let i = 0; i < path.commands.length - 1; i++) {
          const pnt0 = path.commands[i];
          const pnt1 = path.commands[i + 1];
          const d = p.dist(pnt0.x, pnt0.y, pnt1.x, pnt1.y);

          // create a gap between each letter
          if (d > 20) continue;

          // alternate in every step from -1 to 1
          const stepper = p.map(i % 2, 0, 1, -1, 1);
          let angle = p.atan2(pnt1.y - pnt0.y, pnt1.x - pnt0.x);
          angle = angle + addToAngle;

          const cx = pnt0.x + p.cos(angle * stepper) * d * 4 * curveHeight;
          const cy = pnt0.y + p.sin(angle * stepper) * d * 3 * curveHeight;

          p.bezier(pnt0.x, pnt0.y, cx, cy, cx, cy, pnt1.x, pnt1.y);
        }
      }
    };
    p.keyReleased = () => {
      if (p.keyCode === p.ALT) filled = !filled;
    };
    p.keyPressed = () => {
      if (
        (p.keyCode === p.DELETE || p.keyCode === p.BACKSPACE) &&
        textTyped.length > 0
      )
        textTyped = textTyped.substring(0, textTyped.length - 1);
    };
    p.keyTyped = () => {
      if (p.keyCode >= 32) textTyped += p.key;
    };
  });
  return '';
};

/**
 * エージェントが作るフォントアウトライン
 * [マウス]
 * 左クリック + x座標：変形速度
 * [キー]
 * キーボード：テキスト入力
 * Alt：動きの停止/再開
 * Delete/Backspace：リセット
 */
export const P_3_2_3_01 = () => {
  if (!!globalP5Instance) globalP5Instance.remove();
  const spacing = 20;
  const spaceWidth = 80; // width of letter ' '
  const fontSize = 200;
  const lineSpacing = fontSize * 1.2;
  const stepSize = 2;

  let typedKey = 'a';
  let fontPath: opentype.Path;
  let textW = 0;
  let letterX = 50 + spacing;
  let letterY = lineSpacing;
  let danceFactor = 1;
  let font: opentype.Font;
  let pnts: any;
  let freeze = false;

  globalP5Instance = new p5((p: p5) => {
    p.setup = () => {
      p.createCanvas(p.windowWidth, p.windowHeight);
      p.noLoop();

      opentype.load(FreeSansNoPunch, (err, f) => {
        if (err) p.print(err);
        else {
          font = f;
          pnts = getPoints();
          p.loop();
        }
      });
    };
    p.draw = () => {
      if (!font) return;
      p.noFill();
      p.push();
      // translation according the actual writing position
      p.translate(letterX, letterY);

      // distortion on/off
      danceFactor = 1;
      if (p.mouseIsPressed && p.mouseButton === p.LEFT)
        danceFactor = p.map(p.mouseX, 0, p.width, 0, 3);

      // are there points to draw?
      if (pnts.length > 0) {
        // let the points dance
        for (let i = 0; i < pnts.length; i++) {
          pnts[i].x += p.random(-stepSize, stepSize) * danceFactor;
          pnts[i].y += p.random(-stepSize, stepSize) * danceFactor;
        }

        //  ------ lines: connected straight  ------
        p.strokeWeight(0.1);
        p.stroke(0);
        p.beginShape();
        for (let i = 0; i < pnts.length; i++) {
          p.vertex(pnts[i].x, pnts[i].y);
          p.ellipse(pnts[i].x, pnts[i].y, 7, 7);
        }
        p.vertex(pnts[0].x, pnts[0].y);
        p.endShape();

        //  ------ lines: connected rounded  ------
        /*
          strokeWeight(0.08);
          beginShape();
          // start controlpoint
          curveVertex(pnts[pnts.length-1].x, pnts[pnts.length-1].y);
          // only these points are drawn
          for (let i = 0; i < pnts.length; i++) {
            curveVertex(pnts[i].x, pnts[i].y);
          }
          curveVertex(pnts[0].x, pnts[0].y);
          // end controlpoint
          curveVertex(pnts[1].x, pnts[1].y);
          endShape();
        */
      }
      p.pop();
    };
    const getPoints = () => {
      fontPath = font.getPath(typedKey, 0, 0, 200);
      let path = new Path(fontPath.commands);
      path = resampleByLength(path, 25);
      textW = path.bounds().width;
      // remove all commands without a coordinate
      for (let i = path.commands.length - 1; i >= 0; i--) {
        if (path.commands[i].x === undefined) path.commands.splice(i, 1);
      }
      return path.commands;
    };
    p.keyReleased = () => {
      if (p.keyCode === p.ALT) {
        // switch loop on/off
        freeze = !freeze;
        if (freeze) p.noLoop();
        else p.loop();
      }
    };
    p.keyPressed = () => {
      switch (p.keyCode) {
        case p.ENTER:
        case p.RETURN:
          typedKey = '';
          pnts = getPoints();
          letterY += lineSpacing;
          letterX = 50;
          break;
        case p.BACKSPACE:
        case p.DELETE:
          p.background(255);
          typedKey = '';
          pnts = getPoints();
          letterX = 50;
          letterY = lineSpacing;
          freeze = false;
          p.loop();
          break;
      }
    };
    p.keyTyped = () => {
      if (p.keyCode >= 32) {
        if (p.keyCode === 32) {
          typedKey = '';
          letterX += textW + spaceWidth;
          pnts = getPoints();
        } else {
          typedKey = p.key;
          letterX += textW + spacing;
          pnts = getPoints();
        }
        freeze = false;
        p.loop();
      }
    };
  });
  return '';
};

/**
 * 並走するフォントアウトライン
 * [マウス]
 * x座標：フォントアウトラインの単純化
 * y座標：帯の幅
 * [キー]
 * キーボード：テキスト入力
 * Delete/Backspace：文字の削除
 * ←→：線の密度を変更する
 * ↑↓：フォントサイズを変更する
 */
export const P_3_2_4_01 = () => {
  if (!!globalP5Instance) globalP5Instance.remove();
  let density = 2.5;
  let ribbonWidth = 92;
  let shapeColor: p5.Color;
  let fontSize = 800;
  let pathSampleFactor = 0.1;
  let textTyped = 'a';
  let font: p5.Font;

  globalP5Instance = new p5((p: p5) => {
    class Letter {
      char: string;
      x: number;
      y: number;
      constructor(char: string, x: number, y: number) {
        this.char = char;
        this.x = x;
        this.y = y;
      }
      draw() {
        const path = font.textToPoints(this.char, this.x, this.y, fontSize, {
          sampleFactor: pathSampleFactor
        });
        p.stroke(shapeColor);

        for (let d = 0; d < ribbonWidth; d += density) {
          p.beginShape();
          for (let i = 0; i < path.length; i++) {
            const pos = path[i];
            const nextPos = path[i + 1];
            if (nextPos) {
              const p0 = p.createVector(pos.x, pos.y);
              const p1 = p.createVector(nextPos.x, nextPos.y);
              const v = p5.Vector.sub(p1, p0);
              v.normalize();
              v.rotate(p.HALF_PI);
              v.mult(d);
              const pneu = p5.Vector.add(p0, v);
              p.curveVertex(pneu.x, pneu.y);
            }
          }
          p.endShape(p.CLOSE);
        }
      }
    }
    const createLetters = () => {
      letters = [];
      const chars = textTyped.split('');
      let x = 0;
      for (let i = 0; i < chars.length; i++) {
        if (i > 0) {
          const charsBefore = textTyped.substring(0, i);
          x = (font.textBounds(charsBefore, 0, 0, fontSize) as {
            x: number;
            y: number;
            w: number;
            h: number;
          }).w;
        }
        const newLetter = new Letter(chars[i], x, 0);
        letters.push(newLetter);
      }
    };
    let letters: Letter[] = [];

    p.preload = () => {
      font = p.loadFont(NotoSansBold);
    };
    p.setup = () => {
      p.createCanvas(p.windowWidth, p.windowHeight);
      p.noFill();
      p.strokeWeight(1);
      shapeColor = p.color(0);

      createLetters();
    };
    p.draw = () => {
      p.background(255);
      p.translate(100, p.height * 0.75);

      pathSampleFactor = 0.1 * p.pow(0.02, p.mouseX / p.width);
      ribbonWidth = p.map(p.mouseY, 0, p.height, 1, 200);

      for (let i = 0; i < letters.length; i++) {
        letters[i].draw();
      }
    };
    p.keyReleased = () => {
      if (p.keyCode === p.LEFT_ARROW) density *= 1.25;
      if (p.keyCode === p.RIGHT_ARROW) density /= 1.25;

      if (p.keyCode === p.UP_ARROW) {
        fontSize *= 1.1;
        createLetters();
      }
      if (p.keyCode === p.DOWN_ARROW) {
        fontSize /= 1.1;
        createLetters();
      }
      if (p.keyCode === p.ENTER) createLetters();
    };
    p.keyPressed = () => {
      if (
        (p.keyCode === p.DELETE || p.keyCode === p.BACKSPACE) &&
        textTyped.length > 0
      ) {
        textTyped = textTyped.substring(0, textTyped.length - 1);
        createLetters();
      }
    };
    p.keyTyped = () => {
      if (p.keyCode >= 32) {
        textTyped += p.key;
        createLetters();
      }
    };
  });
  return '';
};
