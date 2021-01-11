import {IActionCard} from '../ICard';
import {Tags} from '../Tags';
import {Player} from '../../Player';
import {CorporationCard} from './../corporation/CorporationCard';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectOption} from '../../inputs/SelectOption';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {Game} from '../../Game';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class UtopiaInvest implements IActionCard, CorporationCard {
    public name = CardName.UTOPIA_INVEST;
    public tags = [Tags.BUILDING];
    public startingUnits = {
      megacredits: 40,
    };
    public startingProduction = {
      steel: 1,
      titanium: 1,
    }
    public cardType = CardType.CORPORATION;
    public play() {
      return undefined;
    }
    public canAct(player: Player): boolean {
      return player.megaCreditProduction +
                player.steelProduction +
                player.titaniumProduction +
                player.plantProduction +
                player.energyProduction +
                player.heatProduction > -5;
    }
    private log(player: Player, game: Game, type: string) {
      game.log('${0} decreased ${1} production 1 step to gain 4 ${2}', (b) => b.player(player).string(type).string(type));
    }
    public action(player: Player, game: Game) {
      const result = new OrOptions();
      result.title = 'Select production to decrease one step and gain 4 resources';

      const options: Array<SelectOption> = [];

      const reduceMegacredits = new SelectOption('Decrease MC production', 'Decrease production', () => {
        player.deductMegacredits(1);
        player.addMegacredits(4);
        this.log(player, game, 'megacredit');
        return undefined;
      });

      const reduceSteel = new SelectOption('Decrease steel production', 'Decrease production', () => {
        player.deductSteelProduction(1);
        player.addSteel(4);
        this.log(player, game, 'steel');
        return undefined;
      });

      const reduceTitanium = new SelectOption('Decrease titanium production', 'Decrease production', () => {
        player.deductTitaniumProduction(1);
        player.addTitanium(4);
        this.log(player, game, 'titanium');
        return undefined;
      });

      const reducePlants = new SelectOption('Decrease plants production', 'Decrease production', () => {
        player.deductPlantProduction(1);
        player.addPlants(4);
        this.log(player, game, 'plant');
        return undefined;
      });

      const reduceEnergy = new SelectOption('Decrease energy production', 'Decrease production', () => {
        player.deductEnergyProduction(1);
        player.addEnergy(4);
        this.log(player, game, 'energy');
        return undefined;
      });

      const reduceHeat = new SelectOption('Decrease heat production', 'Decrease production', () => {
        player.deductHeatProduction(1);
        player.addHeat(4);
        this.log(player, game, 'heat');
        return undefined;
      });

      if (player.megaCreditProduction > -5) {
        options.push(reduceMegacredits);
      }
      if (player.steelProduction > 0) {
        options.push(reduceSteel);
      }
      if (player.titaniumProduction > 0) {
        options.push(reduceTitanium);
      }
      if (player.plantProduction > 0) {
        options.push(reducePlants);
      }
      if (player.energyProduction > 0) {
        options.push(reduceEnergy);
      }
      if (player.heatProduction > 0) {
        options.push(reduceHeat);
      }

      result.options = options;
      return result;
    }
    public metadata: CardMetadata = {
      cardNumber: 'R33',
      description: 'You start with 40 MC. Increase your steel and titanium production 1 step each.',
      renderData: CardRenderer.builder((b) => {
        b.br;
        b.megacredits(40).nbsp.production((pb) => pb.steel(1).titanium(1));
        b.corpBox('action', (ce) => {
          ce.action('Decrease any production to gain 4 resources of that kind.', (eb) => {
            eb.production((eb) => eb.wild(1)).startAction.wild(4).digit;
          });
        });
      }),
    }
}
