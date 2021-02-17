import p5 from 'p5';
import opentype from 'opentype.js';
import AniLetters from './lib/AniLetters';
import animatedType from './lib/animatedType';
import FiraSansCompressedBold from './assets/P_3_2_5_01/FiraSansCompressed-Bold.otf';
import FreeSansFont from './assets/P_3_2_1_01/FreeSans.otf';
export default { title: 'P3：Type' };

declare let globalP5Instance: p5;

/**
 * 動きのあるフォント　～その１
 * [マウス]
 * x/y座標：さまざまなパラメータ（描画モードによる）
 * [キー]
 * キーボード：テキスト入力
 * Delete/Backspace：文字の削除
 * ←→：描画モードの変更
 * ↑↓：点の密度を変更
 */
export const P_3_2_5_01 = () => {
  if (!!globalP5Instance) globalP5Instance.remove();
  const fontSize = 250;

  let font: p5.Font;
  let textTyped = 'TYPE & CODE';
  let drawMode = 1;
  let nOff = 0;
  let pointDensity = 8;
  let colors: p5.Color[];
  let textImg: p5.Graphics;

  globalP5Instance = new p5((p: p5) => {
    const setupText = () => {
      // create an offscreen graphics object to draw the text into
      textImg = p.createGraphics(p.width, p.height);
      textImg.pixelDensity(1);
      textImg.background(255);
      textImg.textFont(font);
      textImg.textSize(fontSize);
      textImg.text(textTyped, 100, fontSize + 50);
      textImg.loadPixels();
    };
    p.preload = () => {
      font = p.loadFont(FiraSansCompressedBold);
    };
    p.setup = () => {
      p.createCanvas(1600, 800);
      p.frameRate(25);
      p.rectMode(p.CENTER);

      colors = [
        p.color(65, 105, 185),
        p.color(245, 95, 80),
        p.color(15, 233, 118)
      ];
      p.pixelDensity(1);

      setupText();
    };
    p.draw = () => {
      p.background(255);
      nOff++;

      for (let x = 0; x < textImg.width; x += pointDensity) {
        for (let y = 0; y < textImg.height; y += pointDensity) {
          // Calculate the index for the pixels array from x and y
          const index = (x + y * textImg.width) * 4;
          // Get the red value from image
          const r = textImg.pixels[index];

          if (r < 128) {
            if (drawMode == 1) {
              p.strokeWeight(1);

              const noiseFac = p.map(p.mouseX, 0, p.width, 0, 1);
              const lengthFac = p.map(p.mouseY, 0, p.height, 0.01, 1);

              const num = p.noise((x + nOff) * noiseFac, y * noiseFac);
              if (num < 0.6) p.stroke(colors[0]);
              else if (num < 0.7) p.stroke(colors[1]);
              else p.stroke(colors[2]);

              p.push();
              p.translate(x, y);
              p.rotate(p.radians(p.frameCount));
              p.line(0, 0, fontSize * lengthFac, 0);
              p.pop();
            }

            if (drawMode == 2) {
              p.stroke(0, 0, 0);
              p.strokeWeight(1);
              p.noStroke();
              p.push();
              p.translate(x, y);

              const num = p.noise((x + nOff) / 10, y / 10);

              if (num < 0.6) p.fill(colors[0]);
              else if (num < 0.7) p.fill(colors[1]);
              else p.fill(colors[2]);

              const w = p.noise((x - nOff) / 10, (y + nOff * 0.1) / 10) * 20;
              const h = p.noise((x - nOff) / 10, (y + nOff * 0.1) / 10) * 10;
              p.ellipse(0, 0, w, h); // rect() is cool too
              p.pop();
            }

            if (drawMode == 3) {
              p.stroke(0, 0, 0);
              p.strokeWeight(1);
              p.noStroke();

              const num = p.random(1);

              if (num < 0.6) p.fill(colors[0]);
              else if (num < 0.7) p.fill(colors[1]);
              else p.fill(colors[2]);

              p.push();
              p.beginShape();
              for (let i = 0; i < 3; i++) {
                const ox =
                  (p.noise(
                    (i * 1000 + x - nOff) / 30,
                    (i * 3000 + y + nOff) / 30
                  ) -
                    0.5) *
                  pointDensity *
                  6;
                const oy =
                  (p.noise(
                    (i * 2000 + x - nOff) / 30,
                    (i * 4000 + y + nOff) / 30
                  ) -
                    0.5) *
                  pointDensity *
                  6;
                p.vertex(x + ox, y + oy);
              }
              p.endShape(p.CLOSE);
              p.pop();
            }

            if (drawMode == 4) {
              p.stroke(colors[0]);
              p.strokeWeight(3);

              p.point(x - 10, y - 10);
              p.point(x, y);
              p.point(x + 10, y + 10);

              for (let i = 0; i < 5; i++) {
                if (i === 1) p.stroke(colors[1]);
                else if (i === 3) p.stroke(colors[2]);

                if (i % 2 == 0) {
                  const ox = p.noise((10000 + i * 100 + x - nOff) / 10) * 10;
                  const oy = p.noise((20000 + i * 100 + x - nOff) / 10) * 10;
                  p.point(x + ox, y + oy);
                } else {
                  const ox = p.noise((30000 + i * 100 + x - nOff) / 10) * 10;
                  const oy = p.noise((40000 + i * 100 + x - nOff) / 10) * 10;
                  p.point(x - ox, y - oy);
                }
              }
            }
          }
        }
      }
    };
    p.keyPressed = () => {
      if (p.keyCode === p.DELETE || p.keyCode === p.BACKSPACE) {
        textTyped = textTyped.substring(0, p.max(0, textTyped.length - 1));
        setupText();
      }
      if (p.keyCode === p.ENTER || p.keyCode === p.RETURN) {
        textTyped += '\n';
        setupText();
      }
      if (p.keyCode === p.LEFT_ARROW) {
        drawMode--;
        if (drawMode < 1) drawMode = 4;
      }
      if (p.keyCode === p.RIGHT_ARROW) {
        drawMode++;
        if (drawMode > 4) drawMode = 1;
      }
      if (p.keyCode === p.DOWN_ARROW) {
        pointDensity--;
        if (pointDensity < 4) pointDensity = 4;
      }
      if (p.keyCode === p.UP_ARROW) pointDensity++;
    };
    p.keyTyped = () => {
      if (p.keyCode >= 32) {
        textTyped += p.key;
        setupText();
      }
    };
  });
  return '';
};

/**
 * 動きのあるフォント　～その２
 * [キー]
 * キーボード：テキスト入力
 * Delete/Backspace：文字の削除
 * 1-2：円/正方形
 * ←→：描画モードの変更
 * ↑↓：アニメーションスピード
 */
export const P_3_2_5_02 = () => {
  if (!!globalP5Instance) globalP5Instance.remove();
  let aniLetters: AniLetters;

  globalP5Instance = new p5((p: p5) => {
    p.setup = () => {
      p.createCanvas(800, 800);
      p.strokeWeight(1);
      p.strokeCap(p.ROUND);

      // adding your aniLetters object with
      // the letter width and height
      aniLetters = new AniLetters(p, 40, 100);

      // initialize with a message
      aniLetters.textTyped.push(aniLetters.addText('TYPE'));
      aniLetters.textTyped.push(aniLetters.addText('CODE'));
    };
    p.draw = () => {
      // noLoop();
      p.background(255, 255, 255, 30);

      // count how many lines of text there are
      aniLetters.getLineCount();
      // collect the letters and their x and y locations
      aniLetters.getPaths();
      // loop through the paths and draw them to screen
      aniLetters.render();
    };
    p.keyPressed = () => {
      // change draw mode
      if (p.keyCode === p.LEFT_ARROW) {
        aniLetters.drawMode--;
        if (aniLetters.drawMode < 1) aniLetters.drawMode = 3;
      }
      if (p.keyCode === p.RIGHT_ARROW) {
        aniLetters.drawMode++;
        if (aniLetters.drawMode > 3) aniLetters.drawMode = 1;
      }
      // change the number of steps in the animation
      if (p.keyCode === p.DOWN_ARROW) {
        aniLetters.aniSteps--;
        if (aniLetters.aniSteps < 4) aniLetters.aniSteps = 4;
      }
      if (p.keyCode === p.UP_ARROW) aniLetters.aniSteps++;

      // change between ellipses and rect
      if (p.key === '1') aniLetters.style = 1;
      if (p.key === '2') aniLetters.style = 2;

      // on return
      if (p.keyCode == p.ENTER || p.keyCode == p.RETURN) {
        aniLetters.addLines();
      }
      // remove letters
      if (p.keyCode === p.DELETE || p.keyCode === p.BACKSPACE) {
        // aniLetters.textTyped.pop();
        // aniLetters.cursorLocation.x -= aniLetters.letterWidth + aniLetters.letterPadding;
        aniLetters.removeLetters();
      }
    };
    p.keyTyped = () => {
      if (p.keyCode >= 32) aniLetters.addCharacters(p.key);
    };
  });
  return '';
};

/**
 * 動きのあるフォント　～その３
 * [マウス]
 * x/y座標：さまざまなパラメータ（描画モードによる）
 * [キー]
 * キーボード：テキスト入力
 * Delete/Backspace：文字の削除
 * ←→：描画モードの変更
 * ↑↓：点の密度を変更
 */
export const P_3_2_5_03 = () => {
  if (!!globalP5Instance) globalP5Instance.remove();
  let font: opentype.Font;
  // declare your animatedText variable
  let myAnimatedText: animatedType;

  globalP5Instance = new p5((p: p5) => {
    p.setup = () => {
      p.createCanvas(p.windowWidth, p.windowHeight);
      p.noLoop();
      p.noCursor();
      p.imageMode(p.CENTER);
      p.rectMode(p.CENTER);

      // read in the font to opentype.js
      opentype.load(FreeSansFont, (err, f) => {
        if (err) p.print('Font could not be loaded: ' + err);
        else {
          font = f;
          // initialize the animatedType Object
          myAnimatedText = new animatedType(p, font);
          // add some text in
          myAnimatedText.textTyped.push(myAnimatedText.addText('TYPE!'));
          myAnimatedText.textTyped.push(myAnimatedText.addText('CODE!'));
          p.loop();
        }
      });

      // frameRate(1)
    };
    p.draw = () => {
      // noLoop();
      if (!font) return;
      p.background(255, 255, 255, 20);
      // background(255, 255, 255);

      // margin border
      p.translate(20, 150);
      p.fill(0);

      myAnimatedText.getLineCount();
      myAnimatedText.getPaths();
      myAnimatedText.getIndividualPaths();
      myAnimatedText.getCoordinates();

      // draw methods
      if (myAnimatedText.drawMode == 1)
        myAnimatedText.animatedPoints('ellipse');
      if (myAnimatedText.drawMode == 2) myAnimatedText.animatedPoints('rect');
      if (myAnimatedText.drawMode == 3) myAnimatedText.lines2mouse();
      if (myAnimatedText.drawMode == 4) myAnimatedText.radialLines();
      if (myAnimatedText.drawMode == 5) myAnimatedText.orbitingPoints('points');
      if (myAnimatedText.drawMode == 6)
        myAnimatedText.wobblyShapes('TRIANGLE_FAN');
      if (myAnimatedText.drawMode == 7)
        myAnimatedText.wobblyShapes('TRIANGLES');
      if (myAnimatedText.drawMode == 8) myAnimatedText.outwardLines();
    };
    // key controls
    p.keyPressed = () => {
      if (p.keyCode === p.DELETE || p.keyCode === p.BACKSPACE)
        myAnimatedText.removeLetters();
      if (p.keyCode === p.ENTER || p.keyCode === p.RETURN)
        myAnimatedText.addLines();
      if (p.keyCode === p.LEFT_ARROW) {
        myAnimatedText.drawMode--;
        if (myAnimatedText.drawMode < 1) myAnimatedText.drawMode = 8;
      }
      if (p.keyCode === p.RIGHT_ARROW) {
        myAnimatedText.drawMode++;
        if (myAnimatedText.drawMode > 8) myAnimatedText.drawMode = 1;
      }
      if (p.keyCode === p.UP_ARROW) {
        myAnimatedText.pointDensity--;
        if (myAnimatedText.pointDensity < 2) myAnimatedText.pointDensity = 2;
      }
      if (p.keyCode === p.DOWN_ARROW) myAnimatedText.pointDensity++;
    };
    p.keyTyped = () => {
      if (p.keyCode >= 32) myAnimatedText.addCharacters(p.key);
    };
  });
  return '';
};
