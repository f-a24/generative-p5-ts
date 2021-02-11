import p5 from 'p5';
import chroma from 'chroma-js';

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
