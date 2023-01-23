import {IAward} from './../IAward';
import {Player} from '../../Player';
import {isAresTile} from '../../TileType';
import {CardName} from '../../CardName';
import {ASIMOV_AWARD_BONUS} from '../../constants';

export class Rugged implements IAward {
    public name: string = 'Rugged';
    public description: string = 'Most tiles adjacent to hazards'
    public getScore(player: Player): number {
      let score = player.game.board.spaces.filter((space) =>
        space.player === player &&
        space.tile !== undefined &&
        isAresTile(space.tile.tileType) === false &&
        player.game.board.getAdjacentSpaces(space).some((space) => space.tile !== undefined && isAresTile(space.tile.tileType)),
      ).length;

      if (player.cardIsInEffect(CardName.ASIMOV)) score += ASIMOV_AWARD_BONUS;
      return score;
    }
}
