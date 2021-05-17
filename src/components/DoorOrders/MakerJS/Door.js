var makerjs = require('makerjs');
var _ = require('lodash');

var DoorInner = (function () {
  function DoorInner(width, height, leftStile, rightStile, topRail, bottomRail) {
    var line = makerjs.paths.Line;
    var ls = Math.min(leftStile, 0);
    var rs = Math.min(rightStile, 0);
    var tr = Math.min(topRail, 0);
    var br = Math.min(bottomRail, 0);

    this.paths = {
      bottom: new line([ls, -0], [width - br, -0]),
      top: new line([ls, height], [width - rs, height]),
      left: new line([-0, ls], [-0, height - br]),
      right: new line([width + 0, tr], [width + 0, height - br])
    };
  }
  return DoorInner;
})();

var midRails = (function () {
  function midRails(width, height, leftStile, rightStile, topRail, bottomRail, panelsH, horizontalMidRailSize) {

    var line = makerjs.paths.Line;
    var ls = Math.min(leftStile, 0);
    var rs = Math.min(rightStile, 0);

    const mr = Array.from(Array(panelsH).keys()).slice(1).map(i => {
      let a = new line([ls, ((height / panelsH) * (i)) + (horizontalMidRailSize / 2)], [width - rs, ((height / panelsH) * (i)) + (horizontalMidRailSize / 2)]);
      let b = new line([ls, ((height / panelsH) * (i)) - (horizontalMidRailSize / 2)], [width - rs, ((height / panelsH) * (i)) - (horizontalMidRailSize / 2)]);

      return [a, b];
    });

    let m = _.flatten(mr);

    this.paths = m;


  }
  return midRails;
})();

var unevenMidRails = (function () {
  function unevenMidRails(
    width,
    height,
    leftStile,
    rightStile,
    topRail,
    bottomRail,
    panelsH,
    horizontalMidRailSize,
    unevenInput1,
    unevenInput2,
    unevenInput3,
    unevenInput4,
    unevenInput5,
  ) {

    var line = makerjs.paths.Line;
    var ls = Math.min(leftStile, 0);
    var rs = Math.min(rightStile, 0);

    let mr;
    let m;

    let y1;
    let y2;
    let y3;
    let y4;
    let y5;

    switch (panelsH) {
      case 2:

        y1 = ((height+topRail) - unevenInput1);

        mr = Array.from(Array(panelsH).keys()).slice(1).map(i => {
          let a = new line([ls, y1], [width - rs, y1]);
          let b = new line([ls, y1 - horizontalMidRailSize], [width - rs, y1 - horizontalMidRailSize]);
          return [a, b];
        });

        m = _.flatten(mr);
        break;
      case 3:
        y1 = ((height+topRail) - unevenInput1);
        y2 = y1 - unevenInput2;

        mr = Array.from(Array(panelsH).keys()).slice(1).map(i => {
          let a = new line([ls, y1], [width - rs, y1]);
          let b = new line([ls, y1 - horizontalMidRailSize], [width - rs, y1 - horizontalMidRailSize]);

          let c = new line([ls, y2], [width - rs, y2]);
          let d = new line([ls, y2 - horizontalMidRailSize], [width - rs, y2 - horizontalMidRailSize]);

          return [a, b, c, d];
        });

        m = _.flatten(mr);
        break;
      case 4:
        y1 = ((height+topRail) - unevenInput1);
        y2 = y1 - unevenInput2;
        y3 = y2 - unevenInput3;

        mr = Array.from(Array(panelsH).keys()).slice(1).map(i => {
          let a = new line([ls, y1], [width - rs, y1]);
          let b = new line([ls, y1 - horizontalMidRailSize], [width - rs, y1 - horizontalMidRailSize]);

          let c = new line([ls, y2], [width - rs, y2]);
          let d = new line([ls, y2 - horizontalMidRailSize], [width - rs, y2 - horizontalMidRailSize]);

          let e = new line([ls, y3], [width - rs, y3]);
          let f = new line([ls, y3 - horizontalMidRailSize], [width - rs, y3 - horizontalMidRailSize]);

          return [a, b, c, d, e, f];
        });

        m = _.flatten(mr);
        break;
      case 5:
        y1 = ((height+topRail) - unevenInput1);
        y2 = y1 - unevenInput2;
        y3 = y2 - unevenInput3;
        y4 = y3 - unevenInput4;

        mr = Array.from(Array(panelsH).keys()).slice(1).map(i => {
          let a = new line([ls, y1], [width - rs, y1]);
          let b = new line([ls, y1 - horizontalMidRailSize], [width - rs, y1 - horizontalMidRailSize]);

          let c = new line([ls, y2], [width - rs, y2]);
          let d = new line([ls, y2 - horizontalMidRailSize], [width - rs, y2 - horizontalMidRailSize]);

          let e = new line([ls, y3], [width - rs, y3]);
          let f = new line([ls, y3 - horizontalMidRailSize], [width - rs, y3 - horizontalMidRailSize]);

          let g = new line([ls, y4], [width - rs, y4]);
          let h = new line([ls, y4 - horizontalMidRailSize], [width - rs, y4 - horizontalMidRailSize]);

          return [a, b, c, d, e, f, g, h];
        });

        m = _.flatten(mr);
        break;
      case 6:
        y1 = ((height+topRail) - unevenInput1);
        y2 = y1 - unevenInput2;
        y3 = y2 - unevenInput3;
        y4 = y3 - unevenInput4;
        y5 = y4 - unevenInput5;

        mr = Array.from(Array(panelsH).keys()).slice(1).map(i => {
          let a = new line([ls, y1], [width - rs, y1]);
          let b = new line([ls, y1 - horizontalMidRailSize], [width - rs, y1 - horizontalMidRailSize]);

          let c = new line([ls, y2], [width - rs, y2]);
          let d = new line([ls, y2 - horizontalMidRailSize], [width - rs, y2 - horizontalMidRailSize]);

          let e = new line([ls, y3], [width - rs, y3]);
          let f = new line([ls, y3 - horizontalMidRailSize], [width - rs, y3 - horizontalMidRailSize]);

          let g = new line([ls, y4], [width - rs, y4]);
          let h = new line([ls, y4 - horizontalMidRailSize], [width - rs, y4 - horizontalMidRailSize]);

          let j = new line([ls, y5], [width - rs, y5]);
          let k = new line([ls, y5 - horizontalMidRailSize], [width - rs, y5 - horizontalMidRailSize]);

          return [a, b, c, d, e, f, g, h, j, k];
        });

        m = _.flatten(mr);
        break;
      default:
        mr = Array.from(Array(panelsH).keys()).slice(1).map(i => {
          let a = new line([ls, height - unevenInput1], [width - rs, height - unevenInput1]);
          let b = new line([ls, (height - unevenInput1) - horizontalMidRailSize], [width - rs, (height - unevenInput1) - horizontalMidRailSize]);
          return [a, b];
        });

        m = _.flatten(mr);
    }

    this.paths = m;

  }
  return unevenMidRails;
})();

var vRails = (function () {
  function vRails(width, height, leftStile, rightStile, topRail, bottomRail, panelsH, panelsW, horizontalMidRailSize, verticalMidRailSize) {

    var line = makerjs.paths.Line;
    var br = Math.min(bottomRail, 0);

    let vr;
    let v;

    switch (panelsH) {
      case 1:
        vr = Array.from(Array(panelsW).keys()).slice(1).map(i => {
          let a = new line([((width / panelsW) * (i)) + (verticalMidRailSize / 2), br], [((width / panelsW) * (i)) + (verticalMidRailSize / 2), height - br]);
          let b = new line([((width / panelsW) * (i)) - (verticalMidRailSize / 2), br], [((width / panelsW) * (i)) - (verticalMidRailSize / 2), height - br]);
          return [a, b];
        });
        v = _.flatten(vr);
        break;
      case 2:
        vr = Array.from(Array(panelsW).keys()).slice(1).map(i => {

          let x1 = ((width / panelsW) * (i)) + (verticalMidRailSize / 2);
          let x2 = ((width / panelsW) * (i)) - (verticalMidRailSize / 2);

          let y1 = height - (height / parseInt(panelsH)) - (horizontalMidRailSize / 2);
          let y2 = height - (height / parseInt(panelsH)) + (horizontalMidRailSize / 2);


          let a = new line([x1, br], [x1, y1]);
          let b = new line([x2, br], [x2, y1]);
          let c = new line([x1, y2], [x1, height]);
          let d = new line([x2, y2], [x2, height]);
          return [a, b, c, d];
        });

        v = _.flatten(vr);
        break;
      case 3:
        vr = Array.from(Array(panelsW).keys()).slice(1).map(i => {

          let x1 = ((width / panelsW) * (i)) + (verticalMidRailSize / 2);
          let x2 = ((width / panelsW) * (i)) - (verticalMidRailSize / 2);

          let y1 = height - (height / parseInt(panelsH)) - (horizontalMidRailSize / 2);
          let y2 = height - (height / parseInt(panelsH)) + (horizontalMidRailSize / 2);

          let y3 = (height / parseInt(panelsH)) - (horizontalMidRailSize / 2);
          let y4 = (height / parseInt(panelsH)) + (horizontalMidRailSize / 2);


          let a = new line([x1, y2], [x1, height]);
          let b = new line([x2, y2], [x2, height]);
          let c = new line([x1, y4], [x1, y1]);
          let d = new line([x2, y4], [x2, y1]);
          let e = new line([x1, y3], [x1, br]);
          let f = new line([x2, y3], [x2, br]);
          return [a, b, c, d, e, f];
        });

        v = _.flatten(vr);
        break;
      case 4:
        vr = Array.from(Array(panelsW).keys()).slice(1).map(i => {

          let x1 = ((width / panelsW) * (i)) + (verticalMidRailSize / 2);
          let x2 = ((width / panelsW) * (i)) - (verticalMidRailSize / 2);

          let y1 = height - (height / parseInt(panelsH)) - (horizontalMidRailSize / 2);
          let y2 = height - (height / parseInt(panelsH)) + (horizontalMidRailSize / 2);

          let y3 = (height / parseInt(panelsH)) - (horizontalMidRailSize / 2);
          let y4 = ((height / parseInt(panelsH)) * 2) + (horizontalMidRailSize / 2);

          let y5 = ((height / parseInt(panelsH)) * 2) - (horizontalMidRailSize / 2);
          let y6 = (height / parseInt(panelsH)) + (horizontalMidRailSize / 2);


          let a = new line([x1, y2], [x1, height]);
          let b = new line([x2, y2], [x2, height]);

          let c = new line([x1, y3], [x1, br]);
          let d = new line([x2, y3], [x2, br]);

          let e = new line([x1, y4], [x1, y1]);
          let f = new line([x2, y4], [x2, y1]);

          let g = new line([x1, y5], [x1, y6]);
          let h = new line([x2, y5], [x2, y6]);


          return [a, b, c, d, e, f, g, h];
        });

        v = _.flatten(vr);
        break;
      case 5:
        vr = Array.from(Array(panelsW).keys()).slice(1).map(i => {

          let x1 = ((width / panelsW) * (i)) + (verticalMidRailSize / 2);
          let x2 = ((width / panelsW) * (i)) - (verticalMidRailSize / 2);

          let y1 = height - (height / parseInt(panelsH)) - (horizontalMidRailSize / 2);
          let y2 = height - (height / parseInt(panelsH)) + (horizontalMidRailSize / 2);

          let y3 = (height / parseInt(panelsH)) - (horizontalMidRailSize / 2);
          let y4 = ((height / parseInt(panelsH)) * 2) + (horizontalMidRailSize / 2);

          let y5 = ((height / parseInt(panelsH)) * 2) - (horizontalMidRailSize / 2);
          let y6 = (height / parseInt(panelsH)) + (horizontalMidRailSize / 2);

          let y7 = ((height / parseInt(panelsH)) * 3) - (horizontalMidRailSize / 2);
          let y8 = ((height / parseInt(panelsH)) * 3) + (horizontalMidRailSize / 2);


          let a = new line([x1, y2], [x1, height]);
          let b = new line([x2, y2], [x2, height]);

          let c = new line([x1, y3], [x1, br]);
          let d = new line([x2, y3], [x2, br]);

          let e = new line([x1, y4], [x1, y7]);
          let f = new line([x2, y4], [x2, y7]);

          let g = new line([x1, y5], [x1, y6]);
          let h = new line([x2, y5], [x2, y6]);

          let k = new line([x1, y8], [x1, y1]);
          let l = new line([x2, y8], [x2, y1]);


          return [a, b, c, d, e, f, g, h, k, l];
        });

        v = _.flatten(vr);
        break;
      case 6:
        v = [];
        break;
      default:
        vr = Array.from(Array(panelsW).keys()).slice(1).map(i => {
          let a = new line([((width / panelsW) * (i)) + (verticalMidRailSize / 2), br], [((width / panelsW) * (i)) + (verticalMidRailSize / 2), height - br]);
          let b = new line([((width / panelsW) * (i)) - (verticalMidRailSize / 2), br], [((width / panelsW) * (i)) - (verticalMidRailSize / 2), height - br]);
          return [a, b];
        });
        v = _.flatten(vr);
    }


    this.paths = v;

  }
  return vRails;
})();


function Door(
  width,
  height,
  leftStile,
  rightStile,
  topRail,
  bottomRail,
  panelsH,
  panelsW,
  horizontalMidRailSize,
  verticalMidRailSize,
  unevenCheck,
  unevenInput1,
  unevenInput2,
  unevenInput3,
  unevenInput4,
  unevenInput5,
  solid) {
  var mm = makerjs.models;

  this.models = {
    outer: new mm.Rectangle(width + (leftStile + rightStile), height + (topRail + bottomRail))
  };
  if (!solid) {
    this.models['inner'] = new DoorInner(width, height, leftStile, rightStile, topRail, bottomRail);
    if (parseInt(panelsH) > 1) {
      if (unevenCheck) {
        this.models['unevenMidRails'] = new unevenMidRails(
          width,
          height,
          leftStile,
          rightStile,
          topRail,
          bottomRail,
          panelsH,
          horizontalMidRailSize,
          unevenInput1,
          unevenInput2,
          unevenInput3,
          unevenInput4,
          unevenInput5,
        );
      } else {
        this.models['midRails'] = new midRails(width, height, leftStile, rightStile, topRail, bottomRail, panelsH, horizontalMidRailSize);
      }

    }
    if (parseInt(panelsW) > 1) {
      this.models['vRails'] = new vRails(width, height, leftStile, rightStile, topRail, bottomRail, panelsH, panelsW, horizontalMidRailSize, verticalMidRailSize);
    }
  }
  this.models['outer'].origin = [-leftStile, -bottomRail];
}



export default Door;
