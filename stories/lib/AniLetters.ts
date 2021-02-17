import p5 from 'p5';

// the AniLetters object defines the simple geometry font
export default class AniLetters {
  p: p5;
  textTyped: { counter: number; text: string }[];
  paths: { letter: string; x: number; y: number }[];
  letterWidth: number;
  letterHeight: number;
  lineCount: number;
  aniSteps: number;
  drawMode: number;
  cursorLocation: { x: number; y: number };
  letterPadding: number;
  style: number;

  constructor(p: p5, _lwidth: number, _lheight: number) {
    this.p = p;
    this.textTyped = [];
    this.paths = [];
    this.letterWidth = _lwidth;
    this.letterHeight = _lheight;
    this.lineCount = 0;
    this.aniSteps = 20;
    this.drawMode = 3;
    this.cursorLocation = { x: 50, y: 50 };
    this.letterPadding = 60;
    this.style = 1;
  }
  /*
  Data Handling
  */
  // set the lineCount to the number of "lines" or text object in the textTyped Array
  getLineCount() {
    if (this.textTyped.length > 0) this.lineCount = this.textTyped.length - 1;
    else this.lineCount = 0;
  }
  // get each data path of the letters
  getPaths() {
    this.paths = [];
    this.textTyped.forEach((txt, idx) => {
      txt.text.split('').forEach((d, i) => {
        const pathData = {
          letter: d.toUpperCase(),
          x:
            this.cursorLocation.x + (this.letterWidth + this.letterPadding * i),
          y: this.cursorLocation.y + this.letterHeight * idx
        };
        this.paths.push(pathData);
      });
    });
  }
  // add a text object for each line
  addText(_text: string) {
    return { counter: 0, text: _text };
  }
  /*
    Keyboard interactions
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
    if (this[_key.toUpperCase()]) this.textTyped[this.lineCount].text += _key;
    else console.log('not a letter');
  }
  /*
    Call functions in render
    */
  render() {
    if (this.paths.length > 0) {
      this.paths.forEach(d => {
        this[d.letter](d.x, d.y);
      });
    }
  }
  /*
  Letter Definitions
  */
  A(x: number, y: number) {
    this.p.push();
    this.p.translate(x, y);
    this.diagonalToMiddle(this.letterWidth / 2, 0, 1);
    this.diagonalToMiddle(-this.letterWidth / 2, 0, -1);
    this.halfCrossBar(this.letterWidth / 4, this.letterHeight / 2);
    this.p.pop();
  }
  B(x: number, y: number) {
    this.p.push();
    this.p.translate(x, y);
    this.fullStem(0, 0);
    this.halfBowl(0, 0, -1);
    this.halfBowl(0, this.letterHeight / 2, -1);
    this.p.pop();
  }
  C(x: number, y: number) {
    this.p.push();
    this.p.translate(x, y);
    this.fullBowl(0, 0, 1);
    this.p.pop();
  }
  D(x: number, y: number) {
    this.p.push();
    this.p.translate(x, y);
    this.fullStem(0, 0);
    this.fullBowl(0, 0, -1);
    this.p.pop();
  }
  E(x: number, y: number) {
    this.p.push();
    this.p.translate(x, y);
    this.fullStem(0, 0);
    this.crossBar(0, 0);
    this.crossBar(0, this.letterHeight / 2);
    this.crossBar(0, this.letterHeight);
    this.p.pop();
  }
  F(x: number, y: number) {
    this.p.push();
    this.p.translate(x, y);
    this.fullStem(0, 0);
    this.crossBar(0, 0);
    this.crossBar(0, this.letterHeight / 2);
    this.p.pop();
  }
  G(x: number, y: number) {
    this.p.push();
    this.p.translate(x, y);
    this.fullBowl(0, 0, 1);
    this.halfStem(this.letterWidth, this.letterHeight / 2);
    this.halfCrossBar(this.letterWidth / 2, this.letterHeight / 2);
    this.p.pop();
  }
  H(x: number, y: number) {
    this.p.push();
    this.p.translate(x, y);
    this.fullStem(0, 0);
    this.crossBar(0, this.letterHeight / 2);
    this.fullStem(this.letterWidth, 0);
    this.p.pop();
  }
  I(x: number, y: number) {
    this.p.push();
    this.p.translate(x, y);
    this.fullStem(this.letterWidth / 2, 0);
    this.p.pop();
  }
  J(x: number, y: number) {
    this.p.push();
    this.p.translate(x, y);
    this.jCurve(0, 0);
    this.p.pop();
  }
  K(x: number, y: number) {
    this.p.push();
    this.p.translate(x, y);
    this.fullStem(0, 0);
    this.halfDiagonalLeg(0, this.letterHeight / 2, 1);
    this.halfDiagonalLeg(0, this.letterHeight / 2, -1);
    this.p.pop();
  }
  L(x: number, y: number) {
    this.p.push();
    this.p.translate(x, y);
    this.fullStem(0, 0);
    this.crossBar(0, this.letterHeight);
    this.p.pop();
  }
  M(x: number, y: number) {
    this.p.push();
    this.p.translate(x, y);
    this.fullStem(0, 0);
    this.fullStem(this.letterWidth, 0);
    this.diagonalToMiddle(0, 0, 1);
    this.diagonalToMiddle(0, 0, -1);
    this.p.pop();
  }
  N(x: number, y: number) {
    this.p.push();
    this.p.translate(x, y);
    this.fullStem(0, 0);
    this.fullStem(this.letterWidth, 0);
    this.diagonalToEnd(0, 0, -1);
    this.p.pop();
  }
  O(x: number, y: number) {
    this.p.push();
    this.p.translate(x, y);
    this.letterO(0, 0);
    this.p.pop();
  }
  P(x: number, y: number) {
    this.p.push();
    this.p.translate(x, y);
    this.fullStem(0, 0);
    this.halfBowl(0, 0, -1);
    this.p.pop();
  }
  Q(x: number, y: number) {
    this.p.push();
    this.p.translate(x, y);
    this.letterO(0, 0);
    this.halfDiagonalArm(this.letterWidth / 2, this.letterHeight / 2, -1);
    this.p.pop();
  }
  R(x: number, y: number) {
    this.p.push();
    this.p.translate(x, y);
    this.fullStem(0, 0);
    this.halfBowl(0, 0, -1);
    this.halfDiagonalLeg(0, this.letterHeight / 2, -1);
    this.p.pop();
  }
  S(x: number, y: number) {
    this.p.push();
    this.p.translate(x, y);
    // this.p.noFill();
    this.sCurve(0, 0);
    this.p.pop();
  }
  T(x: number, y: number) {
    this.p.push();
    this.p.translate(x, y);
    this.fullStem(this.letterWidth / 2, 0);
    this.crossBar(0, 0);
    this.p.pop();
  }
  U(x: number, y: number) {
    this.p.push();
    this.p.translate(x, y);
    this.uCurve(0, 0);
    this.p.pop();
  }
  V(x: number, y: number) {
    this.p.push();
    this.p.translate(x, y);
    this.diagonalToMiddle(0, 0, 1);
    this.diagonalToMiddle(0, 0, -1);
    this.p.pop();
  }
  W(x: number, y: number) {
    this.p.push();
    this.p.translate(x, y);
    this.diagonalToQuarter(0, 0, 1);
    this.diagonalToQuarter(0, 0, -1);
    this.diagonalToQuarter(this.letterWidth / 2, 0, 1);
    this.diagonalToQuarter(this.letterWidth / 2, 0, -1);
    this.p.pop();
  }
  X(x: number, y: number) {
    this.p.push();
    this.p.translate(x, y);
    this.diagonalToEnd(0, 0, -1);
    this.diagonalToEnd(0, 0, 1);
    this.p.pop();
  }
  Y(x: number, y: number) {
    this.p.push();
    this.p.translate(x, y);
    this.halfStem(this.letterWidth / 2, this.letterHeight / 2);
    this.halfDiagonalArm(0, 0, 1);
    this.halfDiagonalArm(0, 0, -1);
    this.p.pop();
  }
  Z(x: number, y: number) {
    this.p.push();
    this.p.translate(x, y);
    this.diagonalToEnd(0, 0, 1);
    this.crossBar(0, 0);
    this.crossBar(0, this.letterHeight);
    this.p.pop();
  }
  /*
  Component Definitions
  */
  sCurve(x1: number, y1: number) {
    this.p.push();
    this.p.translate(x1, y1);

    const staticFn = () => {
      this.p.noFill();
      this.p.curve(
        this.letterWidth,
        -this.letterHeight * 1.5,
        0,
        this.letterHeight * 0.25,
        this.letterWidth,
        this.letterHeight * 0.75,
        this.letterWidth - this.letterWidth,
        this.letterHeight * 0.75 + this.letterHeight * 1.5
      );
      this.p.arc(
        this.letterWidth / 2,
        this.letterHeight * 0.25,
        this.letterWidth,
        this.letterHeight / 2,
        this.p.PI,
        0
      );
      this.p.arc(
        this.letterWidth / 2,
        this.letterHeight * 0.75,
        this.letterWidth,
        this.letterHeight / 2,
        0,
        this.p.PI
      );
    };

    const dynamicFn = () => {
      this.arcFromToInSteps(
        this.letterWidth / 2,
        this.letterHeight * 0.25,
        this.letterWidth / 2,
        this.letterWidth / 2,
        -this.p.PI,
        0,
        this.aniSteps
      );
      this.arcFromToInSteps(
        this.letterWidth / 2,
        this.letterHeight * 0.75,
        this.letterWidth / 2,
        this.letterWidth / 2,
        this.p.PI,
        0,
        this.aniSteps
      );
      this.curveFromToInSteps(
        this.letterWidth,
        -this.letterHeight * 1.5,
        0,
        this.letterHeight * 0.25,
        this.letterWidth,
        this.letterHeight * 0.75,
        this.letterWidth - this.letterWidth,
        this.letterHeight * 0.75 + this.letterHeight * 1.5,
        this.aniSteps
      );
    };

    if (this.drawMode === 1) staticFn();
    if (this.drawMode === 2) dynamicFn();
    if (this.drawMode === 3) {
      staticFn();
      dynamicFn();
    }
    this.p.pop();
  }
  uCurve(x1: number, y1: number) {
    this.p.push();
    this.p.translate(x1, y1);

    const staticFn = () => {
      this.p.noFill();
      this.p.arc(
        this.letterWidth / 2,
        0,
        this.letterWidth,
        this.letterHeight * 2,
        0,
        this.p.PI
      );
    };
    const dynamicFn = () => {
      this.arcFromToInSteps(
        this.letterWidth / 2,
        0,
        this.letterWidth / 2,
        this.letterHeight,
        0,
        this.p.PI,
        this.aniSteps + 10
      );
    };

    if (this.drawMode === 1) staticFn();
    if (this.drawMode === 2) dynamicFn();
    if (this.drawMode === 3) {
      staticFn();
      dynamicFn();
    }
    this.p.pop();
  }
  jCurve(x1: number, y1: number) {
    this.p.push();
    this.p.translate(x1, y1);
    const staticFn = () => {
      this.p.noFill();
      this.p.bezier(
        this.letterWidth,
        0,
        this.letterWidth + 10,
        this.letterHeight * 1.5,
        0,
        this.letterHeight,
        0,
        this.letterHeight * 0.75
      );
    };
    const dynamicFn = () => {
      this.bezierFromToInSteps(
        this.letterWidth,
        0,
        this.letterWidth + 10,
        this.letterHeight * 1.5,
        0,
        this.letterHeight,
        0,
        this.letterHeight * 0.75,
        this.aniSteps + 10
      );
    };

    if (this.drawMode === 1) staticFn();
    if (this.drawMode === 2) dynamicFn();
    if (this.drawMode === 3) {
      staticFn();
      dynamicFn();
    }
    this.p.pop();
  }
  letterO(x1: number, y1: number) {
    this.p.push();
    this.p.translate(x1, y1);

    const staticFn = () => {
      this.p.noFill();
      this.p.ellipse(
        this.letterWidth / 2,
        this.letterHeight / 2,
        this.letterWidth,
        this.letterHeight
      );
    };
    const dynamicFn = () => {
      this.arcFromToInSteps(
        this.letterWidth / 2,
        this.letterHeight / 2,
        this.letterWidth / 2,
        this.letterHeight / 2,
        this.p.PI,
        -this.p.PI,
        this.aniSteps + 10
      );
    };

    if (this.drawMode === 1) staticFn();
    if (this.drawMode === 2) dynamicFn();
    if (this.drawMode === 3) {
      staticFn();
      dynamicFn();
    }
    this.p.pop();
  }
  halfDiagonalArm(x1: number, y1: number, direction: number) {
    this.p.push();
    this.p.translate(x1, y1);

    const staticFn = () => {
      this.p.noFill();
      if (direction === 1) {
        this.p.line(
          this.letterWidth / 2,
          this.letterHeight / 2,
          this.letterWidth,
          0
        );
      }
      if (direction === -1)
        this.p.line(0, 0, this.letterWidth / 2, this.letterHeight / 2);
    };
    const dynamicFn = () => {
      if (direction === 1) {
        this.lineFromToInSteps(
          this.letterWidth / 2,
          this.letterHeight / 2,
          this.letterWidth,
          0,
          this.aniSteps
        );
      }
      if (direction === -1) {
        this.lineFromToInSteps(
          0,
          0,
          this.letterWidth / 2,
          this.letterHeight / 2,
          this.aniSteps
        );
      }
    };

    if (this.drawMode === 1) staticFn();
    if (this.drawMode === 2) dynamicFn();
    if (this.drawMode === 3) {
      staticFn();
      dynamicFn();
    }
    this.p.pop();
  }
  diagonalToEnd(x1: number, y1: number, direction: number) {
    this.p.push();
    this.p.translate(x1, y1);

    const staticFn = () => {
      this.p.noFill();
      if (direction === 1)
        this.p.line(this.letterWidth, 0, 0, this.letterHeight);
      if (direction === -1)
        this.p.line(0, 0, this.letterWidth, this.letterHeight);
    };
    const dynamicFn = () => {
      if (direction === 1) {
        this.lineFromToInSteps(
          this.letterWidth,
          0,
          0,
          this.letterHeight,
          this.aniSteps
        );
      }
      if (direction === -1) {
        this.lineFromToInSteps(
          0,
          0,
          this.letterWidth,
          this.letterHeight,
          this.aniSteps
        );
      }
    };

    if (this.drawMode === 1) staticFn();
    if (this.drawMode === 2) dynamicFn();
    if (this.drawMode === 3) {
      staticFn();
      dynamicFn();
    }
    this.p.pop();
  }
  diagonalToQuarter(x1: number, y1: number, direction: number) {
    this.p.push();
    this.p.translate(x1, y1);
    const staticFn = () => {
      this.p.noFill();
      if (direction === 1)
        this.p.line(0, 0, this.letterWidth / 4, this.letterHeight);
      if (direction === -1) {
        this.p.line(
          this.letterWidth / 4,
          this.letterHeight,
          this.letterWidth / 2,
          0
        );
      }
    };
    const dynamicFn = () => {
      if (direction === 1) {
        this.lineFromToInSteps(
          0,
          0,
          this.letterWidth / 4,
          this.letterHeight,
          this.aniSteps
        );
      }
      if (direction === -1) {
        this.lineFromToInSteps(
          this.letterWidth / 4,
          this.letterHeight,
          this.letterWidth / 2,
          0,
          this.aniSteps
        );
      }
    };

    if (this.drawMode === 1) staticFn();
    if (this.drawMode === 2) dynamicFn();
    if (this.drawMode === 3) {
      staticFn();
      dynamicFn();
    }
    this.p.pop();
  }
  diagonalToMiddle(x1: number, y1: number, direction: number) {
    this.p.push();
    this.p.translate(x1, y1);
    const staticFn = () => {
      this.p.noFill();
      if (direction === 1)
        this.p.line(0, 0, this.letterWidth / 2, this.letterHeight);
      if (direction === -1) {
        this.p.line(
          this.letterWidth / 2,
          this.letterHeight,
          this.letterWidth,
          0
        );
      }
    };
    const dynamicFn = () => {
      if (direction === 1) {
        this.lineFromToInSteps(
          0,
          0,
          this.letterWidth / 2,
          this.letterHeight,
          this.aniSteps
        );
      }
      if (direction === -1) {
        this.lineFromToInSteps(
          this.letterWidth / 2,
          this.letterHeight,
          this.letterWidth,
          0,
          this.aniSteps
        );
      }
    };

    if (this.drawMode === 1) staticFn();
    if (this.drawMode === 2) dynamicFn();
    if (this.drawMode === 3) {
      staticFn();
      dynamicFn();
    }
    this.p.pop();
  }
  halfDiagonalLeg(x1: number, y1: number, direction: number) {
    this.p.push();
    this.p.translate(x1, y1);
    let endpoint: number;
    if (direction === 1) endpoint = -this.letterHeight / 2;
    if (direction === -1) endpoint = this.letterHeight / 2;

    const staticFn = () => {
      this.p.noFill();
      this.p.line(0, 0, this.letterHeight / 2, endpoint);
    };
    const dynamicFn = () => {
      this.lineFromToInSteps(
        0,
        0,
        this.letterHeight / 2,
        endpoint,
        this.aniSteps
      );
    };

    if (this.drawMode === 1) staticFn();
    if (this.drawMode === 2) dynamicFn();
    if (this.drawMode === 3) {
      staticFn();
      dynamicFn();
    }
    this.p.pop();
  }

  fullStem(x1: number, y1: number) {
    this.p.push();
    this.p.translate(x1, y1);
    const staticFn = () => {
      this.p.noFill();
      this.p.line(0, 0, 0, this.letterHeight);
    };
    const dynamicFn = () => {
      this.lineFromToInSteps(0, 0, 0, this.letterHeight, this.aniSteps);
    };
    if (this.drawMode === 1) staticFn();
    if (this.drawMode === 2) dynamicFn();
    if (this.drawMode === 3) {
      staticFn();
      dynamicFn();
    }
    this.p.pop();
  }
  halfStem(x1: number, y1: number) {
    this.p.push();
    this.p.translate(x1, y1);
    const staticFn = () => {
      this.p.noFill();
      this.p.line(0, 0, 0, this.letterHeight / 2);
    };
    const dynamicFn = () => {
      this.lineFromToInSteps(0, 0, 0, this.letterHeight / 2, this.aniSteps);
    };
    if (this.drawMode === 1) staticFn();
    if (this.drawMode === 2) dynamicFn();
    if (this.drawMode === 3) {
      staticFn();
      dynamicFn();
    }
    this.p.pop();
  }
  halfCrossBar(x1: number, y1: number) {
    this.p.push();
    this.p.translate(x1, y1);
    const staticFn = () => {
      this.p.noFill();
      this.p.line(0, 0, this.letterWidth / 2, 0);
    };
    const dynamicFn = () => {
      this.lineFromToInSteps(0, 0, this.letterWidth / 2, 0, this.aniSteps);
    };

    if (this.drawMode === 1) staticFn();
    if (this.drawMode === 2) dynamicFn();
    if (this.drawMode === 3) {
      staticFn();
      dynamicFn();
    }
    this.p.pop();
  }
  halfBowl(x1: number, y1: number, direction: number) {
    const cPoint = this.letterWidth * 8;
    this.p.noFill();
    this.p.push();
    if (direction === 1) this.p.translate(x1 + this.letterWidth, y1);
    if (direction === -1) this.p.translate(x1, y1);
    const staticFn = () => {
      this.p.noFill();
      this.p.curve(
        cPoint * direction,
        0,
        0,
        0,
        0,
        this.letterHeight / 2,
        cPoint * direction,
        this.letterHeight / 2
      );
    };
    const dynamicFn = () => {
      this.curveFromToInSteps(
        cPoint * direction,
        0,
        0,
        0,
        0,
        this.letterHeight / 2,
        cPoint * direction,
        this.letterHeight / 2,
        this.aniSteps
      );
    };

    if (this.drawMode === 1) staticFn();
    if (this.drawMode === 2) dynamicFn();
    if (this.drawMode === 3) {
      staticFn();
      dynamicFn();
    }
    this.p.pop();
  }
  fullBowl(x1: number, y1: number, direction: number) {
    const cPoint = this.letterWidth * 8;
    this.p.noFill();
    this.p.push();
    if (direction === 1) this.p.translate(x1 + this.letterWidth, y1);
    if (direction === -1) this.p.translate(x1, y1);
    const staticFn = () => {
      this.p.noFill();
      this.p.curve(
        cPoint * direction,
        0,
        0,
        0,
        0,
        this.letterHeight,
        cPoint * direction,
        this.letterHeight
      );
    };
    const dynamicFn = () => {
      this.curveFromToInSteps(
        cPoint * direction,
        0,
        0,
        0,
        0,
        this.letterHeight,
        cPoint * direction,
        this.letterHeight,
        this.aniSteps
      );
    };

    if (this.drawMode === 1) staticFn();
    if (this.drawMode === 2) dynamicFn();
    if (this.drawMode === 3) {
      staticFn();
      dynamicFn();
    }
    this.p.pop();
  }
  crossBar(x1: number, y1: number) {
    this.p.push();
    this.p.translate(x1, y1);
    const staticFn = () => {
      this.p.noFill();
      this.p.line(0, 0, this.letterWidth, 0);
    };
    const dynamicFn = () => {
      this.lineFromToInSteps(0, 0, this.letterWidth, 0, this.aniSteps);
    };

    if (this.drawMode === 1) staticFn();
    if (this.drawMode === 2) dynamicFn();
    if (this.drawMode === 3) {
      staticFn();
      dynamicFn();
    }
    this.p.pop();
  }
  /*
  Animation functions
  */
  lineFromToInSteps(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    stepCount: number
  ) {
    const aniIndex = this.p.frameCount % (stepCount + 1);
    const ratio = aniIndex / stepCount;
    const posX = this.p.lerp(x1, x2, ratio);
    const posY = this.p.lerp(y1, y2, ratio);
    this.p.fill(65, 105, 185);
    this.p.rectMode(this.p.CENTER);
    if (this.style === 1) this.p.rect(posX, posY, 10, 10);
    else if (this.style === 2) this.p.ellipse(posX, posY, 10, 10);
    else this.p.ellipse(posX, posY, 10, 10);
  }
  curveFromToInSteps(
    a1: number,
    a2: number,
    b1: number,
    b2: number,
    c1: number,
    c2: number,
    d1: number,
    d2: number,
    stepCount: number
  ) {
    const points: { x: number; y: number }[] = [];
    for (let i = 0; i <= stepCount; i++) {
      const t = i / stepCount;
      const cx = this.p.curvePoint(a1, b1, c1, d1, t);
      const cy = this.p.curvePoint(a2, b2, c2, d2, t);
      points.push({ x: cx, y: cy });
    }
    const aniIndex = this.p.frameCount % stepCount;
    const ratio = aniIndex / stepCount;
    const posX = this.p.lerp(points[aniIndex].x, points[aniIndex + 1].x, ratio);
    const posY = this.p.lerp(points[aniIndex].y, points[aniIndex + 1].y, ratio);
    this.p.fill(65, 105, 185);
    this.p.rectMode(this.p.CENTER);
    if (this.style === 1) this.p.rect(posX, posY, 10, 10);
    else if (this.style === 2) this.p.ellipse(posX, posY, 10, 10);
    else this.p.ellipse(posX, posY, 10, 10);
  }
  bezierFromToInSteps(
    a1: number,
    a2: number,
    b1: number,
    b2: number,
    c1: number,
    c2: number,
    d1: number,
    d2: number,
    stepCount: number
  ) {
    const points = [];
    for (let i = 0; i <= stepCount; i++) {
      const t = i / stepCount;
      const cx = this.p.bezierPoint(a1, b1, c1, d1, t);
      const cy = this.p.bezierPoint(a2, b2, c2, d2, t);
      points.push({ x: cx, y: cy });
    }
    const aniIndex = this.p.frameCount % stepCount;
    const ratio = aniIndex / stepCount;
    const posX = this.p.lerp(points[aniIndex].x, points[aniIndex + 1].x, ratio);
    const posY = this.p.lerp(points[aniIndex].y, points[aniIndex + 1].y, ratio);
    this.p.fill(65, 105, 185);
    this.p.rectMode(this.p.CENTER);
    if (this.style === 1) this.p.rect(posX, posY, 10, 10);
    else if (this.style === 2) this.p.ellipse(posX, posY, 10, 10);
    else this.p.ellipse(posX, posY, 10, 10);
  }
  arcFromToInSteps(
    x: number,
    y: number,
    radiusWidth: number,
    radiusHeight: number,
    a1: number,
    a2: number,
    stepCount: number
  ) {
    const aniIndex = this.p.frameCount % (stepCount + 1);
    const ratio = aniIndex / stepCount;
    const angle = this.p.lerp(a1, a2, ratio);
    const posX = x + this.p.cos(angle) * radiusWidth;
    const posY = y + this.p.sin(angle) * radiusHeight;
    this.p.fill(65, 105, 185);
    this.p.rectMode(this.p.CENTER);
    if (this.style === 1) this.p.rect(posX, posY, 10, 10);
    else if (this.style === 2) this.p.ellipse(posX, posY, 10, 10);
    else this.p.ellipse(posX, posY, 10, 10);
  }
}
