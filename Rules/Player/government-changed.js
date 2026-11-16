"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const Engine_1 = require("@civ-clone/core-engine/Engine");
const PlayerWorldRegistry_1 = require("@civ-clone/core-player-world/PlayerWorldRegistry");
const CityBuildRegistry_1 = require("@civ-clone/core-city-build/CityBuildRegistry");
const CityRegistry_1 = require("@civ-clone/core-city/CityRegistry");
const ClientRegistry_1 = require("@civ-clone/core-client/ClientRegistry");
const InteractionRegistry_1 = require("@civ-clone/core-diplomacy/InteractionRegistry");
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
const relations_1 = require("@civ-clone/civ2-diplomacy/lib/relations");
const isHuman_1 = require("@civ-clone/base-difficulty/lib/isHuman");
const getRules = (engine = Engine_1.instance, playerWorldRegistry = PlayerWorldRegistry_1.instance, interactionRegistry = InteractionRegistry_1.instance, clientRegistry = ClientRegistry_1.instance, cityRegistry = CityRegistry_1.instance, cityBuildRegistry = CityBuildRegistry_1.instance) => {
    // The government each player was last seen to have, so the rules below act only on an actual change, as
    //  `civ_set_government` does (`if (government != old_government)`). Not saved: after a game is loaded, a player's
    //  first change counts as one.
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
            // `build` refuses an item the city can't choose, so the item is set directly, then priced by the city's
            //  own rules (`reprice`), progress kept.
            cityBuild._building =
                new BuildItem_1.default(Rifleman_1.default, cityBuild.city());
            cityBuild.reprice();
        }))),
        new Changed_1.default('civ2-government:player/government-changed/emit', new Effect_1.default((0, changed_1.emitGovernmentChanged)(engine))),
        new Changed_1.default('civ2-government:player/government-changed/clear-yield-caches', new Criterion_1.default((0, changed_1.hasPlayerWorld)(playerWorldRegistry)), new Effect_1.default((0, changed_1.clearYieldCaches)(playerWorldRegistry))),
        // Last, after every rule that asks whether this is a change.
        new Changed_1.default('civ2-government:player/government-changed/last-seen', new Low_1.default(), new Effect_1.default((player, government) => {
            lastSeen.set(player, government.constructor);
        })),
    ];
};
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=government-changed.js.map