import p5 from 'p5';
export default { title: 'P2：Shape' };

declare let globalP5Instance: p5;

/**
 * グリッドと動き　～その１
 * [マウス]
 * x座標：円の位置
 * y座標：円のサイズ
 * 左クリック：円の位置のランダム値の更新
 */
export const P_2_1_2_01 = () => {
  if (!!globalP5Instance) globalP5Instance.remove();
  const tileCount = 20;
  let actRandomSeed = 0;

  const circleAlpha = 130;
  let circleColor: p5.Color;

  globalP5Instance = new p5((p: p5) => {
    p.setup = () => {
      p.createCanvas(600, 600);
      p.noFill();
      circleColor = p.color(0, 0, 0, circleAlpha);
    };
    p.draw = () => {
      p.translate(p.width / tileCount / 2, p.height / tileCount / 2);
      p.background(255);
      p.randomSeed(actRandomSeed);
      p.stroke(circleColor);
      p.strokeWeight(p.mouseY / 60);

      for (let gridY = 0; gridY < tileCount; gridY++) {
        for (let gridX = 0; gridX < tileCount; gridX++) {
          const posX = (p.width / tileCount) * gridX;
          const posY = (p.height / tileCount) * gridY;

          const shiftX = p.random(-p.mouseX, p.mouseX) / 20;
          const shiftY = p.random(-p.mouseX, p.mouseX) / 20;

          p.ellipse(posX + shiftX, posY + shiftY, p.mouseY / 15, p.mouseY / 15);
        }
      }
    };
    p.mousePressed = () => {
      actRandomSeed = p.random(100000);
    };
  });
  return '';
};

/**
 * グリッドと動き　～その２
 * [マウス]
 * x座標：外円のx座標
 * y座標：外円のy座標
 * 左クリック：外円の位置のランダム値の更新
 * [キー]
 * 0-3：円の色
 * ↑↓：外円のサイズ
 * ←→：内円のサイズ
 */
export const P_2_1_2_02 = () => {
  if (!!globalP5Instance) globalP5Instance.remove();
  const tileCount = 20;
  let actRandomSeed = 0;

  let moduleColorBackground: p5.Color;
  let moduleColorForeground: p5.Color;

  let moduleAlphaBackground = 100;
  let moduleAlphaForeground = 100;

  let moduleRadiusBackground = 30;
  let moduleRadiusForeground = 15;

  let backgroundColor: p5.Color;

  globalP5Instance = new p5((p: p5) => {
    p.setup = () => {
      p.createCanvas(600, 600);
      p.colorMode(p.HSB, 360, 100, 100, 100);
      p.noStroke();

      moduleColorBackground = p.color(0, 0, 0, moduleAlphaBackground);
      moduleColorForeground = p.color(0, 0, 100, moduleAlphaForeground);

      backgroundColor = p.color(0, 0, 100);
    };
    p.draw = () => {
      p.translate(p.width / tileCount / 2, p.height / tileCount / 2);
      p.background(backgroundColor);
      p.randomSeed(actRandomSeed);

      for (let gridY = 0; gridY < tileCount; gridY++) {
        for (let gridX = 0; gridX < tileCount; gridX++) {
          const bPosX = (p.width / tileCount) * gridX;
          const bPosY = (p.height / tileCount) * gridY;

          const shiftX = (p.random(-1, 1) * p.mouseX) / 20;
          const shiftY = (p.random(-1, 1) * p.mouseY) / 20;

          p.fill(moduleColorBackground);
          p.ellipse(
            bPosX + shiftX,
            bPosY + shiftY,
            moduleRadiusBackground,
            moduleRadiusBackground
          );

          const fPosX = (p.width / tileCount) * gridX;
          const fPosY = (p.height / tileCount) * gridY;

          p.fill(moduleColorForeground);
          p.ellipse(
            fPosX,
            fPosY,
            moduleRadiusForeground,
            moduleRadiusForeground
          );
        }
      }
    };
    p.mousePressed = () => {
      actRandomSeed = p.random(100000);
    };

    const colorsEqual = (col1: p5.Color, col2: p5.Color) =>
      col1.toString() === col2.toString();

    p.keyPressed = () => {
      if (p.key === '1') {
        if (
          colorsEqual(
            moduleColorBackground,
            p.color(0, 0, 0, moduleAlphaBackground)
          )
        ) {
          moduleColorBackground = p.color(273, 73, 51, moduleAlphaBackground);
        } else {
          moduleColorBackground = p.color(0, 0, 0, moduleAlphaBackground);
        }
      }
      if (p.key === '2') {
        if (
          colorsEqual(
            moduleColorForeground,
            p.color(360, 100, 100, moduleAlphaForeground)
          )
        ) {
          moduleColorForeground = p.color(323, 100, 77, moduleAlphaForeground);
        } else {
          moduleColorForeground = p.color(360, 100, 100, moduleAlphaForeground);
        }
      }

      if (p.key === '3') {
        if (moduleAlphaBackground === 100) {
          moduleAlphaBackground = 50;
          moduleAlphaForeground = 50;
        } else {
          moduleAlphaBackground = 100;
          moduleAlphaForeground = 100;
        }

        moduleColorBackground = p.color(
          p.hue(moduleColorBackground),
          p.saturation(moduleColorBackground),
          p.brightness(moduleColorBackground),
          moduleAlphaBackground
        );
        moduleColorForeground = p.color(
          p.hue(moduleColorForeground),
          p.saturation(moduleColorForeground),
          p.brightness(moduleColorForeground),
          moduleAlphaForeground
        );
      }

      if (p.key === '0') {
        moduleRadiusBackground = 30;
        moduleRadiusForeground = 15;
        moduleAlphaBackground = 100;
        moduleAlphaForeground = 100;
        moduleColorBackground = p.color(0, 0, 0, moduleAlphaBackground);
        moduleColorForeground = p.color(0, 0, 100, moduleAlphaForeground);
      }

      if (p.keyCode === p.UP_ARROW) moduleRadiusBackground += 2;
      if (p.keyCode === p.DOWN_ARROW)
        moduleRadiusBackground = p.max(moduleRadiusBackground - 2, 10);
      if (p.keyCode === p.LEFT_ARROW)
        moduleRadiusForeground = p.max(moduleRadiusForeground - 2, 5);
      if (p.keyCode === p.RIGHT_ARROW) moduleRadiusForeground += 2;
    };
  });
  return '';
};

/**
 * グリッドと動き　～その３
 * [マウス]
 * x/y座標：グリッドサイズ
 */
export const P_2_1_2_03 = () => {
  if (!!globalP5Instance) globalP5Instance.remove();
  let moduleColor: p5.Color;
  const moduleAlpha = 180;
  const maxDistance = 500;

  globalP5Instance = new p5((p: p5) => {
    p.setup = () => {
      p.createCanvas(600, 600);
      p.noFill();
      p.strokeWeight(3);
      moduleColor = p.color(0, 0, 0, moduleAlpha);
    };
    p.draw = () => {
      p.clear();
      p.stroke(moduleColor);

      for (let gridY = 0; gridY < p.width; gridY += 25) {
        for (let gridX = 0; gridX < p.height; gridX += 25) {
          let diameter = p.dist(p.mouseX, p.mouseY, gridX, gridY);
          diameter = (diameter / maxDistance) * 40;
          p.push();
          p.translate(gridX, gridY, diameter * 5);
          p.rect(0, 0, diameter, diameter); // also nice: ellipse(...)
          p.pop();
        }
      }
    };
  });
  return '';
};

/**
 * グリッドと動き　～その４
 * [マウス]
 * x/y座標：グリッドの四隅の座標
 * 左クリック：ランダム値の更新
 */
export const P_2_1_2_04 = () => {
  if (!!globalP5Instance) globalP5Instance.remove();
  const tileCount = 20;
  const rectSize = 30;

  let actRandomSeed = 0;

  globalP5Instance = new p5((p: p5) => {
    p.setup = () => {
      p.createCanvas(600, 600);
      p.colorMode(p.HSB, 360, 100, 100, 100);
      p.noStroke();
      p.fill(192, 100, 64, 60);
    };
    p.draw = () => {
      p.clear();
      p.randomSeed(actRandomSeed);

      for (let gridY = 0; gridY < tileCount; gridY++) {
        for (let gridX = 0; gridX < tileCount; gridX++) {
          const posX = (p.width / tileCount) * gridX;
          const posY = (p.height / tileCount) * gridY;

          const shiftX1 = (p.mouseX / 20) * p.random(-1, 1);
          const shiftY1 = (p.mouseY / 20) * p.random(-1, 1);
          const shiftX2 = (p.mouseX / 20) * p.random(-1, 1);
          const shiftY2 = (p.mouseY / 20) * p.random(-1, 1);
          const shiftX3 = (p.mouseX / 20) * p.random(-1, 1);
          const shiftY3 = (p.mouseY / 20) * p.random(-1, 1);
          const shiftX4 = (p.mouseX / 20) * p.random(-1, 1);
          const shiftY4 = (p.mouseY / 20) * p.random(-1, 1);

          p.push();
          p.translate(posX, posY);
          p.beginShape();
          p.vertex(shiftX1, shiftY1);
          p.vertex(rectSize + shiftX2, shiftY2);
          p.vertex(rectSize + shiftX3, rectSize + shiftY3);
          p.vertex(shiftX4, rectSize + shiftY4);
          p.endShape();
          p.pop();
        }
      }
    };
    p.mousePressed = () => {
      actRandomSeed = p.random(100000);
    };
  });
  return '';
};
