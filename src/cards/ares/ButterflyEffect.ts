import {Card} from '../Card';
import {CardName} from '../../CardName';
import {ShiftAresGlobalParametersDeferred} from '../../deferredActions/ShiftAresGlobalParametersDeferred';
import {Player} from '../../Player';
import {CardType} from '../CardType';
import {IProjectCard} from '../IProjectCard';
import {CardRenderer} from '../render/CardRenderer';
import {Size} from '../render/Size';
import {AresHandler} from '../../ares/AresHandler';
import {HAZARD_CONSTRAINTS} from '../../ares/IAresData';

export class ButterflyEffect extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.EVENT,
      name: CardName.BUTTERFLY_EFFECT,
      cost: 8,
      tr: {tr: 1},

      metadata: {
        cardNumber: 'A03',
        description: 'Effect: Gain 1 TR. Move each individual hazard marker up to 1 step up or down.',
        renderData: CardRenderer.builder((b) => {
          b.tr(1).br;
          b.plate('All hazard markers').colon().text('-1 / 0 / +1', Size.SMALL);
        }),
      },
    });
  }

  public canPlay(player: Player): boolean {
    if (!super.canPlay(player)) return false;

    const trGain = player.computeTerraformRatingBump(this);
    Card.setRedsWarningText(trGain, this);

    return true;
  }

  public play(player: Player) {
    player.increaseTerraformRatingSteps(1);

    AresHandler.ifAres(player.game, (aresData) => {
      const hazardData = aresData.hazardData;

      if (HAZARD_CONSTRAINTS.some((constraint) => hazardData[constraint].available === true)) {
        player.game.defer(new ShiftAresGlobalParametersDeferred(player));
      } else {
        player.game.log('All hazard markers have already been reached.');
      }
    });

    return undefined;
  }
}
