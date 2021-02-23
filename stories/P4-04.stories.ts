import p5 from 'p5';
import { timestamp } from './lib/generative-design-library';
import { emojis } from './lib/emoji-average-colors';
import { kdTree, rgbObj } from './lib/kdTree';
import Pic from './assets/P_4_3_1_01/pic.png';
import * as twemoji from './lib/twemojiModuleP_4_3_4_01';
export default { title: 'P4：Image' };

declare let globalP5Instance: p5;

/**
 * ピクセル値が作る絵文字　～その１
 */
export const P_4_3_4_01 = () => {
  if (!!globalP5Instance) globalP5Instance.remove();
  const tileWidth = 20;
  const tileHeight = 20;
  // var emojis -> defined in file emoji-average-colors.js
  const icons: { [key: string]: p5.Image } = {};

  let img: p5.Image;
  let tree;

  globalP5Instance = new p5((p: p5) => {
    p.preload = () => {
      img = p.loadImage(Pic);
      for (const name in emojis) {
        icons[name] = p.loadImage(twemoji[`twemoji${name.replace(/-/g, '_')}`]);
      }
    };
    p.setup = () => {
      p.createCanvas(img.width * tileWidth, img.height * tileHeight);

      // setup kdTree to find neareast color in a speedy way
      const colors: rgbObj[] = [];
      for (const name in emojis) {
        const col = emojis[name].averageColor;
        col.name = name;
        colors.push(col);
      }
      const distance = (a: rgbObj, b: rgbObj) =>
        Math.pow(a.r - b.r, 2) +
        Math.pow(a.g - b.g, 2) +
        Math.pow(a.b - b.b, 2);
      tree = new kdTree(colors, distance, ['r', 'g', 'b']);
    };
    p.draw = () => {
      p.background(255);

      for (let gridX = 0; gridX < img.width; gridX++) {
        for (let gridY = 0; gridY < img.height; gridY++) {
          // grid position
          const posX = tileWidth * gridX;
          const posY = tileHeight * gridY;

          // get current color
          const c = p.color(img.get(gridX, gridY));

          // find emoji with 'nearest' color
          const nearest = tree.nearest(
            { r: p.red(c), g: p.green(c), b: p.blue(c) },
            1
          );

          const name = nearest[0][0].name;
          p.image(icons[name], posX, posY, tileWidth, tileHeight);
        }
      }
      p.noLoop();
    };
  });
  return '';
};

/**
 * ピクセル値が作る絵文字　～その２
 */
export const P_4_3_4_02 = () => {
  if (!!globalP5Instance) globalP5Instance.remove();
  // var emojis -> defined in file emoji-average-colors.js
  const icons: { [key: string]: p5.Image } = {};

  let cam;
  let tree;
  let recording = false;

  globalP5Instance = new p5((p: p5) => {
    p.preload = () => {
      for (const name in emojis) {
        icons[name] = p.loadImage(twemoji[`twemoji${name.replace(/-/g, '_')}`]);
      }
    };
    p.setup = () => {
      p.createCanvas(80 * 16, 60 * 16);

      // setup kdTree to find neareast color in a speedy way
      const colors: rgbObj[] = [];
      for (const name in emojis) {
        const col = emojis[name].averageColor;
        col.emoji = name;
        colors.push(col);
      }
      const distance = (a: rgbObj, b: rgbObj) =>
        Math.pow(a.r - b.r, 2) +
        Math.pow(a.g - b.g, 2) +
        Math.pow(a.b - b.b, 2);
      tree = new kdTree(colors, distance, ['r', 'g', 'b']);

      // setup camera
      cam = p.createCapture(p.VIDEO);
      cam.size(80, 60);
      cam.hide();
    };
    p.draw = () => {
      p.background(255);
      // image(cam, 0, 0, width, width*cam.height/cam.width);
      cam.loadPixels();

      const titleWidth = p.width / cam.width;
      const titleHeight = p.height / cam.height;
      // console.log("tile size: "+titleWidth+" x "+titleHeight);
      for (let gridX = 0; gridX < cam.width; gridX++) {
        for (let gridY = 0; gridY < cam.height; gridY++) {
          // grid position
          const posX = titleWidth * gridX;
          const posY = titleHeight * gridY;
          // get current color
          const rgba = cam.get(p.min(gridX, cam.width - 1), gridY);
          // find emoji with 'nearest' color
          const nearest = tree.nearest(
            { r: rgba[0], g: rgba[1], b: rgba[2] },
            1
          )[0][0];
          // console.log(nearest);
          p.image(icons[nearest.emoji], posX, posY, titleWidth, titleHeight);
          // fill(rgba);
          // ellipse(posX, posY, titleWidth, titleHeight);
        }
      }

      if (recording) p.saveCanvas(timestamp(), 'png');
    };
    p.keyReleased = () => {
      if (p.key === 'f' || p.key === 'F') recording = !recording;
    };
  });
  return '';
};
