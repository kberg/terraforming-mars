import {expect} from "chai";
import {Game} from "../../../src/Game";
import {Ambassador} from "../../../src/milestones/fanmade/Ambassador";
import {Player} from "../../../src/Player";
import {Turmoil} from "../../../src/turmoil/Turmoil";
import {TestingUtils} from "../../TestingUtils";
import {TestPlayers} from "../../TestPlayers";

describe('Ambassador', () => {
  let milestone : Ambassador; let player : Player; let player2 : Player; let game: Game; let turmoil: Turmoil;

  beforeEach(() => {
    milestone = new Ambassador();
    player = TestPlayers.BLUE.newPlayer();
    player2 = TestPlayers.RED.newPlayer();

    const gameOptions = TestingUtils.setCustomGameOptions();
    game = Game.newInstance('foobar', [player, player2], player, gameOptions);
    turmoil = Turmoil.getTurmoil(game);
  });

  it('Cannot claim', () => {
    player.totalChairmanshipsWon = 3;
    expect(milestone.canClaim(player)).is.false;

    player.totalChairmanshipsWon = 0;

    for (let i = 0; i < 3; i++) {
      turmoil.parties[i].partyLeader = player.id;
    }

    expect(milestone.canClaim(player)).is.false;
  });

  it('Can claim', () => {
    // 4 chairmanships
    player.totalChairmanshipsWon = 4;
    expect(milestone.canClaim(player)).is.true;

    // Hybrid scenario
    player.totalChairmanshipsWon = 1;

    for (let i = 0; i < 3; i++) {
      turmoil.parties[i].partyLeader = player.id;
    }

    expect(milestone.canClaim(player)).is.true;

    // 4 party leaders
    player.totalChairmanshipsWon = 0;
    turmoil.parties[3].partyLeader = player.id;
    expect(milestone.canClaim(player)).is.true;
  });
});
