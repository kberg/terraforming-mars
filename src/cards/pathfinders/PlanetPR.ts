import {Card} from '../Card';
import {CorporationCard} from '../corporation/CorporationCard';
import {Tags} from '../Tags';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {CardRenderer} from '../render/CardRenderer';
import {ICloneTagCard} from './ICloneTagCard';
import {DeclareCloneTag} from '../../pathfinders/DeclareCloneTag';
import {PathfindersExpansion} from '../../pathfinders/PathfindersExpansion';
import {played} from '../Options';
import {IProjectCard} from '../IProjectCard';

export class PlanetPR extends Card implements CorporationCard, ICloneTagCard {
  constructor() {
    super({
      cardType: CardType.CORPORATION,
      name: CardName.PLANET_PR,
      startingMegaCredits: 40,

      metadata: {
        cardNumber: 'PfC2',
        description: 'You start with 40 M€.',
        renderData: CardRenderer.builder((b) => {
          b.br;
          b.megacredits(40);
          b.corpBox('effect', (ce) => {
            ce.effect('Each time you play 2 of the same planetary tags in a row (including this), ' +
              'raise the planetary influence track one additional step and gain 2 M€.', (eb) => {
              eb.jovian({played}).jovian({played}).slash().venus(2, {played}).br
                .earth(2, {played}).slash().mars(2, {played}).slash().moon(2, {played}).br
                .colon().megacredits(2).planetaryTrack().text('+1');
            });
          });
        }),
      },
    });
  }


  public cloneTag: Tags = Tags.CLONE;

  public get tags(): Array<Tags> {
    return [this.cloneTag];
  }

  public play(player: Player) {
    player.increaseTerraformRatingSteps(2);

    player.game.defer(new DeclareCloneTag(player, this));
    return undefined;
  }

  public onCardPlayed(player: Player, card: IProjectCard) {

  }
}
