import p5 from 'p5';
import misoBoldFont from './assets/P_3_1_2_01/miso-bold.ttf';
import spaceP_3_1_2_01Svg from './assets/P_3_1_2_01/space.svg';
import space2P_3_1_2_01Svg from './assets/P_3_1_2_01/space2.svg';
import periodP_3_1_2_01Svg from './assets/P_3_1_2_01/period.svg';
import commaP_3_1_2_01Svg from './assets/P_3_1_2_01/comma.svg';
import exclamationmarkP_3_1_2_01Svg from './assets/P_3_1_2_01/exclamationmark.svg';
import questionmarkP_3_1_2_01Svg from './assets/P_3_1_2_01/questionmark.svg';
import returnP_3_1_2_01Svg from './assets/P_3_1_2_01/return.svg';
import spaceP_3_1_2_02Svg from './assets/P_3_1_2_02/space.svg';
import space2P_3_1_2_02Svg from './assets/P_3_1_2_02/space2.svg';
import periodP_3_1_2_02Svg from './assets/P_3_1_2_02/period.svg';
import commaP_3_1_2_02Svg from './assets/P_3_1_2_02/comma.svg';
import exclamationmarkP_3_1_2_02Svg from './assets/P_3_1_2_02/exclamationmark.svg';
import questionmarkP_3_1_2_02Svg from './assets/P_3_1_2_02/questionmark.svg';
import icon1Svg from './assets/P_3_1_2_02/icon1.svg';
import icon2Svg from './assets/P_3_1_2_02/icon2.svg';
import icon3Svg from './assets/P_3_1_2_02/icon3.svg';
import icon4Svg from './assets/P_3_1_2_02/icon4.svg';
import icon5Svg from './assets/P_3_1_2_02/icon5.svg';
export default { title: 'P3：Type' };

declare let globalP5Instance: p5;

/**
 * HELLO, TYPE
 * [マウス]
 * x座標：サイズ
 * y座標：位置
 * ドラッグ：描画
 * [キー]
 * A-Z：文字の切り替え
 */
export const P_3_0_01 = () => {
  if (!!globalP5Instance) globalP5Instance.remove();
  const font = 'sans-serif';
  let letter = 'A';

  globalP5Instance = new p5((p: p5) => {
    p.setup = () => {
      p.createCanvas(p.windowWidth, p.windowHeight);
      p.background(255);
      p.fill(0);
      p.textFont(font);
      p.textAlign(p.CENTER, p.CENTER);
    };
    p.mouseMoved = () => {
      p.clear();
      p.textSize((p.mouseX - p.width / 2) * 5 + 1);
      p.text(letter, p.width / 2, p.mouseY);
    };
    p.mouseDragged = () => {
      p.textSize((p.mouseX - p.width / 2) * 5 + 1);
      p.text(letter, p.width / 2, p.mouseY);
    };
    p.keyTyped = () => {
      letter = p.key;
    };
  });
  return '';
};

/**
 * 時間ベースで書くテキスト
 * [マウス]
 * y座標：行間
 * [キー]
 * A-Z：文字の切り替え
 */
export const P_3_1_1_01 = () => {
  if (!!globalP5Instance) globalP5Instance.remove();
  let textTyped = 'Type slow and fast!';
  const fontSizes = [textTyped.length];
  const minFontSize = 15;
  const maxFontSize = 800;
  const maxTimeDelta = 5000.0;
  const font = 'Arial';

  let newFontSize = 0;
  let pMillis = 0;
  let spacing = 2; // line height

  globalP5Instance = new p5((p: p5) => {
    p.setup = () => {
      p.createCanvas(800, 600);
      p.noCursor();
      p.noStroke();

      // init fontSizes
      for (let i = 0; i < textTyped.length; i++) {
        fontSizes[i] = minFontSize;
      }
    };
    p.draw = () => {
      p.background(255);
      p.textAlign(p.LEFT);
      p.fill(0);

      spacing = p.map(p.mouseY, 0, p.height, 0, 120);
      p.translate(0, 200 + spacing);

      let x = 0;
      let y = 0;
      let fontSize = 20;

      for (let i = 0; i < textTyped.length; i++) {
        // get fontsize for the actual letter from the array
        fontSize = fontSizes[i];
        p.textFont(font, fontSize);
        const letter = textTyped.charAt(i);
        const letterWidth = p.textWidth(letter);

        if (x + letterWidth > p.width) {
          // start new line and add line height
          x = 0;
          y += spacing;
        }

        // draw letter
        p.text(letter, x, y);
        // update x-coordinate for next letter
        x += letterWidth;
      }

      // blinking cursor after text
      const timeDelta = p.millis() - pMillis;
      newFontSize = p.map(timeDelta, 0, maxTimeDelta, minFontSize, maxFontSize);
      newFontSize = p.min(newFontSize, maxFontSize);

      p.fill(200, 30, 40);
      if (p.int(p.frameCount / 10) % 2 === 0) p.fill(255);
      p.rect(x, y, newFontSize / 2, newFontSize / 20);
    };
    p.keyTyped = () => {
      if (p.keyCode >= 32) {
        textTyped += p.key;
        fontSizes.push(newFontSize);
      } else if (p.keyCode === p.BACKSPACE || p.keyCode === p.DELETE) {
        if (textTyped.length > 0) {
          textTyped = textTyped.substring(0, p.max(0, textTyped.length - 1));
          fontSizes.pop();
        }
      }
      // reset timer
      pMillis = p.millis();
    };
  });
  return '';
};

/**
 * 設計図としてのテキスト　～その１
 * [マウス]
 * ドラッグ：アートボードのスクロール
 * [キー]
 * キーボード：テキスト入力
 * 区切り文字（,/./!/?/リターン）：カーブ
 * スペース：ランダムな向きのカーブ
 * Delete/Backspace：文字の削除
 * ↑↓：ディスプレイ領域のズーム
 * Alt（option）：ランダムレイアウトの更新
 */
export const P_3_1_2_01 = () => {
  if (!!globalP5Instance) globalP5Instance.remove();
  let textTyped = '';

  let font: p5.Font;
  let shapeSpace: p5.Image;
  let shapeSpace2: p5.Image;
  let shapePeriod: p5.Image;
  let shapeComma: p5.Image;
  let shapeQuestionmark: p5.Image;
  let shapeExclamationmark: p5.Image;
  let shapeReturn: p5.Image;

  let centerX: number;
  let centerY: number;
  let offsetX = 0;
  let offsetY = 0;
  let zoom = 0.75;
  let actRandomSeed = 6;

  globalP5Instance = new p5((p: p5) => {
    p.preload = () => {
      font = p.loadFont(misoBoldFont);
      shapeSpace = p.loadImage(spaceP_3_1_2_01Svg);
      shapeSpace2 = p.loadImage(space2P_3_1_2_01Svg);
      shapePeriod = p.loadImage(periodP_3_1_2_01Svg);
      shapeComma = p.loadImage(commaP_3_1_2_01Svg);
      shapeExclamationmark = p.loadImage(exclamationmarkP_3_1_2_01Svg);
      shapeQuestionmark = p.loadImage(questionmarkP_3_1_2_01Svg);
      shapeReturn = p.loadImage(returnP_3_1_2_01Svg);
    };
    p.setup = () => {
      p.createCanvas(p.windowWidth, p.windowHeight);

      textTyped += 'Ich bin der Musikant mit Taschenrechner in der Hand!\n\n';
      textTyped += 'Ich addiere\n';
      textTyped += 'Und subtrahiere, \n\n';
      textTyped +=
        'Kontrolliere\nUnd komponiere\nUnd wenn ich diese Taste drück,\nSpielt er ein kleines Musikstück?\n\n';
      textTyped += 'Ich bin der Musikant mit Taschenrechner in der Hand!\n\n';
      textTyped += 'Ich addiere\n';
      textTyped += 'Und subtrahiere, \n\n';
      textTyped +=
        'Kontrolliere\nUnd komponiere\nUnd wenn ich diese Taste drück,\nSpielt er ein kleines Musikstück?\n\n';

      centerX = p.width / 2;
      centerY = p.height / 2;

      p.cursor(p.HAND);
      p.textFont(font, 25);
      p.textAlign(p.LEFT, p.BASELINE);
      p.noStroke();
      p.fill(0);
    };
    p.windowResized = () => {
      p.resizeCanvas(p.windowWidth, p.windowHeight);
    };
    p.draw = () => {
      p.background(255);

      if (p.mouseIsPressed && p.mouseButton === p.LEFT) {
        centerX = p.mouseX - offsetX;
        centerY = p.mouseY - offsetY;
      }

      // allways produce the same sequence of random numbers
      p.randomSeed(actRandomSeed);
      p.translate(centerX, centerY);
      p.scale(zoom);

      for (let i = 0; i < textTyped.length; i++) {
        const letter = textTyped.charAt(i);
        const letterWidth = p.textWidth(letter);

        // ------ letter rule table ------
        switch (letter) {
          case ' ': // space
            // 50% left, 50% right
            const dir = p.floor(p.random(0, 2));
            if (dir === 0) {
              p.image(shapeSpace, 1, -15);
              p.translate(4, 1);
              p.rotate(p.QUARTER_PI);
            }
            if (dir === 1) {
              p.image(shapeSpace2, 1, -15);
              p.translate(14, -5);
              p.rotate(-p.QUARTER_PI);
            }
            break;

          case ',':
            p.image(shapeComma, 1, -15);
            p.translate(35, 15);
            p.rotate(p.QUARTER_PI);
            break;

          case '.':
            p.image(shapePeriod, 1, -55);
            p.translate(56, -56);
            p.rotate(-p.HALF_PI);
            break;

          case '!':
            p.image(shapeExclamationmark, 1, -27);
            p.translate(42.5, -17.5);
            p.rotate(-p.QUARTER_PI);
            break;

          case '?':
            p.image(shapeQuestionmark, 1, -27);
            p.translate(42.5, -17.5);
            p.rotate(-p.QUARTER_PI);
            break;

          case '\n': // return
            p.image(shapeReturn, 1, -15);
            p.translate(1, 10);
            p.rotate(p.PI);
            break;

          default:
            // all others
            p.text(letter, 0, 0);
            p.translate(letterWidth, 0);
        }
      }

      // blink cursor after text
      if ((p.frameCount / 6) % 2 === 0) p.rect(0, 0, 15, 2);
    };
    p.mousePressed = () => {
      offsetX = p.mouseX - centerX;
      offsetY = p.mouseY - centerY;
    };
    p.keyReleased = () => {
      if (p.keyCode === p.ALT) actRandomSeed++;
    };
    p.keyPressed = () => {
      switch (p.keyCode) {
        case p.DELETE:
        case p.BACKSPACE:
          textTyped = textTyped.substring(0, p.max(0, textTyped.length - 1));
          p.print(textTyped);
          break;
        case p.ENTER:
        case p.RETURN:
          // enable linebreaks
          textTyped += '\n';
          break;
        case p.UP_ARROW:
          zoom += 0.05;
          break;
        case p.DOWN_ARROW:
          zoom -= 0.05;
          break;
      }
    };
    p.keyTyped = () => {
      if (p.keyCode >= 32) {
        textTyped += p.key;
        p.print(textTyped);
      }
    };
  });
  return '';
};

/**
 *  設計図としてのテキスト　～その２
 * [マウス]
 * ドラッグ：アートボードのスクロール
 * [キー]
 * キーボード：要素
 * スペース：開始地点をランダムな位置にする
 * Delete/Backspace：要素の削除
 * ↑↓：ディスプレイ領域のズーム
 * Alt（option）：ランダムレイアウトの更新
 */
export const P_3_1_2_02 = () => {
  if (!!globalP5Instance) globalP5Instance.remove();
  let textTyped = 'Was hier folgt ist Tet! So asnt, und mag. Ich mag Tet sehr.';
  let font: p5.Font;
  let shapeSpace: p5.Image;
  let shapeSpace2: p5.Image;
  let shapePeriod: p5.Image;
  let shapeComma: p5.Image;
  let shapeQuestionmark: p5.Image;
  let shapeExclamationmark: p5.Image;
  let icon1: p5.Image;
  let icon2: p5.Image;
  let icon3: p5.Image;
  let icon4: p5.Image;
  let icon5: p5.Image;

  let centerX: number;
  let centerY: number;

  let offsetX = 0;
  let offsetY = 0;
  let zoom = 0.75;
  let actRandomSeed = 6;
  const palette = [
    [253, 195, 0],
    [0, 0, 0],
    [0, 158, 224],
    [99, 33, 129],
    [121, 156, 19],
    [226, 0, 26],
    [224, 134, 178]
  ];
  let actColorIndex = 0;

  globalP5Instance = new p5((p: p5) => {
    p.preload = () => {
      font = p.loadFont(misoBoldFont);
      shapeSpace = p.loadImage(spaceP_3_1_2_02Svg);
      shapeSpace2 = p.loadImage(space2P_3_1_2_02Svg);
      shapePeriod = p.loadImage(periodP_3_1_2_02Svg);
      shapeComma = p.loadImage(commaP_3_1_2_02Svg);
      shapeExclamationmark = p.loadImage(exclamationmarkP_3_1_2_02Svg);
      shapeQuestionmark = p.loadImage(questionmarkP_3_1_2_02Svg);

      icon1 = p.loadImage(icon1Svg);
      icon2 = p.loadImage(icon2Svg);
      icon3 = p.loadImage(icon3Svg);
      icon4 = p.loadImage(icon4Svg);
      icon5 = p.loadImage(icon5Svg);
    };
    p.setup = () => {
      p.createCanvas(p.windowWidth, p.windowHeight);

      centerX = p.width / 2;
      centerY = p.height / 2;

      p.cursor(p.HAND);
      p.textFont(font, 25);
      p.textAlign(p.LEFT, p.BASELINE);
      p.noStroke();
      p.fill(0);
    };
    p.windowResized = () => {
      p.resizeCanvas(p.windowWidth, p.windowHeight);
    };
    p.draw = () => {
      p.background(255);

      if (p.mouseIsPressed && p.mouseButton === p.LEFT) {
        centerX = p.mouseX - offsetX;
        centerY = p.mouseY - offsetY;
      }

      // allways produce the same sequence of random numbers
      p.randomSeed(actRandomSeed);

      p.translate(centerX, centerY);
      p.scale(zoom);

      p.push();

      actColorIndex = 0;
      p.fill(
        palette[actColorIndex][0],
        palette[actColorIndex][1],
        palette[actColorIndex][2]
      );
      p.rect(0, -25, 10, 35);

      for (let i = 0; i < textTyped.length; i++) {
        const letter = textTyped.charAt(i);
        const letterWidth = p.textWidth(letter);

        // ------ letter rule table ------
        switch (letter) {
          case ' ': // space
            const dir = p.floor(p.random(5));
            if (dir === 0) {
              p.image(shapeSpace, 0, -15);
              p.translate(2, 0);
              p.rotate(p.QUARTER_PI);
            }
            if (dir === 1) {
              p.image(shapeSpace2, 0, -15);
              p.translate(13, -5);
              p.rotate(-p.QUARTER_PI);
            }
            break;

          case ',':
            p.image(shapeComma, 0, -15);
            p.translate(33, 15);
            p.rotate(p.QUARTER_PI);
            break;

          case '.':
            p.image(shapePeriod, 0, -56);
            p.translate(56, -56);
            p.rotate(-p.HALF_PI);
            break;

          case '!':
            p.image(shapeExclamationmark, 0, -30);
            p.translate(43, -18);
            p.rotate(-p.QUARTER_PI);
            break;

          case '?':
            p.image(shapeQuestionmark, 0, -30);
            p.translate(43, -18);
            p.rotate(-p.QUARTER_PI);
            break;

          case '\n':
            // start a new line at a random position near the center
            p.rect(0, -25, 10, 35);
            p.pop();
            p.push();
            p.translate(p.random(-300, 300), p.random(-300, 300));
            p.rotate(p.floor(p.random(8)) * p.QUARTER_PI);
            actColorIndex = (actColorIndex + 1) % palette.length;
            p.fill(
              palette[actColorIndex][0],
              palette[actColorIndex][1],
              palette[actColorIndex][2]
            );
            p.rect(0, -25, 10, 35);
            break;

          case 'o': // Station big
            p.rect(0, -15, letterWidth + 1, 15);
            p.push();
            p.fill(0);
            let station = textTyped.substring(i - 10, i - 1);
            station = station.toLowerCase();
            station = station.replace(/\s+/g, '');
            station =
              station.substring(0, 1).toUpperCase() +
              station.substring(1, station.length - 1);
            p.text(station, -10, 40);
            p.ellipse(-5, -7, 33, 33);
            p.fill(255);
            p.ellipse(-5, -7, 25, 25);
            p.pop();
            p.translate(letterWidth, 0);
            break;

          case 'a': // Station small left
            p.rect(0, 0 - 15, letterWidth + 1, 25);
            p.rect(0, 0 - 15, letterWidth + 1, 15);
            p.translate(letterWidth, 0);
            break;

          case 'u': // Station small right
            p.rect(0, 0 - 25, letterWidth + 1, 25);
            p.rect(0, 0 - 15, letterWidth + 1, 15);
            p.translate(letterWidth, 0);
            break;

          case ':': // icon
            p.image(icon1, 0, -60, 30, 30);
            break;

          case '+': // icon
            p.image(icon2, 0, -60, 35, 30);
            break;

          case '-': // icon
            p.image(icon3, 0, -60, 30, 30);
            break;

          case 'x': // icon
            p.image(icon4, 0, -60, 30, 30);
            break;

          case 'z': // icon
            p.image(icon5, 0, -60, 30, 30);
            break;

          default:
            // all others
            p.rect(0, -15, letterWidth + 1, 15);
            p.translate(letterWidth, 0);
        }
      }

      // blink cursor after text
      p.fill(200, 30, 40);
      if ((p.frameCount / 6) % 2 === 0) p.rect(0, 0, 15, 2);
      p.pop();
    };
    p.mousePressed = () => {
      offsetX = p.mouseX - centerX;
      offsetY = p.mouseY - centerY;
    };
    p.keyReleased = () => {
      if (p.keyCode === p.ALT) actRandomSeed++;
    };
    p.keyPressed = () => {
      switch (p.keyCode) {
        case p.DELETE:
        case p.BACKSPACE:
          textTyped = textTyped.substring(0, textTyped.length - 1);
          p.print(textTyped);
          break;
        case p.ENTER:
        case p.RETURN:
          textTyped += '\n';
          break;
        case p.UP_ARROW:
          zoom += 0.05;
          break;
        case p.DOWN_ARROW:
          zoom -= 0.05;
          break;
      }
    };
    p.keyTyped = () => {
      if (p.keyCode >= 32) {
        textTyped += p.key;
        p.print(textTyped);
      }
    };
  });
  return '';
};
