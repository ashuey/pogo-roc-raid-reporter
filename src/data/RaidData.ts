type RaidData = RaidDataEgg | RaidDataHatched;

interface RaidDataBase {
    gym: number;
    level: number;
    remaining: number;
}

interface RaidDataEgg extends RaidDataBase {
    hatched: false;
}

interface RaidDataHatched extends RaidDataBase {
    hatched: true;
    boss: string;
}

export default RaidData;