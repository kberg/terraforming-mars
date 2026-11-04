<!-- Popup for choosing how the game's milestones and awards are picked, or picking them by hand. -->
<template>
  <PopupPanel class="create-game-ma-popup" @close="$emit('close')">
    <template #header>
      <h2>
        <span v-i18n>Milestones and Awards</span>&nbsp;<a :href="WIKI_URLS.randomMilestonesAndAwards" class="tooltip" v-i18n data-tooltip="Link opens in a new tab/window" target="_blank">&#9432;</a>
      </h2>
    </template>
    <div class="create-game-ma-row">
      <span class="create-game-ma-row-heading" v-i18n>Type</span>
      <template v-for="m in MA_MODES" :key="m">
        <input type="radio" name="maMode" :value="m" :checked="mode === m" @change="setMode(m)" :id="modeId(m)">
        <label :for="modeId(m)" v-i18n>{{ MA_MODE_LABELS[m] }}</label>
      </template>
    </div>

    <div v-if="mode === 'random'" class="create-game-ma-row">
      <span class="create-game-ma-row-heading" v-i18n>Pool</span>
      <template v-for="src in MA_SOURCES" :key="src">
        <input type="radio" name="maSource" :value="src" :checked="source === src" @change="setSource(src)" :id="sourceId(src)">
        <label :for="sourceId(src)" v-i18n>{{ MA_SOURCE_LABELS[src] }}</label>
      </template>
    </div>

    <div v-if="mode === 'random'" class="create-game-ma-row">
      <span class="create-game-ma-row-heading" v-i18n>Randomness</span>
      <template v-for="synergy in MA_SYNERGIES" :key="synergy">
        <input type="radio" name="maSynergy" :value="synergy" :checked="randomMA === synergy" @change="$emit('update:randomMA', synergy)" :id="synergyId(synergy)">
        <label :for="synergyId(synergy)" v-i18n>{{ synergy }}</label>
      </template>
    </div>

    <template v-if="mode === 'manual'">
      <div class="corporations-filter-toolbox-cont">
        <div class="corporations-filter-toolbox">
          <input class="filter" :placeholder="$t('filter')" v-model="filterText">
        </div>
      </div>
      <!-- As many columns as fit the width, scrolling down for the rest. Awards start a new column. -->
      <div class="create-game-ma-scroll">
        <div class="create-game-ma-lists">
          <div class="create-game-ma-heading">
            <span v-i18n>Milestones</span>&nbsp;({{ milestones.length }}/{{ limit }})
          </div>
          <div v-for="name in MILESTONES" :key="name" v-show="include(name)" class="create-game-ma-item">
            <label class="form-checkbox">
              <input type="checkbox" :value="name" v-model="milestones" :disabled="!milestones.includes(name) && milestones.length >= limit">
              <i class="form-icon"></i>
              <span class="create-game-ma-name">
                <span v-i18n>{{ baseName(name) }}</span><template v-if="nameNumber(name)">&nbsp;({{ nameNumber(name) }})</template>
                <div v-if="getMilestone(name).requirements" :class="icon(getMilestone(name).requirements)"></div>
              </span>
            </label>
          </div>
          <div class="create-game-ma-heading create-game-ma-heading--awards">
            <span v-i18n>Awards</span>&nbsp;({{ awards.length }}/{{ limit }})
          </div>
          <div v-for="name in AWARDS" :key="name" v-show="include(name)" class="create-game-ma-item">
            <label class="form-checkbox">
              <input type="checkbox" :value="name" v-model="awards" :disabled="!awards.includes(name) && awards.length >= limit">
              <i class="form-icon"></i>
              <span class="create-game-ma-name">
                <span v-i18n>{{ baseName(name) }}</span><template v-if="nameNumber(name)">&nbsp;({{ nameNumber(name) }})</template>
                <div v-if="getAward(name).requirements" :class="icon(getAward(name).requirements)"></div>
              </span>
            </label>
          </div>
        </div>
      </div>
    </template>
  </PopupPanel>
</template>

<script setup lang="ts">
import {computed, ref, watch} from 'vue';
import PopupPanel from '../common/PopupPanel.vue';
import {MilestoneName, milestoneNames} from '@/common/ma/MilestoneName';
import {AwardName, awardNames} from '@/common/ma/AwardName';
import {CustomMA} from '@/common/ma/CustomMA';
import {RandomMAOptionType} from '@/common/ma/RandomMAOptionType';
import {Expansion} from '@/common/cards/GameModule';
import {getAward, getMilestone} from '@/client/MilestoneAwardManifest';
import {WIKI_URLS} from '@/client/utils/WikiLinks';
import {MA_MODE_LABELS, MA_MODES, MA_SOURCE_LABELS, MA_SOURCES, MA_SYNERGIES, MAMode, MASource, maMode, maModeOptions, maSource, maSourceOptions} from './maMode';

const MILESTONES: ReadonlyArray<MilestoneName> = milestoneNames.toSorted();
const AWARDS: ReadonlyArray<AwardName> = awardNames.toSorted();

const props = defineProps<{
  randomMA: RandomMAOptionType;
  modularMA: boolean;
  includeFanMA: boolean;
  customMA: CustomMA | undefined;
  /** How many milestones, and how many awards, a hand-picked selection needs. */
  limit: number;
}>();

const emit = defineEmits<{
  'update:randomMA': [value: RandomMAOptionType];
  'update:modularMA': [value: boolean];
  'update:includeFanMA': [value: boolean];
  'update:customMA': [value: CustomMA | undefined];
  'close': [];
}>();

const mode = computed(() => maMode(props.randomMA));
const source = computed(() => maSource(props.modularMA, props.includeFanMA));

const filterText = ref('');
// Kept while the popup is open, so switching away from 'manual' and back restores the picks.
const milestones = ref<Array<MilestoneName>>([...props.customMA?.milestones ?? []]);
const awards = ref<Array<AwardName>>([...props.customMA?.awards ?? []]);

function modeId(m: MAMode): string {
  return 'maMode-' + m + '-radio';
}

function synergyId(synergy: RandomMAOptionType): string {
  return synergy === RandomMAOptionType.LIMITED ? 'maSynergy-limited-radio' : 'maSynergy-full-radio';
}

function setMode(m: MAMode) {
  const options = maModeOptions(m, props.randomMA, props.modularMA);
  emit('update:randomMA', options.randomMA);
  emit('update:modularMA', options.modularMA);
  // customMA is only valid in manual mode.
  emit('update:customMA', m === 'manual' ? {milestones: [...milestones.value], awards: [...awards.value]} : undefined);
}

// Some names end in a number, such as Tactician4, which is shown as Tactician (4).
const NUMBERED_NAME = /^(.*\D)(\d+)$/;

/** The name without its trailing number. */
function baseName(name: string): string {
  return NUMBERED_NAME.exec(name)?.[1] ?? name;
}

/** The name's trailing number, if it has one. */
function nameNumber(name: string): string | undefined {
  return NUMBERED_NAME.exec(name)?.[2];
}

function sourceId(src: MASource): string {
  return 'maSource-' + src.replace('+', '-') + '-radio';
}

function setSource(src: MASource) {
  const options = maSourceOptions(src);
  emit('update:modularMA', options.modularMA);
  emit('update:includeFanMA', options.includeFanMA);
}

function include(name: string): boolean {
  const normalized = filterText.value.toLocaleUpperCase();
  return normalized.length === 0 || baseName(name).toLocaleUpperCase().includes(normalized);
}

function icon(module: Expansion | undefined): string | undefined {
  if (module === undefined) {
    return undefined;
  }
  const suffix = module === 'colonies' ? 'colony' : module === 'moon' ? 'themoon' : module;
  return `create-game-expansion-icon expansion-icon-${suffix}`;
}

watch([milestones, awards], () => {
  emit('update:customMA', {milestones: [...milestones.value], awards: [...awards.value]});
}, {deep: true});
</script>

<style scoped lang="less">
// A fixed-size popup whose body fills the space under the header, so the lists can fill it.
.create-game-ma-popup :deep(.popup-inner) {
  display: flex;
  flex-direction: column;
}

.create-game-ma-popup :deep(.popup-body) {
  display: flex;
  flex-direction: column;
  flex: 1 1 0;
  min-height: 0;
}

.create-game-ma-row {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.create-game-ma-row-heading {
  margin-right: 8px;
  font-weight: bold;
}

// Fills the rest of the popup, and scrolls down when the lists are taller than that.
.create-game-ma-scroll {
  flex: 1 1 0;
  min-height: 0;
  margin-top: 8px;
  overflow: hidden auto;
}

// As many columns as fit the width, balanced. Its height isn't limited, so it never adds columns sideways.
.create-game-ma-lists {
  column-width: 200px;
  column-gap: 20px;
}

.create-game-ma-heading {
  font-weight: bold;
  break-after: avoid;
}

.create-game-ma-heading--awards {
  break-before: column;
}

.create-game-ma-item {
  break-inside: avoid;
}

// The popup sits inside .create-game-page-column, whose labels look like buttons.
// Restore spectre's checkbox look, as in the corporations filter.
.create-game-ma-lists label.form-checkbox,
.create-game-ma-lists label.form-checkbox:hover {
  display: block;
  color: inherit;
  background-color: transparent;
  font-family: inherit;
  font-size: inherit;
  text-align: left;
  border-radius: 0;
  min-width: 0;
  height: auto;
  min-height: 1.4rem;
  line-height: 1.2rem;
  margin: .2rem 0;
  padding: .1rem .4rem .1rem 1.2rem;
  cursor: pointer;
}

// Keeps the expansion icon on the same line as the name.
.create-game-ma-name {
  white-space: nowrap;
}

// Fits the expansion icon within the line, so rows with an icon are no taller than the rest.
.create-game-ma-lists .create-game-expansion-icon {
  width: 1.2rem;
  height: 1.2rem;
  background-size: 1.2rem 1.2rem;
  margin: 0 0 0 6px;
  vertical-align: top;
}
</style>
