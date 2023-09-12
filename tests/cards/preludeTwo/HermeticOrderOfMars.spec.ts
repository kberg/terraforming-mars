import {expect} from 'chai';
import {HermeticOrderOfMars} from '../../../src/cards/preludeTwo/HermeticOrderOfMars';
import {Player} from '../../../src/Player';
import {TestPlayers} from '../../TestPlayers';
import {Game} from '../../../src/Game';
import {SpaceName} from '../../../src/SpaceName';
import {SpaceType} from '../../../src/SpaceType';
import {Resources} from '../../../src/Resources';
import {TestingUtils} from '../../TestingUtils';

describe('HermeticOrderOfMars', function() {
  let card : HermeticOrderOfMars; let player : Player; let player2 : Player; let game: Game;

  beforeEach(() => {
    card = new HermeticOrderOfMars();
    
    player = TestPlayers.BLUE.newPlayer();
    player2 = TestPlayers.RED.newPlayer();
    const gameOptions = TestingUtils.setCustomGameOptions();
    game = Game.newInstance('foobar', [player, player2], player, gameOptions);
  });

  it('Play', function() {
    const tharsis = game.board.getSpace(SpaceName.THARSIS_THOLUS);
    const lands = game.board.getAdjacentSpaces(tharsis).filter((space) => space.spaceType === SpaceType.LAND);
    game.addCityTile(player, lands[0].id);

    card.play(player);
    expect(player.getProduction(Resources.MEGACREDITS)).eq(2);
    expect(player.megaCredits).eq(3);
  });
});
