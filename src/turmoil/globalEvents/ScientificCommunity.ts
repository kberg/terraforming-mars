import {IGlobalEvent} from './IGlobalEvent';
import {GlobalEventName} from './GlobalEventName';
import {PartyName} from '../parties/PartyName';
import {Game} from '../../Game';
import {Turmoil} from '../Turmoil';

export class ScientificCommunity implements IGlobalEvent {
    public name = GlobalEventName.SCIENTIFIC_COMMUNITY;
    public description = 'Gain 1 MC for each card in hand (no limit) and influence.';
    public revealedDelegate = PartyName.REDS;
    public currentDelegate = PartyName.SCIENTISTS;
    public resolve(game: Game, turmoil: Turmoil) {
      game.getPlayers().forEach((player) => {
        const amount = player.cardsInHand.length + turmoil.getPlayerInfluence(player);
        player.addMegacredits(amount, {globalEvent: true});
      });
    }
}
