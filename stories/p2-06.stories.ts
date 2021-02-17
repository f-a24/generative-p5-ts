import p5 from 'p5';
export default { title: 'P2：Shape' };

declare let globalP5Instance: p5;

/**
 * ダムエージェント（単純なエージェント）　～その１
 * [マウス]
 * x座標：イメージ生成速度
 * [キー]
 * Delete/Backspace：リセット
 */
export const P_2_2_1_01 = () => {
  if (!!globalP5Instance) globalP5Instance.remove();
  const NORTH = 0;
  const NORTHEAST = 1;
  const EAST = 2;
  const SOUTHEAST = 3;
  const SOUTH = 4;
  const SOUTHWEST = 5;
  const WEST = 6;
  const NORTHWEST = 7;

  let direction: number;
  let stepSize = 1;
  let diameter = 1;
  let posX: number;
  let posY: number;

  globalP5Instance = new p5((p: p5) => {
    p.setup = () => {
      p.createCanvas(p.windowWidth, p.windowHeight);
      p.noStroke();
      p.fill(0, 40);

      posX = p.width / 2;
      posY = p.height / 2;
    };
    p.draw = () => {
      for (let i = 0; i <= p.mouseX; i++) {
        direction = p.int(p.random(0, 8));

        if (direction === NORTH) {
          posY -= stepSize;
        } else if (direction === NORTHEAST) {
          posX += stepSize;
          posY -= stepSize;
        } else if (direction === EAST) {
          posX += stepSize;
        } else if (direction === SOUTHEAST) {
          posX += stepSize;
          posY += stepSize;
        } else if (direction === SOUTH) {
          posY += stepSize;
        } else if (direction === SOUTHWEST) {
          posX -= stepSize;
          posY += stepSize;
        } else if (direction === WEST) {
          posX -= stepSize;
        } else if (direction === NORTHWEST) {
          posX -= stepSize;
          posY -= stepSize;
        }

        if (posX > p.width) posX = 0;
        if (posX < 0) posX = p.width;
        if (posY < 0) posY = p.height;
        if (posY > p.height) posY = 0;

        p.ellipse(posX + stepSize / 2, posY + stepSize / 2, diameter, diameter);
      }
    };
    p.keyPressed = () => {
      if (p.keyCode === p.DELETE || p.keyCode === p.BACKSPACE) p.clear();
    };
  });
  return '';
};

/**
 * ダムエージェント（単純なエージェント）　～その２
 * [マウス]
 * x座標：イメージ生成速度
 * [キー]
 * 1-3：描画モード
 * Delete/Backspace：リセット
 */
export const P_2_2_1_02 = () => {
  if (!!globalP5Instance) globalP5Instance.remove();
  const NORTH = 0;
  const NORTHEAST = 1;
  const EAST = 2;
  const SOUTHEAST = 3;
  const SOUTH = 4;
  const SOUTHWEST = 5;
  const WEST = 6;
  const NORTHWEST = 7;

  let direction: number;
  let stepSize = 1;
  let diameter = 1;
  let posX: number;
  let posY: number;
  let drawMode = 1;
  let counter = 0;

  globalP5Instance = new p5((p: p5) => {
    p.setup = () => {
      p.createCanvas(p.windowWidth, p.windowHeight);
      p.colorMode(p.HSB, 360, 100, 100, 100);
      p.noStroke();
      posX = p.width / 2;
      posY = p.height / 2;
    };
    p.draw = () => {
      for (let i = 0; i <= p.mouseX; i++) {
        counter++;

        // random number for the direction of the next step
        if (drawMode === 2) {
          direction = p.int(p.random(3));
        } else {
          direction = p.int(p.random(7));
        }

        if (direction === NORTH) {
          posY -= stepSize;
        } else if (direction === NORTHEAST) {
          posX += stepSize;
          posY -= stepSize;
        } else if (direction === EAST) {
          posX += stepSize;
        } else if (direction === SOUTHEAST) {
          posX += stepSize;
          posY += stepSize;
        } else if (direction === SOUTH) {
          posY += stepSize;
        } else if (direction === SOUTHWEST) {
          posX -= stepSize;
          posY += stepSize;
        } else if (direction === WEST) {
          posX -= stepSize;
        } else if (direction === NORTHWEST) {
          posX -= stepSize;
          posY -= stepSize;
        }

        if (posX > p.width) posX = 0;
        if (posX < 0) posX = p.width;
        if (posY < 0) posY = p.height;
        if (posY > p.height) posY = 0;

        if (drawMode === 3 && counter >= 100) {
          counter = 0;
          p.fill(192, 100, 64, 80);
          p.ellipse(
            posX + stepSize / 2,
            posY + stepSize / 2,
            diameter + 7,
            diameter + 7
          );
        }

        p.fill(0, 40);
        p.ellipse(posX + stepSize / 2, posY + stepSize / 2, diameter, diameter);
      }
    };
    p.keyPressed = () => {
      if (p.keyCode === p.DELETE || p.keyCode === p.BACKSPACE) p.clear();

      if (p.key === '1') {
        drawMode = 1;
        stepSize = 1;
        diameter = 1;
      }
      if (p.key === '2') {
        drawMode = 2;
        stepSize = 1;
        diameter = 1;
      }
      if (p.key === '3') {
        drawMode = 3;
        stepSize = 10;
        diameter = 5;
      }
    };
  });
  return '';
};

/**
 * インテリジェントエージェント　～その１
 * [マウス]
 * x座標：イメージ生成速度
 * [キー]
 * Delete/Backspace：リセット
 */
export const P_2_2_2_01 = () => {
  if (!!globalP5Instance) globalP5Instance.remove();
  const NORTH = 0;
  const EAST = 1;
  const SOUTH = 2;
  const WEST = 3;
  const stepSize = 3;
  const minLength = 10;
  const angleCount = 7;

  let direction = SOUTH;
  let angle: number;
  let reachedBorder = false;
  let posX: number;
  let posY: number;
  let posXcross: number;
  let posYcross: number;

  globalP5Instance = new p5((p: p5) => {
    const getRandomAngle = (currentDirection: number) => {
      const a =
        ((p.floor(p.random(-angleCount, angleCount)) + 0.5) * 90) / angleCount;
      if (currentDirection === NORTH) return a - 90;
      if (currentDirection === EAST) return a;
      if (currentDirection === SOUTH) return a + 90;
      if (currentDirection === WEST) return a + 180;
      return 0;
    };
    p.setup = () => {
      p.createCanvas(600, 600);
      p.colorMode(p.HSB, 360, 100, 100, 100);
      p.background(360);

      angle = getRandomAngle(direction);
      posX = p.floor(p.random(p.width));
      posY = 5;
      posXcross = posX;
      posYcross = posY;
    };
    p.draw = () => {
      const speed = p.int(p.map(p.mouseX, 0, p.width, 0, 20));
      for (let i = 0; i <= speed; i++) {
        // ------ draw dot at current position ------
        p.strokeWeight(1);
        p.stroke(180, 0, 0);
        p.point(posX, posY);

        // ------ make step ------
        posX += p.cos(p.radians(angle)) * stepSize;
        posY += p.sin(p.radians(angle)) * stepSize;

        // ------ check if agent is near one of the display borders ------
        reachedBorder = false;

        if (posY <= 5) {
          direction = SOUTH;
          reachedBorder = true;
        } else if (posX >= p.width - 5) {
          direction = WEST;
          reachedBorder = true;
        } else if (posY >= p.height - 5) {
          direction = NORTH;
          reachedBorder = true;
        } else if (posX <= 5) {
          direction = EAST;
          reachedBorder = true;
        }

        // ------ if agent is crossing his path or border was reached ------
        p.loadPixels();
        const currentPixel = p.get(p.floor(posX), p.floor(posY));
        if (
          reachedBorder ||
          (currentPixel[0] !== 255 &&
            currentPixel[1] !== 255 &&
            currentPixel[2] !== 255)
        ) {
          angle = getRandomAngle(direction);

          let distance = p.dist(posX, posY, posXcross, posYcross);
          if (distance >= minLength) {
            p.strokeWeight(3);
            p.stroke(0, 0, 0);
            p.line(posX, posY, posXcross, posYcross);
          }

          posXcross = posX;
          posYcross = posY;
        }
      }
    };
    p.keyPressed = () => {
      if (p.keyCode === p.DELETE || p.keyCode === p.BACKSPACE)
        p.background(360);
    };
  });
  return '';
};

/**
 * インテリジェントエージェント　～その２
 * [マウス]
 * x座標：イメージ生成速度
 * [キー]
 * 1-3：描画モード
 * Delete/Backspace：リセット
 */
export const P_2_2_2_02 = () => {
  if (!!globalP5Instance) globalP5Instance.remove();
  const NORTH = 0;
  const EAST = 1;
  const SOUTH = 2;
  const WEST = 3;
  const dWeight = 50;
  const dStroke = 4;
  const stepSize = 3;
  const minLength = 10;
  const angleCount = 7;

  let direction = SOUTH;
  let angle: number;
  let reachedBorder = false;
  let posX: number;
  let posY: number;
  let posXcross: number;
  let posYcross: number;
  let drawMode = 1;

  globalP5Instance = new p5((p: p5) => {
    const getRandomAngle = (currentDirection: number) => {
      const a =
        ((p.floor(p.random(-angleCount, angleCount)) + 0.5) * 90) / angleCount;
      if (currentDirection === NORTH) return a - 90;
      if (currentDirection === EAST) return a;
      if (currentDirection === SOUTH) return a + 90;
      if (currentDirection === WEST) return a + 180;
      return 0;
    };
    p.setup = () => {
      p.createCanvas(600, 600);
      p.colorMode(p.HSB, 360, 100, 100, 100);
      p.background(360);

      angle = getRandomAngle(direction);
      posX = p.floor(p.random(p.width));
      posY = 5;
      posXcross = posX;
      posYcross = posY;
    };
    p.draw = () => {
      const speed = p.int(p.map(p.mouseX, 0, p.width, 0, 20));
      for (let i = 0; i <= speed; i++) {
        // ------ draw dot at current position ------
        p.strokeWeight(1);
        p.stroke(180, 0, 0);
        p.point(posX, posY);

        // ------ make step ------
        posX += p.cos(p.radians(angle)) * stepSize;
        posY += p.sin(p.radians(angle)) * stepSize;

        // ------ check if agent is near one of the display borders ------
        reachedBorder = false;

        if (posY <= 5) {
          direction = SOUTH;
          reachedBorder = true;
        } else if (posX >= p.width - 5) {
          direction = WEST;
          reachedBorder = true;
        } else if (posY >= p.height - 5) {
          direction = NORTH;
          reachedBorder = true;
        } else if (posX <= 5) {
          direction = EAST;
          reachedBorder = true;
        }

        // ------ if agent is crossing his path or border was reached ------
        p.loadPixels();
        const currentPixel = p.get(p.floor(posX), p.floor(posY));
        if (
          reachedBorder ||
          (currentPixel[0] !== 255 &&
            currentPixel[1] !== 255 &&
            currentPixel[2] !== 255)
        ) {
          angle = getRandomAngle(direction);

          const distance = p.dist(posX, posY, posXcross, posYcross);
          if (distance >= minLength) {
            p.strokeWeight(distance / dWeight);
            if (drawMode === 1) p.stroke(0);
            if (drawMode === 2) p.stroke(52, 100, distance / dStroke);
            if (drawMode === 3) p.stroke(192, 100, 64, distance / dStroke);
            p.line(posX, posY, posXcross, posYcross);
          }

          posXcross = posX;
          posYcross = posY;
        }
      }
    };
    p.keyPressed = () => {
      if (p.keyCode === p.DELETE || p.keyCode === p.BACKSPACE)
        p.background(360);
      if (p.key === '1') drawMode = 1;
      if (p.key === '2') drawMode = 2;
      if (p.key === '3') drawMode = 3;
    };
  });
  return '';
};
