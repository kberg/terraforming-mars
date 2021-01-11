import {Game} from '../../Game';
import {ICard} from '../ICard';
import {Player} from '../../Player';
import {PlayerInput} from '../../PlayerInput';
import {OrOptions} from '../../inputs/OrOptions';
import {PartialUnits} from '../../Units';

export interface CorporationCard extends ICard {
    initialActionText?: string;
    initialAction?: (player: Player, game: Game) => PlayerInput | undefined;
    startingUnits: PartialUnits;
    startingProduction?: PartialUnits;
    cardCost?: number;
    onCorpCardPlayed?: (
        player: Player,
        game: Game,
        card: CorporationCard
    ) => OrOptions | void;
    onProductionPhase?: (player: Player) => undefined;
    isDisabled?: boolean;
}
