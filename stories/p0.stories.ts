import p5 from 'p5';
export default { title: 'P0：Start' };

declare let globalP5Instance: p5;

export const P_0_0_0_01 = () => {
  if (!!globalP5Instance) globalP5Instance.remove();
  globalP5Instance = new p5((p: p5) => {
    p.setup = () => {
      p.createCanvas(720, 720);
      p.noFill();
      console.log('Hello');
    };

    p.draw = () => {
      p.background(255);
      p.ellipse(p.mouseX, p.mouseY, 40, 40);
    };
  });
  return '';
};
