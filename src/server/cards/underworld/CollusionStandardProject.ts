import {IPlayer} from '../../IPlayer';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {StandardProjectCard} from '../StandardProjectCard';
import {Turmoil} from '../../turmoil/Turmoil';
import {SelectParty} from '../../inputs/SelectParty';
import {AndOptions} from '../../inputs/AndOptions';
import {PartyName} from '../../../common/turmoil/PartyName';
import {SelectAmount} from '../../inputs/SelectAmount';

export class CollusionStandardProject extends StandardProjectCard {
  constructor(properties = {
    name: CardName.COLLUSION_STANDARD_PROJECT,
    cost: 0,

    metadata: {
      cardNumber: '',
      renderData: CardRenderer.builder((b) =>
        b.standardProject('Spend 1 corruption to convert 1 or 2 neutral delegates into your own delegates.',
          (eb) => {
            // TODO(kberg): iconography
            eb.corruption(1).startAction.text('CONVERT');
          }),
      ),
    },
  }) {
    super(properties);
  }

  public override canAct(player: IPlayer): boolean {
    if (player.underworldData.corruption === 0) {
      return false;
    }
    const game = player.game;
    const turmoil = Turmoil.getTurmoil(game);
    if (turmoil.hasDelegatesInReserve(player.id)) {
      return false;
    }
    if (this.getParties(turmoil).length === 0) {
      return false;
    }
    // return super.canAct(player); // Not necessary this time.
    return true;
  }

  actionEssence(player: IPlayer): void {
    player.underworldData.corruption--;
    player.defer(this.execute(player));
  }

  private getParties(turmoil: Turmoil) {
    return turmoil.parties.filter((party) => party.delegates.get('NEUTRAL') > 0).map((party) => party.name);
  }

  public execute(player: IPlayer) {
    const game = player.game;
    const turmoil = Turmoil.getTurmoil(game);
    const parties = this.getParties(turmoil);
    if (parties.length === 0) {
      return undefined;
    }

    const data = {
      partyName: PartyName.GREENS,
      amount: 0,
    };

    const options = new AndOptions(() => {
      const party = turmoil.getPartyByName(data.partyName);
      if (party.delegates.get('NEUTRAL') >= data.amount) {
        throw new Error(`${data.partyName} does not have ${data.amount} delegates.`);
      }
      for (let i = 0; i < data.amount; i++) {
        turmoil.replaceDelegateFromParty('NEUTRAL', player.id, data.partyName, game);
      }

      player.totalDelegatesPlaced += data.amount;
      game.log('${0} sent ${1} delegate(s) in ${2} area', (b) =>
        b.player(player).number(data.amount).partyName(data.partyName));
      return undefined;
    });

    const selectCount = new SelectAmount('Send 1 or 2 delegates', 'choose', (amount) => {
      data.amount = amount;
      return undefined;
    }, 1, 2, true);

    const sendDelegate = new SelectParty('Choose a party', 'Send delegate', parties, (partyName: PartyName) => {
      data.partyName = partyName;
      return undefined;
    });

    options.options.push(selectCount);
    options.options.push(sendDelegate);

    return sendDelegate;
  }
}