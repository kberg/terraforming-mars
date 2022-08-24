import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {Player} from '../../Player';
import {ISpace} from '../../boards/ISpace';
import {SelectSpace} from '../../inputs/SelectSpace';
import {Resources} from '../../../common/Resources';
import {CardName} from '../../../common/cards/CardName';
import {Priority} from '../../deferredActions/DeferredAction';
import {GainProduction} from '../../deferredActions/GainProduction';
import {Board} from '../../boards/Board';
import {CardRenderer} from '../render/CardRenderer';
import {Units} from '../../../common/Units';
import {all} from '../Options';

export class ImmigrantCity extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.IMMIGRANT_CITY,
      tags: [Tag.CITY, Tag.BUILDING],
      cost: 13,
      productionBox: Units.of({energy: -1, megacredits: -2}),

      metadata: {
        cardNumber: '200',
        renderData: CardRenderer.builder((b) => {
          b.effect('When a City tile is placed, including this, increase your M€ production 1 step.', (eb) => {
            eb.city({all}).startEffect.production((pb) => pb.megacredits(1));
          }).br;
          b.production((pb) => pb.minus().energy(1).megacredits(-2)).city();
        }),
        description: 'Decrease your Energy production 1 step and decrease your M€ production 2 steps. Place a City tile.',
      },
    });
  }

  public override innerCanPlay(player: Player): boolean {
    return player.game.board.getAvailableSpacesForCity(player).length > 0;
  }

  public onTilePlaced(cardOwner: Player, activePlayer: Player, space: ISpace) {
    if (Board.isCitySpace(space)) {
      cardOwner.game.defer(
        new GainProduction(cardOwner, Resources.MEGACREDITS),
        cardOwner.id !== activePlayer.id ? Priority.OPPONENT_TRIGGER : undefined,
      );
    }
  }

  public override innerPlay(player: Player) {
    return new SelectSpace('Select space for city tile', player.game.board.getAvailableSpacesForCity(player), (space: ISpace) => {
      player.game.addCityTile(player, space.id);
      return undefined;
    });
  }
}
