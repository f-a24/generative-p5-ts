import p5 from 'p5';
export default { title: 'P1：Color' };

declare let globalP5Instance: p5;

/**
 * ルールで作るカラーパレット　～その１
 * [マウス]
 * x/y座標：解像度
 * [キー]
 * 0-9：カラーパレットの切り替え
 */
export const P_1_2_3_01 = () => {
  if (!!globalP5Instance) globalP5Instance.remove();
  const tileCountX = 50;
  const tileCountY = 10;

  const hueValues: number[] = [];
  const saturationValues: number[] = [];
  const brightnessValues: number[] = [];
  globalP5Instance = new p5((p: p5) => {
    p.setup = () => {
      p.createCanvas(p.windowWidth, p.windowHeight);
      p.colorMode(p.HSB, 360, 100, 100, 100);
      p.noStroke();

      // init with random values
      for (let i = 0; i < tileCountX; i++) {
        hueValues[i] = p.random(360);
        saturationValues[i] = p.random(100);
        brightnessValues[i] = p.random(100);
      }
    };

    p.draw = () => {
      // white back
      p.background(0, 0, 100);

      // limit mouse coordinates to canvas
      const mX = p.constrain(p.mouseX, 0, p.width);
      const mY = p.constrain(p.mouseY, 0, p.height);

      // tile counter
      let counter = 0;

      // map mouse to grid resolution
      const currentTileCountX = p.int(p.map(mX, 0, p.width, 1, tileCountX));
      const currentTileCountY = p.int(p.map(mY, 0, p.height, 1, tileCountY));
      const tileWidth = p.width / currentTileCountX;
      const tileHeight = p.height / currentTileCountY;

      for (let gridY = 0; gridY < tileCountY; gridY++) {
        for (let gridX = 0; gridX < tileCountX; gridX++) {
          const posX = tileWidth * gridX;
          const posY = tileHeight * gridY;
          const index = counter % currentTileCountX;

          // get component color values
          p.fill(
            hueValues[index],
            saturationValues[index],
            brightnessValues[index]
          );
          p.rect(posX, posY, tileWidth, tileHeight);
          counter++;
        }
      }
    };

    p.keyPressed = () => {
      if (p.key === '1') {
        for (let i = 0; i < tileCountX; i++) {
          hueValues[i] = p.random(360);
          saturationValues[i] = p.random(100);
          brightnessValues[i] = p.random(100);
        }
      }

      if (p.key === '2') {
        for (let i = 0; i < tileCountX; i++) {
          hueValues[i] = p.random(360);
          saturationValues[i] = p.random(100);
          brightnessValues[i] = 100;
        }
      }

      if (p.key === '3') {
        for (let i = 0; i < tileCountX; i++) {
          hueValues[i] = p.random(360);
          saturationValues[i] = 100;
          brightnessValues[i] = p.random(100);
        }
      }

      if (p.key === '4') {
        for (let i = 0; i < tileCountX; i++) {
          hueValues[i] = 0;
          saturationValues[i] = 0;
          brightnessValues[i] = p.random(100);
        }
      }

      if (p.key === '5') {
        for (let i = 0; i < tileCountX; i++) {
          hueValues[i] = 195;
          saturationValues[i] = 100;
          brightnessValues[i] = p.random(100);
        }
      }

      if (p.key === '6') {
        for (let i = 0; i < tileCountX; i++) {
          hueValues[i] = 195;
          saturationValues[i] = p.random(100);
          brightnessValues[i] = 100;
        }
      }

      if (p.key === '7') {
        for (let i = 0; i < tileCountX; i++) {
          hueValues[i] = p.random(180);
          saturationValues[i] = p.random(80, 100);
          brightnessValues[i] = p.random(50, 90);
        }
      }

      if (p.key === '8') {
        for (let i = 0; i < tileCountX; i++) {
          hueValues[i] = p.random(180, 360);
          saturationValues[i] = p.random(80, 100);
          brightnessValues[i] = p.random(50, 90);
        }
      }

      if (p.key === '9') {
        for (let i = 0; i < tileCountX; i++) {
          if (i % 2 === 0) {
            hueValues[i] = p.random(360);
            saturationValues[i] = 100;
            brightnessValues[i] = p.random(100);
          } else {
            hueValues[i] = 195;
            saturationValues[i] = p.random(100);
            brightnessValues[i] = 100;
          }
        }
      }

      if (p.key === '0') {
        for (let i = 0; i < tileCountX; i++) {
          if (i % 2 === 0) {
            hueValues[i] = 140;
            saturationValues[i] = p.random(30, 100);
            brightnessValues[i] = p.random(40, 100);
          } else {
            hueValues[i] = 210;
            saturationValues[i] = p.random(40, 100);
            brightnessValues[i] = p.random(50, 100);
          }
        }
      }
    };
  });
  return '';
};

/**
 * ルールで作るカラーパレット　～その２
 * ・タイルのサイズもランダム
 * [マウス]
 * 左クリック：カラーパレットの切り替え
 */
export const P_1_2_3_02 = () => {
  if (!!globalP5Instance) globalP5Instance.remove();
  const colorCount = 20;
  const hueValues: number[] = [];
  const saturationValues: number[] = [];
  const brightnessValues: number[] = [];

  let actRandomSeed = 0;

  globalP5Instance = new p5((p: p5) => {
    p.setup = () => {
      p.createCanvas(p.windowWidth, p.windowHeight);
      p.colorMode(p.HSB, 360, 100, 100, 100);
      p.noStroke();
    };
    p.draw = () => {
      p.noLoop();
      p.randomSeed(actRandomSeed);

      // ------ colors ------
      // create palette
      for (let i = 0; i < colorCount; i++) {
        if (i % 2 === 0) {
          hueValues[i] = p.random(130, 220);
          saturationValues[i] = 100;
          brightnessValues[i] = p.random(15, 100);
        } else {
          hueValues[i] = 195;
          saturationValues[i] = p.random(20, 100);
          brightnessValues[i] = 100;
        }
      }
      // ------ area tiling ------
      // count tiles
      let counter = 0;
      // row count and row height
      const rowCount = p.int(p.random(5, 30));
      const rowHeight = p.height / rowCount;

      // seperate each line in parts
      for (let i = rowCount; i >= 0; i--) {
        // how many fragments
        let partCount = i + 1;
        const parts = [];

        for (let ii = 0; ii < partCount; ii++) {
          // sub fragments or not?
          if (p.random() < 0.075) {
            // take care of big values
            const fragments = p.int(p.random(2, 20));
            partCount = partCount + fragments;
            for (let iii = 0; iii < fragments; iii++) {
              parts.push(p.random(2));
            }
          } else {
            parts.push(p.random(2, 20));
          }
        }

        // add all subparts
        let sumPartsTotal = 0;
        for (let ii = 0; ii < partCount; ii++) {
          sumPartsTotal += parts[ii];
        }

        // draw rects
        let sumPartsNow = 0;
        for (let ii = 0; ii < parts.length; ii++) {
          sumPartsNow += parts[ii];

          const x = p.map(sumPartsNow, 0, sumPartsTotal, 0, p.width);
          const y = rowHeight * i;
          const w = -p.map(parts[ii], 0, sumPartsTotal, 0, p.width);
          const h = rowHeight;

          const index = counter % colorCount;
          const col = p.color(
            hueValues[index],
            saturationValues[index],
            brightnessValues[index]
          );
          p.fill(col);
          p.rect(x, y, w, h);

          counter++;
        }
      }
    };
    p.mouseReleased = () => {
      actRandomSeed = p.random(100000);
      p.loop();
    };
  });
  return '';
};

/**
 * ルールで作るカラーパレット　～その３
 * ・タイルのサイズもランダム
 * ・タイルをグラデーションにして少し透かして重ねる
 * [マウス]
 * 左クリック：カラーパレットの切り替え
 */
export const P_1_2_3_03 = () => {
  if (!!globalP5Instance) globalP5Instance.remove();
  const colorCount = 20;
  const hueValues: number[] = [];
  const saturationValues: number[] = [];
  const brightnessValues: number[] = [];
  let actRandomSeed = 0;
  const alphaValue = 75;

  globalP5Instance = new p5((p: p5) => {
    const gradient = (
      x: number,
      y: number,
      w: number,
      h: number,
      c1: p5.Color,
      c2: p5.Color
    ) => {
      const ctx: CanvasRenderingContext2D = (p as any).drawingContext; // global canvas context p5.js var
      const grd = ctx.createLinearGradient(x, y, x, y + h);
      grd.addColorStop(0, c1.toString());
      grd.addColorStop(1, c2.toString());
      ctx.fillStyle = grd;
      ctx.fillRect(x, y, w, h);
    };
    p.setup = () => {
      p.createCanvas(p.windowWidth, p.windowHeight);
      p.colorMode(p.HSB, 360, 100, 100, 100);
      p.noStroke();
    };
    p.draw = () => {
      p.noLoop();
      p.background(0);
      p.randomSeed(actRandomSeed);

      // ------ colors ------
      // create palette
      for (let i = 0; i < colorCount; i++) {
        if (i % 2 === 0) {
          hueValues[i] = p.random(360);
          saturationValues[i] = 100;
          brightnessValues[i] = p.random(100);
        } else {
          hueValues[i] = 195;
          saturationValues[i] = p.random(100);
          brightnessValues[i] = 100;
        }
      }

      // ------ area tiling ------
      // count tiles
      let counter = 0;
      // row count and row height
      const rowCount = p.int(p.random(5, 30));
      const rowHeight = p.height / rowCount;

      // seperate each line in parts
      for (let i = rowCount; i >= 0; i--) {
        // how many fragments
        let partCount = i + 1;
        const parts: number[] = [];

        for (let ii = 0; ii < partCount; ii++) {
          // sub fragments or not?
          if (p.random() < 0.075) {
            // take care of big values
            const fragments = p.int(p.random(2, 20));
            partCount = partCount + fragments;
            for (let iii = 0; iii < fragments; iii++) {
              parts.push(p.random(2));
            }
          } else {
            parts.push(p.random(2, 20));
          }
        }

        // add all subparts
        let sumPartsTotal = 0;
        for (let ii = 0; ii < partCount; ii++) {
          sumPartsTotal += parts[ii];
        }

        // draw rects
        let sumPartsNow = 0;
        for (let ii = 0; ii < parts.length; ii++) {
          sumPartsNow += parts[ii];

          const x = p.map(sumPartsNow, 0, sumPartsTotal, 0, p.width);
          const y = rowHeight * i;
          const w = -p.map(parts[ii], 0, sumPartsTotal, 0, p.width);
          const h = rowHeight * 1.5;

          const index = counter % colorCount;
          const col1 = p.color(0);
          const col2 = p.color(
            hueValues[index],
            saturationValues[index],
            brightnessValues[index],
            alphaValue
          );
          gradient(x, y, w, h, col1, col2);

          counter++;
        }
      }
    };
    p.mouseReleased = () => {
      actRandomSeed = p.random(100000);
      p.loop();
    };
  });
  return '';
};

/**
 * ルールで作るカラーパレット　～その４
 * ・タイルのサイズもランダム
 * ・タイルをグラデーションにして少し透かして重ねる
 * ・03との違いは暗い色、描画されないタイルがある
 * [マウス]
 * 左クリック：カラーパレットの切り替え
 */
export const P_1_2_3_04 = () => {
  if (!!globalP5Instance) globalP5Instance.remove();
  const colorCount = 20;
  const hueValues: number[] = [];
  const saturationValues: number[] = [];
  const brightnessValues: number[] = [];
  let actRandomSeed = 0;
  const alphaValue = 75;

  globalP5Instance = new p5((p: p5) => {
    const gradient = (
      x: number,
      y: number,
      w: number,
      h: number,
      c1: p5.Color,
      c2: p5.Color
    ) => {
      const ctx: CanvasRenderingContext2D = (p as any).drawingContext; // global canvas context p5.js var
      const grd = ctx.createLinearGradient(x, y, x, y + h);
      grd.addColorStop(0, c1.toString());
      grd.addColorStop(1, c2.toString());
      ctx.fillStyle = grd;
      ctx.fillRect(x, y, w, h);
    };
    p.setup = () => {
      p.createCanvas(p.windowWidth, p.windowHeight);
      p.colorMode(p.HSB, 360, 100, 100, 100);
      p.noStroke();
    };
    p.draw = () => {
      p.noLoop();
      p.background(0);
      p.randomSeed(actRandomSeed);

      // ------ colors ------
      // create palette
      for (let i = 0; i < colorCount; i++) {
        if (i % 2 === 0) {
          hueValues[i] = p.random(360);
          saturationValues[i] = 100;
          brightnessValues[i] = p.random(100);
        } else {
          hueValues[i] = 195;
          saturationValues[i] = p.random(20); // diff 03
          brightnessValues[i] = 100;
        }
      }

      // ------ area tiling ------
      // count tiles
      let counter = 0;
      // row count and row height
      const rowCount = p.int(p.random(5, 30));
      const rowHeight = p.height / rowCount;

      // seperate each line in parts
      for (let i = rowCount; i >= 0; i--) {
        // how many fragments
        let partCount = i + 1;
        const parts: number[] = [];

        for (let ii = 0; ii < partCount; ii++) {
          // sub fragments or not?
          if (p.random() < 0.075) {
            // take care of big values
            const fragments = p.int(p.random(2, 20));
            partCount = partCount + fragments;
            for (let iii = 0; iii < fragments; iii++) {
              parts.push(p.random(2));
            }
          } else {
            parts.push(p.random(2, 20));
          }
        }

        // add all subparts
        let sumPartsTotal = 0;
        for (let ii = 0; ii < partCount; ii++) {
          sumPartsTotal += parts[ii];
        }

        // draw rects
        let sumPartsNow = 0;
        for (let ii = 0; ii < parts.length; ii++) {
          sumPartsNow += parts[ii];

          if (p.random() < 0.45) {
            // diff 03
            const x = p.map(sumPartsNow, 0, sumPartsTotal, 0, p.width);
            const y = rowHeight * i;
            const w = -p.map(parts[ii], 0, sumPartsTotal, 0, p.width);
            const h = rowHeight * 1.5;

            const index = counter % colorCount;
            const col1 = p.color(0);
            const col2 = p.color(
              hueValues[index],
              saturationValues[index],
              brightnessValues[index],
              alphaValue
            );
            gradient(x, y, w, h, col1, col2);
          }

          counter++;
        }
      }
    };
    p.mouseReleased = () => {
      actRandomSeed = p.random(100000);
      p.loop();
    };
  });
  return '';
};

/**
 * ルールで作るカラーパレット　～その５
 * ・タイルのサイズもランダム
 * ・タイルに放射状のグラデーション
 * [マウス]
 * 左クリック：カラーパレットの切り替え
 */
export const P_1_2_3_05 = () => {
  if (!!globalP5Instance) globalP5Instance.remove();
  const colorCount = 20;
  const hueValues: number[] = [];
  const saturationValues: number[] = [];
  const brightnessValues: number[] = [];
  let actRandomSeed = 0;
  const alphaValue = 100;

  globalP5Instance = new p5((p: p5) => {
    const centerGradient = (
      x1: number,
      y1: number,
      r1: number,
      x2: number,
      y2: number,
      r2: number,
      c1: p5.Color,
      c2: p5.Color
    ) => {
      const ctx: CanvasRenderingContext2D = (p as any).drawingContext; // global canvas context p5.js var
      const cx = x1 + (x2 - x1) / 2;
      const cy = y1 + (y2 - y1) / 2;
      const grd = ctx.createRadialGradient(cx, cy, r1, cx, cy, r2);
      grd.addColorStop(0, c1.toString());
      grd.addColorStop(1, c2.toString());
      ctx.fillStyle = grd;
      ctx.fillRect(x1, y1, x2 - x1, y2 - y1);
    };
    p.setup = () => {
      p.createCanvas(p.windowWidth, p.windowHeight);
      p.colorMode(p.HSB, 360, 100, 100, 100);
      p.noStroke();
    };
    p.draw = () => {
      p.noLoop();
      p.background(0);
      p.randomSeed(actRandomSeed);

      // ------ colors ------
      // create palette
      for (let i = 0; i < colorCount; i++) {
        if (i % 2 === 0) {
          hueValues[i] = p.random(180);
          saturationValues[i] = p.random(50);
          brightnessValues[i] = 100;
        } else {
          hueValues[i] = p.random(360);
          saturationValues[i] = 100;
          brightnessValues[i] = p.random(100);
        }
      }

      // ------ area tiling ------
      // count tiles
      let counter = 0;
      // row count and row height
      const rowCount = p.int(p.random(5, 30));
      const rowHeight = p.height / rowCount;

      // seperate each line in parts
      for (let i = rowCount; i >= 0; i--) {
        // how many fragments
        let partCount = i + 1;
        const parts: number[] = [];

        for (let ii = 0; ii < partCount; ii++) {
          // sub fragments or not?
          if (p.random() < 0.075) {
            // take care of big values
            const fragments = p.int(p.random(2, 20));
            partCount = partCount + fragments;
            for (let iii = 0; iii < fragments; iii++) {
              parts.push(p.random(2));
            }
          } else {
            parts.push(p.random(2, 20));
          }
        }

        // add all subparts
        let sumPartsTotal = 0;
        for (let ii = 0; ii < partCount; ii++) {
          sumPartsTotal += parts[ii];
        }

        // draw rects
        let sumPartsNow = 0;
        for (let ii = 0; ii < parts.length; ii++) {
          sumPartsNow += parts[ii];

          if (p.random() < 0.45) {
            const w = p.map(parts[ii], 0, sumPartsTotal, 0, p.width);
            const h = rowHeight * 1.5;
            const px1 = p.map(sumPartsNow, 0, sumPartsTotal, 0, p.width);
            const px2 = px1 + w;
            const py1 = rowHeight * i;
            const py2 = py1 + h;

            const index = counter % colorCount;
            const col1 = p.color(
              hueValues[index],
              saturationValues[index],
              brightnessValues[index],
              alphaValue
            );
            // create complementary color
            const col2 = p.color(
              hueValues[index] - 180,
              saturationValues[index],
              brightnessValues[index],
              alphaValue
            );
            centerGradient(px1, py1, 0, px2, py2, p.max(w, h), col1, col2);
          }

          counter++;
        }
      }
    };
    p.mouseReleased = () => {
      actRandomSeed = p.random(100000);
      p.loop();
    };
  });
  return '';
};
