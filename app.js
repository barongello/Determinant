var app = new Vue({
    el: '#app',
    data: {
        transforming: false,
        points: [],
        matrix: {
            a: 1,
            b: 0,
            c: 0,
            d: 1
        },
        startArea: null,
        endArea: null
    },
    methods: {
        calcDeterminant: function () {
            if (this.matrix.a === '' || this.matrix.b === '' || this.matrix.c === '' || this.matrix.d === '') {
                return 'Incomplete';
            }

            return this.matrix.a * this.matrix.d - this.matrix.b * this.matrix.c;
        },
        calcPolygonArea: function () {
            if (this.points.length < 3) {
                return 'Incomplete';
            }

            let area = 0;
            let p2 = this.points[this.points.length - 1];

            for (let p1 of this.points)
            {
                area += (p2.pos.x + p1.pos.x) * (p2.pos.y - p1.pos.y);
                p2 = p1;
            }
        
            return abs(area / 2);
        },
        addPoint: function () {
            this.points.push(new Point(0, 0));
        },
        remPoint: function (index) {
            if (index < 0 || index >= this.points.length || this.points.length === 0) {
                return;
            }

            this.points.splice(index, 1);
        },
        applyTransformation: function () {
            if (this.transforming) {
                return;
            }

            this.startArea = this.calcPolygonArea();
            this.endArea = null;

            for (let point of this.points) {
                let target = createVector();

                target.x = this.matrix.a * point.pos.x + this.matrix.b * point.pos.y;
                target.y = this.matrix.c * point.pos.x + this.matrix.d * point.pos.y;

                point.target = target;
            }

            this.transforming = true;
        },
        endTransformation: function () {
            if (!this.transforming) {
                return;
            }

            this.endArea = this.calcPolygonArea();

            this.transforming = false;
        }
    }
});
