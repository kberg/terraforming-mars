import {BoardName} from '@/common/boards/BoardName';
import {RandomBoardOption} from '@/common/boards/RandomBoardOption';
import {BoardNameType} from '@/common/game/NewGameConfig';

/*
 * CSS class coloring each board's hexagon.
 *
 * Boards without one get an uncolored hexagon.
 */
const COLOR_CLASSES: Partial<Record<BoardNameType, string>> = {
  [BoardName.THARSIS]: 'create-game-tharsis',
  [BoardName.HELLAS]: 'create-game-hellas',
  [BoardName.ELYSIUM]: 'create-game-elysium',
  [BoardName.UTOPIA_PLANITIA]: 'create-game-utopia-planitia',
  [BoardName.VASTITAS_BOREALIS_NOVA]: 'create-game-vastitas-borealis-nova',
  [BoardName.AMAZONIS_PLANITIA]: 'create-game-amazonis-planitia',
  [BoardName.TERRA_CIMMERIA_NOVA]: 'create-game-terra-cimmeria-nova',
};

/** CSS class coloring `boardName`'s hexagon, or empty for an uncolored one. */
export function boardColorClass(boardName: BoardNameType): string {
  return COLOR_CLASSES[boardName] ?? '';
}

/** Returns true when `boardName` is one of the random board options. */
export function isRandomBoard(boardName: BoardNameType): boolean {
  return boardName === RandomBoardOption.OFFICIAL || boardName === RandomBoardOption.ALL;
}

/** The boards a random board option chooses from. */
export function boardsForRandomBoardOption(option: RandomBoardOption): Array<BoardName> {
  const allBoards = Object.values(BoardName)
    // TODO(kberg): Re-enable Amazonis Planitia once it's offered in the create-game form.
    .filter((name) => name !== BoardName.AMAZONIS_PLANITIA);

  switch (option) {
  case RandomBoardOption.ALL:
    return allBoards;
  case RandomBoardOption.OFFICIAL:
    return allBoards.filter((name) => {
      return name === BoardName.THARSIS ||
        name === BoardName.HELLAS ||
        name === BoardName.ELYSIUM ||
        name === BoardName.UTOPIA_PLANITIA ||
        name === BoardName.VASTITAS_BOREALIS_NOVA ||
        name === BoardName.TERRA_CIMMERIA_NOVA;
    });
  }
}
