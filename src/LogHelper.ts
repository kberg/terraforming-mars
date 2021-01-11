import {CardName} from './CardName';
import {Game} from './Game';
import {Player} from './Player';
import {ICard} from './cards/ICard';
import {Resources} from './Resources';
import {ISpace} from './boards/ISpace';
import {TileType} from './TileType';
import {Colony} from './colonies/Colony';
import {Units} from './Units';

export class LogHelper {
  static logAddResource(game: Game, player: Player, card: ICard, qty: number = 1): void {
    let resourceType = 'resource(s)';

    if (card.resourceType) {
      resourceType = card.resourceType.toLowerCase() + '(s)';
    }

    game.log('${0} added ${1} ${2} to ${3}', (b) =>
      b.player(player).number(qty).string(resourceType).card(card));
  }

  static logRemoveResource(game: Game, player: Player, card: ICard, qty: number = 1, effect: string): void {
    let resourceType = 'resource(s)';

    if (card.resourceType) {
      resourceType = card.resourceType.toLowerCase() + '(s)';
    }

    game.log('${0} removed ${1} ${2} from ${3} to ${4}', (b) =>
      b.player(player).number(qty).string(resourceType).card(card).string(effect));
  }

  static logGainStandardResource(game: Game, player: Player, resource: Resources, qty: number = 1) {
    game.log('${0} gained ${1} ${2}', (b) => b.player(player).number(qty).string(resource));
  }

  static logGainProduction(game: Game, player: Player, resource: Resources, qty: number = 1) {
    game.log('${0}\'s ${1} production increased by ${2}', (b) => b.player(player).string(resource).number(qty));
  }

  static logCardChange(game: Game, player: Player, effect: string, qty: number = 1) {
    game.log('${0} ${1} ${2} card(s)', (b) => b.player(player).string(effect).number(qty));
  }

  static logTilePlacement(game: Game, player: Player, space: ISpace, tileType: TileType) {
    this.logBoardTileAction(game, player, space, TileType.toString(tileType) + ' tile');
  }

  static logBoardTileAction(game: Game, player: Player, space: ISpace, description: string, action: string = 'placed') {
    // Skip off-grid tiles
    if (space.x === -1 && space.y === -1) return;
    // Skip solo play random tiles
    if (player.name === 'neutral') return;

    const offset: number = Math.abs(space.y - 4);
    const row: number = space.y + 1;
    const position: number = space.x - offset + 1;

    game.log('${0} ${1} ${2} on row ${3} position ${4}', (b) =>
      b.player(player).string(action).string(description).number(row).number(position));
  }

  static logColonyTrackIncrease(game: Game, player: Player, colony: Colony, steps: number = 1) {
    game.log('${0} increased ${1} colony track ${2} step(s)', (b) =>
      b.player(player).colony(colony).number(steps));
  }

  static logTRIncrease(game: Game, player: Player, steps: number) {
    game.log('${0} gained ${1} TR', (b) => b.player(player).number(steps));
  }

  static logVenusIncrease(game: Game, player: Player, steps: number) {
    game.log('${0} increased Venus scale ${1} step(s)', (b) => b.player(player).number(steps));
  }

  static logDiscardedCards(game: Game, cards: Array<ICard> | Array<CardName>) {
    game.log(cards.length + ' card(s) were discarded', (b) => {
      for (const card of cards) {
        if (typeof card === 'string') {
          b.cardName(card);
        } else {
          b.card(card);
        }
      }
    });
  }

  static logDrawnCards(game: Game, player: Player, cards: Array<ICard> | Array<CardName>) {
    // If |this.count| equals 3, for instance, this generates "${0} drew ${1}, ${2} and ${3}"
    let message = '${0} drew ';
    if (cards.length === 0) {
      message += 'no cards';
    } else {
      for (let i = 0, length = cards.length; i < length; i++) {
        if (i > 0) {
          if (i < length - 1) {
            message += ', ';
          } else {
            message += ' and ';
          }
        }
        message += '${' + (i + 1) + '}';
      }
    }
    game.log(message, (b) => {
      b.player(player);
      for (const card of cards) {
        if (typeof card === 'string') {
          b.cardName(card);
        } else {
          b.card(card);
        }
      }
    });
  }

  // isProduciton needs a value, just not right now.
  static logUnitsDelta(delta: Units, player: Player, _isProduction: boolean, options?: Units.Options) {
    if (options?.log !== undefined && options.log === false) {
      return;
    }

    const gained: Array<string> = [];
    const lost: Array<string> = [];

    if (delta.megacredits > 0) {
      gained.push(`${delta.megacredits} MC`);
    } else if (delta.megacredits < 0) {
      lost.push(`${-delta.megacredits} MC`);
    }

    if (delta.steel > 0) {
      gained.push(`${delta.steel} steel`);
    } else if (delta.steel < 0) {
      lost.push(`${-delta.steel} steel`);
    }

    if (delta.titanium > 0) {
      gained.push(`${delta.titanium} titanium`);
    } else if (delta.titanium < 0) {
      lost.push(`${-delta.titanium} titanium`);
    }

    if (delta.plants > 0) {
      gained.push(`${delta.plants} plants`);
    } else if (delta.plants < 0) {
      lost.push(`${-delta.plants} plants`);
    }

    if (delta.energy > 0) {
      gained.push(`${delta.energy} energy`);
    } else if (delta.energy < 0) {
      lost.push(`${-delta.energy} energy`);
    }

    if (delta.heat > 0) {
      gained.push(`${delta.heat} heat`);
    } else if (delta.heat < 0) {
      lost.push(`${-delta.heat} heat`);
    }

    if (gained.length === 0 && lost.length === 0) {
      return;
    }

    let msg = '${0}';

    if (gained.length > 0) {
      msg = msg + ' gained ' + gained.join(', ');
    }
    if (lost.length > 0) {
      if (gained.length > 0) {
        msg = msg + ' and';
      }

      msg = msg + ((options !== undefined && options.dueTo !== undefined) ? ' lost ' : ' spent ');
      msg = msg + lost.join(', ');
    }

    if (options?.dueTo !== undefined) {
      msg = msg + ' due to ${1}';
    }

    if (options?.globalEvent === true) {
      msg = msg + ' due to a Global Event';
    }

    player.game.log(msg, (b) => {
      b.player(player);
      if (options?.dueTo !== undefined) {
        b.player(options.dueTo);
      }
    });
  }
}
