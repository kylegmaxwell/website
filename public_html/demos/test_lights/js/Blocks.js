var Blocks = {};

Blocks.lineMaterial = new THREE.LineBasicMaterial( { color: 0xAAAAAA, linewidth: 2 } );
Blocks.blockMaterial = new THREE.MeshBasicMaterial( { color: 0x00CED1 } );
Blocks.portMaterial = new THREE.MeshBasicMaterial( { color: 0x005052 } );
Blocks.selectedMaterial = new THREE.MeshBasicMaterial( { color: 0XFFAA00 } );

Blocks.makePlane = function (width, height) {
    var planeGeom = new THREE.PlaneBufferGeometry( width, height );
    return planeGeom;
};
Blocks.makeSphere = function (rad) {
    var sphereGeom = new THREE.SphereBufferGeometry( rad, 12, 12 );
    return sphereGeom;
};
Blocks.makeScene = function() {
    var scene = new THREE.Scene();
    // scene.add(Blocks.makeSphere());

    var geometry = new THREE.SphereBufferGeometry( 5.0 );
    var material = new THREE.MeshPhongMaterial({"color":0x448844});
    var mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);


    var light = new THREE.DirectionalLight();
    scene.add(light);
    // scene.add( Blocks.makeBlock(-2,0) );
    // scene.add( Blocks.makeBlock(2,0) );
    return scene;
};
