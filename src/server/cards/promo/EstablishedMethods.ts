import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {PreludeCard} from '../prelude/PreludeCard';
import {IPlayer} from '../../IPlayer';

export class EstablishedMethods extends PreludeCard {
  constructor() {
    super({
      name: CardName.ESTABLISHED_METHODS,

      behavior: {
        stock: {megacredits: 30},
      },

      metadata: {
        cardNumber: 'X54',
        description: 'Gain 30 M€. Then pay for and perform 1 or 2 standard projects.',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(30).asterix();
        }),
      },

    });
  }

  // The difficult part of this card is detemrining whether the
  // first standard project leaves enough money behind to perform the second
  // standard project.
  //
  // What is the cheapest standard project?
  // That depends a lot on the expansions in play.
  // For the base game, the cheapest standard project is Power Plant (11).
  // The variant Air Scrapping can be as low as 10. (but could cost 3 more if Reds are in power.)
  // The cheapest underworld action is Excavate (7 + steel)
  //   ([let's say] Collusion does not count.)
  //
  // OK, how much do standard projects cost?
  // Well, standard projects can gain MC (oceans, Ares), or other resources (Ares, Mining Guild + That other one)
  // and can cost MC (Ares Nuclear Zone, Turmoil.)
  // Similar Ares issues apply to general tile placement, but those are mostly not
  // an issue now (or at least, they're not reported anymore because they're such outsider issues.)
  //
  // Standard Project effects, and other normal effects apply (discounts, rebates, Turmoil Reds, etc).
  //
  // If we were able to defer some of the second order effects (e.g. Neptunian Power Consultants, drawing cards.)
  // this could be safely undone.
  //
  // Perhaps the best is just "Pay for a standard proejct, and then another if you can afford it."

  go(player: IPlayer, budget: number) {
    const selectCard = player.getStandardProjectOption();
    if (!selectCard.config.enabled?.some((e) => e === true)) {
      return undefined;
    }
    return selectCard;
  }

  bespokePlay(player: IPlayer) {
    return this.go(player, 30);
  }
}
