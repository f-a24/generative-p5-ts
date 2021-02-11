import p5 from 'p5';
export default { title: 'P2：Shape' };

declare let globalP5Instance: p5;

/**
 * エージェントが作る形　～その１
 * [マウス]
 * x/y座標：動きの方向
 * 左クリック：新しい円
 * [キー]
 * 1-2：塗りのモード
 * f：自動描画/停止
 * Delete/Backspace：リセット
 */
export const P_2_2_3_01 = () => {
  if (!!globalP5Instance) globalP5Instance.remove();
  const formResolution = 15;
  const stepSize = 2;
  const initRadius = 150;
  const x: number[] = [];
  const y: number[] = [];

  let centerX: number;
  let centerY: number;
  let filled = false;
  let freeze = false;

  globalP5Instance = new p5((p: p5) => {
    p.setup = () => {
      p.createCanvas(p.windowWidth, p.windowHeight);

      // init shape
      centerX = p.width / 2;
      centerY = p.height / 2;
      const angle = p.radians(360 / formResolution);
      for (let i = 0; i < formResolution; i++) {
        x.push(p.cos(angle * i) * initRadius);
        y.push(p.sin(angle * i) * initRadius);
      }

      p.stroke(0, 50);
      p.strokeWeight(0.75);
      p.background(255);
    };
    p.draw = () => {
      // floating towards mouse position
      centerX += (p.mouseX - centerX) * 0.01;
      centerY += (p.mouseY - centerY) * 0.01;

      // calculate new points
      for (let i = 0; i < formResolution; i++) {
        x[i] += p.random(-stepSize, stepSize);
        y[i] += p.random(-stepSize, stepSize);
        // uncomment the following line to show position of the agents
        // p.ellipse(x[i] + centerX, y[i] + centerY, 5, 5);
      }

      if (filled) {
        p.fill(p.random(255));
      } else {
        p.noFill();
      }

      p.beginShape();
      // first controlpoint
      p.curveVertex(
        x[formResolution - 1] + centerX,
        y[formResolution - 1] + centerY
      );

      // only these points are drawn
      for (let i = 0; i < formResolution; i++) {
        p.curveVertex(x[i] + centerX, y[i] + centerY);
      }
      p.curveVertex(x[0] + centerX, y[0] + centerY);

      // end controlpoint
      p.curveVertex(x[1] + centerX, y[1] + centerY);
      p.endShape();
    };
    p.mousePressed = () => {
      // init shape on mouse position
      centerX = p.mouseX;
      centerY = p.mouseY;
      const angle = p.radians(360 / formResolution);
      for (let i = 0; i < formResolution; i++) {
        x[i] = p.cos(angle * i) * initRadius;
        y[i] = p.sin(angle * i) * initRadius;
      }
    };
    p.keyReleased = () => {
      if (p.keyCode === p.DELETE || p.keyCode === p.BACKSPACE)
        p.background(255);
      if (p.key === '1') filled = false;
      if (p.key === '2') filled = true;

      // pauze/play draw loop
      if (p.key === 'f' || p.key === 'F') freeze = !freeze;
      if (freeze) {
        p.noLoop();
      } else {
        p.loop();
      }
    };
  });
  return '';
};

/**
 * エージェントが作る形　～その２
 * [マウス]
 * x/y座標：動きの方向
 * 左クリック：新しい円・直線
 * [キー]
 * 1-2：塗りのモード
 * 3-4：描画モード
 * ↑↓：ランダム値の振り幅
 * f：自動描画/停止
 * Delete/Backspace：リセット
 */
export const P_2_2_3_02 = () => {
  if (!!globalP5Instance) globalP5Instance.remove();
  const formResolution = 15;
  const initRadius = 150;
  const x: number[] = [];
  const y: number[] = [];

  let stepSize = 2;
  let centerX: number;
  let centerY: number;
  let filled = false;
  let freeze = false;
  let drawMode = 1;

  globalP5Instance = new p5((p: p5) => {
    p.setup = () => {
      p.createCanvas(p.windowWidth, p.windowHeight);

      // init shape
      centerX = p.width / 2;
      centerY = p.height / 2;
      const angle = p.radians(360 / formResolution);
      for (let i = 0; i < formResolution; i++) {
        x.push(p.cos(angle * i) * initRadius);
        y.push(p.sin(angle * i) * initRadius);
      }

      p.stroke(0, 50);
      p.strokeWeight(0.75);
      p.background(255);
    };
    p.draw = () => {
      // floating towards mouse position
      centerX += (p.mouseX - centerX) * 0.01;
      centerY += (p.mouseY - centerY) * 0.01;

      // calculate new points
      for (let i = 0; i < formResolution; i++) {
        x[i] += p.random(-stepSize, stepSize);
        y[i] += p.random(-stepSize, stepSize);
      }

      if (filled) {
        p.fill(p.random(255));
      } else {
        p.noFill();
      }

      switch (drawMode) {
        case 1: // circle
          p.beginShape();
          // start controlpoint
          p.curveVertex(
            x[formResolution - 1] + centerX,
            y[formResolution - 1] + centerY
          );

          // only these points are drawn
          for (let i = 0; i < formResolution; i++) {
            p.curveVertex(x[i] + centerX, y[i] + centerY);
          }
          p.curveVertex(x[0] + centerX, y[0] + centerY);

          // end controlpoint
          p.curveVertex(x[1] + centerX, y[1] + centerY);
          p.endShape();
          break;
        case 2: // line
          p.beginShape();
          // start controlpoint
          p.curveVertex(x[0] + centerX, y[0] + centerY);

          // only these points are drawn
          for (let i = 0; i < formResolution; i++) {
            p.curveVertex(x[i] + centerX, y[i] + centerY);
          }

          // end controlpoint
          p.curveVertex(
            x[formResolution - 1] + centerX,
            y[formResolution - 1] + centerY
          );
          p.endShape();
          break;
      }
    };
    p.mousePressed = () => {
      // init shape on mouse position
      centerX = p.mouseX;
      centerY = p.mouseY;

      let angle: number;
      let radius: number;
      switch (drawMode) {
        case 1: // circle
          angle = p.radians(360 / formResolution);
          radius = initRadius * p.random(0.5, 1);
          for (let i = 0; i < formResolution; i++) {
            x[i] = p.cos(angle * i) * radius;
            y[i] = p.sin(angle * i) * radius;
          }
          break;
        case 2: // line
          radius = initRadius * p.random(0.5, 5);
          angle = p.random(p.PI);

          const x1 = p.cos(angle) * radius;
          const y1 = p.sin(angle) * radius;
          const x2 = p.cos(angle - p.PI) * radius;
          const y2 = p.sin(angle - p.PI) * radius;
          for (let i = 0; i < formResolution; i++) {
            x[i] = p.lerp(x1, x2, i / formResolution);
            y[i] = p.lerp(y1, y2, i / formResolution);
          }
          break;
      }
    };
    p.keyReleased = () => {
      if (p.keyCode === p.DELETE || p.keyCode === p.BACKSPACE)
        p.background(255);
      if (p.key === '1') filled = false;
      if (p.key === '2') filled = true;
      if (p.key === '3') drawMode = 1;
      if (p.key === '4') drawMode = 2;

      if (p.keyCode === p.UP_ARROW) stepSize++;
      if (p.keyCode === p.DOWN_ARROW) stepSize--;
      stepSize = p.max(stepSize, 1);

      // pause/play draw loop
      if (p.key === 'f' || p.key === 'F') freeze = !freeze;
      if (freeze) {
        p.noLoop();
      } else {
        p.loop();
      }
    };
  });
  return '';
};

/**
 * エージェントが作る成長構造　～その１
 */
export const P_2_2_4_01 = () => {
  if (!!globalP5Instance) globalP5Instance.remove();
  const maxCount = 5000; // max count of the cirlces
  const x: number[] = [];
  const y: number[] = [];
  const r: number[] = [];
  let currentCount = 1;

  globalP5Instance = new p5((p: p5) => {
    p.setup = () => {
      p.createCanvas(800, 800);
      p.strokeWeight(0.5);

      // first circle
      x[0] = p.width / 2;
      y[0] = p.height / 2;
      r[0] = 10;
    };
    p.draw = () => {
      p.clear();

      // create a random set of parameters
      const newR = p.random(1, 7);
      const newX = p.random(newR, p.width - newR);
      const newY = p.random(newR, p.height - newR);

      let closestDist = Number.MAX_VALUE;
      let closestIndex = 0;
      // which circle is the closest?
      for (let i = 0; i < currentCount; i++) {
        const newDist = p.dist(newX, newY, x[i], y[i]);
        if (newDist < closestDist) {
          closestDist = newDist;
          closestIndex = i;
        }
      }

      // show original position of the circle and a line to the new position
      // p.fill(230);
      // p.ellipse(newX, newY, newR * 2, newR * 2);
      // p.line(newX, newY, x[closestIndex], y[closestIndex]);

      // aline it to the closest circle outline
      const angle = p.atan2(newY - y[closestIndex], newX - x[closestIndex]);

      x[currentCount] =
        x[closestIndex] + p.cos(angle) * (r[closestIndex] + newR);
      y[currentCount] =
        y[closestIndex] + p.sin(angle) * (r[closestIndex] + newR);
      r[currentCount] = newR;
      currentCount++;

      // draw them
      for (let i = 0; i < currentCount; i++) {
        p.fill(50);
        p.ellipse(x[i], y[i], r[i] * 2, r[i] * 2);
      }

      if (currentCount >= maxCount) p.noLoop();
    };
  });
  return '';
};

/**
 * エージェントが作る成長構造　～その２
 * [キー]
 * 1：それぞれの円のスタート位置と新しい位置をつなぐ線
 */
export const P_2_2_4_02 = () => {
  if (!!globalP5Instance) globalP5Instance.remove();
  const maxCount = 5000; // max count of the cirlces
  const x: number[] = [];
  const y: number[] = [];
  const r: number[] = [];
  const x2: number[] = [];
  const y2: number[] = [];

  let currentCount = 1;
  let drawGhosts = false;

  globalP5Instance = new p5((p: p5) => {
    p.setup = () => {
      p.createCanvas(800, 800);

      // first circle
      x[0] = p.width / 2;
      y[0] = p.height / 2;
      r[0] = 360;
    };
    p.draw = () => {
      p.clear();

      p.strokeWeight(0.5);
      p.noFill();

      // create a random set of parameters
      const newR = p.random(1, 7);
      const newX = p.random(newR, p.width - newR);
      const newY = p.random(newR, p.height - newR);

      let closestDist = Number.MAX_VALUE;
      let closestIndex = 0;
      // which circle is the closest?
      for (let i = 0; i < currentCount; i++) {
        const newDist = p.dist(newX, newY, x[i], y[i]);
        if (newDist < closestDist) {
          closestDist = newDist;
          closestIndex = i;
        }
      }

      // align it to the closest circle outline
      const angle = p.atan2(newY - y[closestIndex], newX - x[closestIndex]);

      x2[currentCount] = newX;
      y2[currentCount] = newY;
      x[currentCount] =
        x[closestIndex] + p.cos(angle) * (r[closestIndex] + newR);
      y[currentCount] =
        y[closestIndex] + p.sin(angle) * (r[closestIndex] + newR);
      r[currentCount] = newR;
      currentCount++;

      // draw circles at random position and lines
      if (drawGhosts) {
        for (let i = 1; i < currentCount; i++) {
          p.fill(230);
          p.ellipse(x2[i], y2[i], r[i] * 2, r[i] * 2);
          p.line(x2[i], y2[i], x[i], y[i]);
        }
      }

      for (let i = 0; i < currentCount; i++) {
        if (i === 0) {
          p.noFill();
        } else {
          p.fill(50);
        }
        p.ellipse(x[i], y[i], r[i] * 2, r[i] * 2);
      }

      if (currentCount >= maxCount) p.noLoop();
    };
    p.keyReleased = () => {
      if (p.key === '1') drawGhosts = !drawGhosts;
    };
  });
  return '';
};
