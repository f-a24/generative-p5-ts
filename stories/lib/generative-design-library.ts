import p5 from 'p5';
import chroma from 'chroma-js';

export const timestamp = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();
  const millis = date.getMilliseconds();

  return[
    year.toString().substr(2),
    ("00" + month).substr(-2, 2),
    ("00" + day).substr(-2, 2),
    '_',
    hour,
    ("00" + minute).substr(-2, 2),
    ("00" + second).substr(-2, 2),
    '_',
    millis
  ].join('');
};

export const RED = 'red';
export const GREEN = 'green';
export const BLUE = 'blue';
export const HUE = 'hue';
export const SATURATION = 'saturation';
export const BRIGHTNESS = 'brightness';
export const GRAYSCALE = 'grayscale';
export const ALPHA = 'alpha';

export const sortColors = (p: p5, colors: p5.Color[], method: string) => {
  // sort red
  if (method === RED)
    colors.sort((a, b) => {
      if (p.red(a) < p.red(b)) return -1;
      if (p.red(a) > p.red(b)) return 1;
      return 0;
    });

  // sort green
  if (method === GREEN)
    colors.sort((a, b) => {
      if (p.green(a) < p.green(b)) return -1;
      if (p.green(a) > p.green(b)) return 1;
      return 0;
    });

  // sort blue
  if (method === BLUE)
    colors.sort((a, b) => {
      if (p.blue(a) < p.blue(b)) return -1;
      if (p.blue(a) > p.blue(b)) return 1;
      return 0;
    });

  // sort hue
  if (method === HUE)
    colors.sort((a, b) => {
      //convert a and b from RGB to HSV
      const aHue = chroma(p.red(a), p.green(a), p.blue(a)).get('hsv.h');
      const bHue = chroma(p.red(b), p.green(b), p.blue(b)).get('hsv.h');

      if (aHue < bHue) return -1;
      if (aHue > bHue) return 1;
      return 0;
    });

  // sort saturation
  if (method === SATURATION)
    colors.sort((a, b) => {
      //convert a and b from RGB to HSV
      const aSat = chroma(p.red(a), p.green(a), p.blue(a)).get('hsv.s');
      const bSat = chroma(p.red(b), p.green(b), p.blue(b)).get('hsv.s');

      if (aSat < bSat) return -1;
      if (aSat > bSat) return 1;
      return 0;
    });

  // sort brightness
  if (method === BRIGHTNESS)
    colors.sort((a, b) => {
      //convert a and b from RGB to HSV
      const aBright = chroma(p.red(a), p.green(a), p.blue(a)).get('hsv.v');
      const bBright = chroma(p.red(b), p.green(b), p.blue(b)).get('hsv.v');

      if (aBright < bBright) return -1;
      if (aBright > bBright) return 1;
      return 0;
    });

  // sort grayscale
  if (method === GRAYSCALE)
    colors.sort((a, b) => {
      const aGrey = p.red(a) * 0.222 + p.green(a) * 0.707 + p.blue(a) * 0.071;
      const bGrey = p.red(b) * 0.222 + p.green(b) * 0.707 + p.blue(b) * 0.071;

      if (aGrey < bGrey) return -1;
      if (aGrey > bGrey) return 1;
      return 0;
    });

  // sort alpha
  if (method === ALPHA)
    colors.sort((a, b) => {
      if (p.alpha(a) < p.alpha(b)) return -1;
      if (p.alpha(a) > p.alpha(b)) return 1;
      return 0;
    });

  return colors;
};

export class Treemap {
  p: p5;
  parent: this;
  data: any;
  count = 0;
  items: Treemap[] = [];
  x = 0;
  y = 0;
  w = 0;
  h = 0;
  options: {
    sort: boolean;
    direction: string;
    padding: number;
    ignore: unknown[];
  };
  minCount = 0;
  maxCount = 0;
  level = 0;
  depth = 0;
  itemCount = 1;
  index = 0;
  root = this;
  isRoot = true;
  ignored = false;
  constructor(p: p5, ..._: unknown[]) {
    this.p = p;
    if (arguments.length >= 5) {
      this.x = arguments[1];
      this.y = arguments[2];
      this.w = arguments[3];
      this.h = arguments[4];
      this.options = arguments[5];
    } else {
      this.parent = arguments[1];
      this.data = arguments[2];
      this.count = arguments[3] || 0;
    }

    this.x = this.x || 0;
    this.y = this.y || 0;
    this.w = this.w || 0;
    this.h = this.h || 0;
    if (this.parent) this.level = this.parent.level + 1;
    if (this.parent) {
      this.root = this.parent.root;
      this.isRoot = false;
    }
    this.options = this.options || this.root.options;
  }
  _shuffleArray(array: unknown[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = this.p.floor(this.p.random() * (i + 1));
      const temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
  }
  addData(data: any, keys?: any) {
    if (keys) {
      // store data. If a key is given, just store that part of the object, otherwise the whole branch.
      if (keys.data) this.data = data[keys.data];
      else this.data = data;

      // store counter. if data is a number, just use that as a counter. if data is an object, store what's given at the key 'count'.
      if (typeof data === 'number') this.count = data;
      else this.count = data[keys.count] || 0;

      // get children. if the key 'children' is defined use that. otherwise data might be just an array, so use it directly.
      let children = data;
      if (keys.children) children = data[keys.children];

      if (children instanceof Array) {
        children.forEach(
          function (child: any) {
            const t = new Treemap(this);
            this.items.push(t);
            t.addData(child, keys);
          }.bind(this)
        );
        return true;
      }
      return false;
    } else {
      // data is a "simple" value (String, Number, small Object or Array) which should be counted.
      const i = this.items.findIndex(el => el.data == data);

      if (i >= 0) {
        // the element is already in this Treemap, so just increase counter
        this.items[i].count++;
        return false;
      } else {
        // the element is not found, so create a new Treemap for it
        this.items.push(new Treemap(this.p, this, data, 1));
      }
      return true;
    }
  }
  addTreemap(data: unknown, count?: number) {
    const t = new Treemap(this.p, this, data, count);
    this.items.push(t);
    return t;
  }
  sumUpCounters() {
    // Adjust parameter this.ignore: if ignore option is defined and this.data is listed in that ignored=true
    if (this.options.ignore instanceof Array) {
      if (this.options.ignore.indexOf(this.data) >= 0) {
        this.ignored = true;
      } else {
        this.ignored = false;
      }
    }

    // return count or 0 depending on this.ignored
    if (this.items.length === 0) {
      if (this.ignored) return 0;
    } else {
      this.minCount = Number.MAX_VALUE;
      this.maxCount = 0;
      this.depth = 0;
      this.itemCount = 1;
      this.count = 0;

      if (this.ignored) return 0;

      for (let i = 0; i < this.items.length; i++) {
        const sum = this.items[i].sumUpCounters();
        this.count += sum;
        this.minCount = this.p.min(this.minCount, sum);
        this.maxCount = this.p.max(this.maxCount, sum);
        this.depth = this.p.max(this.depth, this.items[i].depth + 1);
        this.itemCount += this.items[i].itemCount;
      }
    }
    return this.count;
  }
  calculate() {
    // Stop draw immediately, if it's an empty array
    if (this.items.length === 0) return;

    // if it's the root node, sum up all counters recursively
    if (this == this.root) this.sumUpCounters();

    // If to ignore this element, adjust parameters and stop
    if (this.ignored) {
      this.x = -100000; // just a value far outside the screen, so it won't show up if it's drawn accidentally
      this.y = 0;
      this.w = 0;
      this.h = 0;
      return;
    }

    // sort or shuffle according to the given option
    if (this.options.sort === true || this.options.sort === undefined) {
      // sort items
      this.items.sort((a, b) => {
        if (a.count < b.count) return 1;
        if (a.count > b.count) return -1;
        return 0;
      });
    } else {
      // shuffle explicitly
      this._shuffleArray(this.items);
    }

    // give every child an index. could be handy for drawing
    for (let i = 0; i < this.items.length; i++) {
      this.items[i].index = i;
    }

    // Starting point is a rectangle and a number of counters to fit in.
    // So, as nothing has fit in the rect, restSum, restW, ... are the starting rect and the sum of all counters
    let restSum = this.count;
    const pad = this.options.padding || 0;
    let restX = this.x + pad;
    let restY = this.y + pad;
    let restW = this.w - pad * 2;
    let restH = this.h - pad * 2;

    // Fit in rows. One row consits of one or more rects that should be as square as possible in average.
    // actIndex always points on the first counter, that has not fitted in.
    let actIndex = 0;
    while (actIndex < this.items.length) {
      // A row is always along the shorter edge (a).
      let isHorizontal = true; // horizontal row
      let a = restW;
      let b = restH;
      if (this.options.direction !== 'horizontal') {
        if (restW > restH || this.options.direction === 'vertical') {
          isHorizontal = false; // vertical row
          a = restH;
          b = restW;
        }
      }

      // How many items to fit into the row?
      let rowSum = 0;
      let rowCount = 0;
      let avRelPrev = Number.MAX_VALUE;
      for (var i = actIndex; i < this.items.length; i++) {
        rowSum += this.items[i].count;
        rowCount++;

        // a * bLen is the rect of the row
        const percentage = rowSum / restSum;
        let bLen = b * percentage;
        const avRel = a / rowCount / bLen;

        // Let's assume it's a horizontal row. The rects are as square as possible,
        // as soon as the average width (a / rowCount) gets smaller than the row height (bLen).
        if (avRel < 1 || i === this.items.length - 1) {
          // Which is better, the actual or the previous fitting?
          if (avRelPrev < 1 / avRel) {
            // previous fitting is better, so revert to that
            rowSum -= this.items[i].count;
            rowCount--;
            bLen = (b * rowSum) / restSum;
            i--;
          }

          // get the position and length of the row according to isHorizontal (horizontal or not).
          let aPos = restX;
          let bPos = restY;
          let aLen = restW;
          if (!isHorizontal) {
            aPos = restY;
            bPos = restX;
            aLen = restH;
          }

          // now we can transform the counters between index actIndex and i to rects (in fact to treemaps)
          for (let j = actIndex; j <= i; j++) {
            // map aLen according to the value of the counter
            const aPart = (aLen * this.items[j].count) / rowSum;
            if (isHorizontal) {
              this.items[j].x = aPos;
              this.items[j].y = bPos;
              this.items[j].w = aPart;
              this.items[j].h = bLen;
            } else {
              this.items[j].x = bPos;
              this.items[j].y = aPos;
              this.items[j].w = bLen;
              this.items[j].h = aPart;
            }
            // negative width or height not allowed
            this.items[j].w = this.p.max(this.items[j].w, 0);
            this.items[j].h = this.p.max(this.items[j].h, 0);

            // now that the position, width and height is set, it's possible to calculate the nested treemap.
            this.items[j].calculate();
            aPos += aPart;
          }

          // adjust dimensions for the next row
          if (isHorizontal) {
            restY += bLen;
            restH -= bLen;
          } else {
            restX += bLen;
            restW -= bLen;
          }
          restSum -= rowSum;
          break;
        }
        avRelPrev = avRel;
      }
      actIndex = i + 1;
    }
  }
  draw(drawItemFunction: (item: Treemap) => void) {
    if (!this.ignored) {
      // use the drawing function if given, otherwise draw a simple rect.
      if (drawItemFunction) drawItemFunction(this);
      else this.p.rect(this.x, this.y, this.w, this.h);

      for (let i = 0; i < this.items.length; i++) {
        this.items[i].draw(drawItemFunction);
      }
    }
  }
}

class Point {
  x: number;
  y: number;
  constructor(x?: number, y?: number) {
    this.x = x !== undefined ? x : 0;
    this.y = y !== undefined ? y : 0;
  }
}

const math = {
  sum: (values: number[]) => values.reduce((sum, value) => (sum += value), 0)
};

const MOVETO = 'M';
const LINETO = 'L';
const CURVETO = 'C';
const CLOSE = 'Z';
const CLOSE_COMMAND = Object.freeze({ type: CLOSE });

class Rect {
  x: number;
  y: number;
  width: number;
  height: number;
  constructor(x?: number, y?: number, width?: number, height?: number) {
    this.x = x !== undefined ? x : 0;
    this.y = y !== undefined ? y : 0;
    this.width = width !== undefined ? width : 0;
    this.height = height !== undefined ? height : 0;
  }
}

const fuzzyCompare = (p1: number, p2: number) =>
  Math.abs(p1 - p2) <= 0.000000000001 * Math.min(Math.abs(p1), Math.abs(p2));

const coefficients = (t: number) => {
  let mT: number, a: number, b: number, c: number, d: number;
  mT = 1 - t;
  b = mT * mT;
  c = t * t;
  d = c * t;
  a = b * mT;
  b *= 3.0 * t;
  c *= 3.0 * mT;
  return [a, b, c, d];
};

const pointAt = (
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  x3: number,
  y3: number,
  x4: number,
  y4: number,
  t: number
) => {
  let a: number, b: number, c: number, d: number, coeff: number[];
  coeff = coefficients(t);
  a = coeff[0];
  b = coeff[1];
  c = coeff[2];
  d = coeff[3];
  return {
    x: a * x1 + b * x2 + c * x3 + d * x4,
    y: a * y1 + b * y2 + c * y3 + d * y4
  };
};

const bezier = {
  linePoint: (t: number, x0: number, y0: number, x1: number, y1: number) => {
    const x = x0 + t * (x1 - x0),
      y = y0 + t * (y1 - y0);
    return { type: LINETO, x: x, y: y };
  },
  lineLength: (x0: number, y0: number, x1: number, y1: number) => {
    const a = Math.pow(Math.abs(x0 - x1), 2),
      b = Math.pow(Math.abs(y0 - y1), 2);
    return Math.sqrt(a + b);
  },
  curvePoint: (
    t: number,
    x0: number,
    y0: number,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    x3: number,
    y3: number
  ) => {
    const dt = 1 - t,
      x01 = x0 * dt + x1 * t,
      y01 = y0 * dt + y1 * t,
      x12 = x1 * dt + x2 * t,
      y12 = y1 * dt + y2 * t,
      x23 = x2 * dt + x3 * t,
      y23 = y2 * dt + y3 * t,
      h1x = x01 * dt + x12 * t,
      h1y = y01 * dt + y12 * t,
      h2x = x12 * dt + x23 * t,
      h2y = y12 * dt + y23 * t,
      x = h1x * dt + h2x * t,
      y = h1y * dt + h2y * t;
    return { type: CURVETO, x1: h1x, y1: h1y, x2: h2x, y2: h2y, x: x, y: y };
  },
  curveLength: (
    x0: number,
    y0: number,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    x3: number,
    y3: number,
    n?: number
  ) => {
    if (n === undefined) n = 20;
    let i: number,
      t: number,
      cmd: ReturnType<typeof bezier.curvePoint>,
      length = 0,
      xi = x0,
      yi = y0;
    for (i = 0; i < n; i += 1) {
      t = (i + 1) / n;
      cmd = bezier.curvePoint(t, x0, y0, x1, y1, x2, y2, x3, y3);
      length += Math.sqrt(
        Math.pow(Math.abs(xi - cmd.x), 2) + Math.pow(Math.abs(yi - cmd.y), 2)
      );
      xi = cmd.x;
      yi = cmd.y;
    }
    return length;
  },
  segmentLengths: (
    commands: ReturnType<typeof bezier.curvePoint>[],
    relative?: boolean,
    n?: number
  ) => {
    relative = relative !== undefined ? relative : false;
    if (n === undefined) n = 20;
    let i: number,
      cmd: ReturnType<typeof bezier.curvePoint>,
      type: string,
      closeX: number,
      closeY: number,
      x0: number,
      y0: number,
      s: number,
      lengths: number[],
      ll: number[];
    lengths = [];
    for (i = 0; i < commands.length; i += 1) {
      cmd = commands[i];
      type = cmd.type;

      if (i === 0) {
        closeX = cmd.x;
        closeY = cmd.y;
      } else if (type === MOVETO) {
        closeX = cmd.x;
        closeY = cmd.y;
        lengths.push(0.0);
      } else if (type === CLOSE) {
        lengths.push(bezier.lineLength(x0, y0, closeX, closeY));
      } else if (type === LINETO) {
        lengths.push(bezier.lineLength(x0, y0, cmd.x, cmd.y));
      } else if (type === CURVETO) {
        lengths.push(
          bezier.curveLength(
            x0,
            y0,
            cmd.x1,
            cmd.y1,
            cmd.x2,
            cmd.y2,
            cmd.x,
            cmd.y,
            n
          )
        );
      }
      if (type !== CLOSE) {
        x0 = cmd.x;
        y0 = cmd.y;
      }
    }
    if (relative === true) {
      s = math.sum(lengths);
      ll = [];
      ll.length = lengths.length;
      if (s > 0) {
        for (i = 0; i < lengths.length; i += 1) {
          ll[i] = lengths[i] / s;
        }
      } else {
        for (i = 0; i < lengths.length; i += 1) {
          ll[i] = 0.0;
        }
      }
      return ll;
    }
    return lengths;
  },
  length: (path: Path, n?: number) => {
    n = n || 20;
    return math.sum(bezier.segmentLengths(path.commands, false, n));
  },
  _locate: (path: Path, t: number, segmentLengths?: number[]) => {
    let i: number, cmd: ReturnType<typeof bezier.curvePoint>, closeTo: Point;
    if (segmentLengths === undefined)
      segmentLengths = bezier.segmentLengths(path.commands, true);
    for (i = 0; i < path.commands.length; i += 1) {
      cmd = path.commands[i];
      if (i === 0 || cmd.type === MOVETO) closeTo = new Point(cmd.x, cmd.y);
      if (t <= segmentLengths[i] || i === segmentLengths.length - 1) break;
      t -= segmentLengths[i];
    }
    if (segmentLengths[i] !== 0) t /= segmentLengths[i];
    if (i === segmentLengths.length - 1 && segmentLengths[i] === 0) i -= 1;
    return [i, t, closeTo];
  },
  point: (path: Path, t: number, segmentLengths: number[]) => {
    let loc: ReturnType<typeof bezier._locate>,
      i: number,
      closeTo: Point,
      x0: number,
      y0: number,
      cmd: ReturnType<typeof bezier.curvePoint>;
    loc = bezier._locate(path, t, segmentLengths);
    i = loc[0];
    t = loc[1];
    closeTo = loc[2];
    x0 = path.commands[i].x;
    y0 = path.commands[i].y;
    cmd = path.commands[i + 1];
    if (cmd.type === LINETO || cmd.type === CLOSE) {
      cmd =
        cmd.type === CLOSE
          ? bezier.linePoint(t, x0, y0, closeTo.x, closeTo.y)
          : bezier.linePoint(t, x0, y0, cmd.x, cmd.y);
    } else if (cmd.type === CURVETO) {
      cmd = bezier.curvePoint(
        t,
        x0,
        y0,
        cmd.x1,
        cmd.y1,
        cmd.x2,
        cmd.y2,
        cmd.x,
        cmd.y
      );
    }
    return cmd;
  },
  extrema: (
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    x3: number,
    y3: number,
    x4: number,
    y4: number
  ) => {
    let minX: number,
      maxX: number,
      minY: number,
      maxY: number,
      ax: number,
      bx: number,
      cx: number,
      ay: number,
      by: number,
      cy: number,
      temp: number,
      rcp: number,
      tx: number,
      ty: number;

    const bezierCheck = (t: number) => {
      if (t >= 0 && t <= 1) {
        const p = pointAt(x1, y1, x2, y2, x3, y3, x4, y4, t);
        if (p.x < minX) {
          minX = p.x;
        } else if (p.x > maxX) {
          maxX = p.x;
        }
        if (p.y < minY) {
          minY = p.y;
        } else if (p.y > maxY) {
          maxY = p.y;
        }
      }
    };

    if (x1 < x4) {
      minX = x1;
      maxX = x4;
    } else {
      minX = x4;
      maxX = x1;
    }
    if (y1 < y4) {
      minY = y1;
      maxY = y4;
    } else {
      minY = y4;
      maxY = y1;
    }

    ax = 3 * (-x1 + 3 * x2 - 3 * x3 + x4);
    bx = 6 * (x1 - 2 * x2 + x3);
    cx = 3 * (-x1 + x2);

    if (fuzzyCompare(ax + 1, 1)) {
      if (!fuzzyCompare(bx + 1, 1)) bezierCheck(-cx / bx);
    } else {
      tx = bx * bx - 4 * ax * cx;
      if (tx >= 0) {
        temp = Math.sqrt(tx);
        rcp = 1 / (2 * ax);
        bezierCheck((-bx + temp) * rcp);
        bezierCheck((-bx - temp) * rcp);
      }
    }

    ay = 3 * (-y1 + 3 * y2 - 3 * y3 + y4);
    by = 6 * (y1 - 2 * y2 + y3);
    cy = 3 * (-y1 + y2);

    if (fuzzyCompare(ay + 1, 1)) {
      if (!fuzzyCompare(by + 1, 1)) bezierCheck(-cy / by);
    } else {
      ty = by * by - 4 * ay * cy;
      if (ty > 0) {
        temp = Math.sqrt(ty);
        rcp = 1 / (2 * ay);
        bezierCheck((-by + temp) * rcp);
        bezierCheck((-by - temp) * rcp);
      }
    }
    return new Rect(minX, minY, maxX - minX, maxY - minY);
  }
};

export class Path {
  commands;
  fill;
  stroke;
  strokeWidth;
  constructor(commands?, fill?, stroke?, strokeWidth?) {
    this.commands = commands !== undefined ? commands : [];
    this.fill = fill !== undefined ? fill : 'black';
    this.stroke = stroke !== undefined ? stroke : null;
    this.strokeWidth = strokeWidth !== undefined ? strokeWidth : 1;
  }
  moveTo(x: number, y: number) {
    this.commands.push({ type: MOVETO, x: x, y: y });
  }
  lineTo(x: number, y: number) {
    this.commands.push({ type: LINETO, x: x, y: y });
  }
  close() {
    this.commands.push(CLOSE_COMMAND);
  }
  isClosed() {
    if (this.commands.length === 0) return false;
    return this.commands[this.commands.length - 1].type === CLOSE;
  }
  contours() {
    let contours = [],
      currentContour = [];

    let cmd;
    for (let i = 0; i < this.commands.length; i += 1) {
      cmd = this.commands[i];
      if (cmd.type === MOVETO) {
        if (currentContour.length !== 0) contours.push(currentContour);
        currentContour = [cmd];
      } else {
        currentContour.push(cmd);
      }
    }
    if (currentContour.length !== 0) contours.push(currentContour);
    return contours;
  }
  bounds() {
    if (this.commands.length === 0) return new Rect(0, 0, 0, 0);

    let px: number,
      py: number,
      prev,
      right,
      bottom,
      minX = Number.MAX_VALUE,
      minY = Number.MAX_VALUE,
      maxX = -Number.MAX_VALUE,
      maxY = -Number.MAX_VALUE;

    let cmd;
    for (let i = 0; i < this.commands.length; i += 1) {
      cmd = this.commands[i];
      if (cmd.type === MOVETO || cmd.type === LINETO) {
        px = cmd.x;
        py = cmd.y;
        if (px < minX) minX = px;
        if (py < minY) minY = py;
        if (px > maxX) maxX = px;
        if (py > maxY) maxY = py;
        prev = cmd;
      } else if (cmd.type === CURVETO) {
        const r = bezier.extrema(
          prev.x,
          prev.y,
          cmd.x1,
          cmd.y1,
          cmd.x2,
          cmd.y2,
          cmd.x,
          cmd.y
        );
        right = r.x + r.width;
        bottom = r.y + r.height;
        if (r.x < minX) minX = r.x;
        if (right > maxX) maxX = right;
        if (r.y < minY) minY = r.y;
        if (bottom > maxY) maxY = bottom;
        prev = cmd;
      }
    }
    return new Rect(minX, minY, maxX - minX, maxY - minY);
  }
  point(t, segmentLengths?: number) {
    // Cache the segment lengths for performance.
    if (segmentLengths === undefined)
      segmentLengths = bezier.segmentLengths(this.commands, true, 10);
    return bezier.point(this, t, segmentLengths);
  }
  points(amount: number, options?) {
    const start = options && options.start !== undefined ? options.start : 0.0;
    const end = options && options.end !== undefined ? options.end : 1.0;
    // Otherwise bezier.point() will raise an error for empty paths.
    if (this.commands.length === 0) return [];
    amount = Math.round(amount);
    // "d" is the delta value for each point.
    // For closed paths (e.g. a circle), we don't want the last point, because it will equal the first point.
    // For open paths (e.g. a line) we do want the last point, so we use amount - 1.
    // E.g. If amount=4, and path is open, we want the point at t 0.0, 0.33, 0.66 and 1.0.
    // E.g. If amount=2, and path is open, we want the point at t 0.0 and 1.0.
    const d =
      options && options.closed
        ? amount > 1
          ? (end - start) / amount
          : end - start
        : amount > 1
        ? (end - start) / (amount - 1)
        : end - start;
    const pts = [];
    const segmentLengths = bezier.segmentLengths(this.commands, true, 10);
    for (let i = 0; i < amount; i += 1) {
      pts.push(this.point(start + d * i, segmentLengths));
    }
    return pts;
  }
  length(precision?: number) {
    if (precision === undefined) precision = 20;
    return bezier.length(this, precision);
  }
  resampleByAmount(points, perContour?) {
    const subPaths = perContour ? this.contours() : [this.commands];
    const p = new Path([], this.fill, this.stroke, this.strokeWidth);
    for (let j = 0; j < subPaths.length; j += 1) {
      const subPath = new Path(subPaths[j]);
      const options = subPath.isClosed() ? { closed: true } : {};
      const pts = subPath.points(points, options);
      for (let i = 0; i < pts.length; i += 1) {
        if (i === 0) {
          p.moveTo(pts[i].x, pts[i].y);
        } else {
          p.lineTo(pts[i].x, pts[i].y);
        }
      }
      if (subPath.isClosed()) p.close();
    }
    return p;
  }
  resampleByLength(segmentLength: number, options?) {
    options = options || {};
    const force = options.force || false;
    const subPaths = this.contours();
    let commands = [];
    if (!force) segmentLength = Math.max(segmentLength, 1);
    for (let i = 0; i < subPaths.length; i += 1) {
      const subPath = new Path(subPaths[i]);
      const contourLength = subPath.length();
      const amount = Math.ceil(contourLength / segmentLength);
      commands = commands.concat(subPath.resampleByAmount(amount).commands);
    }
    return new Path(commands, this.fill, this.stroke, this.strokeWidth);
  }
}

export const resampleByLength = (shape, maxLength) => {
  if (!shape) return null;
  return shape.resampleByLength(maxLength);
};
