var Blocks = {};

Blocks.lineMaterial = new THREE.LineBasicMaterial( { color: 0xAAAAAA, linewidth: 5 } );
Blocks.blockMaterial = new THREE.MeshBasicMaterial( { color: 0x00CED1 } );
Blocks.portMaterial = new THREE.MeshBasicMaterial( { color: 0x005052 } );
Blocks.selectedMaterial = new THREE.MeshBasicMaterial( { color: 0XFFAA00 } );

Blocks.makePlane = function (width, height) {
    var planeGeom = new THREE.PlaneBufferGeometry( width, height );
    return planeGeom;
};

Blocks.makeBlock = function (x, y) {
    var blockGeom = Blocks.makePlane(1,1);

    var blockObj = new THREE.Mesh( blockGeom, Blocks.blockMaterial );
    blockObj.userData["type"] = "block";
    blockObj.name = "block";

    var inObj = new THREE.Mesh( blockGeom, Blocks.portMaterial );
    inObj.scale.set(0.4,0.4,1);
    inObj.position.set(-0.5,0,-0.001);
    blockObj.children.push(inObj);
    inObj.parent = blockObj;
    inObj.userData["type"] = "inPort";
    inObj.name = "in";

    var outObj = new THREE.Mesh( blockGeom, Blocks.portMaterial );
    outObj.scale.set(0.4,0.4,1);
    outObj.position.set(0.5,0,-0.001);
    outObj.parent = blockObj;
    outObj.userData["type"] = "outPort";
    outObj.name = "out";

    blockObj.children.push(outObj);
    blockObj.position.set(x,y,0);

    return blockObj;
};



Blocks.connectBlocks = function () {
    // Create a private scope for these vectors so the constructor
    // only has to be called once per session
    var tmpVec1, tmpVec2;

    return function (block1, block2) {
        if (!tmpVec1) tmpVec1 = new THREE.Vector3(0,0,0);
        if (!tmpVec2) tmpVec2 = new THREE.Vector3(0,0,0);

        var outPort = block1.children[1];
        var inPort = block2.children[0];

        tmpVec1.copy(outPort.position);
        tmpVec1.x += 0.2;
        block1.localToWorld(tmpVec1);

        tmpVec2.copy(inPort.position);
        tmpVec2.x -= 0.2;
        block2.localToWorld(tmpVec2);

        return Blocks.makeLine(tmpVec1, tmpVec2);
    };
}();

Blocks.makeLine = function (vStart, vEnd) {
    var geometry = new THREE.Geometry();
    geometry.vertices.push(vStart);
    geometry.vertices.push(vEnd);
    var material = Blocks.lineMaterial;
    var mesh = new THREE.Line(geometry, material);
    return mesh;
}

Blocks.select = function (object, selected) {
    if (!object) return;
    if (selected) {
        object.material = Blocks.selectedMaterial;
    } else {
        object.material = Blocks.portMaterial;
    }
};

Blocks.makeScene = function() {
    var scene = new THREE.Scene();
    scene.add( Blocks.makeBlock(-1,0) );
    scene.add( Blocks.makeBlock(1,0) );
    return scene;
};
