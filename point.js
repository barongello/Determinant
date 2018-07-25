class Point {
    constructor (x, y) {
        this.pos = createVector(x, y);
        this.target = null;
    }

    update() {
        if (!this.target) {
            return;
        }

        let dist = p5.Vector.dist(this.target, this.pos);

        if (dist < 0.01) {
            this.pos = this.target;
            this.target = null;

            return;
        }

        let desired = p5.Vector.sub(this.target, this.pos);

        desired.setMag(0.05 * dist);

        this.pos.add(desired);
    }

    vertex() {
        vertex(this.pos.x * gridStep, -this.pos.y * gridStep);
    }

    draw() {
		ellipse(this.pos.x * gridStep, -this.pos.y * gridStep, pointSize, pointSize);
    }
}
