import p5 from 'p5';
import P_2_3_6_0100 from './assets/P_2_3_6_01/00.svg';
import P_2_3_6_0101 from './assets/P_2_3_6_01/01.svg';
import P_2_3_6_0102 from './assets/P_2_3_6_01/02.svg';
import P_2_3_6_0103 from './assets/P_2_3_6_01/03.svg';
import P_2_3_6_0104 from './assets/P_2_3_6_01/04.svg';
import P_2_3_6_0105 from './assets/P_2_3_6_01/05.svg';
import P_2_3_6_0106 from './assets/P_2_3_6_01/06.svg';
import P_2_3_6_0107 from './assets/P_2_3_6_01/07.svg';
import P_2_3_6_0108 from './assets/P_2_3_6_01/08.svg';
import P_2_3_6_0109 from './assets/P_2_3_6_01/09.svg';
import P_2_3_6_0110 from './assets/P_2_3_6_01/10.svg';
import P_2_3_6_0111 from './assets/P_2_3_6_01/11.svg';
import P_2_3_6_0112 from './assets/P_2_3_6_01/12.svg';
import P_2_3_6_0113 from './assets/P_2_3_6_01/13.svg';
import P_2_3_6_0114 from './assets/P_2_3_6_01/14.svg';
import P_2_3_6_0115 from './assets/P_2_3_6_01/15.svg';
import * as svgModule from './lib/svgModules.P2-3-6';
export default { title: 'P2：Shape' };

declare let globalP5Instance: p5;

/**
 * 複合モジュールでドローイング　～その１
 * [マウス]
 * ドラッグ：モジュールのドローイング
 * 右ドラッグ：モジュールの削除
 * [キー]
 * g：グリッド表示 on/off
 * d：モジュール値表示 on/off
 * Delete/Backspace：リセット
 */
export const P_2_3_6_01 = () => {
  if (!!globalP5Instance) globalP5Instance.remove();
  const modules: p5.Image[] = [];
  const tileSize = 30;
  const tiles: number[][] = [];

  let gridResolutionX: number;
  let gridResolutionY: number;
  let doDrawGrid = true;
  let isDebugMode = false;

  globalP5Instance = new p5((p: p5) => {
    p.preload = () => {
      // load SVG modules

      // METHOD 1: Looping through local files is efficient
      // for (const i = 0; i < 16; i++) {
      //   modules[i] = loadImage('data/' + nf(i, 2) + '.svg');
      // }

      // METHOD 2: Read files one-by-one
      modules[0] = p.loadImage(P_2_3_6_0100);
      modules[1] = p.loadImage(P_2_3_6_0101);
      modules[2] = p.loadImage(P_2_3_6_0102);
      modules[3] = p.loadImage(P_2_3_6_0103);
      modules[4] = p.loadImage(P_2_3_6_0104);
      modules[5] = p.loadImage(P_2_3_6_0105);
      modules[6] = p.loadImage(P_2_3_6_0106);
      modules[7] = p.loadImage(P_2_3_6_0107);
      modules[8] = p.loadImage(P_2_3_6_0108);
      modules[9] = p.loadImage(P_2_3_6_0109);
      modules[10] = p.loadImage(P_2_3_6_0110);
      modules[11] = p.loadImage(P_2_3_6_0111);
      modules[12] = p.loadImage(P_2_3_6_0112);
      modules[13] = p.loadImage(P_2_3_6_0113);
      modules[14] = p.loadImage(P_2_3_6_0114);
      modules[15] = p.loadImage(P_2_3_6_0115);
    };
    const initTiles = () => {
      for (let gridX = 0; gridX < gridResolutionX; gridX++) {
        tiles[gridX] = [];
        for (let gridY = 0; gridY < gridResolutionY; gridY++) {
          tiles[gridX][gridY] = 0;
        }
      }
    };
    const setTile = () => {
      // convert mouse position to grid coordinates
      let gridX = p.floor(p.mouseX / tileSize) + 1;
      gridX = p.constrain(gridX, 1, gridResolutionX - 2);
      let gridY = p.floor(p.mouseY / tileSize) + 1;
      gridY = p.constrain(gridY, 1, gridResolutionY - 2);
      tiles[gridX][gridY] = 1;
    };
    const unsetTile = () => {
      let gridX = p.floor(p.mouseX / tileSize) + 1;
      gridX = p.constrain(gridX, 1, gridResolutionX - 2);
      let gridY = p.floor(p.mouseY / tileSize) + 1;
      gridY = p.constrain(gridY, 1, gridResolutionY - 2);
      tiles[gridX][gridY] = 0;
    };
    const drawGrid = () => {
      for (let gridX = 0; gridX < gridResolutionX; gridX++) {
        for (let gridY = 0; gridY < gridResolutionY; gridY++) {
          const posX = tileSize * gridX - tileSize / 2;
          const posY = tileSize * gridY - tileSize / 2;
          p.fill(255);
          if (isDebugMode && tiles[gridX][gridY] === 1) p.fill(220);
          p.rect(posX, posY, tileSize, tileSize);
        }
      }
    };
    const drawModules = () => {
      for (let gridX = 0; gridX < gridResolutionX - 1; gridX++) {
        for (let gridY = 0; gridY < gridResolutionY - 1; gridY++) {
          // use only active tiles
          if (tiles[gridX][gridY] === 1) {
            // check the four neightbours, each can be true or false
            const NORTH = p.str(tiles[gridX][gridY - 1]);
            const WEST = p.str(tiles[gridX - 1][gridY]);
            const SOUTH = p.str(tiles[gridX][gridY + 1]);
            const EAST = p.str(tiles[gridX + 1][gridY]);

            // create binary result out of it
            const binaryResult = NORTH + WEST + SOUTH + EAST;

            // convert binary string to a decimal value from 0 - 15
            const decimalResult = parseInt(binaryResult, 2);

            const posX = tileSize * gridX - tileSize / 2;
            const posY = tileSize * gridY - tileSize / 2;

            // decimalResult is also the index for the shape array
            p.image(modules[decimalResult], posX, posY, tileSize, tileSize);

            if (isDebugMode) {
              p.fill(150);
              p.text(decimalResult + '\n' + binaryResult, posX, posY);
            }
          }
        }
      }
    };
    p.setup = () => {
      // use full window size
      p.createCanvas(p.windowWidth, p.windowHeight);

      p.cursor(p.CROSS);
      p.rectMode(p.CENTER);
      p.imageMode(p.CENTER);
      p.strokeWeight(0.15);
      p.textSize(8);
      p.textAlign(p.CENTER, p.CENTER);

      gridResolutionX = p.round(p.width / tileSize) + 2;
      gridResolutionY = p.round(p.height / tileSize) + 2;

      initTiles();
    };
    p.draw = () => {
      p.background(255);

      if (p.mouseIsPressed) {
        if (p.mouseButton === p.LEFT) setTile();
        if (p.mouseButton === p.RIGHT) unsetTile();
      }

      if (doDrawGrid) drawGrid();
      drawModules();
    };
    p.keyPressed = () => {
      if (p.keyCode === p.DELETE || p.keyCode === p.BACKSPACE) initTiles();
      if (p.key === 'g' || p.key === 'G') doDrawGrid = !doDrawGrid;
      if (p.key === 'd' || p.key === 'D') isDebugMode = !isDebugMode;
    };
  });
  return '';
};

/**
 * 複合モジュールでドローイング　～その２
 * [マウス]
 * ドラッグ：モジュールのドローイング
 * 右ドラッグ：モジュールの削除
 * [キー]
 * g：グリッド表示 on/off
 * d：モジュール値表示 on/off
 * r：モジュールのランダムモード on/off
 * 1-8：モジュールの種類
 * yxcvb：モジュールの色
 * Delete/Backspace：リセット
 */
export const P_2_3_6_02 = () => {
  if (!!globalP5Instance) globalP5Instance.remove();
  const modules: p5.Image[][] = [];
  const moduleType = ['A', 'B', 'C', 'D', 'E', 'F', 'J', 'K'];
  const tileSize = 30;
  const tiles: number[][] = [];
  const tileColors: p5.Color[][] = [];
  const tileType: string[][] = [];

  let activeModuleSet = 'A';
  let gridResolutionX: number;
  let gridResolutionY: number;
  let activeTileColor: p5.Color;
  let doDrawGrid = true;
  let randomMode = false;
  let isDebugMode = false;

  globalP5Instance = new p5((p: p5) => {
    const initTiles = () => {
      for (let gridX = 0; gridX < gridResolutionX; gridX++) {
        tiles[gridX] = [];
        tileColors[gridX] = [];
        tileType[gridX] = [];
        for (let gridY = 0; gridY < gridResolutionY; gridY++) {
          tiles[gridX][gridY] = 0;
          tileColors[gridX][gridY] = p.color(p.random(360), 0, p.random(100));
        }
      }
    };
    const setTile = () => {
      // convert mouse position to grid coordinates
      let gridX = p.floor(p.mouseX / tileSize) + 1;
      gridX = p.constrain(gridX, 1, gridResolutionX - 2);
      let gridY = p.floor(p.mouseY / tileSize) + 1;
      gridY = p.constrain(gridY, 1, gridResolutionY - 2);
      tiles[gridX][gridY] = 1;
      tileColors[gridX][gridY] = activeTileColor;
      tileType[gridX][gridY] = randomMode
        ? moduleType[p.int(p.random(moduleType.length))]
        : activeModuleSet;
    };

    const unsetTile = () => {
      let gridX = p.floor(p.mouseX / tileSize) + 1;
      gridX = p.constrain(gridX, 1, gridResolutionX - 2);
      let gridY = p.floor(p.mouseY / tileSize) + 1;
      gridY = p.constrain(gridY, 1, gridResolutionY - 2);
      tiles[gridX][gridY] = 0;
    };
    const drawGrid = () => {
      for (let gridX = 0; gridX < gridResolutionX; gridX++) {
        for (let gridY = 0; gridY < gridResolutionY; gridY++) {
          const posX = tileSize * gridX - tileSize / 2;
          const posY = tileSize * gridY - tileSize / 2;
          p.fill(360);
          if (isDebugMode && tiles[gridX][gridY] === 1) p.fill(80);
          p.stroke(0);
          p.rect(posX, posY, tileSize, tileSize);
        }
      }
    };
    const drawModules = () => {
      for (let gridX = 1; gridX < gridResolutionX - 1; gridX++) {
        for (let gridY = 1; gridY < gridResolutionY - 1; gridY++) {
          // use only active tiles
          const currentTile = tiles[gridX][gridY];
          if (tiles[gridX][gridY] != 0) {
            let binaryResult = '';
            // check the four neightbours, each can be true or false
            // create a binary result out of it, eg. 1011
            // NORTH
            binaryResult += tiles[gridX][gridY - 1] != 0 ? '1' : '0';
            // WEST
            binaryResult += tiles[gridX - 1][gridY] != 0 ? '1' : '0';
            // SOUTH
            binaryResult += tiles[gridX][gridY + 1] != 0 ? '1' : '0';
            // EAST
            binaryResult += tiles[gridX + 1][gridY] != 0 ? '1' : '0';

            // convert binary string to a decimal values from 0 - 15
            const decimalResult = parseInt(binaryResult, 2);
            const posX = tileSize * gridX - tileSize / 2;
            const posY = tileSize * gridY - tileSize / 2;

            p.noStroke();
            p.tint(tileColors[gridX][gridY]);

            // decimalResult is also the index for the shape array
            p.image(
              modules[tileType[gridX][gridY]][decimalResult],
              posX,
              posY,
              tileSize,
              tileSize
            );

            if (isDebugMode) {
              p.fill(60);
              p.text(
                currentTile + '\n' + decimalResult + '\n' + binaryResult,
                posX,
                posY
              );
            }
          }
        }
      }
    };
    p.preload = () => {
      for (let i = 0; i < moduleType.length; i++) {
        modules[moduleType[i]] = [];
        for (let j = 0; j < 16; j++) {
          modules[moduleType[i]].push(
            p.loadImage(svgModule[`${moduleType[i]}_${p.nf(j, 2)}`])
          );
        }
      }
    };
    p.setup = () => {
      // use full window size
      p.createCanvas(p.windowWidth, p.windowHeight);

      p.colorMode(p.HSB, 360, 100, 100, 100);
      p.cursor(p.CROSS);
      p.rectMode(p.CENTER);
      p.imageMode(p.CENTER);
      p.strokeWeight(0.15);
      p.textSize(8);
      p.textAlign(p.CENTER, p.CENTER);

      gridResolutionX = p.round(p.width / tileSize) + 2;
      gridResolutionY = p.round(p.height / tileSize) + 2;
      activeTileColor = p.color(0);

      // invert shape color so image tint can be applied
      for (let i = 0; i < moduleType.length; i++) {
        for (let j = 0; j < modules[moduleType[i]].length; j++) {
          modules[moduleType[i]][j].filter(p.INVERT);
        }
      }

      initTiles();
    };
    p.draw = () => {
      p.background(360);

      if (p.mouseIsPressed) {
        if (p.mouseButton === p.LEFT) setTile();
        if (p.mouseButton === p.RIGHT) unsetTile();
      }

      if (doDrawGrid) drawGrid();
      drawModules();
    };
    p.keyPressed = () => {
      if (p.keyCode === p.DELETE || p.keyCode === p.BACKSPACE) initTiles();
      if (p.key === 'g' || p.key === 'G') doDrawGrid = !doDrawGrid;
      if (p.key === 'd' || p.key === 'D') isDebugMode = !isDebugMode;
      if (p.key === 'r' || p.key === 'R') randomMode = !randomMode;

      if (p.key === '1') activeModuleSet = 'A';
      if (p.key === '2') activeModuleSet = 'B';
      if (p.key === '3') activeModuleSet = 'C';
      if (p.key === '4') activeModuleSet = 'D';
      if (p.key === '5') activeModuleSet = 'E';
      if (p.key === '6') activeModuleSet = 'F';
      if (p.key === '7') activeModuleSet = 'J';
      if (p.key === '8') activeModuleSet = 'K';

      if (p.key === 'y' || p.key === 'Y') activeTileColor = p.color(0);
      if (p.key === 'x' || p.key === 'X')
        activeTileColor = p.color(52, 100, 71);
      if (p.key === 'c' || p.key === 'C')
        activeTileColor = p.color(192, 100, 64);
      if (p.key === 'v' || p.key === 'V')
        activeTileColor = p.color(273, 73, 51);
      if (p.key === 'b' || p.key === 'B')
        activeTileColor = p.color(323, 100, 77);
    };
  });
  return '';
};

/**
 * 複数のブラシでドローイング
 * [マウス]
 * ドラッグ：ドローイング
 * [キー]
 * 1-4：さまざまな反転コピー on/off
 * 5-0：色
 * ↑↓：線の太さ
 * ←→：ブラシの数
 * d：反転軸の表示 on/off
 * Delete/Backspace：リセット
 */
export const P_2_3_7_01 = () => {
  if (!!globalP5Instance) globalP5Instance.remove();
  let lineWidth = 3;
  let lineColor: p5.Color;
  let mv = true;
  let mh = true;
  let md1 = true;
  let md2 = true;
  let penCount = 1;
  let showAxes = true;
  let img: p5.Graphics;

  globalP5Instance = new p5((p: p5) => {
    p.setup = () => {
      // Please work with a square canvas
      p.createCanvas(800, 800);
      p.noCursor();
      p.noFill();
      lineColor = p.color(0);

      // Create an offscreen graphics object to draw into
      img = p.createGraphics(p.width, p.height);
      img.pixelDensity(1);
    };
    p.draw = () => {
      p.background(255);
      p.image(img, 0, 0);

      img.strokeWeight(lineWidth);
      img.stroke(lineColor);

      if (p.mouseIsPressed && p.mouseButton === p.LEFT) {
        const w = p.width / penCount;
        const h = p.height / penCount;
        const x = p.mouseX % w;
        const y = p.mouseY % h;
        const px = x - (p.mouseX - p.pmouseX);
        const py = y - (p.mouseY - p.pmouseY);

        for (let i = 0; i < penCount; i++) {
          for (let j = 0; j < penCount; j++) {
            const ox = i * w;
            const oy = j * h;

            // Normal position
            img.line(x + ox, y + oy, px + ox, py + oy);
            // Horizontal mirror or all three other mirrors
            if (mh || (md2 && md1 && mv))
              img.line(w - x + ox, y + oy, w - px + ox, py + oy);
            // Vertical mirror
            if (mv || (md2 && md1 && mh))
              img.line(x + ox, h - y + oy, px + ox, h - py + oy);
            // Horizontal and vertical mirror
            if ((mv && mh) || (md2 && md1))
              img.line(w - x + ox, h - y + oy, w - px + ox, h - py + oy);

            // When mirroring diagonally, flip X and Y inputs.
            if (md1 || (md2 && mv && mh))
              img.line(y + ox, x + oy, py + ox, px + oy);
            if ((md1 && mh) || (md2 && mv))
              img.line(y + ox, w - x + oy, py + ox, w - px + oy);
            if ((md1 && mv) || (md2 && mh))
              img.line(h - y + ox, x + oy, h - py + ox, px + oy);
            if ((md1 && mv && mh) || md2)
              img.line(h - y + ox, w - x + oy, h - py + ox, w - px + oy);
          }
        }
      }

      if (showAxes) {
        const w = p.width / penCount;
        const h = p.height / penCount;

        // draw mirror axes and tiles
        for (let i = 0; i < penCount; i++) {
          for (let j = 0; j < penCount; j++) {
            const x = i * w;
            const y = j * h;

            p.stroke(0, 50);
            p.strokeWeight(1);
            if (mh) p.line(x + w / 2, y, x + w / 2, y + h);
            if (mv) p.line(x, y + h / 2, x + w, y + h / 2);
            if (md1) p.line(x, y, x + w, y + h);
            if (md2) p.line(x + w, y, x, y + h);

            p.stroke(15, 233, 118, 50);
            p.strokeWeight(1);
            p.rect(i * w, j * h, w - 1, h - 1);
          }
        }

        // draw pen
        p.fill(lineColor);
        p.noStroke();
        p.ellipse(p.mouseX, p.mouseY, lineWidth + 2, lineWidth + 2);
        p.stroke(0, 50);
        p.noFill();
        p.ellipse(p.mouseX, p.mouseY, lineWidth + 1, lineWidth + 1);
      }
    };
    p.keyPressed = () => {
      if (p.keyCode === p.DELETE || p.keyCode === p.BACKSPACE) img.clear();

      if (p.keyCode === p.RIGHT_ARROW) penCount++;
      if (p.keyCode === p.LEFT_ARROW) penCount = p.max(1, penCount - 1);

      if (p.keyCode === p.UP_ARROW) lineWidth++;
      if (p.keyCode === p.DOWN_ARROW) lineWidth = p.max(1, lineWidth - 1);

      if (p.key === '1') mv = !mv;
      if (p.key === '2') mh = !mh;
      if (p.key === '3') md1 = !md1;
      if (p.key === '4') md2 = !md2;

      if (p.key === '5') lineColor = p.color(0);
      if (p.key === '6') lineColor = p.color(15, 233, 118);
      if (p.key === '7') lineColor = p.color(245, 95, 80);
      if (p.key === '8') lineColor = p.color(65, 105, 185);
      if (p.key === '9') lineColor = p.color(255, 231, 108);
      if (p.key === '0') lineColor = p.color(255);

      if (p.key === 'd' || p.key === 'D') showAxes = !showAxes;
    };
  });
  return '';
};
