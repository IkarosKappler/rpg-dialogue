/**
 * @classdesc The pentagon tile from the Girih set.
 *
 * @requires Bounds
 * @requires GirihTile
 * @requires Polygon
 * @requires TileType
 * @requires Vertex
 *
 * @author Ikaros Kappler
 * @date 2013-11-27
 * @modified 2014-04-05 Ikaros Kappler (member array outerTilePolygons added).
 * @modified 2015-03-19 Ikaros Kappler (added toSVG()).
 * @modified 2020-10-31 Refactored to work with PlotBoilerplate.
 * @modified 2020-11-13 Ported from vanilla JS to TypeScript.
 * @version 2.0.1-alpha
 * @file GirihPentagon
 * @public
 **/
import { GirihTile } from "./GirihTile";
import { Vertex } from "../../Vertex";
export declare class GirihPentagon extends GirihTile {
    /**
     * @constructor
     * @extends GirihTile
     * @name GirihPentagon
     * @param {Vertex} position
     * @param {number} edgeLength
     */
    constructor(position: Vertex, edgeLength?: number);
    /**
     * @override
     */
    clone(): GirihTile;
    private _buildInnerPolygons;
    private _buildOuterPolygons;
}
