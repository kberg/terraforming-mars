import {expect} from 'chai';
import {ByElection} from '../../../src/server/cards/community/ByElection';
import {IGame} from '../../../src/server/IGame';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {PartyName} from '../../../src/common/turmoil/PartyName';
import {cast, runAllActions} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {SelectOption} from '../../../src/server/inputs/SelectOption';
import {testGame} from '../../TestGame';

describe('ByElection', function() {
  let card: ByElection;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(function() {
    card = new ByElection();
    [game, player] = testGame(2, {turmoilExtension: true});
  });

  it('Should play', function() {
    const turmoil = game.turmoil!;
    expect(turmoil.getPlayerInfluence(player)).eq(0);

    card.play(player);
    runAllActions(game);

    const orOptions = cast(player.popWaitingFor(), OrOptions);
    const subOptions = cast(orOptions.options[0], SelectOption);
    subOptions.cb(undefined);

    expect(turmoil.getPlayerInfluence(player)).eq(1);

    const rulingParty = turmoil.rulingParty;
    expect(rulingParty.name).to.eq(PartyName.MARS);
    expect(turmoil.politicalAgendasData.agendas.get(PartyName.MARS)).deep.eq({bonusId: 'mb01', policyId: 'mfp01'});

    runAllActions(game);
    expect(player.popWaitingFor()).is.undefined;
  });
});
