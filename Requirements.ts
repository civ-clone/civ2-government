import {
  Communism,
  Democracy,
  Despotism,
  Fundamentalism,
  Monarchy,
  Republic,
} from './Governments';
import { Requirement, table } from '@civ-clone/core-requirement/Requirement';
import CommunismAdvance from '@civ-clone/base-science-advance-communism/Communism';
import DemocracyAdvance from '@civ-clone/base-science-advance-democracy/Democracy';
import FundamentalismAdvance from '@civ-clone/base-science-advance-fundamentalism/Fundamentalism';
import MonarchyAdvance from '@civ-clone/base-science-advance-monarchy/Monarchy';
import TheRepublic from '@civ-clone/base-science-advance-therepublic/TheRepublic';

/**
 * The advance a player needs before it may choose each of Civilization II's governments (OpenCiv2 `src/auto/civ.cpp`
 * `civ_can_choose_government`, richardpenman/civ2@49f26ec): one rule each, made by `Rules/Governments/availability`.
 * Despotism needs none. A government is available by any rule that allows it, so each entry is one way to it: the
 * Statue of Liberty's way (any government) is a rule of the Wonders' own.
 */
export const availability: Requirement[] = table(
  'civ2-government:governments/availability',
  'requires',
  [
    [Despotism],
    [Monarchy, MonarchyAdvance],
    [Communism, CommunismAdvance],
    [Fundamentalism, FundamentalismAdvance],
    [Republic, TheRepublic],
    [Democracy, DemocracyAdvance],
  ]
);

export default availability;
