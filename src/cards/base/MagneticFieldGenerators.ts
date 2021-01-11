import {Player} from '../../Player';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {CardName} from '../../CardName';
import {Game} from '../../Game';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {REDS_RULING_POLICY_COST} from '../../constants';
import {CardRenderer} from '../render/CardRenderer';

export class MagneticFieldGenerators extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.MAGNETIC_FIELD_GENERATORS,
      tags: [Tags.BUILDING],
      cost: 20,
      hasRequirements: false,

      metadata: {
        cardNumber: '165',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.minus().energy(4).digit.br;
            pb.plus().plants(2);
          }).br;
          b.tr(3);
        }),
        description: 'Decrease your Energy production 4 steps and increase your Plant production 2 step. Raise your TR 3 step.',
      },
    });
  }

  public canPlay(player: Player, game: Game): boolean {
    const meetsEnergyRequirements = player.energyProduction >= 4;

    if (PartyHooks.shouldApplyPolicy(game, PartyName.REDS)) {
      return player.canAfford(player.getCardCost(game, this) + REDS_RULING_POLICY_COST * 3, game, true) && meetsEnergyRequirements;
    }

    return meetsEnergyRequirements;
  }

  public play(player: Player, game: Game) {
    player.addEnergyProduction(-4);
    player.addPlantProduction(2);
    player.increaseTerraformRatingSteps(3, game);
    return undefined;
  }
}
