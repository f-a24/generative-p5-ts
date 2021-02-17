import p5 from 'p5';
import faustKurz from './assets/P_3_1_3_01/faust_kurz.txt';
import AllTheWorldsAStage from './assets/P_3_1_3_05/AllTheWorldsAStage.txt';
export default { title: 'P3：Type' };

declare const RiTa: any;
declare let globalP5Instance: p5;

/**
 * テキストイメージ　～その４
 * [マウス]
 * x座標：テキストの位置をそのままにするか並び替えるか
 * [キー]
 * 1：次の文字との線の表示 on/off
 * 2：同じ文字との線の表示 on/off
 * 3：文字の表示 on/off
 * 4：すべての文字非表示
 * 5：すべての文字表示
 * a-z：選択文字の表示 on/off
 */
export const P_3_1_3_04 = () => {
  if (!!globalP5Instance) globalP5Instance.remove();
  const counters: number[] = [];
  const drawLetters: boolean[] = [];

  let loadedText: string[];
  let joinedText: string;
  let charSet: string;
  let posX: number;
  let posY: number;
  let drawGreyLines = false;
  let drawColoredLines = true;
  let drawText = true;

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
      loadedText = p.loadStrings(faustKurz);
    };
    p.setup = () => {
      p.createCanvas(1200, p.windowHeight);
      p.colorMode(p.HSB, 360, 100, 100, 100);
      p.textFont('monospace', 18);
      p.fill(0);

      joinedText = loadedText.join(' ');
      charSet = getUniqCharacters();
      for (let i = 0; i < charSet.length; i++) {
        counters[i] = 0;
        drawLetters[i] = true;
      }

      countCharacters();
    };
    p.draw = () => {
      p.background(360);
      p.translate(50, 0);
      p.noStroke();

      posX = 0;
      posY = 200;
      let oldX = 0;
      let oldY = 0;

      const sortPositionsX: number[] = [];
      const oldPositionsX: number[] = [];
      const oldPositionsY: number[] = [];
      for (let i = 0; i < joinedText.length; i++) {
        sortPositionsX[i] = 0;
        oldPositionsX[i] = 0;
        oldPositionsY[i] = 0;
      }

      // draw counters
      if (p.mouseX >= p.width - 50) {
        p.textSize(10);
        for (let i = 0; i < charSet.length; i++) {
          p.textAlign(p.LEFT);
          p.text(charSet.charAt(i), -15, i * 20 + 40);
          p.textAlign(p.RIGHT);
          p.text(counters[i], -20, i * 20 + 40);
        }
        p.textAlign(p.LEFT);
        p.textSize(18);
      }

      // go through all characters in the text to draw them
      for (let i = 0; i < joinedText.length; i++) {
        // again, find the index of the current letter in the character set
        const upperCaseChar = joinedText.charAt(i).toUpperCase();
        const index = charSet.indexOf(upperCaseChar);
        if (index < 0) continue;

        let m = p.map(p.mouseX, 50, p.width - 50, 0, 1);
        m = p.constrain(m, 0, 1);

        const sortX = sortPositionsX[index];
        const interX = p.lerp(posX, sortX, m);

        const sortY = index * 20 + 40;
        const interY = p.lerp(posY, sortY, m);

        if (drawLetters[index]) {
          if (drawGreyLines) {
            if (oldX != 0 && oldY != 0) {
              p.stroke(0, 10);
              p.line(oldX, oldY, interX, interY);
            }
            oldX = interX;
            oldY = interY;
          }

          if (drawColoredLines) {
            if (oldPositionsX[index] != 0 && oldPositionsY[index] != 0) {
              p.stroke(index * 10, 80, 60, 50);
              p.line(
                oldPositionsX[index],
                oldPositionsY[index],
                interX,
                interY
              );
            }
            oldPositionsX[index] = interX;
            oldPositionsY[index] = interY;
          }

          if (drawText) {
            p.text(joinedText.charAt(i), interX, interY);
          }
        } else {
          oldX = 0;
          oldY = 0;
        }

        sortPositionsX[index] += p.textWidth(joinedText.charAt(i));
        posX += p.textWidth(joinedText.charAt(i));
        if (posX >= p.width - 200 && upperCaseChar === ' ') {
          posY += 40;
          posX = 0;
        }
      }
    };
    p.keyReleased = () => {
      if (p.key === '1') drawGreyLines = !drawGreyLines;
      if (p.key === '2') drawColoredLines = !drawColoredLines;
      if (p.key === '3') drawText = !drawText;
      if (p.key === '4') {
        for (let i = 0; i < charSet.length; i++) {
          drawLetters[i] = false;
        }
      }
      if (p.key === '5') {
        for (let i = 0; i < charSet.length; i++) {
          drawLetters[i] = true;
        }
      }

      const index = charSet.indexOf(p.key.toUpperCase());
      if (index >= 0) drawLetters[index] = !drawLetters[index];
    };
  });
  return '';
};

/**
 * テキストイメージ　～その５
 * [マウス]
 * x座標：テキストの位置をそのままにするか並び替えるか
 * [キー]
 * 1：次の単語との線の表示 on/off
 * 2：同じ単語との線の表示 on/off
 * 3：文字の表示 on/off
 */
export const P_3_1_3_05 = () => {
  if (!!globalP5Instance) globalP5Instance.remove();
  // Alphabetical list of PENN part-of-speech tags
  // source: https://rednoise.org/rita/reference/PennTags.html
  const allPOSTags = [
    'cc',
    'cd',
    'dt',
    'ex',
    'fw',
    'in',
    'jj',
    'jjr',
    'jjs',
    'ls',
    'md',
    'nn',
    'nns',
    'nnp',
    'nnps',
    'pdt',
    'pos',
    'prp',
    'prp$',
    'rb',
    'rbr',
    'rbs',
    'rp',
    'sym',
    'to',
    'uh',
    'vb',
    'vbd',
    'vbg',
    'vbn',
    'vbp',
    'vbz',
    'wdt',
    'wp',
    'wp$',
    'wrb'
  ];
  const allPOSTagsFull = [
    'Coordinating conjunction',
    'Cardinal number',
    'Determiner',
    'Existential there',
    'Foreign word',
    'Preposition or subordinating conjunction',
    'Adjective',
    'Adjective, comparative',
    'Adjective, superlative',
    'List item marker',
    'Modal',
    'Noun, singular or mass',
    'Noun, plural',
    'Proper noun, singular',
    'Proper noun, plural',
    'Predeterminer',
    'Possessive ending',
    'Personal pronoun',
    'Possessive pronoun',
    'Adverb',
    'Adverb, comparative',
    'Adverb, superlative',
    'Particle',
    'Symbol',
    'to',
    'Interjection',
    'Verb, base form',
    'Verb, past tense',
    'Verb, gerund or present participle',
    'Verb, past participle',
    'Verb, non-3rd person singular present',
    'Verb, 3rd person singular present',
    'Wh-determiner',
    'Wh-pronoun',
    'Possessive wh-pronoun',
    'Wh-adverb'
  ];

  const counters: number[] = [];
  const textPOSTags: string[] = [];

  let joinedText: string[];
  let posX: number;
  let posY: number;
  let drawGreyLines = false;
  let drawColoredLines = true;
  let drawText = true;

  globalP5Instance = new p5((p: p5) => {
    p.preload = () => {
      joinedText = p.loadStrings(AllTheWorldsAStage);
    };
    p.setup = () => {
      p.createCanvas(p.windowWidth, p.windowHeight);
      p.colorMode(p.HSB, 360, 100, 100, 100);

      p.textFont('monospace', 18);
      p.fill(0);

      for (let i = 0; i < allPOSTags.length; i++) {
        counters.push(0);
      }

      joinedText = joinedText.join(' ').split(/\s+/);
      for (let i = 0; i < joinedText.length; i++) {
        const wordPOSTag = RiTa.getPosTags(
          RiTa.stripPunctuation(joinedText[i])
        )[0];

        textPOSTags.push(wordPOSTag);

        const tagIndex = allPOSTags.indexOf(wordPOSTag);
        if (tagIndex >= 0) counters[tagIndex]++;

        joinedText[i] += ' ';
      }
    };
    p.draw = () => {
      p.background(360);
      p.translate(50, 0);
      p.noStroke();

      posX = 0;
      posY = 50;
      const sortPositionsX = [];
      const oldPositionsX = [];
      const oldPositionsY = [];
      for (let i = 0; i < joinedText.length; i++) {
        sortPositionsX[i] = 0;
        oldPositionsX[i] = 0;
        oldPositionsY[i] = 0;
      }
      let oldX = 0;
      let oldY = 0;

      // draw counters
      if (p.mouseX >= p.width - 50) {
        p.textSize(10);
        for (let i = 0; i < allPOSTags.length; i++) {
          p.textAlign(p.LEFT);
          p.text(
            allPOSTags[i] + ' (' + allPOSTagsFull[i] + ')',
            -20,
            i * 20 + 40
          );
          p.textAlign(p.RIGHT);
          p.text(counters[i], -25, i * 20 + 40);
        }
        p.textAlign(p.LEFT);
        p.textSize(18);
      }

      p.translate(256, 0);

      // go through all characters in the text to draw them
      for (let i = 0; i < joinedText.length; i++) {
        // again, find the index of the current letter in the alphabet
        const wordPOSTag = textPOSTags[i];
        const index = allPOSTags.indexOf(wordPOSTag);
        if (index < 0) continue;

        let m = p.map(p.mouseX, 50, p.width - 50, 0, 1);
        m = p.constrain(m, 0, 1);

        const sortX = sortPositionsX[index];
        const interX = p.lerp(posX, sortX, m);

        const sortY = index * 20 + 40;
        const interY = p.lerp(posY, sortY, m);

        if (drawGreyLines) {
          if (oldX != 0 && oldY != 0) {
            p.stroke(0, 10);
            p.line(oldX, oldY, interX, interY);
          }
          oldX = interX;
          oldY = interY;
        }

        if (drawColoredLines) {
          if (oldPositionsX[index] != 0 && oldPositionsY[index] != 0) {
            p.stroke(index * 10, 80, 60, 50);
            p.line(oldPositionsX[index], oldPositionsY[index], interX, interY);
          }
          oldPositionsX[index] = interX;
          oldPositionsY[index] = interY;
        }

        if (drawText) p.text(joinedText[i], interX, interY);

        sortPositionsX[index] += p.textWidth(joinedText[i]);
        posX += p.textWidth(joinedText[i]);
        if (posX >= p.min(p.width, 1000)) {
          posY += 40;
          posX = 0;
        }
      }
    };
    p.keyReleased = () => {
      if (p.key === '1') drawGreyLines = !drawGreyLines;
      if (p.key === '2') drawColoredLines = !drawColoredLines;
      if (p.key === '3') drawText = !drawText;
    };
  });
  return '';
};
