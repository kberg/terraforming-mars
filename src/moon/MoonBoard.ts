import {Board} from '../boards/Board';
import {ISpace} from '../boards/ISpace';
import {SerializedBoard} from '../boards/SerializedBoard';
import {Player} from '../Player';
import {Random} from '../Random';
import {SpaceBonus} from '../SpaceBonus';
import {SpaceType} from '../SpaceType';
import {MoonSpaces} from './MoonSpaces';

class Space implements ISpace {
  constructor(
    public id: string,
    public spaceType: SpaceType,
    public x: number,
    public y: number,
    public bonus: Array<SpaceBonus>,
    public hasCathedral: boolean,
    public hasNomads: boolean) { }

  public static mine(id: string, x: number, y: number, bonus: Array<SpaceBonus>) {
    return new Space(id, SpaceType.LUNAR_MINE, x, y, bonus, false, false);
  }
  public static surface(id: string, x: number, y: number, bonus: Array<SpaceBonus>) {
    return new Space(id, SpaceType.LAND, x, y, bonus, false, false);
  }
  public static colony(id: string) {
    return new Space(id, SpaceType.COLONY, -1, -1, [], false, false);
  }
}

export class MoonBoard extends Board {
  public getNoctisCitySpaceIds() {
    return [];
  }
  public getVolcanicSpaceIds() {
    return [];
  }

  public getAvailableSpacesForMine(player: Player): Array<ISpace> {
    const spaces = this.spaces.filter((space) => {
      const val = space.tile === undefined &&
        space.spaceType === SpaceType.LUNAR_MINE &&
        space.id !== MoonSpaces.MARE_IMBRIUM &&
        space.id !== MoonSpaces.MARE_SERENITATIS &&
        space.id !== MoonSpaces.MARE_NUBIUM &&
        space.id !== MoonSpaces.MARE_NECTARIS &&
        (space.player === undefined || space.player.id === player.id);
      return val;
    });
    return spaces;
  }

  public static newInstance(shuffleMoonMapOption: boolean): MoonBoard {
    const STEEL = SpaceBonus.STEEL;
    const DRAW_CARD = SpaceBonus.DRAW_CARD;
    const TITANIUM = SpaceBonus.TITANIUM;

    let b = new Builder();
    b.colony(); // Luna Trade Station
    b.row(2).land().land(STEEL, DRAW_CARD).land().mine(TITANIUM);
    b.row(1).mine(TITANIUM, TITANIUM).mine(/* Mare Imbrium */).land(STEEL).land().land();
    b.row(0).mine().land(STEEL).land(STEEL, TITANIUM).mine(/* Mare Serenatis*/).mine(TITANIUM).land(STEEL, STEEL);
    b.row(0).land(STEEL).land().land().mine(TITANIUM).mine(TITANIUM);
    b.row(0).land().mine(TITANIUM).mine(/* Mare Nubium */).land().mine(/* Mare Nectaris */).land(STEEL);
    b.row(1).land().land(STEEL).land(STEEL).land(DRAW_CARD, DRAW_CARD).land(STEEL);
    b.row(2).land(DRAW_CARD, DRAW_CARD).mine(TITANIUM).mine(TITANIUM, TITANIUM).land();
    b.colony();

    if (shuffleMoonMapOption) {
      const rng = new Random(Math.random());
      b.shuffle(rng);
    }

    return new MoonBoard(b.spaces);
  }

  public static deserialize(board: SerializedBoard, players: Array<Player>): MoonBoard {
    const spaces = Board.deserializeSpaces(board.spaces, players);
    return new MoonBoard(spaces);
  }
}

class Builder {
  y: number = -1;
  x: number = 0;
  spaces: Array<ISpace> = [];
  private idx: number = 0;

  public row(startX: number): Row {
    this.y++;
    this.x = startX;
    return new Row(this);
  }
  public colony() {
    this.spaces.push(Space.colony(this.nextId()));
  }
  public nextId(): string {
    this.idx++;
    const strId = this.idx.toString().padStart(2, '0');
    return 'm' + strId;
  }
  // Shuffle the Moon spaces, except for reserved and offworld spaces
  public shuffle(rng: Random) {
    const excludedSpaces: string[] = [MoonSpaces.LUNA_TRADE_STATION, MoonSpaces.MARE_IMBRIUM, MoonSpaces.MARE_NECTARIS, MoonSpaces.MARE_NUBIUM, MoonSpaces.MARE_SERENITATIS, MoonSpaces.MOMENTUM_VIRIUM];

    for (let i = 0; i < 100; i++) {
      const first = rng.nextInt(this.spaces.length - 1);
      const second = rng.nextInt(this.spaces.length - 1);
      const firstSelectedSpace = this.spaces[first];
      const secondSelectedSpace = this.spaces[second];

      if (excludedSpaces.includes(firstSelectedSpace.id) || excludedSpaces.includes(secondSelectedSpace.id)) continue;

      [firstSelectedSpace.spaceType, secondSelectedSpace.spaceType] = [secondSelectedSpace.spaceType,firstSelectedSpace.spaceType];
      [firstSelectedSpace.bonus, secondSelectedSpace.bonus] = [secondSelectedSpace.bonus, firstSelectedSpace.bonus];
    }
  }
}

class Row {
  constructor(private builder: Builder) {
  }

  land(...bonuses: SpaceBonus[]): Row {
    const space = Space.surface(this.builder.nextId(), this.builder.x++, this.builder.y, bonuses);
    this.builder.spaces.push(space);
    return this;
  }

  mine(...bonuses: SpaceBonus[]): Row {
    const space = Space.mine(this.builder.nextId(), this.builder.x++, this.builder.y, bonuses);
    this.builder.spaces.push(space);
    return this;
  }
}
