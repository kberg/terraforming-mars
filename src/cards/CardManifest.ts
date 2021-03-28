import {CardName} from '../CardName';
import {OldDeck} from '../OldDeck';
import {GameModule} from '../GameModule';
import {CorporationCard} from './corporation/CorporationCard';
import {ICardFactory} from './ICardFactory';
import {IProjectCard} from './IProjectCard';
import {StandardProjectCard} from './StandardProjectCard';
import {StandardActionCard} from './StandardActionCard';

export class CardManifest {
    module: GameModule;
    projectCards : OldDeck<IProjectCard>;
    cardsToRemove: Set<CardName>;
    corporationCards : OldDeck<CorporationCard>;
    preludeCards : OldDeck<IProjectCard>;
    standardProjects : OldDeck<StandardProjectCard>;
    standardActions : OldDeck<StandardActionCard>;
    constructor(arg: {
         module: GameModule,
         projectCards?: Array<ICardFactory<IProjectCard>>,
         cardsToRemove?: Array<CardName>,
         corporationCards?: Array<ICardFactory<CorporationCard>>,
         preludeCards?: Array<ICardFactory<IProjectCard>>,
         standardProjects?: Array<ICardFactory<StandardProjectCard>>,
         standardActions?: Array<ICardFactory<StandardActionCard>>,
         }) {
      this.module = arg.module;
      this.projectCards = new OldDeck<IProjectCard>(arg.projectCards || []);
      this.cardsToRemove = new Set(arg.cardsToRemove || []);
      this.corporationCards = new OldDeck<CorporationCard>(arg.corporationCards || []);
      this.preludeCards = new OldDeck<IProjectCard>(arg.preludeCards || []);
      this.standardProjects = new OldDeck<StandardProjectCard>(arg.standardProjects || []);
      this.standardActions = new OldDeck<StandardActionCard>(arg.standardActions || []);
    }
}
