"use strict";
/**
 * @classdesc A circular interval set.
 *
 * @author   Ikaros Kappler
 * @date     2020-10-02
 * @modified 2020-10-18 Ported to Typescript from vanilla JS.
 * @modified 2020-10-22 Added the removeAt funcion.
 * @version  1.0.1
 * @name CircularIntervalSet
 **/
Object.defineProperty(exports, "__esModule", { value: true });
exports.CircularIntervalSet = void 0;
var CircularIntervalSet = /** @class */ (function () {
    /**
     * Create a new CircularIntervalSet with the given lower and upperBound (start and end).
     *
     * The intervals inside lower and upper bound will initially be added to this set (full range).
     *
     * @param {number} start
     * @param {number} end
     * @method clear
     * @memberof CircularIntervalSet
     **/
    function CircularIntervalSet(start, end) {
        this.start = start;
        this.end = end;
        this.intervals = [[start, end]];
    }
    ;
    /**
     * Clear this set (will be empty after this operation).
     *
     * @method clear
     * @instance
     * @memberof CircularIntervalSet
     * @return {void}
     **/
    CircularIntervalSet.prototype.clear = function () {
        this.intervals = [];
    };
    ;
    /**
     * Remove the interval at given index.
     *
     * @param {number} index
     * @method removeAt
     * @instance
     * @memberof CircularIntervalSet
     * @return {void}
     **/
    // Todo: remove? (not in use any more?)
    CircularIntervalSet.prototype.removeAt = function (index) {
        if (index < 0 || index >= this.intervals.length)
            return;
        this.intervals.splice(index, 1);
    };
    ;
    /**
     * Intersect all sub intervalls with the given range (must be inside bounds).
     *
     * @param {number} start
     * @param {number} end
     * @method intersect
     * @instance
     * @memberof CircularIntervalSet
     * @return {void}
     **/
    CircularIntervalSet.prototype.intersect = function (start, end) {
        for (var i = 0; i < this.intervals.length;) {
            if (start <= end) {
                if ((this.intervals[i][0] >= end || this.intervals[i][1] <= start)) {
                    // Current interval is fully outside range.
                    // REMOVE
                    this.intervals.splice(i, 1);
                }
                else if (this.intervals[i][0] >= start && this.intervals[i][1] <= end) {
                    // Current interval is fully inside.
                    // KEEP
                    i++;
                }
                else if (this.intervals[i][0] <= start && this.intervals[i][1] >= end) {
                    // Desired range lies inside current interval.
                    // CUT OFF LEFT AND RIGHT.
                    this.intervals.splice(i, 1, [start, end]);
                    i++;
                }
                else if (this.intervals[i][0] <= start && this.intervals[i][1] < end) {
                    // Right end is inside range.
                    // CUT OFF LEFT.
                    this.intervals[i][0] = start;
                    i++;
                }
                else if (this.intervals[i][0] > start && this.intervals[i][1] >= end) {
                    // LEFT end is inside range.
                    // CUT OFF RIGHT.
                    this.intervals[i][1] = end;
                    i++;
                }
                else {
                    // NOOP
                    i++;
                }
            }
            else {
                // start > end
                if (this.intervals[i][0] >= end && this.intervals[i][1] <= start) {
                    // Current interval is fully outside range.
                    // REMOVE
                    this.intervals.splice(i, 1);
                }
                else if (this.intervals[i][0] >= start) {
                    // Full inside (right range).
                    // Keep.
                    i++;
                }
                else if (this.intervals[i][1] <= end) {
                    // Full inside (left range).
                    // Keep.
                    i++;
                }
                else if (this.intervals[i][0] >= end && this.intervals[i][1] > start) {
                    // Right part inside.
                    // Cut off left part.
                    this.intervals.splice(i, 1, [start, this.intervals[i][1]]);
                    i++;
                }
                else if (this.intervals[i][0] <= end && this.intervals[i][1] < start) {
                    // Left part inside.
                    // Cut off right part.
                    this.intervals.splice(i, 1, [this.intervals[i][0], end]);
                    i++;
                }
                else if (this.intervals[i][0] <= end && this.intervals[i][1] >= start) {
                    // Start and end inside, inner part is not.
                    // Cut into two.
                    this.intervals.splice(i, 1, [this.intervals[i][0], end], [start, this.intervals[i][1]]);
                    i += 2;
                }
                else {
                    // NOOP
                    i++;
                }
            }
        }
    };
    ;
    /**
     * Convert this set to a human readable string.
     *
     * @method toString
     * @instance
     * @memberof CircularIntervalSet
     * @return {string}
     **/
    CircularIntervalSet.prototype.toString = function () {
        return JSON.stringify(this.intervals);
    };
    ;
    return CircularIntervalSet;
}());
exports.CircularIntervalSet = CircularIntervalSet;
//# sourceMappingURL=CircularIntervalSet.js.map