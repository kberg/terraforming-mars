import { Colony, IColony } from '../../colonies/Colony';
import { Player } from '../../Player';
import { Game } from '../../Game';
import { ColonyName } from '../../colonies/ColonyName';
import { TileType } from '../../TileType';
import { AresHandler } from '../../ares/AresHandler';
import { SelectSpace } from '../../inputs/SelectSpace';
import { ISpace } from '../../ISpace';
import { LogHelper } from '../../components/LogHelper';
import { MAX_COLONY_TRACK_POSITION } from '../../constants';

export class Deimos extends Colony implements IColony {
    public name = ColonyName.DEIMOS;
    public description: string = "Hazards";

    public trade(player: Player, game: Game, usesTradeFleet: boolean = true): void {
        if (usesTradeFleet) this.beforeTrade(this, player, game);

        let steps = 0;

        if (this.trackPosition === MAX_COLONY_TRACK_POSITION) {
            steps = 3;
        } else if (this.trackPosition > 3) {
            steps = 2;
        } else if (this.trackPosition > 1) {
            steps = 1;
        }

        for (let i = 0; i < steps; i++) {
            const availableSpaces = AresHandler.getAllLandSpacesAdjacentToHazards(game);

            if (availableSpaces.length > 0) {
                game.interrupts.push({
                    player: player,
                    playerInput: new SelectSpace(
                        'Select space adjacent to hazard tile to erode',
                        availableSpaces,
                        (foundSpace: ISpace) => {
                            foundSpace.bonus.forEach((spaceBonus) => game.grantSpaceBonus(player, spaceBonus));
                            foundSpace.bonus = [];
                            game.log("${0} eroded space on row ${1} position ${2}", b => b.player(player).number(foundSpace.x).number(foundSpace.y));
                            return undefined;
                        }
                    ),
                });
            }
        }

        if (usesTradeFleet) this.afterTrade(this, player, game);
    }

    public onColonyPlaced(player: Player, game: Game): undefined {
        super.addColony(this, player, game);

        const availableSpaces = this.getAvailableSpaces(player, game);
        const title = "Select space next to no other tile for hazard";

        if (availableSpaces.length > 0) {
            game.interrupts.push({
                player: player,
                playerInput: new SelectSpace(title, availableSpaces, (foundSpace: ISpace) => {
                    AresHandler.putHazardAt(foundSpace, TileType.DUST_STORM_MILD);
                    foundSpace.bonus.forEach((spaceBonus) => game.grantSpaceBonus(player, spaceBonus));
                    LogHelper.logTilePlacement(game, player, foundSpace, TileType.DUST_STORM_MILD);

                    return undefined;
                })
            });
        }
        
        return undefined;
    }
    
    public giveTradeBonus(player: Player): void {
        player.megaCredits += 1;
    }

    private getAvailableSpaces(player: Player, game: Game): Array<ISpace> {
        return game.board.getAvailableSpacesOnLand(player)
                .filter((space) => {
                    const adjacentSpaces = game.board.getAdjacentSpaces(space);
                    return adjacentSpaces.filter((space) => space.tile !== undefined).length === 0;
                });
    }
}