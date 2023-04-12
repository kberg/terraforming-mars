import {Card} from '../Card';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {CardRenderer} from '../render/CardRenderer';
import {CardRenderDynamicVictoryPoints} from '../render/CardRenderDynamicVictoryPoints';
import {CorporationCard} from '../corporation/CorporationCard';
import {Size} from '../render/Size';
import {Player} from '../../Player';
import {AutomaHandler} from '../../automa/AutomaHandler';
import {GameSetup} from '../../GameSetup';
import {TileType} from '../../TileType';
import {ISpace} from '../../boards/ISpace';
import {Game} from '../../Game';

export class TharsisBot extends Card implements CorporationCard {
  constructor() {
    super({
      cardType: CardType.CORPORATION,
      name: CardName.THARSIS_BOT,
      startingMegaCredits: 0,

      metadata: {
        cardNumber: 'AU02',
        description: 'During setup, place a city tile.',
        renderData: CardRenderer.builder((b) => {
          b.br;
          b.city();
          b.corpBox('action', (ce) => {
            ce.vSpace(Size.LARGE);
            ce.action('Place a city tile. 1 VP per 3 cities at game end.', (eb) => {
              eb.empty().startAction.city();
            });
            ce.vSpace();
            ce.vSpace(Size.LARGE);
          });
        }),
        victoryPoints: CardRenderDynamicVictoryPoints.cities(1, 3, true),
      },
    });
  }

  public play() {
    return undefined;
  }

  public initialAction(player: Player) {
    const game = player.game;
    const neutral = GameSetup.neutralPlayerFor(game.id);

    const targetCitySpace: ISpace = AutomaHandler.getTargetCitySpace(game);
    game.simpleAddTile(neutral, game.board.getSpace(targetCitySpace.id), {tileType: TileType.CITY});
    AutomaHandler.grantBonusesForBotTilePlacement(game, targetCitySpace, neutral, TileType.CITY);

    const adjacentGreeneries = game.board.getAdjacentSpaces(targetCitySpace).filter((s) => s.tile?.tileType === TileType.GREENERY).length;
    game.automaBotVictoryPointsBreakdown.city += adjacentGreeneries;
    game.log('${0} initial action: Place a city on row ${1} position ${2}', (b) => b.card(this).number(targetCitySpace.y + 1).number(targetCitySpace.x - Math.abs(targetCitySpace.y - 4) + 1));

    return undefined;
  }

  public canAct(): boolean {
    return true;
  }

  public action(player: Player) {
    const game = player.game;
    const neutral = GameSetup.neutralPlayerFor(game.id);

    const targetCitySpace: ISpace = AutomaHandler.getTargetCitySpace(game);
    game.simpleAddTile(neutral, game.board.getSpace(targetCitySpace.id), {tileType: TileType.CITY});
    AutomaHandler.grantBonusesForBotTilePlacement(game, targetCitySpace, neutral, TileType.CITY);

    const adjacentGreeneries = game.board.getAdjacentSpaces(targetCitySpace).filter((s) => s.tile?.tileType === TileType.GREENERY).length;
    game.automaBotVictoryPointsBreakdown.city += adjacentGreeneries;
    game.log('${0} action: Place a city on row ${1} position ${2}', (b) => b.card(this).number(targetCitySpace.y + 1).number(targetCitySpace.x - Math.abs(targetCitySpace.y - 4) + 1));

    return undefined;
  }

  public static scoreVictoryPoints(game: Game): void {
    const citiesInPlay = game.getCitiesInPlay();

    if (game.automaBotCorporation?.name === CardName.THARSIS_BOT && citiesInPlay % 3 === 0) {
      game.automaBotVictoryPointsBreakdown.victoryPoints++;
      game.automaBotVictoryPointsBreakdown.updateTotal();
    }
  }
}
