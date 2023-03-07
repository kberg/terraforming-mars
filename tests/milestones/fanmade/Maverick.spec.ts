import {expect} from "chai";
import {MicroMills} from "../../../src/cards/base/MicroMills";
import {CommunityServices} from "../../../src/cards/colonies/CommunityServices";
import {ProductiveOutpost} from "../../../src/cards/colonies/ProductiveOutpost";
import {QuantumCommunications} from "../../../src/cards/colonies/QuantumCommunications";
import {MetalsCompany} from "../../../src/cards/prelude/MetalsCompany";
import {ResearchCoordination} from "../../../src/cards/prelude/ResearchCoordination";
import {Game} from "../../../src/Game";
import {Maverick} from "../../../src/milestones/fanmade/Maverick";
import {Player} from "../../../src/Player";
import {TestPlayers} from "../../TestPlayers";

describe('Maverick', () => {
  let milestone : Maverick; let player : Player; let player2 : Player;

  beforeEach(() => {
    milestone = new Maverick();
    player = TestPlayers.BLUE.newPlayer();
    player2 = TestPlayers.RED.newPlayer();

    Game.newInstance('test', [player, player2], player);
    player.playedCards.push(new MetalsCompany(), new CommunityServices(), new ProductiveOutpost(), new MicroMills());
  });

  it('Cannot claim', () => {
    expect(milestone.canClaim(player)).is.false;
  });

  it('Can claim', () => {
    player.playedCards.push(new QuantumCommunications());
    expect(milestone.canClaim(player)).is.true;
  });

  it('Works with wild tags', () => {
    player.playedCards.push(new ResearchCoordination());
    expect(milestone.canClaim(player)).is.true;
  });
});
