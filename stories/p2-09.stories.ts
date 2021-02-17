import p5 from 'p5';
export default { title: 'P2：Shape' };

declare let globalP5Instance: p5;

/**
 * 振り子運動をするエージェント　～その１
 * [キー]
 * 1：振り子表示 on/off
 * 2：パス表示 on/off
 * -+：速度の比率
 * ↑↓：線の長さ
 * ←→：回転速度
 * Delete/Backspace：リセット
 */
export const P_2_2_6_01 = () => {
  const maxAngle = 360;

  let joints = 5;
  let lineLength = 100;
  let speedRelation = 2;
  let center: p5.Vector;
  let pendulumPath: p5.Vector[][];
  let angle = 0;
  let speed: number;
  let showPendulum = true;
  let showPendulumPath = true;

  if (!!globalP5Instance) globalP5Instance.remove();
  globalP5Instance = new p5((p: p5) => {
    const startDrawing = () => {
      pendulumPath = [];
      // new empty array for each joint
      for (let i = 0; i < joints; i++) {
        pendulumPath.push([]);
      }

      angle = 0;
      speed = 8 / p.pow(1.75, joints - 1) / p.pow(2, speedRelation - 1);
    };
    p.setup = () => {
      p.createCanvas(p.windowWidth, p.windowHeight);
      p.colorMode(p.HSB, 360, 100, 100, 100);
      p.noFill();
      p.strokeWeight(1);

      center = p.createVector(p.width / 2, p.height / 2);

      startDrawing();
    };
    p.draw = () => {
      p.background(0, 0, 100);
      angle += speed;

      // each frame, create new positions for each joint
      if (angle <= maxAngle + speed) {
        // start at the center position
        let pos = center.copy();
        for (let i = 0; i < joints; i++) {
          let a = angle * p.pow(speedRelation, i);
          if (i % 2 === 1) a = -a;
          const nextPos = p5.Vector.fromAngle(p.radians(a));
          nextPos.setMag(((joints - i) / joints) * lineLength);
          nextPos.add(pos);

          if (showPendulum) {
            p.noStroke();
            p.fill(0, 10);
            p.ellipse(pos.x, pos.y, 4, 4);
            p.noFill();
            p.stroke(0, 10);
            p.line(pos.x, pos.y, nextPos.x, nextPos.y);
          }

          pendulumPath[i].push(nextPos);
          pos = nextPos;
        }
      }

      // draw the path for each joint
      if (showPendulumPath) {
        p.strokeWeight(1.6);
        for (let i = 0; i < pendulumPath.length; i++) {
          const path = pendulumPath[i];

          p.beginShape();
          const hue = p.map(i, 0, joints, 120, 360);
          p.stroke(hue, 80, 60, 50);
          for (let j = 0; j < path.length; j++) {
            p.vertex(path[j].x, path[j].y);
          }
          p.endShape();
        }
      }
    };
    p.keyPressed = () => {
      if (p.keyCode === p.DELETE || p.keyCode === p.BACKSPACE) startDrawing();

      if (p.keyCode === p.UP_ARROW) {
        lineLength += 2;
        startDrawing();
      }
      if (p.keyCode === p.DOWN_ARROW) {
        lineLength -= 2;
        startDrawing();
      }
      if (p.keyCode === p.LEFT_ARROW) {
        joints--;
        if (joints < 1) joints = 1;
        startDrawing();
      }
      if (p.keyCode === p.RIGHT_ARROW) {
        joints++;
        if (joints > 10) joints = 10;
        startDrawing();
      }

      if (p.key === '+') {
        speedRelation += 0.5;
        if (speedRelation > 5) speedRelation = 5;
        startDrawing();
      }
      if (p.key === '-') {
        speedRelation -= 0.5;
        if (speedRelation < 2) speedRelation = 2;
        startDrawing();
      }

      if (p.key === '1') showPendulum = !showPendulum;
      if (p.key === '2') showPendulumPath = !showPendulumPath;
    };
  });
  return '';
};

/**
 * 振り子運動をするエージェント　～その２
 * [マウス]
 * ドラッグ＆ドロップ：パスを描画
 * [キー]
 * 1：マウスで描いたパス表示 on/off
 * 2：振り子表示 on/off
 * 3：パス表示 on/off
 * -+：速度の比率
 * ↑↓：線の長さ
 * ←→：回転速度
 * Delete/Backspace：リセット
 */
export const P_2_2_6_02 = () => {
  if (!!globalP5Instance) globalP5Instance.remove();
  const resolution = 0.2;

  let joints = 8;
  let lineLength = 32;
  let speed = 16;

  let showPath = true;
  let showPendulum = true;
  let showPendulumPath = true;

  globalP5Instance = new p5((p: p5) => {
    class Shape {
      shapePath: p5.Vector[];
      pendulumPath: p5.Vector[][];
      iterator: number;
      lineLength: number;
      speed: number;
      resolution: number;
      joints: number;

      constructor(
        lineLength: number,
        speed: number,
        resolution: number,
        joints: number
      ) {
        this.shapePath = [];
        this.pendulumPath = [];
        this.iterator = 0;
        this.lineLength = lineLength;
        this.speed = speed;
        this.resolution = resolution;
        this.joints = joints;

        for (let i = 0; i < this.joints; i++) {
          this.pendulumPath.push([]);
        }
      }
      addPos(x: number, y: number) {
        const newPos = p.createVector(x, y);
        this.shapePath.push(newPos);
      }
      draw() {
        p.strokeWeight(0.8);
        p.stroke(0, 10);
        if (showPath) {
          p.beginShape();
          this.shapePath.forEach(pos => {
            p.vertex(pos.x, pos.y);
          });
          p.endShape();
        }

        const currentIndex = p.floor(this.iterator);
        const currentPos = this.shapePath[currentIndex];
        const previousPos = this.shapePath[currentIndex - 1];
        if (previousPos) {
          let offsetPosA: p5.Vector = p5.Vector.lerp(
            previousPos,
            currentPos,
            this.iterator - currentIndex
          ) as any;
          for (let i = 0; i < this.joints; i++) {
            const offsetPosB = p5.Vector.fromAngle(
              p.PI / (i + 1) +
                (this.iterator / p.pow(-2, this.joints - i)) * this.speed
            );
            offsetPosB.setMag(
              (this.lineLength / this.joints) * (this.joints - i)
            );
            offsetPosB.add(offsetPosA);

            if (showPendulum) {
              p.fill(0, 10);
              p.ellipse(offsetPosA.x, offsetPosA.y, 4, 4);
              p.noFill();
              p.line(offsetPosA.x, offsetPosA.y, offsetPosB.x, offsetPosB.y);
            }

            offsetPosA = offsetPosB;

            this.pendulumPath[i].push(offsetPosA);
          }

          if (showPendulumPath) {
            p.strokeWeight(1.6);
            this.pendulumPath.forEach((path, index) => {
              p.beginShape();
              p.stroke((360 / this.joints) * index, 80, 60, 50);
              path.forEach(pos => {
                p.curveVertex(pos.x, pos.y);
              });
              p.endShape();
            });
          }
        }
      }
      update() {
        this.iterator += this.resolution;
        this.iterator = p.constrain(this.iterator, 0, this.shapePath.length);
      }
    }
    let shapes: Shape[] = [];
    let newShape: Shape;
    p.setup = () => {
      p.createCanvas(p.windowWidth, p.windowHeight);
      p.colorMode(p.HSB, 360, 100, 100, 100);
      p.noFill();
      p.strokeWeight(1);
    };
    p.draw = () => {
      p.background(0, 0, 100);
      shapes.forEach(shape => {
        shape.draw();
        shape.update();
      });

      if (newShape) {
        newShape.addPos(p.mouseX, p.mouseY);
        newShape.draw();
        newShape.update();
      }
    };
    p.mousePressed = () => {
      newShape = new Shape(lineLength, speed, resolution, joints);
      newShape.addPos(p.mouseX, p.mouseY);
    };
    p.mouseReleased = () => {
      shapes.push(newShape);
      newShape = null;
    };
    p.keyPressed = () => {
      if (p.keyCode === p.DELETE || p.keyCode === p.BACKSPACE) {
        shapes = [];
        newShape = null;
      }

      if (p.keyCode === p.UP_ARROW) lineLength += 2;
      if (p.keyCode === p.DOWN_ARROW) lineLength -= 2;
      if (p.keyCode === p.LEFT_ARROW) {
        joints--;
        joints = p.max(1, joints);
      }
      if (p.keyCode === p.RIGHT_ARROW) {
        joints++;
        joints = p.max(1, joints);
      }

      if (p.key === '1') showPath = !showPath;
      if (p.key === '2') showPendulum = !showPendulum;
      if (p.key === '3') showPendulumPath = !showPendulumPath;

      if (p.key === '+') speed += 0.5;
      if (p.key === '-') speed -= 0.5;
    };
  });
  return '';
};

/**
 * 振り子運動をするエージェント　～その３
 * [マウス]
 * ドラッグ＆ドロップ：パスを描画
 * [キー]
 * 1：マウスで描いたパス表示 on/off
 * 2：振り子表示 on/off
 * 3：パス表示 on/off
 * 4：明度 on/off
 * -+：速度の比率
 * ↑↓：線の長さ
 * ←→：回転速度
 * Delete/Backspace：リセット
 */
export const P_2_2_6_03 = () => {
  if (!!globalP5Instance) globalP5Instance.remove();
  const resolution = 0.06;
  const damping = 0.998;

  let joints = 12;
  let linelength = 64;
  let gravity = 0.094;
  let showPath = true;
  let showPendulum = true;
  let showPendulumPath = true;
  let clearScreen = false;

  globalP5Instance = new p5((p: p5) => {
    class Pendulum {
      hierarchy: number;
      pendulumArm: Pendulum;
      size: number;
      angle: number;
      origin: p5.Vector;
      end: p5.Vector;
      gravity: number;
      damping: number;
      angularAcceleration: number;
      angularVelocity: number;

      constructor(size: number, hierarchy: number) {
        this.hierarchy = hierarchy - 1;
        this.pendulumArm;
        this.size = size;
        this.angle = p.random(p.TAU);
        this.origin = p.createVector(0, 0);
        this.end = p.createVector(0, 0);
        this.gravity = gravity;
        this.damping = damping;
        this.angularAcceleration = 0;
        this.angularVelocity = 0;
        if (this.hierarchy > 0) {
          this.pendulumArm = new Pendulum(this.size / 1.5, this.hierarchy);
        }
      }
      update(heading: number) {
        this.end.set(
          this.origin.x + this.size * p.sin(this.angle),
          this.origin.y + this.size * p.cos(this.angle)
        );

        this.angularAcceleration =
          (-this.gravity / this.size) * p.sin(this.angle + heading);
        this.angle += this.angularVelocity;
        this.angularVelocity += this.angularAcceleration;
        this.angularVelocity *= this.damping;

        if (this.pendulumArm) {
          this.pendulumArm.update(heading);
        }
      }
      getTrail(offset: p5.Vector, end?: p5.Vector): p5.Vector {
        if (this.pendulumArm) {
          if (end) {
            end.add(this.end);
          } else {
            end = this.end.copy();
          }
          return this.pendulumArm.getTrail(offset, end);
        } else {
          return this.end.copy().add(end).add(offset);
        }
      }

      draw() {
        p.stroke(0, 40);
        p.beginShape();
        p.vertex(this.origin.x, this.origin.y);
        p.vertex(this.end.x, this.end.y);
        p.endShape();

        p.fill(0, 20);
        p.ellipse(this.end.x, this.end.y, 2, 2);
        p.noFill();

        if (this.pendulumArm) {
          p.push();
          p.translate(this.end.x, this.end.y);
          this.pendulumArm.draw();
          p.pop();
        }
      }
    }
    class Shape {
      shapePath: p5.Vector[];
      pendulumPath: p5.Vector[];
      pendulumPathColor: p5.Color;
      iterator: number;
      lineLength: number;
      speed: number;
      resolution: number;
      pendulum: Pendulum;

      constructor(pendulumPathColor: p5.Color) {
        this.shapePath = [];
        this.pendulumPath = [];
        this.pendulumPathColor = pendulumPathColor;
        this.iterator = 0;
        this.lineLength = linelength;
        this.resolution = resolution;
        this.pendulum = new Pendulum(this.lineLength, joints);
      }
      addPos(x: number, y: number) {
        const newPos = p.createVector(x, y);
        this.shapePath.push(newPos);
      }
      draw() {
        p.strokeWeight(0.8);
        p.stroke(0, 10);
        if (showPath) {
          p.beginShape();
          this.shapePath.forEach(pos => {
            p.vertex(pos.x, pos.y);
          });
          p.endShape();
        }
        if (this.iterator < this.shapePath.length) {
          const currentIndex = p.floor(this.iterator);
          const currentPos = this.shapePath[currentIndex];
          const previousPos = this.shapePath[currentIndex - 1];
          if (previousPos) {
            const offsetPos: p5.Vector = p5.Vector.lerp(
              previousPos,
              currentPos,
              this.iterator - currentIndex
            ) as any;
            const heading =
              p.atan2(
                currentPos.y - previousPos.y,
                currentPos.x - previousPos.x
              ) - p.HALF_PI;

            p.push();
            p.translate(offsetPos.x, offsetPos.y);
            this.pendulum.update(heading);
            if (showPendulum) this.pendulum.draw();
            p.pop();
            this.pendulumPath.push(this.pendulum.getTrail(offsetPos));
          }
        }
        if (showPendulumPath) {
          p.strokeWeight(1.6);
          p.stroke(this.pendulumPathColor);
          p.beginShape();
          this.pendulumPath.forEach(pos => {
            p.vertex(pos.x, pos.y);
          });
          p.endShape();
        }
      }
      update() {
        this.iterator += this.resolution;
        this.iterator = p.constrain(this.iterator, 0, this.shapePath.length);
      }
    }
    let shapes: Shape[] = [];
    let newShape: Shape;
    p.setup = () => {
      p.createCanvas(p.windowWidth, p.windowHeight);
      p.colorMode(p.HSB, 360, 100, 100, 100);
      p.noFill();
      p.strokeWeight(1);
    };
    p.draw = () => {
      if (clearScreen) p.background(0, 0, 100);

      shapes.forEach(shape => {
        shape.draw();
        shape.update();
      });

      if (newShape) {
        newShape.addPos(p.mouseX, p.mouseY);
        newShape.draw();
        newShape.update();
      }
    };
    p.mousePressed = () => {
      newShape = new Shape(p.color(p.random(360), 80, 60, 50));
      newShape.addPos(p.mouseX, p.mouseY);
    };
    p.mouseReleased = () => {
      shapes.push(newShape);
      newShape = null;
    };
    p.keyPressed = () => {
      if (p.keyCode === p.DELETE || p.keyCode === p.BACKSPACE) {
        shapes = [];
        newShape = null;
        p.background(0, 0, 100);
      }

      if (p.keyCode === p.UP_ARROW) linelength += 2;
      if (p.keyCode === p.DOWN_ARROW) linelength -= 2;
      if (p.keyCode === p.LEFT_ARROW) {
        joints--;
        joints = p.max(1, joints);
      }
      if (p.keyCode === p.RIGHT_ARROW) {
        joints++;
        joints = p.max(1, joints);
      }

      if (p.key === '1') showPath = !showPath;
      if (p.key === '2') showPendulum = !showPendulum;
      if (p.key === '3') showPendulumPath = !showPendulumPath;
      if (p.key === '4') clearScreen = !clearScreen;

      if (p.key === '-') gravity -= 0.001;
      if (p.key === '+') gravity += 0.001;
    };
  });
  return '';
};
