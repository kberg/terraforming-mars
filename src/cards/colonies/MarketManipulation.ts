import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {Game} from '../../Game';
import {Card} from '../Card';
import {Size} from '../render/Size';
import {CardRenderer} from '../render/CardRenderer';
import {SelectColony} from '../../inputs/SelectColony';
import {ColonyName} from '../../colonies/ColonyName';
import {Colony} from '../../colonies/Colony';
import {DeferredAction} from '../../deferredActions/DeferredAction';

export class MarketManipulation extends Card implements IProjectCard {
  constructor() {
    super({
      cost: 1,
      tags: [Tags.EARTH],
      name: CardName.MARKET_MANIPULATION,
      cardType: CardType.EVENT,

      metadata: {
        cardNumber: 'C23',
        renderData: CardRenderer.builder((b) => {
          b.text('Increase one colony tile track 1 step. Decrease another colony tile track 1 step.', Size.SMALL, true);
        }),
      },
    });
  }

  public canPlay(player: Player): boolean {
    const increasableColonies = this.getIncreasableColonies(player.game);
    const decreasableColonies = this.getDecreasableColonies(player.game);

    if (increasableColonies.length === 0) return false;
    if (decreasableColonies.length === 0) return false;
    if (increasableColonies.length === 1 && decreasableColonies.length === 1 && increasableColonies[0] === decreasableColonies[0]) {
      return false;
    }

    return true;
  }

  private getIncreasableColonies(game: Game) {
    return game.colonies.filter((colony) => colony.trackPosition < 6 && colony.isActive);
  }

  private getDecreasableColonies(game: Game) {
    return game.colonies.filter((colony) => colony.trackPosition > colony.colonies.length && colony.isActive);
  }

  public play(player: Player) {
    const game = player.game;
    let increasableColonies = this.getIncreasableColonies(game);
    const decreasableColonies = this.getDecreasableColonies(game);

    // if there is only one decreasable colony and it is an increasable colony, don't allow increase of that colony.
    if (decreasableColonies.length === 1 && increasableColonies.some((colony) => colony.name === decreasableColonies[0].name)) {
      increasableColonies = increasableColonies.filter((colony) => colony.name !== decreasableColonies[0].name);
    }

    const increaseColonyTrack = new SelectColony(
      'Select which colony tile track to increase',
      'Increase',
      game.getColoniesModel(increasableColonies),
      (increasedColony: ColonyName) => {
        const target = game.colonies.find((colony) => colony.name === increasedColony) as Colony;
        target.increaseTrack();
        game.log('${0} increased ${1} track', (b) => b.player(player).string(increasedColony));

        const decreaseColonyTrack = new SelectColony(
          'Select which colony tile track to decrease',
          'Decrease',
           game.getColoniesModel(decreasableColonies).filter((decreaseableColony) => decreaseableColony.name !== increasedColony),
          (decreasedColony: ColonyName) => {
            const target = game.colonies.find((colony) => colony.name === decreasedColony) as Colony;
            target.decreaseTrack();
            game.log('${0} decreased ${1} track', (b) => b.player(player).string(decreasedColony));
            return undefined;
          },
        );

        game.defer(new DeferredAction(player, () => decreaseColonyTrack));
        return undefined;
      },
    );

    game.defer(new DeferredAction(player, () => increaseColonyTrack));
    return undefined;
  }
}
