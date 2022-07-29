import {CardName} from '../../CardName';
import {Player} from '../../Player';
import {CardType} from '../CardType';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {ResourceType} from '../../ResourceType';
import {IActionCard} from '../ICard';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectOption} from '../../inputs/SelectOption';
import {MoonExpansion} from '../../moon/MoonExpansion';
import {CardRenderer} from '../render/CardRenderer';
import {CardRenderDynamicVictoryPoints} from '../render/CardRenderDynamicVictoryPoints';
import {Units} from '../../Units';
import {MoonCard} from './MoonCard';
import {LogHelper} from '../../LogHelper';
import {MAXIMUM_COLONY_RATE, REDS_RULING_POLICY_COST} from '../../constants';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';

export class DarksideIncubationPlant extends MoonCard implements IActionCard, IProjectCard {
  constructor() {
    super({
      name: CardName.DARKSIDE_INCUBATION_PLANT,
      cardType: CardType.ACTIVE,
      tags: [Tags.MICROBE, Tags.MOON],
      cost: 11,
      resourceType: ResourceType.MICROBE,
      reserveUnits: Units.of({titanium: 1}),

      metadata: {
        description: {
          text: 'Spend 1 titanium. 1 VP for every 2 microbes here.',
          align: 'left',
        },
        cardNumber: 'M45',
        renderData: CardRenderer.builder((b) => {
          b.action('Add 1 microbe here.', (eb) => {
            eb.empty().startAction.microbes(1);
          }).br;
          b.action('Spend 2 microbes to raise the Colony Rate 1 step.', (eb) => {
            eb.microbes(2).startAction.moonColonyRate();
          });

          b.br;
          b.minus().titanium(1);
        }),
        victoryPoints: CardRenderDynamicVictoryPoints.microbes(1, 2),
      },
    });
  };
  public resourceCount = 0;

  public play(player: Player) {
    super.play(player);
    return undefined;
  }

  public canAct() {
    return true;
  }

  public action(player: Player) {
    if (this.resourceCount < 2) {
      player.addResourceTo(this, {log: true});
      return undefined;
    }

    const orOptions = new OrOptions();
    const redsAreRuling = PartyHooks.shouldApplyPolicy(player, PartyName.REDS);

    MoonExpansion.ifMoon(player.game, (moonData) => {
      if (!redsAreRuling || (redsAreRuling && player.canAfford(REDS_RULING_POLICY_COST)) || moonData.colonyRate === MAXIMUM_COLONY_RATE) {
        orOptions.options.push(new SelectOption('Spend 2 microbes to raise the Colony Rate 1 step', 'Select', () => {
          player.removeResourceFrom(this, 2);
          LogHelper.logRemoveResource(player, this, 2, 'raise the Colony Rate');
          MoonExpansion.raiseColonyRate(player);
          return undefined;
        }));
      }
    });

    orOptions.options.push(new SelectOption('Add 1 microbe to this card', 'Add microbe', () => {
      player.addResourceTo(this, {log: true});
      return undefined;
    }));

    if (orOptions.options.length === 1) return orOptions.options[0].cb();
    return orOptions;
  }

  public getVictoryPoints() {
    return Math.floor(this.resourceCount / 2);
  }
}
