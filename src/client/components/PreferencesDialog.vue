<template>
    <div class="preferences_panel" :data="syncPreferences()">
      <div class="preferences_panel_item">
        <label class="form-switch">
          <input type="checkbox" v-on:change="updatePreferences" v-model="prefs.hide_awards_and_milestones" data-test="hide_awards_and_milestones">
          <i class="form-icon"></i> <span v-i18n>Hide awards and milestones</span>
        </label>
      </div>
      <div class="preferences_panel_item">
        <label class="form-switch">
          <input type="checkbox" v-on:change="updatePreferences" v-model="prefs.small_cards" data-test="small_cards">
          <i class="form-icon"></i> <span v-i18n>Smaller cards</span>
        </label>
      </div>
      <div class="preferences_panel_item">
        <label class="form-switch">
          <input type="checkbox" v-on:change="updatePreferences" v-model="prefs.magnify_cards" data-test="magnify_cards">
          <i class="form-icon"></i> <span v-i18n>Magnify cards on hover</span>
        </label>
      </div>
      <div class="preferences_panel_item">
        <label class="form-switch">
          <input type="checkbox" v-on:change="updatePreferences" v-model="prefs.hide_discount_on_cards" data-test="hide_discount_on_cards">
          <i class="form-icon"></i> <span v-i18n>Hide discount on cards</span>
        </label>
      </div>
      <div class="preferences_panel_item">
        <label class="form-switch">
          <input type="checkbox" v-on:change="updatePreferences" v-model="prefs.remove_background" data-test="remove_background">
          <i class="form-icon"></i> <span v-i18n>Remove background image</span>
        </label>
      </div>
      <div class="preferences_panel_item">
        <label class="form-switch">
          <input type="checkbox" v-on:change="updatePreferences" v-model="prefs.show_alerts" data-test="show_alerts">
          <i class="form-icon"></i> <span v-i18n>Show in-game alerts</span>
        </label>
      </div>
      <div class="preferences_panel_item">
        <label class="form-switch">
          <input type="checkbox" v-on:change="updatePreferences" v-model="prefs.enable_sounds" data-test="enable_sounds">
          <i class="form-icon"></i> <span v-i18n>Enable sounds</span>
        </label>
      </div>
      <div class="preferences_panel_item">
        <label class="form-switch">
          <input type="checkbox" v-on:change="updatePreferences" v-model="prefs.hide_animated_sidebar" data-test="hide_animated_sidebar">
          <i class="form-icon"></i> <span v-i18n>Hide sidebar notification</span>
        </label>
      </div>
      <div class="preferences_panel_item">
        <label class="form-switch">
          <input type="checkbox" v-on:change="updatePreferences" v-model="prefs.hide_tile_confirmation" data-test="hide_tile_confirmation">
          <i class="form-icon"></i> <span v-i18n>Hide tile confirmation</span>
        </label>
      </div>
      <div class="preferences_panel_item">
        <label class="form-switch">
          <input type="checkbox" v-on:change="updatePreferences" v-model="prefs.learner_mode" data-test="learner_mode">
          <i class="form-icon"></i>
          <span v-i18n>Learner Mode (req. refresh)</span>
          <span class="tooltip tooltip-left" :data-tooltip="$t('Show information that can be helpful\n to players who are still learning the games')">&#9432;</span>
        </label>
      </div>

      <div class="preferences_panel_item">
        <label class="form-switch">
          <input type="checkbox" v-on:change="updatePreferences" v-model="prefs.symbol_overlay" data-test="symbol_overlay">
          <i class="form-icon"></i>
          <span v-i18n>Symbol Overlay</span>
          <span class="tooltip tooltip-left" :data-tooltip="$t('Add symbols on top of player colors.')">&#9432;</span>
        </label>
      </div>

      <div class="preferences_panel_item">
        <label class="form-switch">
          <input type="checkbox" v-on:change="updatePreferences" v-model="prefs.experimental_ui" data-test="experimental_ui">
          <i class="form-icon"></i>
          <span v-i18n>Experimental UI</span>
          <span class="tooltip tooltip-left" :data-tooltip="$t('Test out any possible new experimental UI features for feedback.')">&#9432;</span>
        </label>
      </div>
      <div class="preferences_panel_item">
        <label class="form-switch">
          <input type="checkbox" v-on:change="updatePreferences" v-model="prefs.debug_view" data-test="debug_view">
          <i class="form-icon"></i>
          <span v-i18n>Debug View</span>
          <span class="tooltip tooltip-left" :data-tooltip="$t('Add information useful for development and debugging.')">&#9432;</span>
        </label>
      </div>

      <div class="preferences_panel_actions">
        <button class="btn btn-lg btn-primary" v-on:click="okClicked" v-i18n>Ok</button>
        <button class="btn btn-lg btn-primary" v-on:click="$refs.bugDialog.show();" v-i18n>Report a bug</button>
      </div>
      <bug-report-dialog ref="bugDialog"></bug-report-dialog>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {WithRefs} from 'vue-typed-refs';

import {getPreferences, PreferencesManager, Preference} from '@/client/utils/PreferencesManager';
import BugReportDialog from '@/client/components/BugReportDialog.vue';

type Refs = {
  bugDialog: InstanceType<typeof BugReportDialog>,
}

export default (Vue as WithRefs<Refs>).extend({
  name: 'PreferencesDialog',
  props: {
    preferencesManager: {
      type: Object as () => PreferencesManager,
    },
  },
  components: {
    'bug-report-dialog': BugReportDialog,
  },
  data() {
    return {
      prefs: {...this.preferencesManager.values()},
    };
  },
  methods: {
    setBoolPreferencesCSS(
      target: HTMLElement,
      val: boolean,
      name: Preference,
    ): void {
      const cssClassSuffix = name;
      if (val) {
        target.classList.add('preferences_' + cssClassSuffix);
      } else {
        target.classList.remove('preferences_' + cssClassSuffix);
      }
    },
    updatePreferences(): void {
      for (const k of Object.keys(this.preferencesManager.values()) as Array<Preference>) {
        const val = this.prefs[k];
        this.preferencesManager.set(k, val, /* setOnChange */ true);
      }
    },
    syncPreferences(): void {
      const target = document.getElementById('ts-preferences-target');
      if (!target) return;

      for (const k of Object.keys(this.prefs) as Array<Preference>) {
        if (k === 'lang') continue;
        this.setBoolPreferencesCSS(target, this.prefs[k], k);
      }

      if (!target.classList.contains('language-' + this.prefs.lang)) {
        target.classList.add('language-' + this.prefs.lang);
      }
    },
    okClicked(): void {
      this.$emit('okButtonClicked');
    },
  },
  computed: {
    getPreferences(): typeof getPreferences {
      return getPreferences;
    },

  },
});
</script>
