function Events(initProject) {

    this.project = initProject;
    this.inPort = null;
    this.outPort = null;
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();;

    this.render = function () {
        // requestAnimationFrame( render );
        this.project.renderer.render(this.project.scene, this.project.camera);
    };

    this.onMouseDown = function( event ) {
        if (event.button !== 0) return;

        // calculate mouse position in normalized device coordinates // (-1 to +1) for both components
        this.mouse.x = ( event.layerX / this.project.width ) * 2 - 1;
        this.mouse.y = - ( event.layerY / this.project.height ) * 2 + 1;
        this.raycaster.setFromCamera( this.mouse, this.project.camera );
        var intersects = this.raycaster.intersectObjects( this.project.scene.children, true );
        if (intersects.length >0) {
            var obj = intersects[0].object;
            this.handleSelect(obj);
        }
        else {
            var wp = new THREE.Vector3(0, 0, 0);
            wp.project(this.project.camera);
            var pos = new THREE.Vector3(this.mouse.x, this.mouse.y, wp.z);
            pos.unproject(this.project.camera);
            this.addBlock(pos);
        }
        this.render();
    };

    this.handleSelect = function(obj) {
        console.log(obj);
        Blocks.select(this.inPort, false);
        Blocks.select(this.outPort, false);

        if (obj.userData.type === "inPort") {
            this.inPort = obj;
        }
        if (obj.userData.type === "outPort") {
            this.outPort = obj;
        }
        if (obj.userData.type === "block") {
            if (this.outPort === null) {
                this.outPort = obj.children[1];
            } else if (this.inPort === null) {
                this.inPort = obj.children[0];
            }
        }

        Blocks.select(this.inPort, true);
        Blocks.select(this.outPort, true);

        if (this.inPort && this.outPort) {
            var block1 = this.outPort.parent;
            var block2 = this.inPort.parent;
            if (block1.uuid === block2.uuid) return;
            var line = Blocks.connectBlocks(block1, block2);
            Blocks.select(this.inPort, false);
            Blocks.select(this.outPort, false);
            this.inPort = null;
            this.outPort = null;
            this.addObject(line);
        }
    };

    this.addBlock = function (pos) {
        var block = Blocks.makeBlock(pos.x, pos.y);
        this.addObject(block);
    };

    this.addObject = function(object) {
        this.project.scene.add(object);
    };

    this.getCenterPos = function () {
        var wp = new THREE.Vector3(0, 0, 0);
        wp.project(this.project.camera);
        var pos = new THREE.Vector3(this.project.camera.x, this.project.camera.y, wp.z);
        pos.unproject(this.project.camera);
        return pos;
    }
    this.makeMoreBlocks = function() {
        var scene = this.project.scene;
        var size = Maths.computeBoundingBox(this.project.scene).size;
        var posList = Maths.circleList(20, 4.0);
        var centerPos = this.getCenterPos();
        // console.log(centerPos);
        posList.forEach( function (pos) {
            pos.add(centerPos);
            this.addBlock(pos);
        }.bind(this));
        this.render();
    };

    this.animatePositions = function () {
        //TODO
    };

    this.onKeyDown = function( event ) {
        console.log(event.which);
        switch(event.which) {
            case 66: // 'b'
                this.makeMoreBlocks();
                return;
            case 71: // 'g'
                this.animatePositions();
                return;
        }
    };
};
