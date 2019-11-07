/**
 * Bezier is a set of functions that create bezier curve on canvas
 */

function Bezier() {

    this.control_points = [];

    this.curve_mode = "Basic";
    this.continuity_mode = "C0";
    this.subdivide_level = 0;
    this.piecewise_degree = 1;

    /** ---------------------------------------------------------------------
     * Evaluate the Bezier curve at the given t parameter
     * @param t Given t parameter
     * @return Vector2D The location of point at given t parameter
     */
    this.evaluate = function (t) {
        if (t >= 0.0 && t <= 1.000005) {
            if (this.control_points.length > 1) {

                // You may find the following functions useful"
                //  - this.binomialCoefficient(m, i) computes "m choose i", aka: (m over i)
                //  - Math.pow(t, i) computes t raised to the power i

                var m = this.control_points.length - 1;
                var thisX = 0;
                var thisY = 0;

                for (var i = 0; i <= m; i++) {

                    var thisPoint = this.control_points[i];
                    var basisFunc = this.binomialCoefficient(m, i) * Math.pow(t, i) * Math.pow((1 - t), (m - i));

                    thisX += thisPoint.x * basisFunc;
                    thisY += thisPoint.y * basisFunc;
                }

                return new Vector2D(thisX, thisY);
            }
        }
    };

    /** ---------------------------------------------------------------------
     * Subdivide this Bezier curve into two curves
     * @param curve1 The first curve
     * @param curve2 The second curve
     */
    this.subdivide = function (curve1, curve2) {

        var m = this.control_points.length;
        var tempPts = this.control_points;

        while ((curve1.length + curve2.length) < 2 * m - 1) {

            curve1.push(tempPts[0]);
            curve2.unshift(tempPts[tempPts.length - 1]);
            var iterPts = [];

            if (tempPts.length === 1)
                iterPts.push(tempPts[0]);

            else
                for (var i = 0; i < tempPts.length - 1; i++) {

                    var x1 = tempPts[i].x;
                    var y1 = tempPts[i].y;
                    var x2 = tempPts[i + 1].x;
                    var y2 = tempPts[i + 1].y;

                    var nextX = 0.5 * x1 + 0.5 * x2;
                    var nextY = 0.5 * y1 + 0.5 * y2;

                    var nextPt = new Vector2D(nextX, nextY);

                    iterPts.push(nextPt);
                }

            tempPts = iterPts;
        }

    };


    /** ---------------------------------------------------------------------
     * Draw this Bezier curve
     */
    this.drawCurve = function () {
        if (this.control_points.length >= 2) {

            if (this.curve_mode == "Basic") {
                // Basic Mode
                //
                // Create a Bezier curve from the entire set of control points,
                // and then simply draw it to the screen

                // Do this by evaluating the curve at some finite number of t-values,
                // and drawing line segments between those points.
                // You may use the this.drawLine() function to do the actual
                // drawing of line segments.

                var evalPoint1 = new Vector2D(0, 0);
                var evalPoint2 = new Vector2D(0, 0);

                for (var t = 0.01; t <= 1.00005; t += 0.01) {

                    evalPoint1 = this.evaluate(t - 0.01);
                    evalPoint2 = this.evaluate(t);

                    this.drawLine(evalPoint1, evalPoint2);
                }
            }
            else if (this.curve_mode == "Subdivision") {
                // Subdivision mode
                //
                // Create a Bezier curve from the entire set of points,
                // then subdivide it the number of times indicated by the
                // this.subdivide_level variable.
                // The control polygons of the subdivided curves will converge
                // to the actual bezier curve, so we only need to draw their
                // control polygons.

                var newCurve = new Bezier();
                newCurve.control_points = this.control_points;
                var curvesArr = [];
                var len = 0;

                for (var j = 0; j < this.subdivide_level; j++) {

                    var curve1 = [];
                    var curve2 = [];
                    if (j === 0) {
                        newCurve.subdivide(curve1, curve2);
                        curvesArr.unshift(curve2);
                        curvesArr.unshift(curve1);
                        len = curvesArr.length;
                    }

                    else {
                        for (var i = 0; i < len; i++) {

                            curve1 = [];
                            curve2 = [];
                            newCurve.control_points = curvesArr[curvesArr.length - 1];
                            newCurve.subdivide(curve1, curve2);
                            curvesArr.unshift(curve2);
                            curvesArr.unshift(curve1);
                            curvesArr.pop();
                        }

                        len = curvesArr.length;
                    }
                    newCurve.control_points = [];
                }

                for (var i = 0; i < curvesArr.length; i++) {
                    for (var j = 0; j < curvesArr[i].length; j++) {
                        newCurve.control_points.push(curvesArr[i][j]);
                    }
                }

                for (var i = 0; i < newCurve.control_points.length - 1; i++) {
                    this.drawLine(newCurve.control_points[i], newCurve.control_points[i + 1]);

                }

            }
            else if (this.curve_mode == "Piecewise") {
                if (this.continuity_mode == "C0") {
                    // C0 continuity
                    //
                    // Each piecewise curve should be C0 continuous with adjacent
                    // curves, meaning they should share an endpoint.

                    var numCurves = (this.control_points.length - 1) / this.piecewise_degree;
                    var subCurvesArr = [];

                    for (var i = 0, k = 0; k < numCurves; i += this.piecewise_degree, k++) {

                        var subCurve = new Bezier();

                        for (var j = 0; j <= this.piecewise_degree; j++) {
                            if ((j + i) < this.control_points.length) {

                                subCurve.control_points.push(this.control_points[j + i]);
                            }
                        }

                        subCurvesArr.push(subCurve);
                    }

                    var evalPoint1 = new Vector2D(0, 0);
                    var evalPoint2 = new Vector2D(0, 0);

                    for (var i = 0; i < subCurvesArr.length; i++) {
                        for (var t = 0.01; t <= 1.00005; t += 0.01) {

                            evalPoint1 = subCurvesArr[i].evaluate(t - 0.01);
                            evalPoint2 = subCurvesArr[i].evaluate(t);

                            this.drawLine(evalPoint1, evalPoint2);
                        }
                    }


                }
                else if (this.continuity_mode == "C1") {
                    // C1 continuity
                    //
                    // Each piecewise curve should be C1 continuous with adjacent
                    // curves.  This means that not only must they share an endpoint,
                    // they must also have the same tangent at that endpoint.
                    // You will likely need to add additional control points to your
                    // Bezier curves in order to enforce the C1 property.
                    // These additional control points do not need to show up onscreen.

                    //@@@@@
                    // YOUR CODE HERE
                    //@@@@@

                }
            }
        }
    };


    /** ---------------------------------------------------------------------
     * Draw line segment between point p1 and p2
     */
    this.drawLine = function (p1, p2) {
        this.gl_operation.drawLine(p1, p2);
    };


    /** ---------------------------------------------------------------------
     * Draw control polygon
     */
    this.drawControlPolygon = function () {
        if (this.control_points.length >= 2) {
            for (var i = 0; i < this.control_points.length - 1; i++) {
                this.drawLine(this.control_points[i], this.control_points[i + 1]);
            }
        }
    };

    /** ---------------------------------------------------------------------
     * Draw control points
     */
    this.drawControlPoints = function () {
        this.gl_operation.drawPoints(this.control_points);
    };


    /** ---------------------------------------------------------------------
     * Drawing setup
     */
    this.drawSetup = function () {
        this.gl_operation.drawSetup();
    };


    /** ---------------------------------------------------------------------
     * Compute nCk ("n choose k")
     * WARNING:: Vulnerable to overflow when n is very large!
     */
    this.binomialCoefficient = function (n, k) {
        var result = -1;

        if (k >= 0 && n >= k) {
            result = 1;
            for (var i = 1; i <= k; i++) {
                result *= n - (k - i);
                result /= i;
            }
        }

        return result;
    };


    /** ---------------------------------------------------------------------
     * Setters
     */
    this.setGL = function (gl_operation) {
        this.gl_operation = gl_operation;
    };

    this.setCurveMode = function (curveMode) {
        this.curve_mode = curveMode;
    };

    this.setContinuityMode = function (continuityMode) {
        this.continuity_mode = continuityMode;
    };

    this.setSubdivisionLevel = function (subdivisionLevel) {
        this.subdivide_level = subdivisionLevel;
    };

    this.setPiecewiseDegree = function (piecewiseDegree) {
        this.piecewise_degree = piecewiseDegree;
    };


    /** ---------------------------------------------------------------------
     * Getters
     */
    this.getCurveMode = function () {
        return this.curve_mode;
    };

    this.getContinuityMode = function () {
        return this.continuity_mode;
    };

    this.getSubdivisionLevel = function () {
        return this.subdivide_level;
    };

    this.getPiecewiseDegree = function () {
        return this.piecewise_degree;
    };

    /** ---------------------------------------------------------------------
     * @return Array A list of control points
     */
    this.getControlPoints = function () {
        return this.control_points;
    };


    /** ---------------------------------------------------------------------
     * @return Vector2D chosen point
     */
    this.getControlPoint = function (idx) {
        return this.control_points[idx];
    };

    /** ---------------------------------------------------------------------
     * Add a new control point
     * @param new_point Vector2D A 2D vector that is added to control points
     */
    this.addControlPoint = function (new_point) {
        this.control_points.push(new_point);
    };

    /** ---------------------------------------------------------------------
     * Remove a control point
     * @param point Vector2D A 2D vector that is needed to be removed from control points
     */
    this.removeControlPoint = function (point) {
        var pos = this.points.indexOf(point);
        this.control_points.splice(pos, 1);
    };

    /** ---------------------------------------------------------------------
     * Remove all control points
     */
    this.clearControlPoints = function () {
        this.control_points = [];
    };

    /** ---------------------------------------------------------------------
     * Print all control points
     */
    this.printControlPoints = function () {
        this.control_points.forEach(element => {
            element.printVector();
        });
    };
}
