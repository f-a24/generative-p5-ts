import p5 from 'p5';
import svg01 from './assets/P_2_2_5_02/01.svg';
import svg02 from './assets/P_2_2_5_02/02.svg';
export default { title: 'P2：Shape' };

declare let globalP5Instance: p5;

/**
 * エージェントが作る密集状態　～その１
 * [マウス]
 * ドラッグ：円を生成する対象範囲
 * [キー]
 * 1：円の表示 on/off
 * 2：線の表示 on/off
 * ↑↓：描画対象範囲の変更
 * f：自動描画/停止
 */
export const P_2_2_5_01 = () => {
  if (!!globalP5Instance) globalP5Instance.remove();
  const minRadius = 3;
  const maxRadius = 50;

  // for mouse and up/down-arrow interaction
  let mouseRect = 15;
  let freeze = false;
  let showCircle = true;
  let showLine = true;

  globalP5Instance = new p5((p: p5) => {
    class Circle {
      x: number;
      y: number;
      r: number;
      constructor(x: number, y: number, r: number) {
        this.x = x;
        this.y = y;
        this.r = r;
      }
      draw() {
        p.stroke(0);
        p.strokeWeight(1.5);
        p.ellipse(this.x, this.y, this.r);
      }
    }
    const circles: Circle[] = [];
    p.setup = () => {
      p.createCanvas(p.windowWidth, p.windowHeight);
      p.noFill();
      p.cursor(p.CROSS);
      p.ellipseMode(p.RADIUS);
      p.rectMode(p.RADIUS);
    };

    p.draw = () => {
      p.background(255);

      // Choose a random or the current mouse position
      let newX = p.random(maxRadius, p.width - maxRadius);
      let newY = p.random(maxRadius, p.height - maxRadius);
      if (p.mouseIsPressed && p.mouseButton === p.LEFT) {
        newX = p.random(p.mouseX - mouseRect, p.mouseX + mouseRect);
        newY = p.random(p.mouseY - mouseRect, p.mouseY + mouseRect);
      }

      // Try to fit the largest possible circle at the current location without overlapping
      let intersection = false;
      for (let newR = maxRadius; newR >= minRadius; newR--) {
        for (let i = 0; i < circles.length; i++) {
          const d = p.dist(newX, newY, circles[i].x, circles[i].y);
          intersection = d < circles[i].r + newR;
          if (intersection) break;
        }
        if (!intersection) {
          circles.push(new Circle(newX, newY, newR));
          break;
        }
      }

      for (let i = 0; i < circles.length; i++) {
        if (showLine) {
          // Try to find an adjacent circle to the current one and draw a connecting line between the two
          let closestCircle: Circle;
          for (let j = 0; j < circles.length; j++) {
            const d = p.dist(
              circles[i].x,
              circles[i].y,
              circles[j].x,
              circles[j].y
            );
            if (d <= circles[i].r + circles[j].r + 1) {
              closestCircle = circles[j];
              break;
            }
          }
          if (closestCircle) {
            p.stroke(100, 230, 100);
            p.strokeWeight(0.75);
            p.line(
              circles[i].x,
              circles[i].y,
              closestCircle.x,
              closestCircle.y
            );
          }
        }

        // Draw the circle itself.
        if (showCircle) circles[i].draw();
      }

      // Visualise the random range of the current mouse position
      if (p.mouseIsPressed && p.mouseButton === p.LEFT) {
        p.stroke(100, 230, 100);
        p.strokeWeight(2);
        p.rect(p.mouseX, p.mouseY, mouseRect, mouseRect);
      }
    };
    p.keyPressed = () => {
      if (p.keyCode === p.UP_ARROW) mouseRect += 4;
      if (p.keyCode === p.DOWN_ARROW) mouseRect -= 4;

      // toggle freeze drawing
      if (p.key === 'f' || p.key === 'F') {
        freeze = !freeze;
        if (freeze) {
          p.noLoop();
        } else {
          p.loop();
        }
      }

      // toggle style
      if (p.key === '1') showCircle = !showCircle;
      if (p.key === '2') showLine = !showLine;
    };
  });
  return '';
};

/**
 * エージェントが作る密集状態　～その２
 * [マウス]
 * ドラッグ：円を生成する対象範囲
 * [キー]
 * 1：円の表示 on/off
 * 2：線の表示 on/off
 * 3：SVGの表示 on/off
 * ↑↓：描画対象範囲の変更
 * f：自動描画/停止
 */
export const P_2_2_5_02 = () => {
  if (!!globalP5Instance) globalP5Instance.remove();
  const minRadius = 3;
  const maxRadius = 50;

  // for mouse and up/down-arrow interaction
  let mouseRect = 15;
  let freeze = false;

  // svg vector import
  let module1: p5.Image;
  let module2: p5.Image;

  // style selector, hotkeys 1, 2, 3
  let showCircle = false;
  let showLine = false;
  let showSVG = true;

  globalP5Instance = new p5((p: p5) => {
    class Circle {
      x: number;
      y: number;
      r: number;
      rotation: number;
      constructor(x: number, y: number, r: number) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.rotation = p.random(p.TAU);
      }

      draw() {
        if (showSVG) {
          p.push();
          p.translate(this.x, this.y);
          p.rotate(this.rotation);
          if (this.r === maxRadius) {
            p.image(module1, 0, 0, this.r * 2, this.r * 2);
          } else {
            p.image(module2, 0, 0, this.r * 2, this.r * 2);
          }
          p.pop();
        }
        if (showCircle) {
          p.stroke(0);
          p.strokeWeight(1.5);
          p.ellipse(this.x, this.y, this.r);
        }
      }
    }
    const circles: Circle[] = [];

    p.preload = () => {
      module1 = p.loadImage(svg01);
      module2 = p.loadImage(svg02);
    };
    p.setup = () => {
      p.createCanvas(p.windowWidth, p.windowHeight);
      p.noFill();
      p.cursor(p.CROSS);
      p.ellipseMode(p.RADIUS);
      p.rectMode(p.RADIUS);
      p.imageMode(p.CENTER);
    };

    p.draw = () => {
      p.background(255);

      // Choose a random or the current mouse position
      let newX = p.random(maxRadius, p.width - maxRadius);
      let newY = p.random(maxRadius, p.height - maxRadius);
      if (p.mouseIsPressed && p.mouseButton === p.LEFT) {
        newX = p.random(p.mouseX - mouseRect, p.mouseX + mouseRect);
        newY = p.random(p.mouseY - mouseRect, p.mouseY + mouseRect);
      }

      // Try to fit the largest possible circle at the current location without overlapping
      for (let newR = maxRadius; newR >= minRadius; newR--) {
        const intersection = circles.some(
          circle => p.dist(newX, newY, circle.x, circle.y) < circle.r + newR
        );
        if (!intersection) {
          circles.push(new Circle(newX, newY, newR));
          break;
        }
      }

      // Draw all circles
      circles.forEach(circle => {
        if (showLine) {
          // Try to find an adjacent circle to the current one and draw a connecting line between the two
          const closestCircle = circles.find(
            otherCircle =>
              p.dist(circle.x, circle.y, otherCircle.x, otherCircle.y) <=
              circle.r + otherCircle.r + 1
          );
          if (closestCircle) {
            p.stroke(100, 230, 100);
            p.strokeWeight(0.75);
            p.line(circle.x, circle.y, closestCircle.x, closestCircle.y);
          }
        }

        // Draw the circle itself.
        circle.draw();
      });

      // Visualise the random range of the current mouse position
      if (p.mouseIsPressed && p.mouseButton === p.LEFT) {
        p.stroke(100, 230, 100);
        p.strokeWeight(2);
        p.rect(p.mouseX, p.mouseY, mouseRect, mouseRect);
      }
    };
    p.keyPressed = () => {
      if (p.keyCode === p.UP_ARROW) mouseRect += 4;
      if (p.keyCode === p.DOWN_ARROW) mouseRect -= 4;

      // toggle freeze drawing
      if (p.key === 'f' || p.key === 'F') {
        freeze = !freeze;
        if (freeze) {
          p.noLoop();
        } else {
          p.loop();
        }
      }

      // toggle style
      if (p.key === '1') showCircle = !showCircle;
      if (p.key === '2') showLine = !showLine;
      if (p.key === '3') showSVG = !showSVG;
    };
  });
  return '';
};
