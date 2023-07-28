/**
 * @author   Ikaros Kappler
 * @date     2018-04-07
 * @modified 2018-04-11 Using VoronoiCells now (was array before).
 * @modified 2020-08-15 Ported from vanilla JS to TypeScript.
 * @version  1.0.2
 **/
import { VoronoiCell } from "../datastructures/VoronoiCell";
/**
 * @classdesc Create the voronoi diagram from the given delaunay triangulation (they are dual graphs).
 *
 * @requires VoronoiCell
 * @requires Triangle
 */
export class delaunay2voronoi {
    constructor(pointList, triangles) {
        this.failedTriangleSets = [];
        this.hasErrors = false;
        this.pointList = pointList;
        this.triangles = triangles;
    }
    ;
    // +---------------------------------------------------------------------------------
    // | Convert the triangle set to the Voronoi diagram.
    // +-------------------------------
    build() {
        const voronoiDiagram = [];
        for (var p in this.pointList) {
            var point = this.pointList[p];
            // Find adjacent triangles for first point
            var adjacentSubset = [];
            for (var t in this.triangles) {
                if (this.triangles[t].a.equals(point) || this.triangles[t].b.equals(point) || this.triangles[t].c.equals(point))
                    adjacentSubset.push(this.triangles[t]);
            }
            var path = this.subsetToPath(adjacentSubset);
            if (path) // There may be errors
                voronoiDiagram.push(new VoronoiCell(path, point));
        }
        return voronoiDiagram;
    }
    ;
    // +---------------------------------------------------------------------------------
    // | Re-order a tiangle subset so the triangle define a single path.
    // |
    // | It is required that all passed triangles are connected to a
    // | path. Otherwise this function will RAISE AN EXCEPTION.
    // |
    // | The function has a failsafe recursive call for the case the first
    // | element in the array is inside the path (no border element).
    // +-------------------------------
    subsetToPath(triangleSet, startPosition, tryOnce) {
        if (triangleSet.length == 0)
            return [];
        if (typeof startPosition === 'undefined')
            startPosition = 0;
        let t = startPosition;
        const result = [triangleSet[t]];
        const visited = [t];
        let i = 0;
        while (result.length < triangleSet.length && i < triangleSet.length) {
            let u = (startPosition + i) % triangleSet.length;
            if (t != u && visited.indexOf(u) == -1 && triangleSet[t].isAdjacent(triangleSet[u])) {
                result.push(triangleSet[u]);
                visited.push(u);
                t = u;
                i = 0;
            }
            else {
                i++;
            }
        }
        // If not all triangles were used the passed set is NOT CIRCULAR.
        // But in this case the triangle at position t is at one end of the path :)
        // -> Restart with t.
        if (result.length < triangleSet.length) {
            if (tryOnce) {
                // Possibility A (try to fix this): split the triangle set into two arrays and restart with each.
                // Possibility B (no fix for this): throw an error and terminate.
                // Possibility C (temp solution): Store the error for later reporting and continue.
                // this.failedTriangleSets.push( triangleSet );
                this.failedTriangleSets = triangleSet;
                this.hasErrors = true;
                // throw "Error: this triangle set is not connected: " + JSON.stringify(triangleSet);
                return null;
            }
            else {
                // Triangle inside path found. Rearrange.
                return this.subsetToPath(triangleSet, t, true);
            }
        }
        else {
            return result;
        }
    }
    ;
}
; // END delaunay2voronoi
//# sourceMappingURL=delaunay2voronoi.js.map