import {Player} from '../../Player';
import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {CardRenderer} from '../render/CardRenderer';
import {Tags} from '../Tags';
import {Resources} from '../../Resources';
import {Units} from '../../Units';
import {RoboticWorkforce} from '../base/RoboticWorkforce';

export class CyberiaSystems extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.CYBERIA_SYSTEMS,
      tags: [Tags.BUILDING],
      cost: 17,
      productionBox: Units.of({steel: 1}),

      metadata: {
        cardNumber: '??',
        description: 'Increase your steel production 1 step. Copy the production boxes of 2 of your other cards with building tags.',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.steel(1));
          b.text('COPY');
          b.production((pb) => pb.building(1).played);
          b.production((pb) => pb.building(1).played);
        }),
      },
    });
  }

  public canPlay(player: Player): boolean {
    const initialCopyableCards = RoboticWorkforce.getAvailableCards(player);
    if (initialCopyableCards.length === 0) return false;

    const productionBoxes = initialCopyableCards.map((c) => c.productionBox);

    // If the first card gives positive production, it may make a previously uncopyable card now copyable
    const maxProductionGains = Units.of({
      megacredits: Math.max(...productionBoxes.map((p) => p?.megacredits || 0)),
      steel: Math.max(...productionBoxes.map((p) => p?.steel || 0)),
      titanium: Math.max(...productionBoxes.map((p) => p?.titanium || 0)),
      plants: Math.max(...productionBoxes.map((p) => p?.plants || 0)),
      energy: Math.max(...productionBoxes.map((p) => p?.energy || 0)),
      heat: Math.max(...productionBoxes.map((p) => p?.heat || 0)),
    });

    return RoboticWorkforce.getAvailableCards(player, maxProductionGains).length > 1;
  }

  public play(player: Player) {
    player.addProduction(Resources.STEEL, 1, {log: true});

    let availableCards = RoboticWorkforce.getAvailableCards(player);
    if (availableCards.length === 0) return undefined;

    return RoboticWorkforce.selectBuildingCard(player, availableCards, this.name, 'Select first builder card to copy', (card) => {
      const secondSet = RoboticWorkforce.getAvailableCards(player).filter((c) => c.name !== card.name && c.name !== this.name);
      return RoboticWorkforce.selectBuildingCard(player, secondSet, this.name, 'Select second builder card to copy');
    });
  }
}
