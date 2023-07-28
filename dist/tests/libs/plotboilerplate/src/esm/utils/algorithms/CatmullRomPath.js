/**
 * @date     2020-04-15
 * @author   Converted to a class by Ikaros Kappler
 * @modified 2020-08-19 Ported this class from vanilla JS to TypeScript.
 * @version  1.0.1
 *
 * @file CatmullRomPath
 * @public
 **/
import { CubicBezierCurve } from "../../CubicBezierCurve";
import { Vertex } from "../../Vertex";
/**
 * @classdesc Compute the Catmull-Rom spline path from a sequence of points (vertices).
 *
 * For comparison to the HobbyCurve I wanted to add a Catmull-Rom path (to show that the
 * HobbyCurve is smoother).
 *
 * This demo implementation was inspired by this Codepen by Blake Bowen
 * https://codepen.io/osublake/pen/BowJed
 *
 * @requires CubicBezierCurve
 * @requires Vertex
 */
export class CatmullRomPath {
    /**
     * @constructor
     * @name CatmullRomPath
     * @param {Array<Vertex>=} vertices? - An optional array of vertices to initialize the path with.
     **/
    constructor(vertices) {
        this.vertices = vertices ? vertices : [];
    }
    ;
    /**
     * Add a new point to the end of the vertex sequence.
     *
     * @name addPoint
     * @memberof CatmullRomPath
     * @instance
     * @param {Vertex} p - The vertex (point) to add.
     **/
    addPoint(p) {
        this.vertices.push(p);
    }
    ;
    /**
     * Generate a sequence of cubic Bézier curves from the point set.
     *
     * @name generateCurve
     * @memberof CatmullRomPath
     * @instance
     * @param {boolean=} circular - Specify if the path should be closed.
     * @param {number=1} tension - (default=0) An optional tension parameter.
     * @return Array<CubicBezierCurve>
     **/
    generateCurve(circular, tension) {
        if (typeof tension === 'undefined')
            tension = 1.0;
        if (circular)
            return this.solveClosed(tension);
        else
            return this.solveOpen(tension);
    }
    ;
    solveOpen(k) {
        var curves = [];
        if (k == null || typeof k === 'undefined')
            k = 1;
        var size = this.vertices.length;
        var last = size - 2;
        for (var i = 0; i < size - 1; i++) {
            var p0 = i ? this.vertices[i - 1] : this.vertices[0];
            var p1 = this.vertices[i + 0];
            var p2 = this.vertices[i + 1];
            var p3 = i !== last ? this.vertices[i + 2] : p2;
            var cp1 = new Vertex(p1.x + (p2.x - p0.x) / 6 * k, p1.y + (p2.y - p0.y) / 6 * k);
            var cp2 = new Vertex(p2.x - (p3.x - p1.x) / 6 * k, p2.y - (p3.y - p1.y) / 6 * k);
            curves.push(new CubicBezierCurve(p1, p2, cp1, cp2));
        }
        return curves;
    }
    ; // END solveOpen
    solveClosed(k) {
        var curves = [];
        if (k == null || typeof k === 'undefined')
            k = 1;
        var size = this.vertices.length;
        var last = size - 1;
        for (var i = 0; i < size; i++) {
            var p0 = i ? this.vertices[i - 1] : this.vertices[last];
            var p1 = this.vertices[i + 0];
            var p2 = this.vertices[(i + 1) % size];
            var p3 = this.vertices[(i + 2) % size];
            var cp1 = new Vertex(p1.x + (p2.x - p0.x) / 6 * k, p1.y + (p2.y - p0.y) / 6 * k);
            var cp2 = new Vertex(p2.x - (p3.x - p1.x) / 6 * k, p2.y - (p3.y - p1.y) / 6 * k);
            curves.push(new CubicBezierCurve(p1, p2, cp1, cp2));
        }
        return curves;
    }
    ; // END solveClosed
}
; // END class
//# sourceMappingURL=CatmullRomPath.js.map