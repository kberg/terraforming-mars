import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {Tags} from '../Tags';
import {Player} from '../../Player';
import {Resources} from '../../Resources';
import {SelectAmount} from '../../inputs/SelectAmount';
import {CardRenderer} from '../render/CardRenderer';

export class HiTechLab extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.HI_TECH_LAB,
      tags: [Tags.SCIENCE, Tags.BUILDING],
      cost: 17,

      metadata: {
        cardNumber: 'X04',
        renderData: CardRenderer.builder((b) => {
          b.action('Spend any amount of energy to draw the same number of cards. TAKE 1 INTO HAND AND DISCARD THE REST.', (eb) => {
            eb.text('X').energy(1).startAction.text('X').cards(1).asterix();
          });
        }),
        victoryPoints: 1,
      },
    });
  }

  public play() {
    return undefined;
  }

  public canAct(player: Player): boolean {
    return player.energy > 0;
  }

  public action(player: Player) {
    return HiTechLab.spendEnergyToDrawCards(player);
  }

  public getVictoryPoints() {
    return 1;
  }

  public static spendEnergyToDrawCards(player: Player) {
    // Minor optimization: If player has only 1 energy, we don't need the SelectAmount
    if (player.energy === 1) {
      player.deductResource(Resources.ENERGY, 1);
      player.game.log('${0} spent ${1} energy', (b) => b.player(player).number(1));
      player.drawCard();
      return undefined;
    }

    return new SelectAmount(
      'Select amount of energy to spend',
      'Spend energy',
      (amount: number) => {
        player.deductResource(Resources.ENERGY, amount);
        player.game.log('${0} spent ${1} energy', (b) => b.player(player).number(amount));

        if (amount === 1) {
          player.drawCard();
          return undefined;
        }

        return player.drawCardKeepSome(amount, {keepMax: 1});
      },
      1,
      player.energy,
    );
  }
}
