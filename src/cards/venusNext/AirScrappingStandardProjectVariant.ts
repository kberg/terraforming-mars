import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Tags} from '../Tags';
import {AirScrappingStandardProject} from './AirScrappingStandardProject';
import {Size} from '../render/Size';
import {HowToAffordRedsPolicy, ActionDetails} from '../../turmoil/RedsPolicy';
import {IProjectCard} from '../IProjectCard';

export class AirScrappingStandardProjectVariant extends AirScrappingStandardProject {
  public howToAffordReds: HowToAffordRedsPolicy | undefined;

  constructor() {
    super({
      name: CardName.AIR_SCRAPPING_STANDARD_PROJECT_VARIANT,
      cost: 15,
      tr: {venus: 1},
      metadata: {
        cardNumber: 'SP1a',
        renderData: CardRenderer.builder((b) => {
          b.standardProject('Spend 15 M€, reduced by 1 M€ per Venus tag you have, to raise Venus 1 step.', (eb) => {
            eb.megacredits(15).text('(').megacredits(-1).slash().venus(1).played.text(')').startAction.venus(1);
          });
          b.br.text('(max -5 M€)', Size.SMALL);
        }),
      },
    });
  }

  protected discount(player: Player): number {
    const tagCount = player.getTagCount(Tags.VENUS);
    const discount = Math.min(tagCount, 5);
    return discount + super.discount(player);
  }

  public getActionDetails(player: Player, card: IProjectCard) {
    return new ActionDetails({card: card, venusIncrease: 1, bonusMegaCredits: this.discount(player)});
  }
}
