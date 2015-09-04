var Scene = {};

Scene.lineMaterial = new THREE.LineBasicMaterial( { color: 0xAAAAAA, linewidth: 2 } );
Scene.blockMaterial = new THREE.MeshBasicMaterial( { color: 0x00CED1 } );
Scene.portMaterial = new THREE.MeshBasicMaterial( { color: 0x005052 } );
Scene.selectedMaterial = new THREE.MeshBasicMaterial( { color: 0XFFAA00 } );

Scene.makePlane = function (width, height) {
    var planeGeom = new THREE.PlaneBufferGeometry( width, height );
    return planeGeom;
};

Scene.makeSphere = function (rad) {
    var sphereGeom = new THREE.SphereBufferGeometry( rad, 12, 12 );
    return sphereGeom;
};

Scene.makeScene = function() {
    var scene = new THREE.Scene();

    var geometry = new THREE.SphereBufferGeometry( 5.0 );
    var green = new THREE.MeshBasicMaterial({"color":0x448844});
    var red = new THREE.MeshBasicMaterial({"color":0xAA4444});

    var child1 = new THREE.Mesh(geometry, green);
    var child2 = new THREE.Mesh(geometry, green);
    var child3 = new THREE.Mesh(geometry, green);

    var parent = new THREE.Object3D();
    parent.add(child1);
    child1.position.x -= 15;
    parent.add(child2);
    parent.add(child3);
    child3.position.x += 15;

    // Set a material on the parent and apply to all children
    parent.material = red;
    parent.traverse(function (elem) {
        elem.material = this.material;
    }.bind(parent));

    child2.material = green;

    scene.add(parent);

    // http://stemkoski.github.io/Three.js/Shapes.html
    var darkMaterial = new THREE.MeshBasicMaterial( { color: 0xFCFCFC } );
    var wireframeMaterial = new THREE.MeshBasicMaterial( { color: 0x000000, wireframe: true, transparent: true } );
    var multiMaterial = [ darkMaterial, wireframeMaterial ];
    var child4 = THREE.SceneUtils.createMultiMaterialObject(geometry,multiMaterial );
    // var child4 = new THREE.Mesh(geometry, wireframeMaterial);
    child4.position.y -= 15;
    scene.add(child4);

    var light = new THREE.DirectionalLight();
    scene.add(light);

    return scene;
};
