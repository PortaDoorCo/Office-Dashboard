var makerjs = require('makerjs');
var _ = require('lodash');

function Door(wrap_width, face_width, thickness, panel_thickness) {
  var mm = makerjs.models;

  var line = makerjs.paths.Line;

  console.log({ panel_thickness });

  const drop_width = face_width + wrap_width;

  if (
    wrap_width > 0 &&
    face_width > 0 &&
    thickness > 0 &&
    panel_thickness > 0
  ) {
    return (this.models = {
      paths: {
        h1: new makerjs.paths.Line([0, 0], [wrap_width * 100, 0]),

        v1: new makerjs.paths.Line([0, 0], [0, thickness * 100]),
        h2: new makerjs.paths.Line(
          [0, thickness * 100],
          [face_width * 100, thickness * 100]
        ),
        v2: new makerjs.paths.Line(
          [wrap_width * 100, 0],
          [wrap_width * 100, panel_thickness * 100]
        ),
        h3: new makerjs.paths.Line(
          [wrap_width * 100, panel_thickness * 100],
          [face_width * 100, panel_thickness * 100]
        ),
        v3: new makerjs.paths.Line(
          [face_width * 100, panel_thickness * 100],
          [face_width * 100, thickness * 100]
        ),
      },
    });
  } else {
    return (this.models = {
      paths: {},
    });
  }
}

export default Door;
