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
        // Deal with THREE.js asyhc matrix update
        obj.traverse( function (element) {
            if (element.matrixWorldNeedsUpdate) {
                // Tell three.js to update the matrix from the position attributes.
                element.updateMatrixWorld(true);
            }
        });

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
            var line = null;
            if (block1.uuid !== block2.uuid) {
                line = Blocks.connectBlocks(block1, block2);
            }
            Blocks.select(this.inPort, false);
            Blocks.select(this.outPort, false);
            this.inPort = null;
            this.outPort = null;
            if (line) {
                this.addObject(line);
            }
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
    this.makeMoreBlocks = function(count) {
        var scene = this.project.scene;
        var size = Maths.computeBoundingBox(this.project.scene).size;
        var radius = this.project.camera.position.z * 0.5;
        radius = Math.max(1.0, radius);
        var posList = Maths.circleList(count, radius);
        var centerPos = this.getCenterPos();
        posList.forEach( function (pos) {
            pos.add(centerPos);
            this.addBlock(pos);
        }.bind(this));
        this.render();
    };

    this.animatePositions = function () {
        var children = this.project.scene.children;
        var delta = new THREE.Vector3(1,0,0);
        children.forEach(function (child) {
            if (child.userData.type === "block") {

                // TODO also try curl noise
                // this.randomizeVec(delta);
                this.noiseVec(delta);

                child.position.add(delta);
                child.updateMatrixWorld(true);
            }

        }.bind(this));

        var tmpVec1 = new THREE.Vector3(0,0,0);
        var tmpVec2 = new THREE.Vector3(0,0,0);

        children.forEach(function (child) {
            if (child.userData.type === "line") {
                var block1 = child.userData.block1;
                var block2 = child.userData.block2;

                Blocks.getBlockPos(block1, tmpVec1, false);
                Blocks.getBlockPos(block2, tmpVec2, true);
                child.geometry.vertices[0].copy(tmpVec1);
                child.geometry.vertices[1].copy(tmpVec2);
                child.geometry.verticesNeedUpdate = true;
            }

        }.bind(this));

        this.render();

    };

    this.randomizeVec = function(vec) {
        // vec.set(0,1,0);
        vec.x = Math.random()-0.5;
        vec.y = Math.random()-0.5;
        vec.z = Math.random()-0.5;
    };

    this.noiseVec = function(vec) {
        var freq = 2;
        var valueX = noise.simplex2(vec.x * freq, vec.y * freq);
        var valueY = noise.simplex2(vec.x * freq + 1234.567, vec.y * freq + 54.321);
        vec.x = valueX;
        vec.y = valueY;
    };

    this.randInt = function(count) {
        var randFloat = Math.random();
        var randInt = Math.floor(randFloat * (count));
        return randInt;
    };

    this.randomConnection = function (count) {
        var itr = 0;
        var children = this.project.scene.children;

        while( itr < count) {
            var i = this.randInt(children.length);
            var j = this.randInt(children.length);
            this.handleSelect(children[i]);
            this.handleSelect(children[j]);
            itr++;
        }
        this.render();
    };

    this.onKeyDown = function( event ) {
        // console.log(event.which);
        switch(event.which) {
            case 66: // 'b'
                this.makeMoreBlocks(20);
                return;
            case 67: // 'c'
                this.randomConnection(5);
                return;
            case 71: // 'g'
                this.animatePositions();
                return;
        }
    };
};
