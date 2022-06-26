import {expect} from 'chai';
import {Ants} from '../../src/cards/base/Ants';
import {Fish} from '../../src/cards/base/Fish';
import {Satellites} from '../../src/cards/base/Satellites';
import {SecurityFleet} from '../../src/cards/base/SecurityFleet';
import {HousePrinting} from '../../src/cards/prelude/HousePrinting';
import {SelfReplicatingRobots} from '../../src/cards/promo/SelfReplicatingRobots';
import {Game} from '../../src/Game';
import {Player} from '../../src/Player';
import {SponsoredProjects} from '../../src/turmoil/globalEvents/SponsoredProjects';
import {Kelvinists} from '../../src/turmoil/parties/Kelvinists';
import {Turmoil} from '../../src/turmoil/Turmoil';
import {TestingUtils} from '../TestingUtils';
import {TestPlayers} from '../TestPlayers';

describe('SponsoredProjects', function() {
  let card : SponsoredProjects; let player : Player; let player2 : Player; let game : Game;

  beforeEach(() => {
    card = new SponsoredProjects();
    player = TestPlayers.BLUE.newPlayer();
    player2 = TestPlayers.RED.newPlayer();

    const gameOptions = TestingUtils.setCustomGameOptions();
    game = Game.newInstance('foobar', [player, player2], player, gameOptions);

    const turmoil = Turmoil.getTurmoil(game);
    turmoil.chairman = player2.id;
    turmoil.dominantParty = new Kelvinists();
    turmoil.dominantParty.partyLeader = player2.id;
    turmoil.dominantParty.delegates.push(player2.id);
    turmoil.dominantParty.delegates.push(player2.id);
  });

  it('resolve play', function() {
    const ants = new Ants();
    player.playedCards.push(ants);
    ants.resourceCount++;

    const securityFleet = new SecurityFleet();
    player2.playedCards.push(securityFleet);
    securityFleet.resourceCount++;

    player2.playedCards.push(new Fish());

    const turmoil = Turmoil.getTurmoil(game);
    card.resolve(game, turmoil);

    expect(player.playedCards[0].resourceCount).eq(2);
    expect(player2.playedCards[0].resourceCount).eq(2);
    expect(player2.playedCards[1].resourceCount).eq(0);
    expect(player2.cardsInHand).has.lengthOf(3);
  });

  it('Adds resources to SelfReplicatingRobots cards', function() {
    const srr = new SelfReplicatingRobots();
    player.playedCards.push(srr);

    const srrTarget1 = {card: new HousePrinting(), resourceCount: 0};
    const srrTarget2 = {card: new Satellites(), resourceCount: 2};
    srr.targetCards.push(srrTarget1);
    srr.targetCards.push(srrTarget2);

    const turmoil = Turmoil.getTurmoil(game);
    card.resolve(game, turmoil);
    expect(srrTarget1.resourceCount).eq(0);
    expect(srrTarget2.resourceCount).eq(3);
  });
});
