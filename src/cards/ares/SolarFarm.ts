import { AresSpaceBonus } from "../../ares/AresSpaceBonus";
import { CardName } from "../../CardName";
import { Game } from "../../Game";
import { SelectSpace } from "../../inputs/SelectSpace";
import { ISpace } from "../../ISpace";
import { Player } from "../../Player";
import { Resources } from "../../Resources";
import { SpaceBonus } from "../../SpaceBonus";
import { SpaceType } from "../../SpaceType";
import { TileType } from "../../TileType";
import { CardType } from "../CardType";
import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";

export class SolarFarm implements IProjectCard {
    public cost: number = 12;
    public tags: Array<Tags> = [Tags.ENERGY, Tags.STEEL];
    public cardType: CardType = CardType.AUTOMATED;
    public name: CardName = CardName.SOLAR_FARM;
    public play(player: Player, game: Game) {
      return new SelectSpace(
        "Select space for Solar Farm tile",
        game.board.getAvailableSpacesOnLand(player),
        (space: ISpace) => {
            const plantsOnSpace = space.bonus.filter((b) => b === SpaceBonus.PLANT).length;
            player.addProduction(Resources.ENERGY, plantsOnSpace, game);

            game.addTile(player, SpaceType.LAND, space, {
              tileType: TileType.SOLAR_FARM,
              card: this.name
            });
            space.adjacency = {bonus: [AresSpaceBonus.POWER, AresSpaceBonus.POWER]}
            return undefined;
          }
      );
    }
}
