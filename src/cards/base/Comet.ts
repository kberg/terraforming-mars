import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {PlaceOceanTile} from '../../deferredActions/PlaceOceanTile';
import {RemoveAnyPlants} from '../../deferredActions/RemoveAnyPlants';
import {CardRenderer} from '../render/CardRenderer';
import {MAX_OCEAN_TILES, MAX_TEMPERATURE, REDS_RULING_POLICY_COST} from '../../constants';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {ActionDetails, HowToAffordRedsPolicy, RedsPolicy} from '../../turmoil/RedsPolicy';
import {Units} from '../../Units';
import {DeferredAction} from '../../deferredActions/DeferredAction';

export class Comet extends Card implements IProjectCard {
  public howToAffordReds: HowToAffordRedsPolicy | undefined;

  constructor() {
    super({
      cardType: CardType.EVENT,
      name: CardName.COMET,
      tags: [Tags.SPACE],
      cost: 21,
      tr: {temperature: 1, oceans: 1},

      metadata: {
        cardNumber: '010',
        description: 'Raise temperature 1 step and place an ocean tile. Remove up to 3 Plants from any player.',
        renderData: CardRenderer.builder((b) => {
          b.temperature(1).oceans(1).br;
          b.minus().plants(-3).any;
        }),
      },
    });
  }

  public canPlay(player: Player): boolean {
    const trGain = player.computeTerraformRatingBump(this);
    Card.setRedsWarningText(trGain, this);

    if (trGain === 0) return true;

    if (PartyHooks.shouldApplyPolicy(player, PartyName.REDS)) {
      this.reserveUnits = Units.adjustUnits(this.reserveUnits, {megacredits: trGain * REDS_RULING_POLICY_COST});
      const actionDetails = this.getActionDetails(player, this);
      this.howToAffordReds = RedsPolicy.canAffordRedsPolicy(player, player.game, actionDetails, false, true);

      if (this.howToAffordReds.mustSpendAtMost !== undefined || this.howToAffordReds.bonusMCFromPlay !== undefined) {
        this.reserveUnits = Units.maybeAdjustReservedMegacredits(player, this.reserveUnits, this.howToAffordReds);
      }

      return this.howToAffordReds.canAfford;
    } else {
      return true;
    }
  }

  public play(player: Player) {
    player.game.defer(new DeferredAction(player, () => {
      player.game.increaseTemperature(player, 1);
      return undefined;
    }));

    player.game.defer(new PlaceOceanTile(player));
    player.game.defer(new RemoveAnyPlants(player, 3));
    return undefined;
  }

  public getActionDetails(player: Player, card: IProjectCard) {
    const oceansMaxed = player.game.board.getOceansOnBoard() === MAX_OCEAN_TILES;
    const oceansToPlace = oceansMaxed ? 0 : 1;

    const temperatureMaxed = player.game.getTemperature() === MAX_TEMPERATURE;
    const temperatureIncrease = temperatureMaxed ? 0 : 1;

    return new ActionDetails({card: card, temperatureIncrease: temperatureIncrease, oceansToPlace: oceansToPlace});
  }
}
