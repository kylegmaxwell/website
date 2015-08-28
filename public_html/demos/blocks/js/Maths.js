var Maths = {};

Maths.circleList = function (count, r) {
  var theta = 0;
  var thetaInc = (Math.PI*2)/(count);
  var i=0;
  var result = [];
  while(i < count) {
    var x = r*Math.cos(theta);
    var y = r*Math.sin(theta);
    theta += thetaInc;
    // r += 0.1;
    result.push(new THREE.Vector2(x, y));
    // console.log(x, y);
    i++;
  }
  return result;

};

/**
 * Compute the bounding box of the object, including all of it's children.
 * @param  {THREE.Object3D} objectRoot The object to size up.
 * @return {Bounding Box}        List of two THREE.Vector3's showing max min
 */
Maths.computeBoundingBox = function (objectRoot, verbose) {
  // TODO File a bug that bboxHelper.box does not have any values.
  // var bboxHelper = new THREE.BoundingBoxHelper(objectRoot);
  // console.log(bboxHelper.box.min);
  // console.log(bboxHelper.box.max);

  var bbMax = new THREE.Vector3(-Infinity, -Infinity, -Infinity);
  var bbMin = new THREE.Vector3(Infinity, Infinity, Infinity);
  var tmp = new THREE.Vector3(0,0,0);

  var elementIndex = 0;
  var foundBufferGeometry = false;
  var foundRegularGeometry = false;
  objectRoot.traverse( function (element) {
    if (element.matrixWorldNeedsUpdate) {
      // Tell three.js to update the matrix from the position attributes.
      element.updateMatrixWorld(true);
    }

    // Use vertices to compute bounds
    if (element.type === "Mesh" && element.visible===true) {

      if (element.geometry instanceof THREE.BufferGeometry) {
        foundBufferGeometry = true;
        var positions = element.geometry.attributes.position.array;
        var i = 0;
        while (i < positions.length) {
          tmp.set(positions[i],positions[i+1],positions[i+2]);
          tmp.applyMatrix4(element.matrix);
          bbMin.min(tmp);
          bbMax.max(tmp);
          i+=3;
        }
      }
      else { // regular (non buffer) geometry
        foundRegularGeometry = true;
        var vertices = element.geometry.vertices;
        vertices.forEach( function (vert) {
          vert.applyMatrix4(element.matrix);
          bbMin.min(vert);
          bbMax.max(vert);
        });
      }

    }
    elementIndex++;
  });
  if (foundBufferGeometry && verbose) {
    console.log("Found buffer geometry");
  }
  if (foundRegularGeometry && verbose) {
    console.log("Found regular geometry");
  }
  // Compute size from bounds
  tmp.copy(bbMax);
  tmp.sub(bbMin);
  var size = Math.max(Math.max(tmp.x,tmp.y),tmp.z);
  if (verbose) {
    console.log("Maximum axis aligned length:",size);
  }
  return {"min":bbMin, "max":bbMax, "size":size};
};