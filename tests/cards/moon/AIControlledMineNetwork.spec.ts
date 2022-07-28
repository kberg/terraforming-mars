import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayers} from '../../TestPlayers';
import {AIControlledMineNetwork} from '../../../src/cards/moon/AIControlledMineNetwork';
import {expect} from 'chai';
import {MoonExpansion} from '../../../src/moon/MoonExpansion';
import {IMoonData} from '../../../src/moon/IMoonData';
import {REDS_RULING_POLICY_COST} from '../../../src/constants';
import {Phase} from '../../../src/Phase';
import {Reds} from '../../../src/turmoil/parties/Reds';
import {PoliticalAgendas} from '../../../src/turmoil/PoliticalAgendas';

const MOON_OPTIONS = TestingUtils.setCustomGameOptions({turmoilExtension: true, moonExpansion: true});

describe('AIControlledMineNetwork', () => {
  let player: Player;
  let card: AIControlledMineNetwork;
  let moonData: IMoonData;
  let game: Game;

  beforeEach(() => {
    player = TestPlayers.BLUE.newPlayer();
    game = Game.newInstance('id', [player], player, MOON_OPTIONS);
    card = new AIControlledMineNetwork();
    moonData = MoonExpansion.moonData(game);
  });

  it('can play', () => {
    player.cardsInHand = [card];
    player.megaCredits = card.cost;

    moonData.logisticRate = 1;
    expect(player.getPlayableCards()).does.not.include(card);

    moonData.logisticRate = 2;
    expect(player.getPlayableCards()).does.include(card);
  });

  it('play', () => {
    expect(moonData.logisticRate).eq(0);
    expect(player.getTerraformRating()).eq(14);

    card.play(player);

    expect(moonData.logisticRate).eq(1);
    expect(player.getTerraformRating()).eq(15);
  });

  it('Respects Reds', function() {
    game.phase = Phase.ACTION;
    game.turmoil!.rulingParty = new Reds();
    PoliticalAgendas.setNextAgenda(game.turmoil!, game);
    moonData.logisticRate = 2;

    player.megaCredits = card.cost;
    expect(player.canPlay(card)).is.false;

    player.megaCredits = card.cost + REDS_RULING_POLICY_COST;
    expect(player.canPlay(card)).is.true;
  });
});

