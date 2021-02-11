import p5 from 'p5';
export default { title: 'P2：Shape' };

declare let globalP5Instance: p5;

/**
 * 振り子運動をするエージェント　～その４
 * [マウス]
 * ドラッグ＆ドロップ：パスを描画
 * [キー]
 * 1：マウスで描いたパス表示 on/off
 * 2：振り子表示 on/off
 * 3：パス表示 on/off
 * 4：明度 on/off
 * ↑↓：線の長さ
 * ←→：重力
 * Delete/Backspace：リセット
 */
export const P_2_2_6_04 = () => {
  if (!!globalP5Instance) globalP5Instance.remove();
  const joints = 5;
  const resolution = 0.04;
  const damping = 0.995;
  const maxArms = 3;
  const armSizeDeviation = 0.2;

  let lineLength = 32;
  let gravity = 0.099;
  let showPath = true;
  let showPendulum = true;
  let showPendulumPath = true;
  let fillMode = true;

  globalP5Instance = new p5((p: p5) => {
    class Pendulum {
      hierarchy: number;
      armCount: number;
      pendulumArms: Pendulum[];
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
        this.armCount = p.floor(p.random(1, maxArms + 1));
        this.pendulumArms = [];
        this.size = size;
        this.angle = p.random(p.TAU);
        this.origin = p.createVector(0, 0);
        this.end = p.createVector(0, 0);
        this.gravity = gravity;
        this.damping = damping;
        this.angularAcceleration = 0;
        this.angularVelocity = 0;

        for (let i = 0; i < this.armCount && this.hierarchy > 0; i++) {
          this.pendulumArms.push(
            new Pendulum(
              this.size / p.randomGaussian(1.5, armSizeDeviation),
              this.hierarchy
            )
          );
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

        this.pendulumArms.forEach(pendulumArm => {
          pendulumArm.update(heading);
        });
      }
      getTrail(offset: p5.Vector, pendulumTrailPaths?: p5.Vector[]) {
        pendulumTrailPaths = pendulumTrailPaths || [];
        offset = offset.copy().add(this.end);
        this.pendulumArms.forEach(pendulumArm => {
          if (pendulumArm.pendulumArms.length) {
            pendulumArm.getTrail(offset, pendulumTrailPaths);
          } else {
            pendulumTrailPaths.push(offset.copy().add(pendulumArm.end));
          }
        });
        return pendulumTrailPaths;
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

        this.pendulumArms.forEach(pendulumArm => {
          p.push();
          p.translate(this.end.x, this.end.y);
          pendulumArm.draw();
          p.pop();
        });
      }
    }

    class Shape {
      shapePath: p5.Vector[];
      pendulumPath: p5.Vector[][];
      pendulumPathColor: p5.Color;
      iterator: number;
      lineLength: number;
      resolution: number;
      pendulum: Pendulum;

      constructor(pendulumPathColor: p5.Color) {
        this.shapePath = [];
        this.pendulumPath = [];
        this.pendulumPathColor = pendulumPathColor;
        this.iterator = 0;
        this.lineLength = lineLength;
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

        if (showPendulumPath && this.pendulumPath.length) {
          p.strokeWeight(1);
          p.stroke(this.pendulumPathColor);

          if (fillMode) {
            const c = this.pendulumPathColor;
            p.fill(p.hue(c), p.saturation(c), p.brightness(c), 10);
            this.pendulumPath.forEach(group => {
              p.beginShape();
              group.forEach(pos => {
                p.vertex(pos.x, pos.y);
              });
              p.endShape();
            });
            p.noFill();
          } else {
            this.pendulumPath[0].forEach((_, column) => {
              p.beginShape();
              this.pendulumPath.forEach(pos => {
                p.vertex(pos[column].x, pos[column].y);
              });
              p.endShape();
            });
          }
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
      }

      if (p.keyCode === p.UP_ARROW) lineLength += 2;
      if (p.keyCode === p.DOWN_ARROW) lineLength -= 2;
      if (p.keyCode === p.LEFT_ARROW) gravity -= 0.001;
      if (p.keyCode === p.RIGHT_ARROW) gravity += 0.001;

      if (p.key === '1') showPath = !showPath;
      if (p.key === '2') showPendulum = !showPendulum;
      if (p.key === '3') showPendulumPath = !showPendulumPath;
      if (p.key === '4') fillMode = !fillMode;
    };
  });
  return '';
};

/**
 * 振り子運動をするエージェント　～その５
 * [マウス]
 * ドラッグ＆ドロップ：パスを描画
 * [キー]
 * 1：マウスで描いたパス表示 on/off
 * 2：振り子表示 on/off
 * 3：パス表示 on/off
 * ↑↓：線の長さ
 * ←→：回転速度
 * +-：重力
 * Delete/Backspace：リセット
 */
export const P_2_2_6_05 = () => {
  if (!!globalP5Instance) globalP5Instance.remove();
  const resolution = 0.04;
  const damping = 0.998;
  const font = 'Georgia';
  const letters =
    'Sie hören nicht die folgenden Gesänge, Die Seelen, denen ich die ersten sang, Zerstoben ist das freundliche Gedränge, Verklungen ach! der erste Wiederklang.';
  const fontSizeMin = 6;

  let joints = 4;
  let lineLength = 128;
  let gravity = 0.094;
  let showPath = true;
  let showPendulum = true;
  let showPendulumPath = true;

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
        if (this.hierarchy > 0)
          this.pendulumArm = new Pendulum(this.size / 1.5, this.hierarchy);
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
        if (this.pendulumArm) this.pendulumArm.update(heading);
      }
      getTrail(offset: p5.Vector, end?: p5.Vector) {
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
      resolution: number;
      pendulum: Pendulum;
      letterIndex: number;

      constructor(pendulumPathColor: p5.Color) {
        this.shapePath = [];
        this.pendulumPath = [];
        this.pendulumPathColor = pendulumPathColor;
        this.iterator = 0;
        this.lineLength = lineLength;
        this.resolution = resolution;
        this.pendulum = new Pendulum(this.lineLength, joints);
        this.letterIndex = 0;
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
        if (showPendulumPath && this.pendulumPath.length) {
          p.noStroke();
          p.fill(this.pendulumPathColor);
          this.letterIndex = 0;
          this.pendulumPath.forEach((pos, posIndex) => {
            const newLetter = letters.charAt(this.letterIndex);
            const nextPosIndex = this.pendulumPath.findIndex(
              (nextPos, nextPosIndex) => {
                if (nextPosIndex > posIndex) {
                  const d = p5.Vector.dist(nextPos, pos);
                  p.textSize(p.max(fontSizeMin, d));
                  return d > p.textWidth(newLetter);
                }
              }
            );
            const nextPos = this.pendulumPath[nextPosIndex];
            if (nextPos) {
              const angle = p.atan2(nextPos.y - pos.y, nextPos.x - pos.x);
              p.push();
              p.translate(pos.x, pos.y);
              p.rotate(angle);
              p.text(newLetter, 0, 0);
              p.pop();
              this.letterIndex++;
              if (this.letterIndex >= letters.length) this.letterIndex = 0;
            }
          });
          p.noFill();
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
      p.strokeWeight(1);
      p.textFont(font, fontSizeMin);
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
      newShape = new Shape(p.color(p.random(360), 80, 60));
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

      if (p.key === '-') gravity -= 0.001;
      if (p.key === '+') gravity += 0.001;
    };
  });
  return '';
};
