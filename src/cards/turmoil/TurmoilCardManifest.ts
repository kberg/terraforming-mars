import {CardName} from '../../CardName';
import {GameModule} from '../../GameModule';
import {CardManifest} from '../CardManifest';
import {AerialLenses} from './AerialLenses';
import {BannedDelegate} from './BannedDelegate';
import {CulturalMetropolis} from './CulturalMetropolis';
import {DiasporaMovement} from './DiasporaMovement';
import {EventAnalysts} from './EventAnalysts';
import {GMOContract} from './GMOContract';
import {LakefrontResorts} from './LakefrontResorts';
import {MartianMediaCenter} from './MartianMediaCenter';
import {ParliamentHall} from './ParliamentHall';
import {PoliticalAlliance} from './PoliticalAlliance';
import {Pristar} from './Pristar';
import {PROffice} from './PROffice';
import {PublicCelebrations} from './PublicCelebrations';
import {Recruitment} from './Recruitment';
import {RedTourismWave} from './RedTourismWave';
import {SeptumTribus} from './SeptumTribus';
import {SponsoredMohole} from './SponsoredMohole';
import {BureaucratsDefaultAction} from './standardActions/BureaucratsDefaultAction';
import {BureaucratsPolicy3Action} from './standardActions/BureaucratsPolicy3Action';
import {CentristsDefaultAction} from './standardActions/CentristsDefaultAction';
import {CentristsPolicy3Action} from './standardActions/CentristsPolicy3Action';
import {EmpowerDefaultAction} from './standardActions/EmpowerDefaultAction';
import {GreensPolicy4Action} from './standardActions/GreensPolicy4Action';
import {KelvinistsDefaultAction} from './standardActions/KelvinistsDefaultAction';
import {KelvinistsPolicy3Action} from './standardActions/KelvinistsPolicy3Action';
import {MarsFirstPolicy4Action} from './standardActions/MarsFirstPolicy4Action';
import {PopulistsPolicy3Action} from './standardActions/PopulistsPolicy3Action';
import {RedsPolicy3Action} from './standardActions/RedsPolicy3Action';
import {ScientistsDefaultAction} from './standardActions/ScientistsDefaultAction';
import {SpomePolicy2Action} from './standardActions/SpomePolicy2Action';
import {SpomePolicy4Action} from './standardActions/SpomePolicy4Action';
import {TranshumansPolicy2Action} from './standardActions/TranshumansPolicy2Action';
import {TranshumansPolicy3Action} from './standardActions/TranshumansPolicy3Action';
import {UnityPolicy2Action} from './standardActions/UnityPolicy2Action';
import {UnityPolicy3Action} from './standardActions/UnityPolicy3Action';
import {SupportedResearch} from './SupportedResearch';
import {TerralabsResearch} from './TerralabsResearch';
import {UtopiaInvest} from './UtopiaInvest';
import {VoteOfNoConfidence} from './VoteOfNoConfidence';
import {WildlifeDome} from './WildlifeDome';

export const TURMOIL_CARD_MANIFEST = new CardManifest({
  module: GameModule.Turmoil,
  projectCards: [
    {cardName: CardName.AERIAL_LENSES, Factory: AerialLenses},
    {cardName: CardName.BANNED_DELEGATE, Factory: BannedDelegate},
    {cardName: CardName.CULTURAL_METROPOLIS, Factory: CulturalMetropolis},
    {cardName: CardName.DIASPORA_MOVEMENT, Factory: DiasporaMovement},
    {cardName: CardName.EVENT_ANALYSTS, Factory: EventAnalysts},
    {cardName: CardName.GMO_CONTRACT, Factory: GMOContract},
    {cardName: CardName.MARTIAN_MEDIA_CENTER, Factory: MartianMediaCenter},
    {cardName: CardName.PARLIAMENT_HALL, Factory: ParliamentHall},
    {cardName: CardName.PR_OFFICE, Factory: PROffice},
    {cardName: CardName.POLITICAL_ALLIANCE, Factory: PoliticalAlliance},
    {cardName: CardName.PUBLIC_CELEBRATIONS, Factory: PublicCelebrations},
    {cardName: CardName.RECRUITMENT, Factory: Recruitment},
    {cardName: CardName.RED_TOURISM_WAVE, Factory: RedTourismWave},
    {cardName: CardName.SPONSORED_MOHOLE, Factory: SponsoredMohole},
    {cardName: CardName.SUPPORTED_RESEARCH, Factory: SupportedResearch},
    {cardName: CardName.WILDLIFE_DOME, Factory: WildlifeDome},
    {cardName: CardName.VOTE_OF_NO_CONFIDENCE, Factory: VoteOfNoConfidence},
  ],
  corporationCards: [
    {cardName: CardName.LAKEFRONT_RESORTS, Factory: LakefrontResorts},
    {cardName: CardName.PRISTAR, Factory: Pristar},
    {cardName: CardName.TERRALABS_RESEARCH, Factory: TerralabsResearch},
    {cardName: CardName.UTOPIA_INVEST, Factory: UtopiaInvest},
    {cardName: CardName.SEPTUM_TRIBUS, Factory: SeptumTribus, compatibility: GameModule.Turmoil},
  ],
  turmoilActions: [
    {cardName: CardName.KELVINISTS_DEFAULT_ACTION, Factory: KelvinistsDefaultAction},
    {cardName: CardName.SCIENTISTS_DEFAULT_ACTION, Factory: ScientistsDefaultAction},
    {cardName: CardName.KELVINISTS_POLICY_3_ACTION, Factory: KelvinistsPolicy3Action},
    {cardName: CardName.GREENS_POLICY_4_ACTION, Factory: GreensPolicy4Action},
    {cardName: CardName.MARS_FIRST_POLICY_4_ACTION, Factory: MarsFirstPolicy4Action},
    {cardName: CardName.UNITY_POLICY_2_ACTION, Factory: UnityPolicy2Action},
    {cardName: CardName.UNITY_POLICY_3_ACTION, Factory: UnityPolicy3Action},
    {cardName: CardName.REDS_POLICY_3_ACTION, Factory: RedsPolicy3Action},
    {cardName: CardName.SPOME_POLICY_2_ACTION, Factory: SpomePolicy2Action},
    {cardName: CardName.SPOME_POLICY_4_ACTION, Factory: SpomePolicy4Action},
    {cardName: CardName.EMPOWER_DEFAULT_ACTION, Factory: EmpowerDefaultAction},
    {cardName: CardName.BUREAUCRATS_DEFAULT_ACTION, Factory: BureaucratsDefaultAction},
    {cardName: CardName.BUREAUCRATS_POLICY_3_ACTION, Factory: BureaucratsPolicy3Action},
    {cardName: CardName.POPULISTS_POLICY_3_ACTION, Factory: PopulistsPolicy3Action},
    {cardName: CardName.TRANSHUMANS_POLICY_2_ACTION, Factory: TranshumansPolicy2Action},
    {cardName: CardName.TRANSHUMANS_POLICY_3_ACTION, Factory: TranshumansPolicy3Action},
    {cardName: CardName.CENTRISTS_DEFAULT_ACTION, Factory: CentristsDefaultAction},
    {cardName: CardName.CENTRISTS_POLICY_3_ACTION, Factory: CentristsPolicy3Action},
  ],
});

