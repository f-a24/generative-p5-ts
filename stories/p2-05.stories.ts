import p5 from 'p5';
export default { title: 'P2：Shape' };

declare let globalP5Instance: p5;

/**
 * グリッドからモアレ模様へ　～その１
 * [マウス]
 * x座標：重ねたレイヤーを回転または移動
 * y座標：重ねたレイヤーを拡大縮小
 * [キー]
 * 1-2：描画モードの変更
 */
export const P_2_1_5_01 = () => {
  if (!!globalP5Instance) globalP5Instance.remove();
  let drawMode = 1;

  globalP5Instance = new p5((p: p5) => {
    p.setup = () => {
      p.createCanvas(800, 800);
      p.noFill();
    };
    const overlay = () => {
      const w = p.width - 100;
      const h = p.height - 100;

      if (drawMode === 1) {
        for (let i = -w / 2; i < w / 2; i += 5) {
          p.line(i, -h / 2, i, h / 2);
        }
      } else if (drawMode === 2) {
        for (let i = 0; i < w; i += 10) {
          p.ellipse(0, 0, i);
        }
      }
    };
    p.draw = () => {
      p.background(255);
      p.translate(p.width / 2, p.height / 2);

      // first shape (fixed)
      p.strokeWeight(3);
      overlay();

      // second shape (dynamically translated/rotated and scaled)
      const x = p.map(p.mouseX, 0, p.width, -50, 50);
      const a = p.map(p.mouseX, 0, p.width, -0.5, 0.5);
      const s = p.map(p.mouseY, 0, p.height, 0.7, 1);

      if (drawMode === 1) p.rotate(a);
      if (drawMode === 2) p.translate(x, 0);

      p.scale(s);
      p.strokeWeight(2);
      overlay();
    };
    p.keyPressed = () => {
      if (p.key === '1') drawMode = 1;
      if (p.key === '2') drawMode = 2;
    };
  });
  return '';
};

/**
 * グリッドからモアレ模様へ　～その２
 * [マウス]
 * クリック：レイヤーの追加
 */
export const P_2_1_5_02 = () => {
  if (!!globalP5Instance) globalP5Instance.remove();
  const minRadius = 5;
  const maxRadius = 250;
  const density = 5;

  globalP5Instance = new p5((p: p5) => {
    class Shape {
      x: number;
      y: number;
      r: number;
      constructor(x: number, y: number, r: number) {
        this.x = x;
        this.y = y;
        this.r = r;
      }
      draw() {
        for (let i = 0; i < this.r; i += density) {
          p.ellipse(this.x, this.y, i);
        }
      }
    }
    const shapes: Shape[] = [];
    p.setup = () => {
      p.createCanvas(800, 800);
      p.noFill();
      shapes.push(new Shape(p.width / 2, p.height / 2, p.width));
    };
    p.draw = () => {
      p.background(255);
      shapes.forEach(shape => {
        shape.draw();
      });
    };
    p.mouseReleased = () => {
      shapes.push(
        new Shape(p.mouseX, p.mouseY, p.random(minRadius, maxRadius))
      );
    };
  });
  return '';
};

/**
 * グリッドからモアレ模様へ　～その３
 * [マウス]
 * ドラッグ＆ドロップ：線を引く
 * [キー]
 * 1-4：線の色
 * ↑↓：線の太さ
 */
export const P_2_1_5_03 = () => {
  if (!!globalP5Instance) globalP5Instance.remove();
  const density = 2.5;
  let shapeHeight = 64;
  let shapeColor: p5.Color;

  globalP5Instance = new p5((p: p5) => {
    class Shape {
      x1: number;
      y1: number;
      x2: number;
      y2: number;
      h: number;
      c: p5.Color;
      constructor(
        x1: number,
        y1: number,
        x2: number,
        y2: number,
        h: number,
        c: p5.Color
      ) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.h = h;
        this.c = c;
      }
      draw() {
        const w = p.dist(this.x1, this.y1, this.x2, this.y2);
        const a = p.atan2(this.y2 - this.y1, this.x2 - this.x1);
        p.stroke(this.c);
        p.push();
        p.translate(this.x1, this.y1);
        p.rotate(a);
        p.translate(0, -this.h / 2);
        for (let i = 0; i < this.h; i += density) {
          p.line(0, i, w, i);
        }
        p.pop();
      }
    }
    let shapes: Shape[] = [];
    let newShape: Shape;
    p.setup = () => {
      p.createCanvas(800, 800);
      p.noFill();
      shapeColor = p.color(0);
    };
    p.draw = () => {
      p.background(255);
      shapes.forEach(shape => {
        shape.draw();
      });

      if (newShape) {
        newShape.x2 = p.mouseX;
        newShape.y2 = p.mouseY;
        newShape.h = shapeHeight;
        newShape.c = shapeColor;
        newShape.draw();
      }
    };
    p.mousePressed = () => {
      newShape = new Shape(
        p.pmouseX,
        p.pmouseY,
        p.mouseX,
        p.mouseY,
        shapeHeight,
        shapeColor
      );
    };
    p.mouseReleased = () => {
      shapes.push(newShape);
      newShape = undefined;
    };
    p.keyPressed = () => {
      if (p.key === '1') shapeColor = p.color(255, 0, 0);
      if (p.key === '2') shapeColor = p.color(0, 255, 0);
      if (p.key === '3') shapeColor = p.color(0, 0, 255);
      if (p.key === '4') shapeColor = p.color(0);

      if (p.keyCode === p.UP_ARROW) shapeHeight += density;
      if (p.keyCode === p.DOWN_ARROW) shapeHeight -= density;
    };
  });
  return '';
};

/**
 * グリッドからモアレ模様へ　～その４
 * [マウス]
 * ドラッグ＆ドロップ：線を引く
 * [キー]
 * スペース：リセット
 * 1-4：線の色
 * ←→：滑らかさ
 * ↑↓：線の太さ
 */
export const P_2_1_5_04 = () => {
  if (!!globalP5Instance) globalP5Instance.remove();
  const density = 2.5;
  let shapeHeight = 64;
  let shapeColor: p5.Color;
  let smoothness = 0;

  globalP5Instance = new p5((p: p5) => {
    class Shape {
      shapePath: p5.Vector[];
      h: number;
      c: p5.Color;
      constructor(h: number, c: p5.Color) {
        this.shapePath = [];
        this.h = h;
        this.c = c;
      }
      addPos(x: number, y: number) {
        const newPos = p.createVector(x, y);
        const lastPos = this.getLastPos();
        if (
          this.shapePath.length === 0 ||
          (lastPos && p5.Vector.dist(newPos, lastPos) > smoothness)
        ) {
          this.shapePath.push(newPos);
        }
      }
      getLastPos() {
        return this.shapePath[this.shapePath.length - 1];
      }
      draw() {
        p.stroke(this.c);
        for (let i = -this.h / 2; i < this.h / 2; i += density) {
          p.beginShape();
          this.shapePath.forEach((pos, index, shapePath) => {
            const previousPos = shapePath[index - 1];
            if (previousPos) {
              const a = p.atan2(previousPos.y - pos.y, previousPos.x - pos.x);
              const offsetPos = p5.Vector.fromAngle(a);
              offsetPos.add(0, i);
              offsetPos.rotate(a);
              offsetPos.add(pos);
              p.curveVertex(offsetPos.x, offsetPos.y);
            }
          });
          p.endShape();
        }
      }
    }
    let shapes: Shape[] = [];
    let newShape: Shape;
    p.setup = () => {
      p.createCanvas(800, 800);
      p.noFill();
      shapeColor = p.color(0);
    };
    p.draw = () => {
      p.background(255);

      shapes.forEach(shape => {
        shape.draw();
      });

      if (newShape) {
        newShape.h = shapeHeight;
        newShape.c = shapeColor;
        newShape.addPos(p.mouseX, p.mouseY);
        newShape.draw();
      }
    };
    p.mousePressed = () => {
      newShape = new Shape(shapeHeight, shapeColor);
      newShape.addPos(p.mouseX, p.mouseY);
    };
    p.mouseReleased = () => {
      shapes.push(newShape);
      newShape = null;
    };
    p.keyPressed = () => {
      if (p.key === '1') shapeColor = p.color(255, 0, 0);
      if (p.key === '2') shapeColor = p.color(0, 255, 0);
      if (p.key === '3') shapeColor = p.color(0, 0, 255);
      if (p.key === '4') shapeColor = p.color(0);

      if (p.key === ' ') {
        shapes = [];
        p.redraw();
      }

      if (p.keyCode === p.RIGHT_ARROW) smoothness += density;
      if (p.keyCode === p.LEFT_ARROW) smoothness -= density;

      if (p.keyCode === p.UP_ARROW) shapeHeight += density;
      if (p.keyCode === p.DOWN_ARROW) shapeHeight -= density;
    };
  });
  return '';
};
