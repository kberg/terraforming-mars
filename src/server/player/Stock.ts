import {LawSuit} from '../cards/promo/LawSuit';
import {IPlayer} from '../IPlayer';
import {Resource} from '../../common/Resource';
import {Units} from '../../common/Units';
import {CrashSiteCleanup} from '../cards/promo/CrashSiteCleanup';
import {LogHelper} from '../LogHelper';
import {From, isFromPlayer} from '../logs/From';

export class Stock {
  private units: Units;
  private player: IPlayer;

  constructor(player: IPlayer, units: Units = Units.EMPTY) {
    this.player = player;
    this.units = Units.of(units);
  }
  public get megacredits() {
    return this.units.megacredits;
  }
  public get steel() {
    return this.units.steel;
  }
  public get titanium() {
    return this.units.titanium;
  }
  public get plants() {
    return this.units.plants;
  }
  public get energy() {
    return this.units.energy;
  }
  public get heat() {
    return this.units.heat;
  }

  public set megacredits(megacredits: number) {
    this.units.megacredits = megacredits;
  }

  public set steel(steel: number) {
    this.units.steel = steel;
  }

  public set titanium(titanium: number) {
    this.units.titanium = titanium;
  }

  public set plants(plants: number) {
    this.units.plants = plants;
  }

  public set energy(energy: number) {
    this.units.energy = energy;
  }

  public set heat(heat: number) {
    this.units.heat = heat;
  }

  public get(resource: Resource): number {
    return this.units[resource];
  }

  public override(units: Partial<Units>) {
    this.units = Units.of({...units});
  }

  public asUnits(): Units {
    return {...this.units};
  }

  public has(units: Units): boolean {
    return this.megacredits - units.megacredits >= 0 &&
      this.steel - units.steel >= 0 &&
      this.titanium - units.titanium >= 0 &&
      this.plants - units.plants >= 0 &&
      this.energy - units.energy >= 0 &&
      this.heat - units.heat >= 0;
  }

  public deduct(
    resource: Resource,
    amount: number,
    options? : {
      log?: boolean,
      from? : From,
      stealing?: boolean
    }) {
    this.add(resource, -amount, options);
  }

  public add(
    resource: Resource,
    amount : number,
    options? : {
      log?: boolean,
      from? : From,
      stealing?: boolean
    }) {
    if (amount === 0) {
      return;
    }
    // When amount is negative, sometimes the amount being asked to be removed is more than the player has.
    // delta represents an adjusted amount which basically declares that a player cannot lose more resources
    // then they have.
    const playerAmount = this[resource];
    const delta = (amount >= 0) ? amount : Math.max(amount, -playerAmount);
    // Lots of calls to addResource used to deduct resources are done by cards and/or players stealing some
    // fixed amount which, if the current player doesn't have it. it just removes as much as possible.
    // (eg. Sabotage.) That's what the delta above, is for.
    //
    // But if the intent is to remove the amount requested (spending 8 plants to place a greenery) then there
    // better be 8 units. The code outside this call is responsible in those cases for making sure the player
    // has enough resource units to pay for an action.
    //
    // In those cases, if the player calls this, but the logic is wrong, the player could wind up with a
    // negative amount of units. This will break other actions in the game. So instead, this method deducts as
    // much as possible, and lots that there was a game error.
    //
    // The shortcut for knowing if this is the case is when `options.from` is undefined.
    if (delta !== amount && options?.from === undefined) {
      this.player.game.logIllegalState(
        `Adjusting ${amount} ${resource} when player has ${playerAmount}`,
        {player: {color: this.player.color, id: this.player.id, name: this.player.name}, resource, amount});
    }

    this.units[resource] += delta;

    if (options?.log === true) {
      LogHelper.logUnitDelta(this.player, resource, delta, /* production*/ false, options.from, options.stealing);
    }

    const from = options?.from;
    if (isFromPlayer(from)) {
      LawSuit.resourceHook(this.player, resource, delta, from.player);
      CrashSiteCleanup.resourceHook(this.player, resource, delta, from.player);
    }

    // Mons Insurance hook
    if (options?.from !== undefined && delta < 0 && (isFromPlayer(from) && from.player.id !== this.player.id)) {
      this.player.resolveInsurance();
    }
  }

  public addUnits(units: Units, options? : {
    log?: boolean,
    from? : From,
  }) {
    if (units.megacredits !== 0) {
      this.add(Resource.MEGACREDITS, units.megacredits, options);
    }
    if (units.steel !== 0) {
      this.add(Resource.STEEL, units.steel, options);
    }
    if (units.titanium !== 0) {
      this.add(Resource.TITANIUM, units.titanium, options);
    }
    if (units.plants !== 0) {
      this.add(Resource.PLANTS, units.plants, options);
    }
    if (units.energy !== 0) {
      this.add(Resource.ENERGY, units.energy, options);
    }
    if (units.heat !== 0) {
      this.add(Resource.HEAT, units.heat, options);
    }
  }

  public deductUnits(units: Units) {
    this.deduct(Resource.MEGACREDITS, units.megacredits);
    this.deduct(Resource.STEEL, units.steel);
    this.deduct(Resource.TITANIUM, units.titanium);
    this.deduct(Resource.PLANTS, units.plants);
    this.deduct(Resource.ENERGY, units.energy);
    this.deduct(Resource.HEAT, units.heat);
  }


  /**
   * `from` steals up to `qty` units of `resource` from this player. Or, at least as
   * much as possible.
   */
  public steal(resource: Resource, qty: number, thief: IPlayer, options?: {log?: boolean}) {
    const qtyToSteal = Math.min(this[resource], qty);
    if (qtyToSteal > 0) {
      this.deduct(resource, qtyToSteal, {log: options?.log ?? true, from: {player: thief}, stealing: true});
      thief.stock.add(resource, qtyToSteal);
    }
  }
}
