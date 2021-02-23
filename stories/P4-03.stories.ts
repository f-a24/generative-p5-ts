import p5 from 'p5';
import chroma from 'chroma-js';
import Pic from './assets/P_4_3_1_01/pic.png';
export default { title: 'P4：Image' };

declare let globalP5Instance: p5;

/**
 * ピクセル値が作る文字
 * [キー]
 * 1：文字のサイズモードの切り替え
 * 2：文字のカラーモードの切り替え
 * ↑↓：最大文字サイズの調整 +/-
 * ←→：最小文字サイズの調整 +/-
 */
export const P_4_3_2_01 = () => {
  if (!!globalP5Instance) globalP5Instance.remove();
  const inputText =
    "All the world's a stage, And all the men and women merely players; They have their exits and their entrances; And one man in his time plays many parts, His acts being seven ages. At first the infant, Mewling and puking in the nurse's arms; Then the whining school-boy, with his satchel And shining morning face, creeping like snail Unwillingly to school. And then the lover, Sighing like furnace, with a woeful ballad Made to his mistress' eyebrow. Then a soldier, Full of strange oaths, and bearded like the pard, Jealous in honour, sudden and quick in quarrel, Seeking the bubble reputation Even in the cannon's mouth. And then the justice, In fair round belly with good capon lin'd, With eyes severe and beard of formal cut, Full of wise saws and modern instances; And so he plays his part. The sixth age shifts Into the lean and slipper'd pantaloon, With spectacles on nose and pouch on side, His youthful hose, well sav'd, a world too wide For his shrunk shank; and his big manly voice, Turning again toward childish treble, pipes And whistles in his sound. Last scene of all, That ends this strange eventful history, Is second childishness and mere oblivion; Sans teeth, sans eyes, sans taste, sans every thing.";
  const spacing = 12; // line height
  const kerning = 0.5; // between letters

  let fontSizeMax = 20;
  let fontSizeMin = 10;
  let fontSizeStatic = false;
  let blackAndWhite = false;
  let img: p5.Image;

  globalP5Instance = new p5((p: p5) => {
    p.preload = () => {
      img = p.loadImage(Pic);
    };
    p.setup = () => {
      p.createCanvas(533, 796);
      p.textFont('Times');
      p.textSize(10);
      p.textAlign(p.LEFT, p.CENTER);
      p.print(img.width + ' • ' + img.height);
    };
    p.draw = () => {
      p.background(255);

      let x = 0;
      let y = 10;
      let counter = 0;

      while (y < p.height) {
        // translate position (display) to position (image)
        img.loadPixels();
        // get current color
        const imgX = p.round(p.map(x, 0, p.width, 0, img.width));
        const imgY = p.round(p.map(y, 0, p.height, 0, img.height));
        const c = p.color(img.get(imgX, imgY));
        const greyscale = p.round(
          p.red(c) * 0.222 + p.green(c) * 0.707 + p.blue(c) * 0.071
        );

        p.push();
        p.translate(x, y);

        if (fontSizeStatic) {
          p.textSize(fontSizeMax);
          if (blackAndWhite) p.fill(greyscale);
          else p.fill(c);
        } else {
          // greyscale to fontsize
          let fontSize = p.map(greyscale, 0, 255, fontSizeMax, fontSizeMin);
          fontSize = p.max(fontSize, 1);
          p.textSize(fontSize);
          if (blackAndWhite) p.fill(0);
          else p.fill(c);
        }

        const letter = inputText.charAt(counter);
        p.text(letter, 0, 0);
        const letterWidth = p.textWidth(letter) + kerning;
        // for the next letter ... x + letter width
        x += letterWidth;

        p.pop();

        // linebreaks
        if (x + letterWidth >= p.width) {
          x = 0;
          y += spacing;
        }

        counter++;
        if (counter >= inputText.length) counter = 0;
      }
      p.noLoop();
    };
    p.keyReleased = () => {
      // change render mode
      if (p.key === '1') fontSizeStatic = !fontSizeStatic;
      // change color style
      if (p.key === '2') blackAndWhite = !blackAndWhite;
      p.print(
        'fontSizeMin: ' +
          fontSizeMin +
          ', fontSizeMax: ' +
          fontSizeMax +
          ', fontSizeStatic: ' +
          fontSizeStatic +
          ', blackAndWhite: ' +
          blackAndWhite
      );
      p.loop();
    };

    p.keyPressed = () => {
      // change fontSizeMax with arrow keys up/down
      if (p.keyCode === p.UP_ARROW) fontSizeMax += 2;
      if (p.keyCode === p.DOWN_ARROW) fontSizeMax -= 2;
      // change fontSizeMin with arrow keys left/right
      if (p.keyCode === p.RIGHT_ARROW) fontSizeMin += 2;
      if (p.keyCode === p.LEFT_ARROW) fontSizeMin -= 2;
      p.loop();
    };
  });
  return '';
};

/**
 * リアルタイムのピクセル値　～その１
 * [マウス]
 * x座標：描画速度
 * y座標：ばらつき具合
 * [キー]
 * ↑↓：カーブポイントの数 +/-
 * q：描画の停止
 * w：描画の再開
 * Delete/Backspace：リセット
 */
export const P_4_3_3_01 = () => {
  if (!!globalP5Instance) globalP5Instance.remove();
  let video: any;
  let x: number;
  let y: number;
  let curvePointX = 0;
  let curvePointY = 0;
  let pointCount = 1;
  let diffusion = 50;
  let streamReady = false;

  globalP5Instance = new p5((p: p5) => {
    p.setup = () => {
      p.createCanvas(640, 480);
      p.background(255);
      x = p.width / 2;
      y = p.height / 2;
      video = p.createCapture(p.VIDEO, () => {
        streamReady = true;
      });
      video.size(p.width * p.pixelDensity(), p.height * p.pixelDensity());
      video.hide();
      p.noFill();
    };
    p.draw = () => {
      if (streamReady) {
        for (let j = 0; j <= p.mouseX / 50; j++) {
          // Retrieve color from capture device
          const c = p.color(video.get(p.width - x, y));

          // convert color c to HSV
          const cHSV = chroma(p.red(c), p.green(c), p.blue(c));
          p.strokeWeight(cHSV.get('hsv.h') / 50);
          p.stroke(c);

          diffusion = p.map(p.mouseY, 0, p.height, 5, 100);

          p.beginShape();
          p.curveVertex(x, y);
          p.curveVertex(x, y);

          for (let i = 0; i < pointCount; i++) {
            const rx = p.int(p.random(-diffusion, diffusion));
            curvePointX = p.constrain(x + rx, 0, p.width - 1);
            const ry = p.int(p.random(-diffusion, diffusion));
            curvePointY = p.constrain(y + ry, 0, p.height - 1);
            p.curveVertex(curvePointX, curvePointY);
          }

          p.curveVertex(curvePointX, curvePointY);
          p.endShape();

          x = curvePointX;
          y = curvePointY;
        }
      }
    };
    p.keyReleased = () => {
      if (p.keyCode === p.DELETE || p.keyCode === p.BACKSPACE) p.clear();
      if (p.key === 'q' || p.key === 'Q') p.noLoop();
      if (p.key === 'w' || p.key === 'W') p.loop();
      if (p.keyCode === p.UP_ARROW) pointCount = p.min(pointCount + 1, 30);
      if (p.keyCode === p.DOWN_ARROW) pointCount = p.max(pointCount - 1, 1);
    };
  });
  return '';
};

/**
 * リアルタイムのピクセル値　～その２
 * [キー]
 * q：描画の停止
 * w：描画の再開
 * Delete/Backspace：リセット
 */
export const P_4_3_3_02 = () => {
  if (!!globalP5Instance) globalP5Instance.remove();
  const maxCounter = 100000;

  let video: any;
  let c: p5.Color;
  let x1: number, x2: number, x3: number, y1: number, y2: number, y3: number;
  let curvePointX = 0;
  let curvePointY = 0;
  let counter: number;
  let streamReady = false;

  globalP5Instance = new p5((p: p5) => {
    p.setup = () => {
      p.createCanvas(640, 480);
      p.background(255);
      video = p.createCapture(p.VIDEO, () => {
        streamReady = true;
      });
      video.size(p.width * p.pixelDensity(), p.height * p.pixelDensity());
      video.hide();
      p.noFill();

      x1 = 0;
      y1 = p.height / 2;
      x2 = p.width / 2;
      y2 = 0;
      x3 = p.width;
      y3 = p.height / 2;
    };
    p.draw = () => {
      if (streamReady) {
        // first line
        // Retrieve color from capture device
        c = p.color(video.get(x1, y1));
        // convert color c to HSV
        let cHSV = chroma(p.red(c), p.green(c), p.blue(c));
        const hueValue = cHSV.get('hsv.h');
        p.strokeWeight(hueValue / 50);
        p.stroke(c);

        p.beginShape();
        p.curveVertex(x1, y1);
        p.curveVertex(x1, y1);
        for (let i = 0; i < 7; i++) {
          curvePointX = p.constrain(x1 + p.random(-50, 50), 0, p.width - 1);
          curvePointY = p.constrain(y1 + p.random(-50, 50), 0, p.height - 1);
          p.curveVertex(curvePointX, curvePointY);
        }
        p.curveVertex(curvePointX, curvePointY);
        p.endShape();
        x1 = curvePointX;
        y1 = curvePointY;

        // second line
        // Retrieve color from capture device
        c = p.color(video.get(x2, y2));
        // convert color c to HSV
        cHSV = chroma(p.red(c), p.green(c), p.blue(c));
        const saturationValue = cHSV.get('hsv.s');
        p.strokeWeight(saturationValue / 2);
        p.stroke(c);

        p.beginShape();
        p.curveVertex(x2, y2);
        p.curveVertex(x2, y2);
        for (let i = 0; i < 7; i++) {
          curvePointX = p.constrain(x2 + p.random(-50, 50), 0, p.width - 1);
          curvePointY = p.constrain(y2 + p.random(-50, 50), 0, p.height - 1);
          p.curveVertex(curvePointX, curvePointY);
        }
        p.curveVertex(curvePointX, curvePointY);
        p.endShape();
        x2 = curvePointX;
        y2 = curvePointY;

        // third line
        // Retrieve color from capture device
        c = p.color(video.get(x3, y3));
        // convert color c to HSV
        cHSV = chroma(p.red(c), p.green(c), p.blue(c));
        const brightnessValue = cHSV.get('hsv.v');
        p.strokeWeight(brightnessValue / 100);
        p.stroke(c);

        p.beginShape();
        p.curveVertex(x3, y3);
        p.curveVertex(x3, y3);
        for (let i = 0; i < 7; i++) {
          curvePointX = p.constrain(x3 + p.random(-50, 50), 0, p.width - 1);
          curvePointY = p.constrain(y3 + p.random(-50, 50), 0, p.height - 1);
          p.curveVertex(curvePointX, curvePointY);
        }
        p.curveVertex(curvePointX, curvePointY);
        p.endShape();
        x3 = curvePointX;
        y3 = curvePointY;

        counter++;
        if (counter >= maxCounter) p.noLoop();
      }
    };
    p.keyReleased = () => {
      if (p.keyCode === p.DELETE || p.keyCode === p.BACKSPACE) p.clear();
      if (p.key === 'q' || p.key === 'Q') p.noLoop();
      if (p.key === 'w' || p.key === 'W') p.loop();
    };
  });
  return '';
};
