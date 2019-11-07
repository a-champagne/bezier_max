/**
 * vector2D is a set of functions that perform standard operations 
 * on 2D vectors - (x, y), which are stored as 2-element arrays.
 */

function Vector2D (dx, dy) {
    
    this.x = 0.0;
    this.y = 0.0;

    if (arguments.length >= 1) this.x = dx;
    if (arguments.length >= 2) this.y = dy;

    /** ---------------------------------------------------------------------
     *  A new 2D vector that has the same values as the input argument
     */
    this.createFrom = function (from) {
        this.x = from.x;
        this.y = from.y;
    };

    /** ---------------------------------------------------------------------
     * Copy a 2D vector into another 2D vector
     * @param to Vector2D A 2D vector that you want changed
     */
    this.copy = function (to) {
        to.x = this.x;
        to.y = this.y;
    };

    /** ---------------------------------------------------------------------
     * Set the components of a 2D vector
     * @param dx Number The change in x of the vector
     * @param dy Number The change in y of the vector
     */
    this.set = function (dx, dy) {
        this.x = dx;
        this.y = dy;
    };

    /** ---------------------------------------------------------------------
     * Calculate the length of a vector
     * @return Number The length of a vector
     */
    this.len = function () {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    };

    /** ---------------------------------------------------------------------
     * Make a vector have a length of 1
     * @return Vector2D The input vector normalized to unit length. Or null if the vector is zero length
     */
    this.normalize = function () {
        var length, percent;

        length = this.len(v);
        if (Math.abs(length) < 0.0000001) {
            return null; // Invalid vector
        }

        percent = 1.0 / length;
        var new_x = this.x * percent;
        var new_y = this.y * percent;
        
        var new_vector = new Vector2D(new_x, new_y);
        return new_vector;
    };

    /** ---------------------------------------------------------------------
     * Add two vectors:  result = v0 + v1
     * @param v1 Vector2D A 2D vector
     * @return Vector2D The result of adding v and v1
     */
    this.add = function (v1) {
        var new_x = this.x + v1.x;
        var new_y = this.y + v1.y;

        var new_vector = new Vector2D(new_x, new_y);
        return new_vector;
    };

    /** ---------------------------------------------------------------------
     * Subtract two vectors:  result = v0 - v1
     * @param v1 Vector2D A 2D vector
     * @return Vector2D The result of subtracting v1 from v0
     */
    this.subtract = function (v1) {
        var new_x = this.x - v1.x;
        var new_y = this.y - v1.y;
        
        var new_vector = new Vector2D(new_x, new_y);
        return new_vector;
    };

	/** ---------------------------------------------------------------------
     * Scale a vector:  result = s * v0
     * @param s Number A scale factor
     * @return Vector2D The result
     */
    this.multiply = function (s) {
        var new_x = this.x * s;
        var new_y = this.y * s;

        var new_vector = new Vector2D(new_x, new_y);
        return new_vector;
    };
	
    /** ---------------------------------------------------------------------
     * Calculate the dot product of 2 vectors
     * @param v1 Float32Array A 2D vector
     * @return Number Float32Array The dot product of v0 and v1
     */
    this.dotProduct = function (v1) {
        var dot_product = this.x * v1.x + this.y * v1.y;
        return dot_product;
    };

    /** ---------------------------------------------------------------------
     * Determine if 2 vectors are equal
     * @param v1 Float32Array A 2D vector
     * @return Boolean if 2 vectors are equal
     */
    this.equal = function (v1) {
        var is_equal = (this.x == v1.x && this.y == v1.y);
        return is_equal;
    };

    /** ---------------------------------------------------------------------
     * Print a vector on the console
     * @param name String A description of the vector to be printed
     * @param v Float32Array A 2D vector
     */
    this.printVector = function () {
        var maximum, order, digits;

        maximum = Math.max(this.x, this.y);
        order = Math.floor(Math.log(maximum) / Math.LN10 + 0.000000001);
        digits = (order <= 0) ? 5 : (order > 5) ? 0 : (5 - order);

        console.log("Vector2D: " + this.x.toFixed(digits) + " "
                                 + this.y.toFixed(digits));
    };
}
 