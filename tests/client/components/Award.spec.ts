import {mount} from '@vue/test-utils';
import {getLocalVue} from './getLocalVue';
import {expect} from 'chai';
import Award from '@/client/components/Award.vue';
import {FundedAwardModel} from '@/common/models/FundedAwardModel';

function createAward(
  {funded, scores = []}:
  {funded: boolean, scores?: FundedAwardModel['scores']},
): FundedAwardModel {
  return {
    name: `Cosmic Settler`,
    playerName: funded ? 'Foo' : '',
    playerColor: funded ? 'red': '',
    scores,
  };
}

const DESCRIPTION = 'Own the most cities not on Mars';

describe('Award', () => {
  it('shows passed award', () => {
    const award = createAward({funded: false});
    const wrapper = mount(Award, {
      localVue: getLocalVue(),
      propsData: {award},
    });

    expect(wrapper.text()).to.include(award.name);
  });

  it(`doesn't show award's description`, () => {
    const award = createAward({funded: false});
    const wrapper = mount(Award, {
      localVue: getLocalVue(),
      propsData: {award},
    });

    expect(wrapper.text()).to.not.include(DESCRIPTION);
  });

  it(`doesn't show scores`, () => {
    const award = createAward({
      funded: true,
      scores: [
        {playerColor: 'red', playerScore: 2},
      ],
    });

    const wrapper = mount(Award, {
      localVue: getLocalVue(),
      propsData: {award},
    });

    expect(wrapper.find('[data-test=player-score]').exists()).to.be.false;
  });

  it(`shows scores if showScores is passed`, () => {
    const award = createAward({
      funded: true,
      scores: [
        {playerColor: 'red', playerScore: 2},
      ],
    });

    const wrapper = mount(Award, {
      localVue: getLocalVue(),
      propsData: {award, showScores: true},
    });

    expect(wrapper.find('[data-test=player-score]').exists()).to.be.true;
  });

  it(`colors player's score`, () => {
    const award = createAward({
      funded: true,
      scores: [
        {playerColor: 'red', playerScore: 2},
      ],
    });

    const wrapper = mount(Award, {
      localVue: getLocalVue(),
      propsData: {award, showScores: true},
    });

    const scoreWrapper = wrapper.find('[data-test=player-score]');
    expect(scoreWrapper.classes()).to.includes(`player_bg_color_${award.scores[0].playerColor}`);
  });

  it('shows sorted players scores', () => {
    const award = createAward({
      funded: false,
      scores: [
        {playerColor: 'red', playerScore: 2},
        {playerColor: 'blue', playerScore: 4},
        {playerColor: 'yellow', playerScore: 0},
        {playerColor: 'green', playerScore: 4},
      ],
    });

    const wrapper = mount(Award, {
      localVue: getLocalVue(),
      propsData: {award, showScores: true},
    });

    const scores = wrapper.findAll('[data-test=player-score]')
      .wrappers.map((scoreWrapper) => parseInt(scoreWrapper.text()));

    expect(scores).to.be.deep.eq([4, 4, 2, 0]);
  });

  it(`shows player's cube if award is funded`, () => {
    const award = createAward({funded: true});
    const wrapper = mount(Award, {
      localVue: getLocalVue(),
      propsData: {award},
    });

    expect(wrapper.find(`.board-cube--${award.playerColor}`).exists()).to.be.true;
  });

  it(`creates correct css class from award's name`, () => {
    const award = createAward({funded: true});
    const wrapper = mount(Award, {
      localVue: getLocalVue(),
      propsData: {award},
    });

    expect(wrapper.find('.ma-name--cosmic-settler').exists()).to.be.true;
  });
});
