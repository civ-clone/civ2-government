"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = exports.giveRegardless = void 0;
const Engine_1 = require("@civ-clone/core-engine/Engine");
const PlayerWorldRegistry_1 = require("@civ-clone/core-player-world/PlayerWorldRegistry");
const CityBuildRegistry_1 = require("@civ-clone/core-city-build/CityBuildRegistry");
const CityRegistry_1 = require("@civ-clone/core-city/CityRegistry");
const ClientRegistry_1 = require("@civ-clone/core-client/ClientRegistry");
const InteractionRegistry_1 = require("@civ-clone/core-diplomacy/InteractionRegistry");
const PlayerGovernmentRegistry_1 = require("@civ-clone/core-government/PlayerGovernmentRegistry");
const changed_1 = require("@civ-clone/base-government-change/lib/changed");
const Governments_1 = require("../../Governments");
const Changed_1 = require("@civ-clone/core-government/Rules/Changed");
const BuildItem_1 = require("@civ-clone/core-city-build/BuildItem");
const Criterion_1 = require("@civ-clone/core-rule/Criterion");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const Fanatic_1 = require("@civ-clone/base-unit-fanatic/Fanatic");
const High_1 = require("@civ-clone/core-rule/Priorities/High");
const Low_1 = require("@civ-clone/core-rule/Priorities/Low");
const Rifleman_1 = require("@civ-clone/base-unit-rifleman/Rifleman");
const TurnStart_1 = require("@civ-clone/core-player/Rules/TurnStart");
const relations_1 = require("@civ-clone/civ2-diplomacy/lib/relations");
const isHuman_1 = require("@civ-clone/base-difficulty/lib/isHuman");
/**
 * Sets `cityBuild` to `Item` as `CityBuild#build` does, but without asking whether the city may choose it, which
 *  `build` refuses: the original sets the production whether or not it could be chosen. Everything else `build` does is
 *  kept: the cost, the item cleared, the last queue move's dropped items forgotten, and the `ProductionChanged` rules
 *  asked from what the build had at the turn's start, so a change back later in the turn is still measured from there.
 *  core-city-build has no public way to do this.
 */
const giveRegardless = (cityBuild, Item) => {
    var _a, _b;
    const build = cityBuild, previous = (_b = (_a = cityBuild.building()) === null || _a === void 0 ? void 0 : _a.item()) !== null && _b !== void 0 ? _b : null;
    build._building = new BuildItem_1.default(Item, cityBuild.city(), build._ruleRegistry);
    build._cleared = null;
    cityBuild.cost().set(build._building.cost().value());
    build._queueDropped = [];
    build.productionChanged(previous, Item);
};
exports.giveRegardless = giveRegardless;
const getRules = (engine = Engine_1.instance, playerWorldRegistry = PlayerWorldRegistry_1.instance, interactionRegistry = InteractionRegistry_1.instance, clientRegistry = ClientRegistry_1.instance, cityRegistry = CityRegistry_1.instance, cityBuildRegistry = CityBuildRegistry_1.instance, playerGovernmentRegistry = PlayerGovernmentRegistry_1.instance) => {
    // The government each player was last seen to have, so the rules below act only on an actual change, as
    //  `civ_set_government` does (`if (government != old_government)`). Not saved: it is filled in at each turn's start
    //  for any player it doesn't have yet (one from a loaded game), so setting a loaded player's government again isn't a
    //  change.
    const lastSeen = new WeakMap(), isChange = (player, government) => lastSeen.get(player) !== government.constructor;
    return [
        // Entering Anarchy, or any change of government by a computer player, ends every other player's vendetta against
        //  it (OpenCiv2 `src/auto/civ.cpp` `civ_set_government`, richardpenman/civ2@e39fe7b).
        new Changed_1.default('civ2-government:player/government-changed/clear-vendettas', new High_1.default(), new Criterion_1.default(isChange), new Criterion_1.default((player, government) => government instanceof Governments_1.Anarchy || !(0, isHuman_1.default)(player, clientRegistry)), new Effect_1.default((player) => (0, relations_1.clearVendettasAgainst)(player, interactionRegistry))),
        // A person's cities building Fanatics switch to Riflemen under any government but Fundamentalism, keeping their
        //  shields (`civ_set_government`). The original sets the city's production whether or not it could choose
        //  Riflemen, so a city that can't is given them all the same.
        new Changed_1.default('civ2-government:player/government-changed/fanatics-to-riflemen', new High_1.default(), new Criterion_1.default(isChange), new Criterion_1.default((player, government) => !(government instanceof Governments_1.Fundamentalism)), new Criterion_1.default((player) => (0, isHuman_1.default)(player, clientRegistry)), new Effect_1.default((player) => cityRegistry
            .getByPlayer(player)
            .flatMap((city) => cityBuildRegistry.getBy('city', city))
            .filter((cityBuild) => { var _a; return ((_a = cityBuild.building()) === null || _a === void 0 ? void 0 : _a.item()) === Fanatic_1.default; })
            .forEach((cityBuild) => {
            if (cityBuild.getAvailable(Rifleman_1.default)) {
                cityBuild.build(Rifleman_1.default);
                return;
            }
            (0, exports.giveRegardless)(cityBuild, Rifleman_1.default);
        }))),
        new Changed_1.default('civ2-government:player/government-changed/emit', new Effect_1.default((0, changed_1.emitGovernmentChanged)(engine))),
        new Changed_1.default('civ2-government:player/government-changed/clear-yield-caches', new Criterion_1.default((0, changed_1.hasPlayerWorld)(playerWorldRegistry)), new Effect_1.default((0, changed_1.clearYieldCaches)(playerWorldRegistry))),
        // At a turn's start, the government of a player not seen yet (as one from a loaded game).
        new TurnStart_1.default('civ2-government:player/turn-start/last-seen', new Criterion_1.default((player) => !lastSeen.has(player)), new Effect_1.default((player) => {
            var _a;
            const current = (_a = playerGovernmentRegistry
                .getBy('player', player)[0]) === null || _a === void 0 ? void 0 : _a.current();
            if (current) {
                lastSeen.set(player, current.constructor);
            }
        })),
        // Last, after every rule that asks whether this is a change.
        new Changed_1.default('civ2-government:player/government-changed/last-seen', new Low_1.default(), new Effect_1.default((player, government) => {
            lastSeen.set(player, government.constructor);
        })),
    ];
};
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=government-changed.js.map