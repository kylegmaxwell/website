function Project() {
    this.height = 600;
    this.width = 600;

    this.camera = null;
    this.renderer = null;
    this.canvas = null;
    this.scene = null;
    this.controls = null;

    this.makeRenderer = function () {
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize( this.width, this.height );
        this.renderer.setClearColor(0xF5F5F5);
    };

};
