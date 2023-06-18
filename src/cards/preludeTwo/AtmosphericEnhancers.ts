import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';
import {PreludeCard} from '../prelude/PreludeCard';
import {Tags} from '../Tags';
import {AltSecondaryTag} from '../render/CardRenderItem';
import {ResourceType} from '../../ResourceType';
import {Celestic} from '../venusNext/Celestic';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectOption} from '../../inputs/SelectOption';
import {Size} from '../render/Size';

export class AtmosphericEnhancers extends PreludeCard {
  constructor() {
    super({
      name: CardName.ATMOSPHERIC_ENHANCERS,
      tags: [Tags.VENUS],
      metadata: {
        cardNumber: '??',
        renderData: CardRenderer.builder((b) => {
          b.cards(2).secondaryTag(AltSecondaryTag.FLOATER);
          b.br.br;
          b.temperature(2, Size.SMALL).slash().oxygen(2, Size.SMALL).slash().venus(2, Size.SMALL);
        }),
        description: 'Raise temperature, oxygen or Venus 2 steps. Draw 2 cards with a floater icon on it.',
      },
    });
  }

  public play(player: Player) {
    const game = player.game;

    player.drawCard(2, {
      include: (card) => Celestic.floaterCards.has(card.name) || card.resourceType === ResourceType.FLOATER,
    });

    const increaseGlobalParameterTwoSteps = new OrOptions();
    increaseGlobalParameterTwoSteps.title = 'Choose global parameter to raise 2 steps';

    const increaseTemp = new SelectOption('Raise temperature 2 steps', 'Raise temperature', () => {
      game.increaseTemperature(player, 2);
      game.log('${0} increased temperature 2 step(s)', (b) => b.player(player));
      return undefined;
    });

    const increaseOxygen = new SelectOption('Raise oxygen 2 steps', 'Raise oxygen', () => {
      game.increaseOxygenLevel(player, 2);
      game.log('${0} increased oxygen level 2 step(s)', (b) => b.player(player));
      return undefined;
    });

    const increaseVenus = new SelectOption('Raise Venus 2 steps', 'Raise Venus', () => {
      game.increaseVenusScaleLevel(player, 2);
      game.log('${0} increased Venus 2 step(s)', (b) => b.player(player));
      return undefined;
    });

    increaseGlobalParameterTwoSteps.options.push(increaseTemp, increaseOxygen, increaseVenus);

    return increaseGlobalParameterTwoSteps;
  }
}

