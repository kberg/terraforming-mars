import {LawSuit} from '../cards/promo/LawSuit';
import {IPlayer} from '../IPlayer';
import {Resource} from '../../common/Resource';
import {Units} from '../../common/Units';
import {LogHelper} from '../LogHelper';
import {From, isFromPlayer} from '../logs/From';

export class Production {
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

  public get(resource: Resource): number {
    return this.units[resource];
  }

  public override(units: Partial<Units>) {
    this.units = Units.of({...units});
  }

  public asUnits(): Units {
    return {...this.units};
  }

  public add(
    resource: Resource,
    amount : number,
    options? : { log: boolean, from? : From, stealing?: boolean},
  ) {
    const adj = resource === Resource.MEGACREDITS ? -5 : 0;
    const delta = (amount >= 0) ? amount : Math.max(amount, -(this.units[resource] - adj));
    this.units[resource] += delta;

    if (options?.log === true) {
      LogHelper.logUnitDelta(this.player, resource, amount, /* production*/ true, options.from, options.stealing);
    }

    const from = options?.from;
    if (isFromPlayer(from)) {
      LawSuit.resourceHook(this.player, resource, delta, from.player);

      // Mons Insurance hook
      if (delta < 0 && from.player.id !== this.player.id) {
        this.player.resolveInsurance();
      }
    }

    for (const card of this.player.tableau) {
      card.onProductionGain?.(this.player, resource, amount);
    }
  }

  public canAdjust(units: Units): boolean {
    return this.units.megacredits + units.megacredits >= -5 &&
      this.units.steel + units.steel >= 0 &&
      this.units.titanium + units.titanium >= 0 &&
      this.units.plants + units.plants >= 0 &&
      this.units.energy + units.energy >= 0 &&
      this.units.heat + units.heat >= 0;
  }

  public adjust(units: Units, options?: {log: boolean, from?: From}) {
    if (units.megacredits !== undefined) {
      this.add(Resource.MEGACREDITS, units.megacredits, options);
    }

    if (units.steel !== undefined) {
      this.add(Resource.STEEL, units.steel, options);
    }

    if (units.titanium !== undefined) {
      this.add(Resource.TITANIUM, units.titanium, options);
    }

    if (units.plants !== undefined) {
      this.add(Resource.PLANTS, units.plants, options);
    }

    if (units.energy !== undefined) {
      this.add(Resource.ENERGY, units.energy, options);
    }

    if (units.heat !== undefined) {
      this.add(Resource.HEAT, units.heat, options);
    }
  }
}
