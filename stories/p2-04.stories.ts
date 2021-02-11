import p5 from 'p5';
import draw from './assets/P_2_1_4_01/draw.png';
import shapes from './assets/P_2_1_4_01/shapes.png';
import toner from './assets/P_2_1_4_01/toner.png';
import ball from './assets/P_2_1_4_02/ball.mov';
export default { title: 'P2：Shape' };

declare let globalP5Instance: p5;

/**
 * グリッドとチェックボックス　～その１
 * [キー]
 * 1-3：画像の切り替え
 * [スライダー]
 * グレースケールのしきい値の調整
 */
export const P_2_1_4_01 = () => {
  if (!!globalP5Instance) globalP5Instance.remove();
  const cols = 40;
  const rows = 40;
  const imgList: p5.Image[] = [];

  let img: p5.Image;
  let slider: p5.Element;
  let boxes: p5.Element[];
  let boxHolder: p5.Element;

  globalP5Instance = new p5((p: p5) => {
    p.preload = () => {
      imgList[0] = p.loadImage(draw);
      imgList[1] = p.loadImage(shapes);
      imgList[2] = p.loadImage(toner);
    };
    p.setup = () => {
      // the html dom elements are not rendered on canvas
      p.noCanvas();
      // set pixel density to 1
      p.pixelDensity(1);
      boxHolder = p.createDiv('');
      boxHolder.id('mirror');

      boxes = [];

      // set the current img
      img = imgList[0];
      img.resize(cols, rows);
      img.loadPixels();

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const box = p.createCheckbox();
          box.style('display', 'inline');
          box.parent('mirror');
          boxes.push(box);
        }
        const linebreak = p.createSpan('<br/>');
        linebreak.parent('mirror');
      }

      // add a slider to adjust the pixel threshold
      slider = p.createSlider(0, 255, 0);
    };
    p.draw = () => {
      for (let y = 0; y < img.height; y++) {
        for (let x = 0; x < img.height; x++) {
          const c = p.color(img.get(x, y));
          const bright = (p.red(c) + p.green(c) + p.blue(c)) / 3;

          // get the threshold from the slider
          const threshold = slider.value();

          const checkIndex = x + y * cols;
          (boxes[checkIndex] as any).checked(bright <= threshold);
        }
      }
    };
    p.keyPressed = () => {
      if (p.key === '1') img = imgList[0];
      if (p.key === '2') img = imgList[1];
      if (p.key === '3') img = imgList[2];

      img.resize(cols, rows);
      img.loadPixels();
    };
  });
  return '';
};

/**
 * グリッドとチェックボックス　～その２
 * [スライダー]
 * グレースケールのしきい値の調整
 */
export const P_2_1_4_02 = () => {
  if (!!globalP5Instance) globalP5Instance.remove();
  const cols = 40;
  const rows = 40;

  let video: any;
  let slider: p5.Element;
  let boxes: p5.Element[];
  let boxHolder: p5.Element;

  globalP5Instance = new p5((p: p5) => {
    p.preload = () => {
      video = p.createVideo(ball);
    };
    p.setup = () => {
      p.noCanvas();
      p.pixelDensity(1);

      boxHolder = p.createDiv('');
      boxHolder.id('mirror');

      boxes = [];

      video.size(cols, rows);
      // slider threshold at 200
      slider = p.createSlider(0, 255, 200);

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const box = p.createCheckbox();
          box.style('display', 'inline');
          box.parent('mirror');
          boxes.push(box);
        }
        const linebreak = p.createSpan('<br/>');
        linebreak.parent('mirror');
      }
      // play the video in a loop
      video.loop();
    };
    p.draw = () => {
      (video as any).loadPixels();
      for (let y = 0; y < video.height; y++) {
        for (let x = 0; x < video.width; x++) {
          // get the video pixel location
          const index = (x + y * video.height) * 4;
          const r = video.pixels[index];
          const g = video.pixels[index + 1];
          const b = video.pixels[index + 2];

          const bright = (r + g + b) / 3;
          const threshold = slider.value();
          const checkIndex = x + y * cols;

          (boxes[checkIndex] as any).checked(
            bright <= (threshold as number) - 1
          );
        }
      }
    };
  });
  return '';
};

/**
 * グリッドとチェックボックス　～その３
 */
export const P_2_1_4_03 = () => {
  if (!!globalP5Instance) globalP5Instance.remove();
  const w = 600;
  const sliderHeight = 17;
  const padding = 10;
  const sliderMin = 0;
  const sliderMax = 100;

  let sliderCount: number;
  let sliderWidth: number;

  globalP5Instance = new p5((p: p5) => {
    p.setup = () => {
      p.createCanvas(800, 800);
      // get the number of sliders based on w & h
      sliderWidth = w / 2;
      sliderCount = p.ceil(sliderWidth / sliderHeight);
      p.noLoop();
    };
    p.draw = () => {
      p.background(48, 58, 118);

      for (let i = 0; i <= sliderCount; i++) {
        // topleft - horizontal
        const sval1 = p.map(i, sliderCount, 0, sliderMin, sliderMax);
        p.createSlider(sliderMin, sliderMax, sval1)
          .position(padding, i * sliderHeight + padding)
          .style('width', sliderWidth + 'px');

        // bottomright - horizontal
        p.createSlider(sliderMin, sliderMax, sval1)
          .position(
            sliderWidth + padding * 3,
            sliderWidth + padding * 2 + i * sliderHeight
          )
          .style('width', sliderWidth + 'px');

        // topright - vertical
        const sval2 = p.map(i, 0, sliderCount, sliderMin, sliderMax);
        p.createSlider(sliderMin, sliderMax, sval2)
          .position(
            sliderWidth / 2 + padding * 2 + i * sliderHeight,
            sliderWidth / 2 + padding
          )
          .style('width', sliderWidth + 'px')
          .style('transform', 'rotate(' + 90 + 'deg)');

        // bottomleft - vertical
        p.createSlider(sliderMin, sliderMax, sval1)
          .position(
            sliderWidth / 2 - i * sliderHeight + padding * 2,
            sliderWidth + sliderWidth / 2 + padding * 3
          )
          .style('width', sliderWidth + 'px')
          .style('transform', 'rotate(' + 90 + 'deg)');
      }
    };
  });
  return '';
};

/**
 * グリッドとチェックボックス　～その４
 * [マウス]
 * クリック：オブジェクトの追加
 */
export const P_2_1_4_04 = () => {
  if (!!globalP5Instance) globalP5Instance.remove();
  globalP5Instance = new p5((p: p5) => {
    // define a SliderRose object
    class SliderRose {
      x1: number;
      y1: number;
      private sliders: p5.Element[];
      private sinAngle: number;
      constructor(_x: number, _y: number) {
        this.x1 = _x;
        this.y1 = _y;
        // collect the sliders in an array
        this.sliders = [];
        this.sinAngle = 0;

        // create a counter to index the sliders
        let counter = 0;
        // set the slider width
        const roseRadius = p.random(20, 100);
        // define how many degrees to skip from 360
        const skip = 20;
        // create sliders around a circle
        for (let i = 0; i < 360; i += skip) {
          const sliderAngle = p.radians(i);
          const x2 = p.cos(sliderAngle) * roseRadius;
          const y2 = p.sin(sliderAngle) * roseRadius;
          // create the slider, position, and rotate
          this.sliders[counter] = p.createSlider(0, 255, 50);
          this.sliders[counter].position(this.x1 + x2, this.y1 + y2);
          this.sliders[counter].style('width', roseRadius + 'px');
          this.sliders[counter].style('transform', 'rotate(' + i + 'deg)');
          counter++;
        }
      }
      // for each loop through the draw function
      // update the sliders according to a sin wave
      update() {
        let offset = 0;
        for (let i = 0; i < this.sliders.length; i++) {
          // map the value along the sine wave to the slider values
          const x = p.map(p.sin(this.sinAngle + offset), -1, 1, 0, 255);
          this.sliders[i].value(x);
          offset += 0.05;
        }
        this.sinAngle += 0.1;
      }
    }
    const sliders: SliderRose[] = [];
    p.setup = () => {
      p.createCanvas(p.windowWidth, p.windowHeight);
      // init canvas with slider rose to the middle
      sliders.push(new SliderRose(p.width / 2, p.height / 2));
    };
    p.draw = () => {
      p.background(101, 179, 109);
      // create slider animations
      sliders.forEach(d => {
        d.update();
      });
    };
    p.mousePressed = () => {
      sliders.push(new SliderRose(p.mouseX, p.mouseY));
    };
  });
  return '';
};
