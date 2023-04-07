import {Game} from "../Game";
import {TerralabsResearch} from "../cards/turmoil/TerralabsResearch";
import {SOLO_START_TR} from "../constants";

export class AutomaHandler {
    private constructor() {}

    public static initialize(game: Game): void {
      game.hasAutomaBot = true;
      game.automaBotScore = SOLO_START_TR;

      // This is just a placeholder for now, we'll add the real bot corporations later
      const automaBotCorporation = new TerralabsResearch();
      game.automaBotCorporation = automaBotCorporation;
      game.log('Bot played ${0}', (b) => b.card(automaBotCorporation));
    }
}