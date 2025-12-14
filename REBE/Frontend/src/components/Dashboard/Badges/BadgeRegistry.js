import InsaneBadge from './InsaneBadge';
import ExtremeBadge from './ExtremeBadge';
import TerrifyingBadge from './TerrifyingBadge';
import CatastrophicBadge from './CatastrophicBadge';
import HorrificBadge from './HorrificBadge';
import UnrealBadge from './UnrealBadge';

export const badgeRegistry = [
    { levelReq: 5, name: "Insane", component: InsaneBadge},
    { levelReq: 10, name: "Extreme", component: ExtremeBadge},
    { levelReq: 15, name: "Terrifying", component: TerrifyingBadge},
    { levelReq: 20, name: "Catastrophic", component: CatastrophicBadge},
    { levelReq: 30, name: "Horrific", component: HorrificBadge},
    { levelReq: 40, name: "Unreal", component: UnrealBadge},
]