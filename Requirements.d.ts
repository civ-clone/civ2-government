import { Requirement } from '@civ-clone/core-requirement/Requirement';
/**
 * The advance a player needs before it may choose each of Civilization II's governments (OpenCiv2 `src/auto/civ.cpp`
 * `civ_can_choose_government`, richardpenman/civ2@49f26ec): one rule each, made by `Rules/Governments/availability`.
 * Despotism needs none. A government is available by any rule that allows it, so each entry is one way to it: the
 * Statue of Liberty's way (any government) is a rule of the Wonders' own.
 */
export declare const availability: Requirement[];
export default availability;
