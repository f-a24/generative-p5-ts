import p5 from 'p5';
import { timestamp } from './lib/generative-design-library';
import VideoMp4 from './assets/P_4_2_2_01/video.mp4';
import VideoOgg from './assets/P_4_2_2_01/video.ogg';
import Pic from './assets/P_4_3_1_01/pic.png';
import Svg056 from './assets/P_4_3_1_02/056.svg';
import Svg076 from './assets/P_4_3_1_02/076.svg';
import Svg082 from './assets/P_4_3_1_02/082.svg';
import Svg096 from './assets/P_4_3_1_02/096.svg';
import Svg117 from './assets/P_4_3_1_02/117.svg';
import Svg148 from './assets/P_4_3_1_02/148.svg';
import Svg152 from './assets/P_4_3_1_02/152.svg';
import Svg157 from './assets/P_4_3_1_02/157.svg';
import Svg164 from './assets/P_4_3_1_02/164.svg';
import Svg166 from './assets/P_4_3_1_02/166.svg';
import Svg186 from './assets/P_4_3_1_02/186.svg';
import Svg198 from './assets/P_4_3_1_02/198.svg';
import Svg224 from './assets/P_4_3_1_02/224.svg';
export default { title: 'P4：Image' };

declare let globalP5Instance: p5;

/**
 * 時間ベースの画像の集合　～その１
 */
export const P_4_2_2_01 = () => {
  if (!!globalP5Instance) globalP5Instance.remove();
  const tileCountX = 9;
  const tileCountY = 12;
  const imageCount = tileCountX * tileCountY;

  let tileWidth: number;
  let tileHeight: number;
  let currentImage = 0;
  let gridX = 0;
  let gridY = 0;
  let movie: any;

  globalP5Instance = new p5((p: p5) => {
    p.preload = () => {
      movie = p.createVideo([VideoMp4, VideoOgg]);
      movie.hide();
    };
    p.setup = () => {
      p.createCanvas(1024, 1024);
      p.background(0);
      tileWidth = p.width / tileCountX;
      tileHeight = p.height / tileCountY;
      p.print(movie.width + ' • ' + movie.height);
    };
    p.draw = () => {
      if (movie.elt.readyState === 4) {
        const posX = tileWidth * gridX;
        const posY = tileHeight * gridY;

        // draw video
        p.image(movie, posX, posY, tileWidth, tileHeight);

        currentImage++;

        // seek the video to next time
        const nextTime = p.map(
          currentImage,
          0,
          imageCount,
          0,
          movie.duration()
        );
        p.print('seek to: ' + movie.time());
        movie.time(nextTime);

        // new grid position
        gridX++;
        if (gridX >= tileCountX) {
          gridX = 0;
          gridY++;
        }

        if (currentImage >= imageCount) p.noLoop();
      }
    };
  });
  return '';
};

/**
 * 時間ベースの画像の集合　～その２
 */
export const P_4_2_2_02 = () => {
  if (!!globalP5Instance) globalP5Instance.remove();
  // intervalTime in sec., here 30 seconds
  const intervalTime = 30;
  const startTime = timestamp();

  let cam: any;
  let secondsSinceStart = 0;
  let counter = 0;
  let doSave = true;
  let streamReady = false;

  globalP5Instance = new p5((p: p5) => {
    p.setup = () => {
      p.createCanvas(640, 480);
      cam = p.createCapture(p.VIDEO, () => {
        streamReady = true;
      });
      cam.hide();
      p.noStroke();
    };
    p.draw = () => {
      if (streamReady) {
        p.image(cam, 0, 0, p.width, (p.width * cam.height) / cam.width);

        secondsSinceStart = p.millis() / 1000;
        const interval = p.int(secondsSinceStart % intervalTime);

        if (interval === 0 && doSave === true) {
          const saveFileName = startTime + '-' + p.nf(counter, 5, 0);
          p.saveCanvas(saveFileName, 'png');
          doSave = false;
          counter++;
        } else if (interval !== 0) {
          doSave = true;
        }

        // visualize the time to the next shot
        p.fill(p.random(0, 255), p.random(0, 255), p.random(0, 255));
        p.rect(p.map(interval, 0, intervalTime, 0, p.width), 0, 5, 5);
      }
    };
  });
  return '';
};

/**
 * ピクセル値が作るグラフィック　～その１
 * [マウス]
 * x/y座標：さまざまなパラメータ（描画モードによる）
 * [キー]
 * 1-9：描画モード
 */
export const P_4_3_1_01 = () => {
  if (!!globalP5Instance) globalP5Instance.remove();
  let drawMode = 1;
  let img: p5.Image;

  globalP5Instance = new p5((p: p5) => {
    p.preload = () => {
      img = p.loadImage(Pic);
    };
    p.setup = () => {
      p.createCanvas(603, 873);
      p.print(img.width + ' • ' + img.height);
    };
    p.draw = () => {
      p.background(255);

      const mouseXFactor = p.map(p.mouseX, 0, p.width, 0.05, 1);
      const mouseYFactor = p.map(p.mouseY, 0, p.height, 0.05, 1);

      for (let gridX = 0; gridX < img.width; gridX++) {
        for (let gridY = 0; gridY < img.height; gridY++) {
          // grid position + tile size
          const tileWidth = p.width / img.width;
          const tileHeight = p.height / img.height;
          const posX = tileWidth * gridX;
          const posY = tileHeight * gridY;

          // get current color
          img.loadPixels();
          const c = p.color(img.get(gridX, gridY));
          // greyscale conversion
          const greyscale = p.round(
            p.red(c) * 0.222 + p.green(c) * 0.707 + p.blue(c) * 0.071
          );

          switch (drawMode) {
            case 1:
              // greyscale to stroke weight
              const w1 = p.map(greyscale, 0, 255, 15, 0.1);
              p.stroke(0);
              p.strokeWeight(w1 * mouseXFactor);
              p.line(posX, posY, posX + 5, posY + 5);
              break;
            case 2:
              // greyscale to ellipse area
              p.fill(0);
              p.noStroke();
              let r2 =
                1.1284 * p.sqrt(tileWidth * tileWidth * (1 - greyscale / 255));
              r2 *= mouseXFactor * 3;
              p.ellipse(posX, posY, r2, r2);
              break;
            case 3:
              // greyscale to line length
              let l3 = p.map(greyscale, 0, 255, 30, 0.1);
              l3 *= mouseXFactor;
              p.stroke(0);
              p.strokeWeight(10 * mouseYFactor);
              p.line(posX, posY, posX + l3, posY + l3);
              break;
            case 4:
              // greyscale to rotation, line length and stroke weight
              p.stroke(0);
              const w4 = p.map(greyscale, 0, 255, 10, 0);
              p.strokeWeight(w4 * mouseXFactor + 0.1);
              let l4 = p.map(greyscale, 0, 255, 35, 0);
              l4 *= mouseYFactor;
              p.push();
              p.translate(posX, posY);
              p.rotate((greyscale / 255) * p.PI);
              p.line(0, 0, 0 + l4, 0 + l4);
              p.pop();
              break;
            case 5:
              // greyscale to line relief
              const w5 = p.map(greyscale, 0, 255, 5, 0.2);
              p.strokeWeight(w5 * mouseYFactor + 0.1);
              // get neighbour pixel, limit it to image width
              const c2 = p.color(
                img.get(p.min(gridX + 1, img.width - 1), gridY)
              );
              p.stroke(c2);
              const greyscale2 = p.floor(
                p.red(c2) * 0.222 + p.green(c2) * 0.707 + p.blue(c2) * 0.071
              );
              const h5 = 50 * mouseXFactor;
              const d1 = p.map(greyscale, 0, 255, h5, 0);
              const d2 = p.map(greyscale2, 0, 255, h5, 0);
              p.line(posX - d1, posY + d1, posX + tileWidth - d2, posY + d2);
              break;
            case 6:
              // pixel color to fill, greyscale to ellipse size
              const w6 = p.map(greyscale, 0, 255, 25, 0);
              p.noStroke();
              p.fill(c);
              p.ellipse(posX, posY, w6 * mouseXFactor, w6 * mouseXFactor);
              break;
            case 7:
              p.stroke(c);
              const w7 = p.map(greyscale, 0, 255, 5, 0.1);
              p.strokeWeight(w7);
              p.fill(255, 255 * mouseXFactor);
              p.push();
              p.translate(posX, posY);
              p.rotate((greyscale / 255) * p.PI * mouseYFactor);
              p.rect(0, 0, 15, 15);
              p.pop();
              break;
            case 8:
              p.noStroke();
              p.fill(greyscale, greyscale * mouseXFactor, 255 * mouseYFactor);
              p.rect(posX, posY, 3.5, 3.5);
              p.rect(posX + 4, posY, 3.5, 3.5);
              p.rect(posX, posY + 4, 3.5, 3.5);
              p.rect(posX + 4, posY + 4, 3.5, 3.5);
              break;
            case 9:
              p.stroke(255, greyscale, 0);
              p.noFill();
              p.push();
              p.translate(posX, posY);
              p.rotate((greyscale / 255) * p.PI);
              p.strokeWeight(1);
              p.rect(0, 0, 15 * mouseXFactor, 15 * mouseYFactor);
              const w9 = p.map(greyscale, 0, 255, 15, 0.1);
              p.strokeWeight(w9);
              p.stroke(0, 70);
              p.ellipse(0, 0, 10, 5);
              p.pop();
              break;
          }
        }
      }
    };
    p.keyReleased = () => {
      // change draw mode
      if (p.key === '1') drawMode = 1;
      if (p.key === '2') drawMode = 2;
      if (p.key === '3') drawMode = 3;
      if (p.key === '4') drawMode = 4;
      if (p.key === '5') drawMode = 5;
      if (p.key === '6') drawMode = 6;
      if (p.key === '7') drawMode = 7;
      if (p.key === '8') drawMode = 8;
      if (p.key === '9') drawMode = 9;
    };
  });
  return '';
};

/**
 * ピクセル値が作るグラフィック　～その２
 */
export const P_4_3_1_02 = () => {
  if (!!globalP5Instance) globalP5Instance.remove();
  let shapes: p5.Image[];
  let img: p5.Image;

  globalP5Instance = new p5((p: p5) => {
    p.preload = () => {
      img = p.loadImage(Pic);

      shapes = [];
      shapes.push(p.loadImage(Svg056));
      shapes.push(p.loadImage(Svg076));
      shapes.push(p.loadImage(Svg082));
      shapes.push(p.loadImage(Svg096));
      shapes.push(p.loadImage(Svg117));
      shapes.push(p.loadImage(Svg148));
      shapes.push(p.loadImage(Svg152));
      shapes.push(p.loadImage(Svg157));
      shapes.push(p.loadImage(Svg164));
      shapes.push(p.loadImage(Svg166));
      shapes.push(p.loadImage(Svg186));
      shapes.push(p.loadImage(Svg198));
      shapes.push(p.loadImage(Svg224));
    };
    p.setup = () => {
      p.createCanvas(600, 900);
      p.image(img, 0, 0);
    };
    p.draw = () => {
      p.background(255);

      for (let gridX = 0; gridX < img.width; gridX++) {
        for (let gridY = 0; gridY < img.height; gridY++) {
          // grid position + title size
          const titleWidth = 603 / img.width;
          const titleHeight = 873 / img.height;
          const posX = titleWidth * gridX;
          const posY = titleHeight * gridY;

          // get current color
          img.loadPixels();
          const c = img.get(p.min(gridX, img.width - 1), gridY);
          // greyscale conversion
          const greyscale = p.round(
            p.red(c) * 0.222 + p.green(c) * 0.707 + p.blue(c) * 0.071
          );
          const gradientToIndex = p.round(
            p.map(greyscale, 0, 255, 0, shapes.length - 1)
          );
          p.image(shapes[gradientToIndex], posX, posY, titleWidth, titleHeight);
        }
      }
    };
  });
  return '';
};
