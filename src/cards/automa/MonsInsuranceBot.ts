import {Card} from '../Card';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {CardRenderer} from '../render/CardRenderer';
import {CorporationCard} from '../corporation/CorporationCard';
import {Player} from '../../Player';
import {Size} from '../render/Size';
import {Resources} from '../../Resources';

export class MonsInsuranceBot extends Card implements CorporationCard {
  constructor() {
    super({
      cardType: CardType.CORPORATION,
      name: CardName.MONS_INSURANCE_BOT,
      startingMegaCredits: 0,

      metadata: {
        cardNumber: 'AU06',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.megacredits(-2).any.asterix();
          });
          b.text('(Each opponent decreases their M€ production 2 steps.)', Size.TINY, false, false);
          b.corpBox('action', (ce) => {
            ce.vSpace(Size.LARGE);
            ce.action('Gain 1 TR.', (eb) => {
              eb.empty().startAction.tr(1);
            });
            ce.vSpace(Size.SMALL);
            ce.effect('When you decrease the bot’s production or resources, gain 3 M€.', (eb) => {
              eb.production((pb) => pb.wild(1).any).or().minus().nbsp(Size.TINY).wild(1).any;
              eb.startEffect.megacredits(3);
            });
            ce.vSpace(Size.SMALL);
          });
        }),
      },
    });
  }

  public play() {
    return undefined;
  }

  public initialAction(player: Player) {
    for (const p of player.game.getPlayers()) {
      p.addProduction(Resources.MEGACREDITS, -2, {log: true});
    }

    return undefined;
  }

  public canAct(): boolean {
    return true;
  }

  public action(player: Player) {
    const game = player.game;
    game.automaBotVictoryPointsBreakdown.terraformRating++;
    game.log('${0} action: Gain 1 TR', (b) => b.card(this));

    return undefined;
  }

  public static resolveMonsInsuranceBot(attacker: Player) {
    attacker.addResource(Resources.MEGACREDITS, 3);
    attacker.game.log('${0} gained 3 M€ from Mons Insurance bot', (b) => b.player(attacker));
  }
}
