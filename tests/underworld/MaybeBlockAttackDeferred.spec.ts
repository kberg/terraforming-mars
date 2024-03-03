import {expect} from 'chai';
import {TestPlayer} from '../TestPlayer';
import {testGame} from '../TestGame';
import {Game} from '../../src/server/Game';
import {cast, formatMessage} from '../TestingUtils';
import {Cryptocurrency} from '../../src/server/cards/pathfinders/Cryptocurrency';
import {MartianCulture} from '../../src/server/cards/pathfinders/MartianCulture';
import {GHGProducingBacteria} from '../../src/server/cards/base/GHGProducingBacteria';
import {RegolithEaters} from '../../src/server/cards/base/RegolithEaters';
import {IProjectCard} from '../../src/server/cards/IProjectCard';
import {Phase} from '../../src/common/Phase';
import {PlayerInput} from '../../src/server/PlayerInput';
import {OrOptions} from '../../src/server/inputs/OrOptions';
import {PrivateMilitaryContractor} from '../../src/server/cards/underworld/PrivateMilitaryContractor';
import {MaybeBlockAttackDeferred} from '../../src/server/underworld/MaybeBlockAttackDeferred';

describe('UnderworldExpansion', function() {
  let player1: TestPlayer;
  let player2: TestPlayer;
  let game: Game;
  let dataCard1: IProjectCard;
  let dataCard2: IProjectCard;
  let microbeCard1: IProjectCard;
  let microbeCard2: IProjectCard;

  beforeEach(() => {
    [game, player1, player2] = testGame(2, {underworldExpansion: true});
    dataCard1 = new Cryptocurrency();
    dataCard2 = new MartianCulture();
    microbeCard1 = new GHGProducingBacteria();
    microbeCard2 = new RegolithEaters();
    player1.playedCards = [dataCard1, dataCard2, microbeCard1, microbeCard2];
    game.phase = Phase.ACTION;
  });

  class MaybeBlockAttackTester {
    // The target of the attack. If you want a different target, change this before calling run.
    public target = player1;
    // The perpetrator of the attack. If you want a different perpetrator, change this before calling run.
    public perpetrator = player2;

    // Will be true if the callback is invoked.
    public called: boolean = false;
    // True if the caller did not block.
    public proceed: boolean = false;
    // And player input the target must immediately resolve.
    public playerInput: PlayerInput | undefined = undefined;

    public run() {
      const deferredAction = new MaybeBlockAttackDeferred(this.target, this.perpetrator).andThen((proceed) => {
        this.proceed = proceed;
        this.called = true;
        return undefined;
      });
      this.playerInput = deferredAction.execute();
    }
  }

  it('maybeBlockAttack - disabled', () => {
    [game, player1, player2] = testGame(2, {underworldExpansion: false});
    const tester = new MaybeBlockAttackTester();

    tester.run();

    expect(tester.called).is.true;
    expect(tester.proceed).is.true;
    expect(tester.playerInput).is.undefined;
  });

  it('maybeBlockAttack - cannot afford', () => {
    player1.underworldData.corruption = 0;
    const tester = new MaybeBlockAttackTester();

    tester.run();

    expect(tester.called).is.true;
    expect(tester.proceed).is.true;
    expect(tester.playerInput).is.undefined;
  });

  it('maybeBlockAttack - do not block', () => {
    player1.underworldData.corruption = 1;
    const tester = new MaybeBlockAttackTester();

    tester.run();

    expect(tester.called).is.false;

    const orOptions = cast(tester.playerInput, OrOptions);
    orOptions.options[1].cb();

    expect(tester.called).is.true;
    expect(tester.proceed).is.true;
    expect(player1.underworldData.corruption).eq(1);
  });

  it('maybeBlockAttack - block', () => {
    player1.underworldData.corruption = 1;
    const tester = new MaybeBlockAttackTester();

    tester.run();

    expect(tester.called).is.false;

    const orOptions = cast(tester.playerInput, OrOptions);
    orOptions.options[0].cb();

    expect(tester.called).is.true;
    expect(tester.proceed).is.false;
    expect(player1.underworldData.corruption).eq(0);
  });

  it('maybeBlockAttack - block self', () => {
    player1.underworldData.corruption = 1;
    const tester = new MaybeBlockAttackTester();
    tester.perpetrator = player1;
    tester.target = player1;

    tester.run();

    expect(tester.called).is.false;

    const orOptions = cast(tester.playerInput, OrOptions);
    orOptions.options[0].cb();

    expect(tester.called).is.true;
    expect(tester.proceed).is.false;
    expect(player1.underworldData.corruption).eq(0);
  });

  it('maybeBlockAttack - privateMilitaryContractor - no resources', () => {
    const privateMilitaryContractor = new PrivateMilitaryContractor();
    player1.playedCards.push(privateMilitaryContractor);
    const tester = new MaybeBlockAttackTester();
    privateMilitaryContractor.resourceCount = 0;

    tester.run();

    expect(tester.called).is.true;
    expect(tester.proceed).is.true;
  });

  it('maybeBlockAttack - privateMilitaryContractor - resources', () => {
    const privateMilitaryContractor = new PrivateMilitaryContractor();
    player1.playedCards.push(privateMilitaryContractor);
    const tester = new MaybeBlockAttackTester();
    privateMilitaryContractor.resourceCount = 2;

    tester.run();

    expect(tester.called).is.false;

    const orOptions = cast(tester.playerInput, OrOptions);

    expect(orOptions.options.length).eq(2);
    orOptions.options[0].cb();

    expect(tester.called).is.true;
    expect(tester.proceed).is.false;
    expect(player1.underworldData.corruption).eq(0);
    expect(privateMilitaryContractor.resourceCount).eq(1);
  });

  it('maybeBlockAttack - privateMilitaryContractor - resources and corruption', () => {
    const privateMilitaryContractor = new PrivateMilitaryContractor();
    player1.playedCards.push(privateMilitaryContractor);
    const tester = new MaybeBlockAttackTester();
    privateMilitaryContractor.resourceCount = 2;
    player1.underworldData.corruption = 2;

    tester.run();

    expect(tester.called).is.false;

    const orOptions = cast(tester.playerInput, OrOptions);

    expect(orOptions.options.length).eq(3);
    expect(formatMessage(orOptions.options[0].title)).matches(/Private Military Contractor/);
    orOptions.options[0].cb();

    expect(tester.called).is.true;
    expect(tester.proceed).is.false;
    expect(player1.underworldData.corruption).eq(2);
    expect(privateMilitaryContractor.resourceCount).eq(1);
  });
});
