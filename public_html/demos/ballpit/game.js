'use strict';

function Game(context, height, width) {
    this.context = context;
    this.height = height;
    this.width = width;
    this.world = this.createWorld();
    this.createGround();
    // this.createPoly( 100, 100, [[0, 0], [10, 30], [-10, 30]], true);
    // this.createPoly(150, 150, [[0, 0], [10, 30], [-10, 30]], true);
    this.createBox(0, this.height*0.5, 10, this.height);
    this.createBox(this.width, this.height*0.5, 10, this.height);

}

Game.prototype.createWorld = function () {
    var worldAABB = new b2AABB();
    worldAABB.minVertex.Set(0,0);
    worldAABB.maxVertex.Set(this.width, this.height);
    var gravity = new b2Vec2(0, 300);
    var doSleep = true;
    return new b2World(worldAABB, gravity, doSleep);
}

Game.prototype.createGround = function () {
    var groundSd = new b2BoxDef();
    groundSd.extents.Set(this.width, 50);
    groundSd.restitution = 0.2;
    var groundBd = new b2BodyDef();
    groundBd.AddShape(groundSd);
    groundBd.position.Set(0, this.height+40);
    this.world.CreateBody(groundBd);
}

Game.prototype.createPoly = function (x, y, points, fixed) {
    var polySd = new b2PolyDef();
    if (!fixed) polySd.density = 1.0;
    polySd.vertexCount = points.length;
    for (var i = 0; i < points.length; i++) {
        polySd.vertices[i].Set(points[i][0], points[i][1]);
    }
    var polyBd = new b2BodyDef();
    polyBd.AddShape(polySd);
    polyBd.position.Set(x,y);
    this.world.CreateBody(polyBd)
};

Game.prototype.createBox = function (x, y, width, height, fixed) {
    if (typeof(fixed) == 'undefined') fixed = true;
    var boxSd = new b2BoxDef();
    if (!fixed) boxSd.density = 1.0;
    boxSd.extents.Set(width, height);
    var boxBd = new b2BodyDef();
    boxBd.AddShape(boxSd);
    boxBd.position.Set(x,y);
    this.world.CreateBody(boxBd)
}

// Create a circle body
Game.prototype.createCircle = function (x, y) {
    var circleSd = new b2CircleDef();
    circleSd.density = 1.0;
    circleSd.radius = 10;
    circleSd.restitution = 0.5;
    circleSd.friction = 0.5;
    var circleBd = new b2BodyDef();
    circleBd.AddShape(circleSd);
    circleBd.position.Set(x,y);
    var circleBody = this.world.CreateBody(circleBd);
}

Game.prototype.step = function (dt, iter) {
    this.world.Step(dt, iter);
}

Game.prototype.draw = function () {
    for (var j = this.world.m_jointList; j; j = j.m_next) {
        this.drawJoint(j);
    }
    this.context.beginPath();
    for (var b = this.world.m_bodyList; b; b = b.m_next) {
        for (var s = b.GetShapeList(); s != null; s = s.GetNext()) {
            this.drawShape(s);
        }
    }
    this.context.stroke();
}

Game.prototype.drawJoint = function (joint) {
    var b1 = joint.m_body1;
    var b2 = joint.m_body2;
    var x1 = b1.m_position;
    var x2 = b2.m_position;
    var p1 = joint.GetAnchor1();
    var p2 = joint.GetAnchor2();
    this.context.strokeStyle = '#00eeee';
    this.context.beginPath();
    switch (joint.m_type) {
    case b2Joint.e_distanceJoint:
        this.context.moveTo(p1.x, p1.y);
        this.context.lineTo(p2.x, p2.y);
        break;

    case b2Joint.e_pulleyJoint:
        // TODO
        break;

    default:
        if (b1 == this.world.m_groundBody) {
            this.context.moveTo(p1.x, p1.y);
            this.context.lineTo(x2.x, x2.y);
        }
        else if (b2 == this.world.m_groundBody) {
            this.context.moveTo(p1.x, p1.y);
            this.context.lineTo(x1.x, x1.y);
        }
        else {
            this.context.moveTo(x1.x, x1.y);
            this.context.lineTo(p1.x, p1.y);
            this.context.lineTo(x2.x, x2.y);
            this.context.lineTo(p2.x, p2.y);
        }
        break;
    }
    this.context.stroke();
}
Game.prototype.drawShape = function(shape) {
    this.context.strokeStyle = '#ffffff';
    switch (shape.m_type) {
    case b2Shape.e_circleShape:
        {
            var circle = shape;
            var pos = circle.m_position;
            var r = circle.m_radius;
            var segments = 16.0;
            var theta = 0.0;
            var dtheta = 2.0 * Math.PI / segments;
            // draw circle
            this.context.moveTo(pos.x + r, pos.y);
            for (var i = 0; i < segments; i++) {
                var d = new b2Vec2(r * Math.cos(theta), r * Math.sin(theta));
                var v = b2Math.AddVV(pos, d);
                this.context.lineTo(v.x, v.y);
                theta += dtheta;
            }
            this.context.lineTo(pos.x + r, pos.y);

            // draw radius
            this.context.moveTo(pos.x, pos.y);
            var ax = circle.m_R.col1;
            var pos2 = new b2Vec2(pos.x + r * ax.x, pos.y + r * ax.y);
            this.context.lineTo(pos2.x, pos2.y);
        }
        break;
    case b2Shape.e_polyShape:
        {
            var poly = shape;
            var tV = b2Math.AddVV(poly.m_position, b2Math.b2MulMV(poly.m_R, poly.m_vertices[0]));
            this.context.moveTo(tV.x, tV.y);
            for (var i = 0; i < poly.m_vertexCount; i++) {
                var v = b2Math.AddVV(poly.m_position, b2Math.b2MulMV(poly.m_R, poly.m_vertices[i]));
                this.context.lineTo(v.x, v.y);
            }
            this.context.lineTo(tV.x, tV.y);
        }
        break;
    }
}

