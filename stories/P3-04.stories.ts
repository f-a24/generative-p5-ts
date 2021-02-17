import p5 from 'p5';
import opentype from 'opentype.js';
import {
  Treemap,
  Path,
  resampleByLength
} from './lib/generative-design-library';
import misoBoldFont from './assets/P_3_1_2_01/miso-bold.ttf';
import FreeSansFont from './assets/P_3_2_1_01/FreeSans.otf';
import prideAndPrejudice from './assets/P_3_1_4_01/pride_and_prejudice.txt';
import A_01SVG from './assets/P_3_2_1_02/A_01.svg';
import A_02SVG from './assets/P_3_2_1_02/A_02.svg';
import B_01SVG from './assets/P_3_2_1_02/B_01.svg';
import B_02SVG from './assets/P_3_2_1_02/B_02.svg';
import C_01SVG from './assets/P_3_2_1_02/C_01.svg';
import C_02SVG from './assets/P_3_2_1_02/C_02.svg';
import D_01SVG from './assets/P_3_2_1_02/D_01.svg';
import D_02SVG from './assets/P_3_2_1_02/D_02.svg';
export default { title: 'P3：Type' };

declare let globalP5Instance: p5;

/**
 * テキストダイアグラム　～その１
 * [キー]
 * r：ランダム on/off
 * h：水平方向のレイアウト
 * v：垂直方向のレイアウト
 * b：両方向のレイアウト
 */
export const P_3_1_4_01 = () => {
  if (!!globalP5Instance) globalP5Instance.remove();
  let loadedText: string[];
  let joinedText: string;
  let treemap: Treemap;
  let font: p5.Font;
  let doSort = true;
  let rowDirection = 'both';

  globalP5Instance = new p5((p: p5) => {
    p.preload = () => {
      font = p.loadFont(misoBoldFont);
      loadedText = p.loadStrings(prideAndPrejudice);
    };
    p.setup = () => {
      p.createCanvas(p.windowWidth, p.windowHeight);
      joinedText = loadedText.join(' ');

      // If you want to get rid of all number chars too, just uncomment the following line
      // joinedText = joinedText.replace(/\d+/g, '');
      const words = joinedText.match(/\w+/g);
      treemap = new Treemap(p, 1, 1, p.width - 3, p.height - 3, {
        sort: doSort,
        direction: rowDirection
      });

      // count words
      for (let i = 0; i < words.length; i++) {
        const w = words[i].toLowerCase();
        treemap.addData(w);
      }
      treemap.calculate();
    };
    p.draw = () => {
      p.background(255);
      p.textAlign(p.CENTER, p.BASELINE);

      for (let i = 0; i < treemap.items.length; i++) {
        const item = treemap.items[i];

        p.fill(255);
        p.stroke(0);
        p.strokeWeight(1);
        p.rect(item.x, item.y, item.w, item.h);

        const word = item.data;
        p.textFont(font, 100);
        const textW = p.textWidth(word);
        let fontSize = (100 * (item.w * 0.9)) / textW;
        fontSize = p.min(fontSize, item.h * 0.9);
        p.textFont(font, fontSize);

        p.fill(0);
        p.noStroke();
        p.text(word, item.x + item.w / 2, item.y + item.h * 0.8);
      }
      p.noLoop();
    };
    p.keyTyped = () => {
      if (p.key === 'r' || p.key === 'R') {
        doSort = !doSort;
        treemap.options.sort = doSort;
        treemap.calculate();
        p.loop();
      }
      if (p.key === 'h' || p.key === 'H') {
        rowDirection = 'horizontal';
        treemap.options.direction = rowDirection;
        treemap.calculate();
        p.loop();
      }
      if (p.key === 'v' || p.key === 'V') {
        rowDirection = 'vertical';
        treemap.options.direction = rowDirection;
        treemap.calculate();
        p.loop();
      }
      if (p.key === 'b' || p.key === 'B') {
        rowDirection = 'both';
        treemap.options.direction = rowDirection;
        treemap.calculate();
        p.loop();
      }
    };
  });
  return '';
};

/**
 * テキストダイアグラム　～その２
 * r：ランダム on/off
 * h：水平方向のレイアウト
 * v：垂直方向のレイアウト
 * b：両方向のレイアウト
 * 1-9：文字数のグループ表示 on/off
 * 0：全グループ表示
 */
export const P_3_1_4_02 = () => {
  if (!!globalP5Instance) globalP5Instance.remove();
  let loadedText: string[];
  let joinedText: string;
  let treemap: Treemap;
  let font: p5.Font;
  let doSort = true;
  let rowDirection = 'both';

  globalP5Instance = new p5((p: p5) => {
    p.preload = () => {
      font = p.loadFont(misoBoldFont);
      loadedText = p.loadStrings(prideAndPrejudice);
    };
    p.setup = () => {
      p.createCanvas(p.windowWidth, p.windowHeight);
      joinedText = loadedText.join(' ');
      // If you want to get rid of all number chars too, just uncomment the following line
      // joinedText = joinedText.replace(/\d+/g, '');
      const words = joinedText.match(/\w+/g);

      // create the main treemap
      treemap = new Treemap(p, 1, 1, p.width - 3, p.height - 3, {
        sort: doSort,
        direction: rowDirection,
        padding: 2,
        ignore: []
      });

      // make an array for the nested treemaps
      const subTreemaps = [];

      // count words
      for (let i = 0; i < words.length; i++) {
        const w = words[i].toLowerCase();
        const index = w.length;
        // Add only words with less than 10 letters
        if (index < 10) {
          let t = subTreemaps[index];
          if (t === undefined) {
            t = treemap.addTreemap(index);
            subTreemaps[index] = t;
          }
          t.addData(w);
        }
      }
      treemap.calculate();
    };
    p.draw = () => {
      p.background(255);
      p.textAlign(p.CENTER, p.BASELINE);

      // p.colorMode(p.HSB, 360, 100, 100, 100);
      p.strokeWeight(1);

      for (let i = 0; i < treemap.items.length; i++) {
        const subTreemap = treemap.items[i];
        if (!subTreemap.ignored) {
          // const h = p.map(i, 0, treemap.items.length, 50, 150);

          for (let j = 0; j < subTreemap.items.length; j++) {
            const item = subTreemap.items[j];
            // const s = p.map(subTreemap.items[j].count, 0, subTreemap.maxCount, 10, 30);

            // p.fill(h, s, 100);
            // p.stroke(h, s + 20, 90);
            p.noFill();
            p.stroke(0);
            p.rect(item.x, item.y, item.w, item.h);

            const word = subTreemap.items[j].data;
            p.textFont(font, 100);
            const textW = p.textWidth(word);
            let fontSize = (100 * (item.w * 0.9)) / textW;
            fontSize = p.min(fontSize, item.h * 0.9);
            p.textFont(font, fontSize);

            p.fill(0);
            p.noStroke();
            p.text(word, item.x + item.w / 2, item.y + item.h * 0.8);
          }
        }
      }
      p.noLoop();
    };
    p.keyTyped = () => {
      if (p.key === 'r' || p.key === 'R') {
        doSort = !doSort;
        treemap.options.sort = doSort;
        treemap.calculate();
        p.loop();
      }
      if (p.key === 'h' || p.key === 'H') {
        rowDirection = 'horizontal';
        treemap.options.direction = rowDirection;
        treemap.calculate();
        p.loop();
      }
      if (p.key === 'v' || p.key === 'V') {
        rowDirection = 'vertical';
        treemap.options.direction = rowDirection;
        treemap.calculate();
        p.loop();
      }
      if (p.key === 'b' || p.key === 'B') {
        rowDirection = 'both';
        treemap.options.direction = rowDirection;
        treemap.calculate();
        p.loop();
      }

      // number key 1 - 9
      if (p.keyCode >= 49 && p.keyCode <= 57) {
        const num = p.keyCode - 48;
        // search for the pressed number in the ignore array
        const i = treemap.options.ignore.indexOf(num);
        if (i >= 0) {
          // found value, so remove it
          treemap.options.ignore.splice(i, 1);
        } else {
          // not found, so add to array
          treemap.options.ignore.push(num);
        }
        treemap.calculate();
        p.loop();
      }
      if (p.key === '0') {
        treemap.options.ignore = [];
        treemap.calculate();
        p.loop();
      }
    };
  });
  return '';
};

/**
 * フォントアウトラインの分解　～その１
 * [キー]
 * キーボード：テキスト入力
 * Delete/Backspace：文字の削除
 */
export const P_3_2_1_01 = () => {
  if (!!globalP5Instance) globalP5Instance.remove();
  let textTyped = 'Type ...!';
  let font: opentype.Font;

  globalP5Instance = new p5((p: p5) => {
    p.setup = () => {
      p.createCanvas(p.windowWidth, p.windowHeight);
      p.noLoop();

      opentype.load(FreeSansFont, (err, f) => {
        if (err) console.log(err);
        else {
          font = f;
          p.loop();
        }
      });
    };
    p.draw = () => {
      if (!font) return;

      p.background(255);
      // margin border
      p.translate(20, 220);

      if (textTyped.length > 0) {
        // get a path from OpenType.js
        const fontPath = font.getPath(textTyped, 0, 0, 200);
        // convert it to a g.Path object
        let path = new Path(fontPath.commands);
        // resample it with equidistant points
        path = resampleByLength(path, 11);
        // path = g.resampleByAmount(path, 500);

        // lines
        p.stroke(181, 157, 0);
        p.strokeWeight(1.0);
        const l = 5;
        for (let i = 0; i < path.commands.length; i++) {
          const pnt = path.commands[i];
          p.line(pnt.x - l, pnt.y - l, pnt.x + l, pnt.y + l);
        }

        // dots
        p.fill(0);
        p.noStroke();
        const diameter = 7;
        for (let i = 0; i < path.commands.length; i++) {
          const pnt = path.commands[i];
          // on every 2nd point
          if (i % 2 === 0) p.ellipse(pnt.x, pnt.y, diameter, diameter);
        }
      }
      p.noLoop();
    };
    p.keyPressed = () => {
      if (
        (p.keyCode === p.DELETE || p.keyCode === p.BACKSPACE) &&
        textTyped.length > 0
      ) {
        textTyped = textTyped.substring(0, textTyped.length - 1);
        p.loop();
      }
    };
    p.keyTyped = () => {
      if (p.keyCode >= 32) {
        textTyped += p.key;
        p.loop();
      }
    };
  });
  return '';
};

/**
 * フォントアウトラインの分解　～その２
 * [マウス]
 * x座標：SVG要素の回転角度
 * y座標：SVG要素の拡大縮小率
 * [キー]
 * Alt：SVG要素の変更
 * キーボード：テキスト入力
 * Delete/Backspace：文字の削除
 *
 */
export const P_3_2_1_02 = () => {
  if (!!globalP5Instance) globalP5Instance.remove();
  let textTyped = 'Type...!';
  let font: opentype.Font;
  let shapeSet = 0;
  let module1: p5.Image;
  let module2: p5.Image;

  globalP5Instance = new p5((p: p5) => {
    p.preload = () => {
      module1 = p.loadImage(A_01SVG);
      module2 = p.loadImage(A_02SVG);
    };
    p.setup = () => {
      p.createCanvas(p.windowWidth, p.windowHeight);
      opentype.load(FreeSansFont, (err, f) => {
        if (err) console.log(err);
        else font = f;
      });
    };
    p.draw = () => {
      p.background(255);
      p.noStroke();
      p.imageMode(p.CENTER);

      // margin border
      p.translate(60, 300);

      if (textTyped.length > 0 && font != undefined) {
        // get a path from OpenType.js
        const fontPath = font.getPath(textTyped, 0, 0, 200);
        // convert it to a g.Path object
        let path = new Path(fontPath.commands);
        // resample it with equidistant points
        path = resampleByLength(path, 6);

        // ------ svg modules ------
        // module1
        let diameter = 30;

        for (let i = 0; i < path.commands.length - 1; i++) {
          const pnt = path.commands[i];
          const nextPnt = path.commands[i + 1];

          // skip this loop if one of the points doesn't have coordinates (could happen for path closing commands)
          if (!pnt.x || !nextPnt.x) continue;

          // on every third point
          if (i % 3 === 0) {
            // rotate the module facing to the next one (i+1)
            p.push();
            const angle = p.atan2(pnt.y - nextPnt.y, pnt.x - nextPnt.x);
            p.translate(pnt.x, pnt.y);
            p.rotate(angle);
            p.rotate(p.radians(-p.mouseX));
            p.image(
              module1,
              0,
              0,
              diameter + p.mouseY / 2.5,
              diameter + p.mouseY / 2.5
            );
            p.pop();
          }
        }

        // module2
        diameter = 18;
        for (let i = 0; i < path.commands.length - 1; i++) {
          const pnt = path.commands[i];
          const nextPnt = path.commands[i + 1];

          // skip this loop if one of the points doesn't have coordinates (could happen for path closing commands)
          if (!pnt.x || !nextPnt.x) continue;

          // on every third point
          if (i % 3 === 0) {
            // rotate the module facing to the next one (i+1)
            p.push();
            const angle = p.atan2(pnt.y - nextPnt.y, pnt.x - nextPnt.x);
            p.translate(pnt.x, pnt.y);
            p.rotate(angle);
            p.rotate(p.radians(p.mouseX));
            p.image(
              module2,
              0,
              0,
              diameter + p.mouseY / 2.5,
              diameter + p.mouseY / 2.5
            );
            p.pop();
          }
        }
      }
    };
    p.keyPressed = () => {
      if (
        (p.keyCode === p.DELETE || p.keyCode === p.BACKSPACE) &&
        textTyped.length > 0
      ) {
        textTyped = textTyped.substring(0, textTyped.length - 1);
      }

      if (p.keyCode === p.ALT) {
        shapeSet = (shapeSet + 1) % 4;
        switch (shapeSet) {
          case 0:
            module1 = p.loadImage(A_01SVG);
            module2 = p.loadImage(A_02SVG);
            break;
          case 1:
            module1 = p.loadImage(B_01SVG);
            module2 = p.loadImage(B_02SVG);
            break;
          case 2:
            module1 = p.loadImage(C_01SVG);
            module2 = p.loadImage(C_02SVG);
            break;
          case 3:
            module1 = p.loadImage(D_01SVG);
            module2 = p.loadImage(D_02SVG);
            break;
        }
      }
    };
    p.keyTyped = () => {
      if (p.keyCode >= 32) textTyped += p.key;
    };
  });
  return '';
};
