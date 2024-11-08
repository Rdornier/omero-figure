/*
// Copyright (C) 2015-2024 University of Dundee & Open Microscopy Environment.
// All rights reserved.
//
// Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following
// conditions are met:
//
// 1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
//
// 2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following
// disclaimer in the documentation // and/or other materials provided with the distribution.
//
// 3. Neither the name of the copyright holder nor the names of its contributors may be used to endorse or promote products derived
// from this software without specific prior written permission.

// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING,
// BUT NOT LIMITED TO,
// THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL
// THE COPYRIGHT HOLDER OR CONTRIBUTORS
// BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
// PROCUREMENT OF SUBSTITUTE // GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
// ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT // LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING
// IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/



var Text = function Text(options) {
  this.manager = options.manager;
  this.paper = options.paper;
  this._x = options.x;
  this._y = options.y;
  this._color = options.color;
  this._fontSize = options.fontSize;
  this._text = options.text;
  this._strokeWidth = options.strokeWidth;
  this._textPosition = options.textPosition;

  this._id = options.id || this.manager.getRandomId();
  this._rotateText = options.rotateText || false;
  this._zoomFraction = options.zoom ? options.zoom / 100 : 1
  this._textAnchor = options.textAnchor || "start"
  this._rotation = options.rotation || 0;
  this._parentShapeCoords = options.parentShapeCoords || {x:0,y:0,width:0,height:0}

  this._selected = false;
  this._area = 0;

  this.element = this.paper.text();
  this.element.attr({"fill-opacity": 0.01, fill: "#fff"});

  this.drawShape();
};

Text.prototype.toJson = function toJson() {
  var rv = {
    type: "Text",
    x: this._x,
    y: this._y,
    fontSize: this._fontSize,
    color: this._color,
    text: this._text,
    textAnchor: this._textAnchor,
    rotation: this._rotation,
    textPosition: this._textPosition,
  };
  if (this._id) {
    rv.id = this._id;
  }
  return rv;
};

Text.prototype.intersectRegion = function intersectRegion(region) {
  return;
}

Text.prototype.offsetShape = function offsetShape(dx, dy) {
  /*this._x = this._x + dx;
  this._y = this._y + dy;
  this.drawShape();*/
};

/*Text.prototype.compareCoords = function compareCoords(json) {
  var selfJson = this.toJson(),
    match = true;
  if (json.type !== selfJson.type) {
    return false;
  }
  ["x", "y"].forEach(function (c) {
    if (Math.round(json[c]) !== Math.round(selfJson[c])) {
      match = false;
    }
  });
  return match;
};*/

// Useful for pasting json with an offset
/*Text.prototype.offsetCoords = function offsetCoords(json, dx, dy) {
  json.x = json.x + dx;
  json.y = json.y + dy;
  return json;
};*/


// handle start of drag by selecting this shape
// if not already selected
/*Text.prototype._handleMousedown = function _handleMousedown() {
  if (!this._selected) {
    this.manager.selectShapes([this]);
  }
};*/


Text.prototype.setStrokeColor = function setStrokeColor(color) {
  this._color = color;
  this.drawShape();
};

Text.prototype.getStrokeColor = function getStrokeColor() {
  return this._color;
};

Text.prototype.setStrokeWidth = function setStrokeWidth(width) {
  this._strokeWidth = width;
  this.drawShape()
};

Text.prototype.getStrokeWidth = function getStrokeWidth() {
  return this._strokeWidth;
};

Text.prototype.setFontSize = function setFontSize(fontSize) {
  this._fontSize = fontSize;
  this.drawShape();
};

Text.prototype.getFontSize = function getFontSize() {
  return this._fontSize;
};

Text.prototype.setText = function setText(text) {
  this._text = text;
  this.drawShape();
};

Text.prototype.getText = function getText() {
  return this._text;
};

Text.prototype.setTextPosition = function setTextPosition(textPosition) {
  this._textPosition = textPosition;
  this.drawShape();
};

Text.prototype.getTextPosition = function getTextPosition() {
  return this._textPosition;
};

Text.prototype.setZoom = function setZoom(zoom) {
    this._zoomFraction = zoom / 100;
    //this.drawShape();
};

Text.prototype.setTextRotation = function setTextRotation(rotation) {
  this._rotation = rotation;
  this.drawShape();
};

Text.prototype.setTextRotated = function setTextRotated(rotateText) {
  /* doesn't work properly for now
  if(rotateText){
    this.element.transform("r" + this._rotation);
  }else{
    this.element.transform("r" + (-this._rotation));
  }*/
};

Text.prototype.setParentShapeCoords = function setParentShapeCoords(coords){
  this._parentShapeCoords = coords;
  this.drawShape()
};

Text.prototype.destroy = function destroy() {
  this.element.remove();
};

Text.prototype.isSelected = function isSelected() {
  return this._selected;
};

Text.prototype.setSelected = function setSelected(selected) {
  this._selected = selected;
};

/*Text.prototype.intersectRegion = function intersectRegion(region) {
  var path = this.manager.regionToPath(region, this._zoomFraction * 100);
  var f = this._zoomFraction,
    x = parseInt(this._x * f, 10),
    y = parseInt(this._y * f, 10);

  return Raphael.isTextInsidePath(path, x, y);
};

Text.prototype.getPath = function getPath() {
  // Adapted from https://github.com/poilu/raphael-boolean
  var a = this.element.attrs,
    radiusX = a.radiusX,
    radiusY = a.radiusY,
    cornerTexts = [
      [a.x - radiusX, a.y - radiusY],
      [a.x + radiusX, a.y - radiusY],
      [a.x + radiusX, a.y + radiusY],
      [a.x - radiusX, a.y + radiusY],
    ],
    path = [];
  var radiusShift = [
    [
      [0, 1],
      [1, 0],
    ],
    [
      [-1, 0],
      [0, 1],
    ],
    [
      [0, -1],
      [-1, 0],
    ],
    [
      [1, 0],
      [0, -1],
    ],
  ];

  //iterate all corners
  for (var i = 0; i <= 3; i++) {
    //insert starting point
    if (i === 0) {
      path.push(["M", cornerTexts[0][0], cornerTexts[0][1] + radiusY]);
    }

    //insert "curveto" (radius factor .446 is taken from Inkscape)
    var c1 = [
      cornerTexts[i][0] + radiusShift[i][0][0] * radiusX * 0.446,
      cornerTexts[i][1] + radiusShift[i][0][1] * radiusY * 0.446,
    ];
    var c2 = [
      cornerTexts[i][0] + radiusShift[i][1][0] * radiusX * 0.446,
      cornerTexts[i][1] + radiusShift[i][1][1] * radiusY * 0.446,
    ];
    var p2 = [
      cornerTexts[i][0] + radiusShift[i][1][0] * radiusX,
      cornerTexts[i][1] + radiusShift[i][1][1] * radiusY,
    ];
    path.push(["C", c1[0], c1[1], c2[0], c2[1], p2[0], p2[1]]);
  }
  path.push(["Z"]);
  path = path.join(",").replace(/,?([achlmqrstvxz]),?/gi, "$1");

  if (this._rotation !== 0) {
    path = Raphael.transformPath(path, "r" + this._rotation);
  }
  return path;
};*/


Text.prototype.drawShape = function drawShape() {
  var color = this._color,
      fontSize = this._fontSize,
      text = this._text,
      dx = 0,
      dy = 0,
      textAnchor = "middle",
      textOffsetX = this._strokeWidth/2 + 6,
      textOffsetY = this._strokeWidth/2 + (fontSize > 12 ? fontSize/2 : 6) + 4,
      f = this._zoomFraction,
      x = this._parentShapeCoords.x * f,
      y = this._parentShapeCoords.y * f,
      w = this._parentShapeCoords.width * f,
      h = this._parentShapeCoords.height * f;

  switch(this._textPosition){
    case "bottom":
        dx = w/2;
        dy = h + textOffsetY;
        break;
    case "left":
        dx = -textOffsetX;
        dy = h/2;
        textAnchor = "end"
        break;
    case "right":
        dx = w + textOffsetX;
        dy = h/2;
        textAnchor = "start"
        break;
    case "top":
        dx = w/2;
        dy = -textOffsetY;
        break;
    case "topleft":
        dx = textOffsetX;
        dy = textOffsetY;
        textAnchor = "start"
        break;
    case "topright":
        dx = w - (textOffsetX);
        dy = textOffsetY;
        textAnchor = "end"
        break;
    case "bottomleft":
        dx = textOffsetX;
        dy = h - (textOffsetY);
        textAnchor = "start"
        break;
    case "bottomright":
        dx = w - (textOffsetX);
        dy = h - (textOffsetY);
        textAnchor = "end"
  }

  var rotatedCoords = this.applyTextRotation(x + w/2, y + h/2, x + dx, y + dy, this._rotation)

  this.element.attr({
    x: rotatedCoords.x,
    y: rotatedCoords.y,
    stroke: color,
    fill: color,
    "fill-opacity": 1,
    "font-size": fontSize,
    "text": text,
    "text-anchor": textAnchor
  });
  //this.element.transform("r" + this._rotation);
};

Text.prototype.applyTextRotation = function applyTextRotation(cx, cy, x, y, rotation){
  var dx = cx - x
  var dy = cy - y
  // distance of point from centre of rotation
  var h = Math.sqrt(dx * dx + dy * dy)
  // and the angle
  var angle1 = Math.atan2(dx, dy)

  // Add the rotation to the angle and calculate new
 // opposite and adjacent lengths from centre of rotation
  var angle2 = angle1 - rotation * Math.PI / 180
  var newo = Math.sin(angle2) * h
  var newa = Math.cos(angle2) * h
  // to give correct x and y within cropped panel
  x = cx - newo
  y = cy - newa
  return {x, y}
};


/*Text.prototype.setSelected = function setSelected(selected) {
  this._selected = !!selected;
  this.drawShape();
};*/

/*Text.prototype.createHandles = function createHandles() {
  // ---- Create Handles -----

  // NB: handleIds are used to calculate ellipse coords
  // so handledIds are scaled to MODEL coords, not zoomed.
  this._handleIds = this.getHandleCoords();

  var self = this,
    // map of centre-points for each handle
    handleAttrs = {
      stroke: "#4b80f9",
      fill: "#fff",
      cursor: "default",
      "fill-opacity": 1.0,
    };

  // draw handles - Can't drag handles to resize, but they are useful
  // simply to indicate that the Text is selected
  self.handles = this.paper.set();

  var hsize = this.handle_wh,
    hx,
    hy,
    handle;
  for (var key in this._handleIds) {
    hx = this._handleIds[key].x;
    hy = this._handleIds[key].y;
    handle = this.paper.rect(hx - hsize / 2, hy - hsize / 2, hsize, hsize);
    handle.attr({ cursor: "move" });
    handle.h_id = key;
    handle.line = self;
    self.handles.push(handle);
  }

  self.handles.attr(handleAttrs).hide(); // show on selection
};

Text.prototype.getHandleCoords = function getHandleCoords() {
  // Returns MODEL coordinates (not zoom coordinates)
  let margin = 2;

  var rot = Raphael.rad(this._rotation),
    x = this._x,
    y = this._y,
    radiusX = this._radiusX + margin,
    radiusY = this._radiusY + margin,
    startX = x - Math.cos(rot) * radiusX,
    startY = y - Math.sin(rot) * radiusX,
    endX = x + Math.cos(rot) * radiusX,
    endY = y + Math.sin(rot) * radiusX,
    leftX = x + Math.sin(rot) * radiusY,
    leftY = y - Math.cos(rot) * radiusY,
    rightX = x - Math.sin(rot) * radiusY,
    rightY = y + Math.cos(rot) * radiusY;

  return {
    start: { x: startX, y: startY },
    end: { x: endX, y: endY },
    left: { x: leftX, y: leftY },
    right: { x: rightX, y: rightY },
  };
};*/

// Class for creating Text.
var CreateText = function CreateText(options) {
  this.manager = options.manager

  this.text = new Text({
    manager: this.manager,
    paper: options.paper,
    zoom: options.zoom,
    text: options.text,
    x: options.x,
    y: options.y,
    color: options.color,
    fontSize: options.fontSize,
    textPosition: options.textPosition,
    strokeWidth: options.strokeWidth,
  //  rotation: options.rotation,
  })
  this.text.setSelected(true);
  this.manager.addShape(this.text);
};

CreateText.prototype.getShape = function getShape() {
  return this.text;
};

export { CreateText, Text };
