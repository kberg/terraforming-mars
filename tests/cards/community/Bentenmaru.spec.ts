import {expect} from 'chai';
import {AcquiredCompany} from '../../../src/cards/base/AcquiredCompany';
import {AsteroidMiningConsortium} from '../../../src/cards/base/AsteroidMiningConsortium';
import {BigAsteroid} from '../../../src/cards/base/BigAsteroid';
import {MineralDeposit} from '../../../src/cards/base/MineralDeposit';
import {Sabotage} from '../../../src/cards/base/Sabotage';
import {TitaniumMine} from '../../../src/cards/base/TitaniumMine';
import {Bentenmaru} from '../../../src/cards/community/corporations/Bentenmaru';
import {ImportedNutrients} from '../../../src/cards/promo/ImportedNutrients';
import {Game} from '../../../src/Game';
import {OrOptions} from '../../../src/inputs/OrOptions';
import {SelectPlayer} from '../../../src/inputs/SelectPlayer';
import {Player} from '../../../src/Player';
import {Resources} from '../../../src/Resources';
import {TestPlayers} from '../../TestPlayers';

describe('Bentenmaru', function() {
  let card : Bentenmaru; let player : Player; let player2 : Player; let game: Game;

  beforeEach(() => {
    card = new Bentenmaru();
    player = TestPlayers.BLUE.newPlayer();
    player2 = TestPlayers.RED.newPlayer();

    player.corporationCards = [card];
    game = Game.newInstance('foobar', [player, player2], player);
  });

  it('Discards all remaining M€ when passing', function() {
    player.megaCredits = 50;

    player.pass();
    expect(player.megaCredits).to.eq(0);
  });

  it('Gain production normally when playing cards that increase production', function() {
    const acquiredCompany = new AcquiredCompany();
    const titaniumMine = new TitaniumMine();

    acquiredCompany.play(player);
    titaniumMine.play(player);
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(3);
    expect(player.getProduction(Resources.TITANIUM)).to.eq(1);

    acquiredCompany.play(player2);
    titaniumMine.play(player2);
    expect(player2.getProduction(Resources.MEGACREDITS)).to.eq(3);
    expect(player2.getProduction(Resources.TITANIUM)).to.eq(1);
  });

  it('Gain resources normally when playing cards that increase resources', function() {
    const mineralDeposit = new MineralDeposit();
    const importedNutrients = new ImportedNutrients();

    mineralDeposit.play(player);
    importedNutrients.play(player);
    expect(player.steel).to.eq(5);
    expect(player.plants).to.eq(4);

    mineralDeposit.play(player2);
    importedNutrients.play(player2);
    expect(player2.steel).to.eq(5);
    expect(player2.plants).to.eq(4);
  });

  it('Gain production when playing cards that decrease other players\' production', function() {
    const titaniumMine = new TitaniumMine();
    const amc = new AsteroidMiningConsortium();

    titaniumMine.play(player);
    titaniumMine.play(player2);
    expect(player.getProduction(Resources.TITANIUM)).to.eq(1);
    expect(player2.getProduction(Resources.TITANIUM)).to.eq(1);

    amc.play(player);
    const selectPlayer = game.deferredActions.pop()!.execute() as SelectPlayer;
    selectPlayer.cb(player2);
    expect(player.getProduction(Resources.TITANIUM)).to.eq(3);
    expect(player2.getProduction(Resources.TITANIUM)).to.eq(1); // no decrease
  });

  it('Gain resources when playing cards that decrease other players\' resources', function() {
    const sabotage = new Sabotage();
    const bigAsteroid = new BigAsteroid();
    player2.megaCredits = 20;
    player2.steel = 5;
    player2.titanium = 3;
    player2.plants = 8;

    const action = sabotage.play(player) as OrOptions;
    action.options[2].cb();
    expect(player.megaCredits).to.eq(7);
    expect(player2.megaCredits).eq(20); // no decrease

    bigAsteroid.play(player);
    game.deferredActions.runNext(); // raise temperature
    const orOptions = game.deferredActions.pop()!.execute() as OrOptions;
    orOptions.options[0].cb(); // choose to remove plants
    expect(player.plants).to.eq(4);
    expect(player2.plants).eq(8); // no decrease
  });
});
