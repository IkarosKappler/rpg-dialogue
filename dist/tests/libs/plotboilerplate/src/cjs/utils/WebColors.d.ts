/**
 * @author   Ikaros Kappler
 * @version  1.0.1
 * @date     2018-11-10
 * @modified 2020-10-23 Ported to Typescript.
 * @modified 2020-10-30 Exporting each color under its name globally.
 **/
import { Color } from "./datastructures/Color";
export declare const Red: Color;
export declare const Pink: Color;
export declare const Purple: Color;
export declare const DeepPurple: Color;
export declare const Indigo: Color;
export declare const Blue: Color;
export declare const LightBlue: Color;
export declare const Cyan: Color;
export declare const Teal: Color;
export declare const Green: Color;
export declare const LightGreen: Color;
/**
 * A set of beautiful web colors (I know, beauty is in the eye of the beholder).
 *
 * I found this color chart with 11 colors and think it is somewhat nice
 *    https://www.pinterest.com/pin/229965124706497134/
 *
 * @requires Color
 *
 */
export declare const WebColors: Array<Color>;
/**
 * A helper function to shuffle the colors into a new order.
 */
export declare const shuffleWebColors: (order: Array<number>) => Color[];
