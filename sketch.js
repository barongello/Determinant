let canvas;
let canvasWidth = 450;
let canvasHeight = 450;
let centerX;
let centerY;
let bgColor = 51;
let gridColor = 83;
let gridWeight = 2;
let gridStep = 25;
let gridLinesX;
let gridLinesY;
let gridScale = 1;
let edgeColor = 255;
let edgeWeight = 2;
let borderColor = 255;
let borderWeight = 1;
let fillColor = 0;
let pointSize = 8;
let selectedPoint = null;

function setup() {
	canvas = createCanvas(canvasWidth, canvasHeight);

	canvas.parent('sketch-holder');

	centerX = width / 2;
	centerY = height / 2;

	gridLinesX = (width / gridStep) / 2;
	gridLinesY = (height / gridStep) / 2;

	app.points.push(new Point(-1, -1));
	app.points.push(new Point(1, -1));
	app.points.push(new Point(1, 1));
	app.points.push(new Point(-1, 1));
}

function draw() {
	background(bgColor);

	translate(width / 2, height / 2);
	scale(gridScale);

	stroke(gridColor);

	strokeWeight(gridWeight * 2);
	line(0, -centerY, 0, centerY);
	line(-centerX, 0, centerX, 0);
	strokeWeight(gridWeight);

	for (let i = 1; i <= gridLinesX; ++i) {
		let x = i * gridStep;

		if (i % 5 === 0) {
			strokeWeight(gridWeight * 2);
		}

		line(x, -centerY, x, centerY);
		line(-x, -centerY, -x, centerY);

		if (i % 5 == 0) {
			strokeWeight(gridWeight);
		}
	}

	for (let i = 1; i <= gridLinesY; ++i) {
		let y = i * gridStep;

		if (i % 5 === 0) {
			strokeWeight(gridWeight * 2);
		}

		line(-centerX, y, centerX, y);
		line(-centerX, -y, centerX, -y);

		if (i % 5 === 0) {
			strokeWeight(gridWeight);
		}
	}

	strokeWeight(edgeWeight);
	stroke(edgeColor);
	fill(edgeColor, 100);

	beginShape();
	for (let point of app.points) {
		point.update();
		point.vertex();
	}
	endShape(CLOSE);

	strokeWeight(borderWeight);
	stroke(borderColor);
	fill(fillColor);

	let transforming = false;

	for (let point of app.points) {
		transforming |= (point.target !== null);

		let distanceOriginX = abs(point.pos.x * gridStep);
		let distanceOriginY = abs(point.pos.y * gridStep);

		if (distanceOriginX > centerX) {
			gridStep = max(gridStep - (distanceOriginX - centerX), 1);
			gridLinesX = (width / gridStep) / 2;
			gridLinesY = (height / gridStep) / 2;
		}
		
		if (distanceOriginY > centerY) {
			gridStep = max(gridStep - (distanceOriginY - centerY), 1);
			gridLinesX = (width / gridStep) / 2;
			gridLinesY = (height / gridStep) / 2;
		}

		point.draw();
	}

	if (!transforming && app.transforming) {
		app.endTransformation();
	}
}

function mousePressed(e) {
	if (e.target !== canvas.canvas) {
		return;
	}
	
	let click = createVector(mouseX, mouseY);

	for (let point of app.points) {
		let pointInCanvas = createVector(point.pos.x * gridStep + centerX, -point.pos.y * gridStep + centerY);
		let dist = p5.Vector.dist(click, pointInCanvas);

		if (dist <= pointSize / 2) {
			selectedPoint = point;

			break;
		}
	}
}

function mouseDragged(e) {
	if (selectedPoint === null || e.target !== canvas.canvas) {
		return;
	}

	selectedPoint.pos.x = (mouseX - centerX) / gridStep;
	selectedPoint.pos.y = -(mouseY - centerY) / gridStep;
}

function mouseReleased() {
	if (selectedPoint !== null) {
		selectedPoint = null;
	}
}
