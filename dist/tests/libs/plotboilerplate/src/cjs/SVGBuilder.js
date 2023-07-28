"use strict";
/**
 * Todos:
 *  + use a Drawable interface
 *  + use a SVGSerializable interface
 *
 * @require Vertex
 *
 * @deprecated THIS CLASS IS DEPRECATED. Please use the new `drawutilssvg` instead.
 *
 * @author   Ikaros Kappler
 * @date     2018-12-04
 * @modified 2019-11-07 Added the 'Triangle' style class.
 * @modified 2019-11-13 Added the <?xml ...?> tag.
 * @modified 2020-03-25 Ported this class from vanilla-JS to Typescript.
 * @modified 2020-12-17 Added Circle and CircleSection style classes.
 * @modified 2021-01-26 DEPRECATION
 * @version  1.0.5
 **/
Object.defineProperty(exports, "__esModule", { value: true });
exports.SVGBuilder = void 0;
/**
 * @classdesc A default SVG builder.
 *
 * @requires SVGSerializable
 * @requires Vertex
 */
var SVGBuilder = /** @class */ (function () {
    /**
     * @constructor
     **/
    function SVGBuilder() {
        console.warn("THIS CLASS IS DEPRECATED. Please use the new 'drawutilssvg' instead.");
    }
    ;
    /**
     *  Builds the SVG code from the given list of drawables.
     *
     * @param {object[]} drawables - The drawable elements (should implement Drawable) to be converted (each must have a toSVGString-function).
     * @param {object}   options  - { canvasSize, zoom, offset }
     * @return {string}
     **/
    SVGBuilder.prototype.build = function (drawables, options) {
        var nl = '\n';
        var indent = '  ';
        var buffer = [];
        buffer.push('<?xml version="1.0" encoding="UTF-8"?>' + nl);
        buffer.push('<svg width="' + options.canvasSize.width + '" height="' + options.canvasSize.height + '"');
        buffer.push(' viewBox="');
        buffer.push('0');
        buffer.push(' ');
        buffer.push('0');
        buffer.push(' ');
        buffer.push(options.canvasSize.width.toString());
        buffer.push(' ');
        buffer.push(options.canvasSize.height.toString());
        buffer.push('"');
        buffer.push(' xmlns="http://www.w3.org/2000/svg">' + nl);
        buffer.push(indent + '<defs>' + nl);
        buffer.push(indent + '<style>' + nl);
        buffer.push(indent + indent + ' .Vertex { fill : blue; stroke : none; } ' + nl);
        buffer.push(indent + indent + ' .Triangle { fill : none; stroke : turquoise; stroke-width : 1px; } ' + nl);
        buffer.push(indent + indent + ' .Polygon { fill : none; stroke : green; stroke-width : 2px; } ' + nl);
        buffer.push(indent + indent + ' .BezierPath { fill : none; stroke : blue; stroke-width : 2px; } ' + nl);
        buffer.push(indent + indent + ' .VEllipse { fill : none; stroke : black; stroke-width : 1px; } ' + nl);
        buffer.push(indent + indent + ' .Line { fill : none; stroke : purple; stroke-width : 1px; } ' + nl);
        buffer.push(indent + indent + ' .Circle { fill : none; stroke : purple; stroke-width : 1px; } ' + nl);
        buffer.push(indent + indent + ' .CircleSector { fill : none; stroke : purple; stroke-width : 1px; } ' + nl);
        buffer.push(indent + '</style>' + nl);
        buffer.push(indent + '</defs>' + nl);
        buffer.push(indent + '<g class="main-g"');
        if (options.zoom || options.offset) {
            buffer.push(' transform="');
            if (options.zoom)
                buffer.push('scale(' + options.zoom.x + ',' + options.zoom.y + ')');
            if (options.offset)
                buffer.push(' translate(' + options.offset.x + ',' + options.offset.y + ')');
            buffer.push('"');
        }
        buffer.push('>' + nl);
        for (var i in drawables) {
            var d = drawables[i];
            if (typeof d.toSVGString == 'function') {
                buffer.push(indent + indent);
                buffer.push(d.toSVGString({ 'className': d.className }));
                buffer.push(nl);
            }
            else {
                console.warn('Unrecognized drawable type has no toSVGString()-function. Ignoring: ' + d.className);
            }
        }
        buffer.push(indent + '</g>' + nl);
        buffer.push('</svg>' + nl);
        return buffer.join('');
    };
    ;
    return SVGBuilder;
}());
exports.SVGBuilder = SVGBuilder;
//# sourceMappingURL=SVGBuilder.js.map