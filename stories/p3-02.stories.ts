import p5 from 'p5';
import faustKurz from './assets/P_3_1_3_01/faust_kurz.txt';
import faustShort from './assets/P_3_1_3_03/faust_short.txt';
export default { title: 'P3：Type' };

declare let globalP5Instance: p5;

/**
 * テキストイメージ　～その１
 * [マウス]
 * x座標：テキストの位置をそのままにするか並び替えるか
 * [キー]
 * a：透明モードの切り替え
 */
export const P_3_1_3_01 = () => {
  if (!!globalP5Instance) globalP5Instance.remove();
  const alphabet = 'ABCDEFGHIJKLMNORSTUVWYZÄÖÜß,.;!? ';
  const counters: number[] = [];

  let loadedText: string[];
  let joinedText: string;
  let drawAlpha = true;

  const countCharacters = () => {
    for (let i = 0; i < joinedText.length; i++) {
      // get one character from the text and turn it to uppercase
      const c = joinedText.charAt(i);
      const upperCaseChar = c.toUpperCase();
      const index = alphabet.indexOf(upperCaseChar);
      // increase the respective counter
      if (index >= 0) counters[index]++;
    }
  };
  globalP5Instance = new p5((p: p5) => {
    p.preload = () => {
      loadedText = p.loadStrings(faustKurz);
    };
    p.setup = () => {
      p.createCanvas(620, p.windowHeight);
      p.noStroke();
      p.textFont('monospace', 18);
      joinedText = loadedText.join(' ');
      for (let i = 0; i < alphabet.length; i++) {
        counters[i] = 0;
      }
      countCharacters();
    };
    p.draw = () => {
      p.background(255);
      let posX = 20;
      let posY = 40;

      // go through all characters in the text to draw them
      for (let i = 0; i < joinedText.length; i++) {
        // again, find the index of the current letter in the character set
        const upperCaseChar = joinedText.charAt(i).toUpperCase();
        const index = alphabet.indexOf(upperCaseChar);
        if (index < 0) continue;

        if (drawAlpha) {
          p.fill(87, 35, 129, counters[index] * 3);
        } else {
          p.fill(87, 35, 129);
        }

        const sortY = index * 20 + 40;
        let m = p.map(p.mouseX, 50, p.width - 50, 0, 1);
        m = p.constrain(m, 0, 1);
        const interY = p.lerp(posY, sortY, m);

        p.text(joinedText.charAt(i), posX, interY);

        posX += p.textWidth(joinedText.charAt(i));
        if (posX >= p.width - 200 && upperCaseChar === ' ') {
          posY += 30;
          posX = 20;
        }
      }
    };
    p.keyReleased = () => {
      if (p.key === 'a' || p.key === 'A') drawAlpha = !drawAlpha;
    };
  });
  return '';
};

/**
 * テキストイメージ　～その２
 * [マウス]
 * x座標：テキストの位置をそのままにするか並び替えるか
 * [キー]
 * 1：段落線の表示 on/off
 * 2：文字の表示 on/off
 * 3：すべての文字非表示
 * 4：すべての文字表示
 * a-z：選択文字の表示 on/off
 */
export const P_3_1_3_02 = () => {
  if (!!globalP5Instance) globalP5Instance.remove();
  const drawLetters = [];

  let loadedText: string[];
  let joinedText: string;
  let alphabet: string;
  let posX: number;
  let posY: number;
  let drawLines = false;
  let drawText = true;

  const getUniqCharacters = () => {
    const charsArray = joinedText.toUpperCase().split('');
    const uniqCharsArray = charsArray
      .filter((char, index) => charsArray.indexOf(char) === index)
      .sort();
    return uniqCharsArray.join('');
  };
  globalP5Instance = new p5((p: p5) => {
    p.preload = () => {
      loadedText = p.loadStrings(faustKurz);
    };
    p.setup = () => {
      p.createCanvas(620, p.windowHeight);
      p.textFont('monospace', 18);
      p.fill(87, 35, 129);

      joinedText = loadedText.join(' ');
      alphabet = getUniqCharacters();
      for (let i = 0; i < alphabet.length; i++) {
        drawLetters[i] = true;
      }
    };
    p.draw = () => {
      p.background(255);

      posX = 20;
      posY = 40;
      let oldX = 0;
      let oldY = 0;

      // go through all characters in the text to draw them
      for (let i = 0; i < joinedText.length; i++) {
        // again, find the index of the current letter in the character set
        const upperCaseChar = joinedText.charAt(i).toUpperCase();
        const index = alphabet.indexOf(upperCaseChar);
        if (index < 0) continue;

        const sortY = index * 20 + 40;
        let m = p.map(p.mouseX, 50, p.width - 50, 0, 1);
        m = p.constrain(m, 0, 1);
        const interY = p.lerp(posY, sortY, m);

        if (drawLetters[index]) {
          if (drawLines) {
            if (oldX !== 0 && oldY !== 0) {
              p.stroke(181, 157, 0, 100);
              p.line(oldX, oldY, posX, interY);
            }
            oldX = posX;
            oldY = interY;
          }

          if (drawText) {
            p.noStroke();
            p.text(joinedText.charAt(i), posX, interY);
          }
        } else {
          oldX = 0;
          oldY = 0;
        }

        posX += p.textWidth(joinedText.charAt(i));
        if (posX >= p.width - 200 && upperCaseChar === ' ') {
          posY += 30;
          posX = 20;
        }
      }
    };
    p.keyReleased = () => {
      if (p.key === '1') drawLines = !drawLines;
      if (p.key === '2') drawText = !drawText;
      if (p.key === '3') {
        for (let i = 0; i < alphabet.length; i++) {
          drawLetters[i] = false;
        }
      }
      if (p.key === '4') {
        drawText = true;
        for (let i = 0; i < alphabet.length; i++) {
          drawLetters[i] = true;
        }
      }

      const index = alphabet.indexOf(p.key.toUpperCase());
      if (index >= 0) drawLetters[index] = !drawLetters[index];
    };
  });
  return '';
};

/**
 * テキストイメージ　～その３
 * [マウス]
 * x座標：ランダムな角度
 * y座標：上下方向の距離・線の長さ・円のサイズ
 * [キー]
 * 1：透明モードの切り替え
 * 2：線の表示切り替え
 * 3：円の表示切り替え
 * 4：文字の表示切り替え
 */
export const P_3_1_3_03 = () => {
  if (!!globalP5Instance) globalP5Instance.remove();
  const counters: number[] = [];
  const tracking = 29;

  let loadedText: string[];
  let joinedText: string;
  let charSet: string;
  let posX: number;
  let posY: number;
  let actRandomSeed = 0;
  let drawAlpha = true;
  let drawLines = true;
  let drawEllipses = true;
  let drawText = false;

  const getUniqCharacters = () => {
    const charsArray = joinedText.toUpperCase().split('');
    const uniqCharsArray = charsArray
      .filter((char, index) => charsArray.indexOf(char) === index)
      .sort();
    return uniqCharsArray.join('');
  };

  const countCharacters = () => {
    for (let i = 0; i < joinedText.length; i++) {
      // get one character from the text and turn it to uppercase
      const index = charSet.indexOf(joinedText.charAt(i).toUpperCase());
      // increacre the respective counter
      if (index >= 0) counters[index]++;
    }
  };

  globalP5Instance = new p5((p: p5) => {
    p.preload = () => {
      loadedText = p.loadStrings(faustShort);
    };
    p.setup = () => {
      p.createCanvas(1400, p.windowHeight);
      p.colorMode(p.HSB, 360, 100, 100, 100);

      p.textFont('monospace', 20);
      p.noStroke();

      joinedText = loadedText.join(joinedText);
      charSet = getUniqCharacters();
      for (let i = 0; i < charSet.length; i++) {
        counters[i] = 0;
      }

      countCharacters();
    };
    p.draw = () => {
      p.background(360);

      posX = 80;
      posY = 300;
      p.randomSeed(actRandomSeed);

      // go through all characters in the text to draw them
      for (let i = 0; i < joinedText.length; i++) {
        // again, find the index of the current letter in the character set
        const upperCaseChar = joinedText.charAt(i).toUpperCase();
        const index = charSet.indexOf(upperCaseChar);
        if (index < 0) continue;

        // calculate parameters
        let charAlpha = 100;
        if (drawAlpha) charAlpha = counters[index];

        let my = p.map(p.mouseY, 50, p.height - 50, 0, 1);
        my = p.constrain(my, 0, 1);
        const charSize = counters[index] * my * 3;

        let mx = p.map(p.mouseX, 50, p.width - 50, 0, 1);
        mx = p.constrain(mx, 0, 1);
        const lineLength = charSize;
        const lineAngle = p.random(-p.PI, p.PI) * mx - p.HALF_PI;
        const newPosX = lineLength * p.cos(lineAngle);
        const newPosY = lineLength * p.sin(lineAngle);

        // draw elements
        p.push();
        p.translate(posX, posY);
        p.stroke(273, 73, 51, charAlpha);
        if (drawLines) p.line(0, 0, newPosX, newPosY);
        p.noStroke();
        p.fill(52, 100, 71, charAlpha);
        if (drawEllipses) p.ellipse(0, 0, charSize / 10, charSize / 10);
        if (drawText) {
          p.fill(0, charAlpha);
          p.text(joinedText.charAt(i), newPosX, newPosY);
        }
        p.pop();

        posX += p.textWidth(joinedText.charAt(i));
        if (posX >= p.width - 200 && upperCaseChar === ' ') {
          posY += p.int(tracking * my + 30);
          posX = 80;
        }
      }
    };
    p.keyReleased = () => {
      if (p.key === '1') drawAlpha = !drawAlpha;
      if (p.key === '2') drawLines = !drawLines;
      if (p.key === '3') drawEllipses = !drawEllipses;
      if (p.key === '4') drawText = !drawText;
    };
  });
  return '';
};
