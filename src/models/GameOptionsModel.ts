import {BoardName} from '../boards/BoardName';
import {RandomMAOptionType} from '../RandomMAOptionType';
import {AgendaStyle} from '../turmoil/PoliticalAgendas';
import {CardName} from '../CardName';

export interface GameOptionsModel {
  archaeologyExtension: boolean,
  aresExtension: boolean,
  boardName: BoardName,
  cardsBlackList: Array<CardName>;
  coloniesExtension: boolean,
  colosseumVariant: boolean,
  communityCardsOption: boolean,
  corporateEra: boolean,
  draftVariant: boolean,
  escapeVelocityMode: boolean,
  escapeVelocityThreshold?: number,
  escapeVelocityPeriod?: number,
  escapeVelocityPenalty?: number,
  fastModeOption: boolean,
  initialDraftVariant: boolean,
  leadersExpansion: boolean,
  moonExpansion: boolean,
  newOpsExpansion: boolean,
  preludeExtension: boolean,
  promoCardsOption: boolean,
  politicalAgendasExtension: AgendaStyle,
  societyExpansion: boolean,
  showTimers: boolean,
  shuffleMapOption: boolean,
  shuffleMoonMapOption: boolean,
  silverCubeVariant: boolean,
  singleTradeVariant: boolean,
  solarPhaseOption: boolean,
  soloTR: boolean,
  randomMA: RandomMAOptionType,
  randomTurmoil: boolean,
  turmoilExtension: boolean,
  venusNextExtension: boolean,
  requiresVenusTrackCompletion: boolean,
  altVenusBoard: boolean,
}