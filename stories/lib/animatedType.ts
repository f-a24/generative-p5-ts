import p5 from 'p5';
import opentype from 'opentype.js';
import { Path, resampleByLength } from './generative-design-library';
const fontSize = 120;

export default class animatedType {
  p: p5;
  font: opentype.Font;
  textTyped: { counter: number; text: string }[];
  paths: {
    data: Path;
    lineNumber: number;
    len: number;
    breaks: number;
    ranges: number[];
  }[];
  individualPaths: {
    data: Path;
    lineNumber: number;
    len: number;
    bbox: opentype.BoundingBox;
    distX: number;
    startX: number;
  }[];
  lineCount: number;
  pointDensity: number;
  startX: number;
  colors: p5.Color[];
  drawMode: number;
  angle: number;
  style: number;
  coordinates: { x: number; y: number }[];

  constructor(p: p5, font: opentype.Font) {
    this.p = p;
    this.font = font;
    this.textTyped = [];
    this.paths = [];
    this.individualPaths = [];
    this.lineCount = 0;
    this.pointDensity = 2;
    this.startX = 0;
    this.colors = [
      this.p.color(65, 105, 185),
      this.p.color(245, 95, 80),
      this.p.color(15, 233, 118),
      this.p.color(233, 15, 130),
      this.p.color(118, 15, 233),
      this.p.color(15, 233, 118)
    ];
    this.angle = 0;
    this.drawMode = 8;
    this.style = 1;
  }
  /**
   * Data Handling Methods
   */
  // set the lineCount to the number of "lines" or text object in the textTyped Array
  getLineCount() {
    if (this.textTyped.length > 0) this.lineCount = this.textTyped.length - 1;
    else this.lineCount = 0;
  }
  // create a text object to hold each line of text
  // usage: this.textTyped.push(this.addText("hello"))
  addText(_text: string) {
    return { counter: 0, text: _text };
  }
  // get the path objects for each line typed
  getPaths() {
    // clear the paths each loop
    this.paths = [];

    // go though each of the text objects
    this.textTyped.forEach((txt, lineNum) => {
      if (txt.text.length > 0) {
        const fontPath = this.font.getPath(txt.text, 0, 0, fontSize);
        // convert it to a g.Path object
        let path = new Path(fontPath.commands);
        // resample it with equidistant points
        path = resampleByLength(path, this.pointDensity);
        // console.log(fontPath.getBoundingBox())

        // structure the relevant path data
        const pathData = {
          data: path,
          lineNumber: lineNum,
          len: path.commands.length,
          breaks: this.p.floor(path.commands.length / txt.text.length),
          ranges: []
        };

        // get the start point of each letter
        for (let i = 0; i < pathData.len - 1; i += pathData.breaks) {
          pathData.ranges.push(this.p.floor(i));
        }

        this.paths.push(pathData);
      }
    });
  }
  getIndividualPaths() {
    this.individualPaths = [];

    // go though each of the text objects
    this.textTyped.forEach((txt, lineNum) => {
      if (txt.text.length > 0) {
        txt.text.split('').forEach(d => {
          const fontPath = this.font.getPath(d, 0, 0, fontSize);
          // convert it to a g.Path object
          let path = new Path(fontPath.commands);
          // resample it with equidistant points
          path = resampleByLength(path, this.pointDensity);

          // structure the relevant path data
          const pathData = {
            data: path,
            lineNumber: lineNum,
            len: path.commands.length,
            bbox: fontPath.getBoundingBox(),
            distX: 0,
            startX: 0
          };

          // console.log(pathData.bbox.x1)
          pathData.distX = this.p.ceil(
            this.p.dist(pathData.bbox.x1, 0, pathData.bbox.x2, 0)
          );

          this.individualPaths.push(pathData);
        });
      }
    });

    // set the startX to zero
    this.startX = 0;
    for (let i = 0; i < this.individualPaths.length - 1; i++) {
      // if the linenumbers are the same
      if (
        this.individualPaths[i].lineNumber ===
        this.individualPaths[i + 1].lineNumber
      ) {
        // then add to the startX and assign it to the individualpath startX
        this.individualPaths[i].startX = this.startX;
        this.startX += this.individualPaths[i].distX + 15;
      } else {
        this.individualPaths[i].startX = this.startX;
        this.startX = 0;
      }
      // when reaching the end
      if (i === this.individualPaths.length - 2) {
        this.individualPaths[i + 1].startX = this.startX;
      }
    }
  }
  // get all the coordinates
  getCoordinates() {
    // clear the coordinates each loop
    this.coordinates = [];

    // for each of the letters
    this.paths.forEach(path => {
      path.data.commands.forEach(coord => {
        if (coord.x !== undefined && coord.y !== undefined) {
          const yOffset = path.lineNumber * fontSize;
          this.coordinates.push({ x: coord.x, y: coord.y + yOffset });
        }
      });
    });
  }
  /**
   * keyboard interaction Methods
   */
  // remove letters
  removeLetters() {
    let textTypedCounter = this.lineCount;
    // remove letters from each object
    if (textTypedCounter >= 0 && this.textTyped[0].text.length > 0) {
      this.textTyped[textTypedCounter].text = this.textTyped[
        textTypedCounter
      ].text.substring(
        0,
        this.p.max(0, this.textTyped[textTypedCounter].text.length - 1)
      );
    }
    // remove objects if there's no characters
    if (this.textTyped[textTypedCounter].text.length === 0) {
      textTypedCounter--;
      if (textTypedCounter < 0) {
        console.log('nothing left');
        textTypedCounter = 0;
      } else {
        this.textTyped.pop();
      }
    }
  }
  // add lines
  addLines() {
    this.textTyped.push(this.addText(''));
    this.lineCount++;
  }
  // add characters
  addCharacters(_key: string) {
    this.textTyped[this.lineCount].text += _key;
  }
  /**
   * Rendering Methods
   */
  // show all the points with random color
  randomStrokes() {
    this.coordinates.forEach(coords => {
      this.p.stroke(this.p.random(255), this.p.random(255), this.p.random(255));
      this.p.ellipse(coords.x, coords.y, 5, 5);
    });
  } // end this.show();
  // follow the mouse with extruded lines
  lines2mouse() {
    this.p.stroke(this.colors[0]);
    this.coordinates.forEach(coords => {
      this.p.strokeWeight(1);
      this.p.line(
        coords.x + this.p.map(this.p.mouseX, 0, this.p.width, -100, 100),
        coords.y + this.p.map(this.p.mouseY, 0, this.p.height, -100, 100),
        coords.x,
        coords.y
      );
    });
  }
  // animate the points
  animatedPoints(_shape: string) {
    this.paths.forEach((path, idx) => {
      this.p.fill(this.colors[path.lineNumber]);
      this.p.stroke(this.colors[path.lineNumber]);
      path.ranges.forEach(d => {
        const cmd = path.data.commands[this.textTyped[idx].counter + d];

        if (cmd !== undefined) {
          if (this.textTyped[idx].counter < path.breaks) {
            const yOffset = path.lineNumber * fontSize;
            if (_shape === 'ellipse') {
              this.p.ellipse(
                cmd.x,
                cmd.y + yOffset,
                fontSize * 0.1,
                fontSize * 0.1
              );
            } else if (_shape === 'rect') {
              this.p.rect(
                cmd.x,
                cmd.y + yOffset,
                fontSize * 0.1,
                fontSize * 0.1
              );
            }

            this.textTyped[idx].counter++;
          } else {
            this.textTyped[idx].counter = 0;
          }
        }
      });
    });
  }
  // radial lines
  radialLines() {
    this.p.stroke(this.colors[0]);
    this.coordinates.forEach(coords => {
      this.p.strokeWeight(1);
      for (let i = 0; i < 360; i += 60) {
        const angle = this.p.radians(i);
        const radiusDistanceX = this.p.map(
          this.p.mouseX,
          0,
          this.p.width,
          0,
          this.p.random(20)
        );
        const radiusDistanceY = this.p.map(
          this.p.mouseY,
          0,
          this.p.width,
          0,
          this.p.random(20)
        );
        const ptX = this.p.cos(angle) * radiusDistanceX + coords.x;
        const ptY = this.p.sin(angle) * radiusDistanceY + coords.y;
        this.p.line(ptX, ptY, coords.x, coords.y);
      }
    });
  }
  // orbiting points
  orbitingPoints(_type: string) {
    this.p.stroke(this.colors[0]);
    const rectSize = fontSize * 0.05;
    const shiftX1 = (this.p.mouseX / 100) * this.p.random(-1, 1);
    const shiftY1 = (this.p.mouseY / 100) * this.p.random(-1, 1);
    const shiftX2 = (this.p.mouseX / 100) * this.p.random(-1, 1);
    const shiftY2 = (this.p.mouseY / 100) * this.p.random(-1, 1);
    this.coordinates.forEach((coords, idx) => {
      const angle =
        idx % 2 === 0
          ? this.p.radians(this.p.frameCount % 360)
          : this.p.radians(-this.p.frameCount % 360);

      if (_type === 'points') {
        this.p.push();
        this.p.translate(coords.x, coords.y);
        this.p.rotate(angle);
        this.p.point(0 + shiftX1, 0 + shiftY1);
        this.p.point(0 + rectSize + shiftX2, 0 + shiftY2);
        this.p.pop();
      }
    });
  }
  // make a triangle blob from the points
  triangleBlob() {
    this.p.fill(this.colors[1]);
    this.p.stroke(this.colors[1]);
    this.p.beginShape(this.p.TRIANGLE_STRIP);
    this.coordinates.forEach(coords => {
      this.p.vertex(coords.x, coords.y);
    });
    this.p.endShape();
  }
  // wobblyShapes
  wobblyShapes(_type: string) {
    this.individualPaths.forEach((path, idx) => {
      this.p.stroke(this.colors[path.lineNumber]);
      this.p.fill(this.colors[path.lineNumber]);

      this.angle += 0.01;
      const shifter =
        idx % 2
          ? this.p.sin(this.angle) * 0.05
          : this.p.sin(this.angle) * -0.05;
      const yOffset = path.lineNumber * fontSize;
      const xOffset = path.startX;

      this.p.push();
      this.p.translate(xOffset, yOffset);
      this.p.rotate(shifter);

      // choose a beginShape mode
      if (_type === 'TRIANGLES') {
        this.p.beginShape(this.p.TRIANGLES);
      } else if (_type === 'TRIANGLE_STRIP') {
        this.p.beginShape(this.p.TRIANGLE_STRIP);
      } else if (_type === 'LINES') {
        this.p.beginShape(this.p.LINES);
      } else if (_type === 'TRIANGLE_FAN') {
        this.p.beginShape(this.p.TRIANGLE_FAN);
      } else {
        this.p.beginShape(this.p.TRIANGLES);
      }

      // add all those vertices to the shape
      path.data.commands.forEach(d => {
        this.p.vertex(d.x, d.y);
      });

      this.p.endShape();
      this.p.pop();
    });
  }
  // outward lines following mouse
  outwardLines() {
    this.individualPaths.forEach(path => {
      this.p.stroke(this.colors[path.lineNumber]);
      this.p.strokeWeight(0.5);
      this.p.fill(this.colors[path.lineNumber]);
      const yOffset = path.lineNumber * fontSize;
      const xOffset = path.startX;

      this.p.push();
      this.p.translate(xOffset, yOffset);
      const cX =
        (path.bbox.x1 + path.bbox.x2) / 2 +
        this.p.map(this.p.mouseX, 0, this.p.width, -50, 50);
      const cY =
        (path.bbox.y1 + path.bbox.y2) / 2 +
        this.p.map(this.p.mouseY, 0, this.p.height, -50, 50);
      // add all those vertices to the shape
      path.data.commands.forEach(d => {
        this.p.line(cX, cY, d.x, d.y);
      });
      this.p.pop();
    });
  }
}
