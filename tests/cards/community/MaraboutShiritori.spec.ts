import {expect} from 'chai';
import {Sabotage} from '../../../src/cards/base/Sabotage';
import {TechnologyDemonstration} from '../../../src/cards/base/TechnologyDemonstration';
import {TransNeptuneProbe} from '../../../src/cards/base/TransNeptuneProbe';
import {MaraboutShiritori} from '../../../src/cards/community/corporations/MaraboutShiritori';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {TestPlayers} from '../../TestPlayers';

describe('MaraboutShiritori', function() {
  let card : MaraboutShiritori; let player : Player; let player2 : Player;

  beforeEach(() => {
    card = new MaraboutShiritori();
    player = TestPlayers.BLUE.newPlayer();
    player2 = TestPlayers.RED.newPlayer();
    Game.newInstance('foobar', [player, player2], player);

    card.play();
    player.corporationCards = [card];
  });

  it('Gives 3 M€ discount on next card if it shares a tag with lastCardPlayed', function() {
    // Discount for owner
    player.lastCardPlayed = new TechnologyDemonstration();
    expect(player.getCardCost(new TransNeptuneProbe())).to.eq(3);

    // No discount for other players
    player2.lastCardPlayed = new TechnologyDemonstration();
    expect(player2.getCardCost(new TransNeptuneProbe())).to.eq(6);
  });

  it('No discount for first card played in the generation', function() {
    player.lastCardPlayed = undefined;
    expect(player.getCardCost(new TransNeptuneProbe())).to.eq(6);
  });

  it('Does not count the event tag as a tag', function() {
    player.lastCardPlayed = new TechnologyDemonstration();
    expect(player.getCardCost(new Sabotage())).to.eq(1);
  });
});
