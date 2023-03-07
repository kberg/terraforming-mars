import {expect} from "chai";
import {AsteroidMining} from "../../../src/cards/base/AsteroidMining";
import {Comet} from "../../../src/cards/base/Comet";
import {MethaneFromTitan} from "../../../src/cards/base/MethaneFromTitan";
import {MoholeArea} from "../../../src/cards/base/MoholeArea";
import {EarthElevator} from "../../../src/cards/colonies/EarthElevator";
import {Game} from "../../../src/Game";
import {Dignitary} from "../../../src/milestones/fanmade/Dignitary";
import {Player} from "../../../src/Player";
import {TestPlayers} from "../../TestPlayers";

describe('Dignitary', () => {
  let milestone : Dignitary; let player : Player; let player2 : Player;

  beforeEach(() => {
    milestone = new Dignitary();
    player = TestPlayers.BLUE.newPlayer();
    player2 = TestPlayers.RED.newPlayer();

    Game.newInstance('test', [player, player2], player);
    player.playedCards.push(new EarthElevator(), new AsteroidMining(), new MoholeArea());
  });

  it('Cannot claim', () => {
    expect(milestone.canClaim(player)).is.false;

    // Event cards do not count
    player.playedCards.push(new Comet());
    expect(milestone.canClaim(player)).is.false;
  });

  it('Can claim', () => {
    player.playedCards.push(new MethaneFromTitan());
    expect(milestone.canClaim(player)).is.true;
  });
});
