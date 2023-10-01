import {Tag} from '../../../common/cards/Tag';
import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {CardRenderer} from '../render/CardRenderer';
import {ICorporationCard} from '../corporation/ICorporationCard';
import {IPlayer} from '../../IPlayer';
import {Card} from '../Card';
import {PlayProjectCard} from '../../deferredActions/PlayProjectCard';
import {Resource} from '../../../common/Resource';
import {all} from '../Options';

export class AnubisSecurities extends Card implements ICorporationCard {
  constructor() {
    super({
      type: CardType.CORPORATION,
      name: CardName.ANUBIS_SECURITIES,
      tags: [Tag.MARS],
      startingMegaCredits: 42,
      initialActionText: 'Play a card, ignoring global requirements',

      metadata: {
        cardNumber: 'UC11',
        description: 'You start with 42 M€. As your first action, play a card ignroing global requirements.',
        renderData: CardRenderer.builder((b) => {
          b.effect('When any player increases their TR by 1, they gain 2 MC.', (eb) => {
            eb.tr(1, {all}).startEffect.megacredits(2, {all});
          }).br;
          b.text('-X').corruption(1).text('X').megacredits(6).asterix().br;
          b.text('Y').corruption(1, {all}).colon().text('PAYS Y').megacredits(1).or().tr(1).asterix().br;
          b.plainText('(At the end of the production phase, discard all your corruption and gain 6MC for each unit discarded. ' +
            'Then, each player must pay you 1 MC per unit of corruption they have. If no one has any, gain 1 TR instead.)').br;
        }),
      },
    });
  }

  private inInitialAction = false;

  public getRequirementBonus(): number {
    if (this.inInitialAction === true) {
      // Magic number high enough to always ignore requirements.
      return 50;
    }
    return 0;
  }

  public initialAction(player: IPlayer) {
    this.inInitialAction = true;
    player.game.defer(new PlayProjectCard(player).andThen(() => {
      this.inInitialAction = false;
    }));
    return undefined;
  }

  public onIncreaseTerraformRating(player: IPlayer, _cardOwner: IPlayer, steps: number) {
    const money = steps * 2;
    player.stock.add(Resource.MEGACREDITS, money);
    player.game.log('${1} gained ${2} MC from the ${3} corp effect.', (b) => b.player(player).number(money).card(this));
  }

  public onProductionPhase(player: IPlayer) {
    const corruption = player.underworldData.corruption;
    const money = corruption * 6;
    if (money > 0) {
      player.stock.megacredits += money;
      player.game.log('${0} discarded ${1} corruption and gained ${2} MC', (b) => b.player(player).number(corruption).number(money));
      player.underworldData.corruption = 0;
    }

    let anyCorruptOpponents = false;
    for (const opponent of player.game.getPlayersInGenerationOrder()) {
      if (opponent === player) {
        continue;
      }
      const corruption = opponent.underworldData.corruption;
      if (corruption > 0) {
        anyCorruptOpponents = true;
        opponent.stock.steal(Resource.MEGACREDITS, corruption, player, {log: false});
        player.game.log('${0} was paid ${1} MC from ${2}', (b) => b.player(player).number(corruption).player(opponent));
      }
    }
    if (!anyCorruptOpponents) {
      player.increaseTerraformRating(1);
      player.game.log('${0} gained 1 TR since no opponent had any corruption', (b) => b.player(player));
    }
    return undefined;
  }
}
