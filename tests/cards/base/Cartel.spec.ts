import {expect} from 'chai';
import {Cartel} from '../../../src/server/cards/base/Cartel';
import {ImportedHydrogen} from '../../../src/server/cards/base/ImportedHydrogen';
import {InterstellarColonyShip} from '../../../src/server/cards/base/InterstellarColonyShip';
import {LunarBeam} from '../../../src/server/cards/base/LunarBeam';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';

describe('Cartel', () => {
  let card: Cartel;
  let player: TestPlayer;

  beforeEach(() => {
    card = new Cartel();
    [/* game */, player] = testGame(2);
  });

  it('Should play', () => {
    card.play(player);
    expect(player.production.megacredits).to.eq(1);

    player.playedCards.push(new LunarBeam()); // green card with an earth tag.

    card.play(player);
    expect(player.production.megacredits).to.eq(3);
  });

  it('Correctly counts tags', () => {
    const cards = [
      new ImportedHydrogen(), // event with earth tag
      new InterstellarColonyShip(), // event with earth tag
      new LunarBeam(), // green card with earth tag
    ];

    player.playedCards.push(...cards);
    card.play(player);
    expect(player.production.megacredits).to.eq(2); // events are excluded
  });
});
