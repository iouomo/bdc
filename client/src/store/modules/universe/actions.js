import PlanetsService from 'services/PlanetsService'; 

const clearCoordinates = ({ commit }) => {
  commit('clearCoordinates');
};
const completeCoordinates = ({ commit }, newCoordinates) => {
  commit('completeCoordinates', newCoordinates);
};
const setScale = ({ commit, state }, value) => {
  commit('setScale', state.scale * value);
};
const getCoordinates = async (ms, ratio) => {
  let coordinates = [];
  try {
    coordinates = await PlanetsService.fetchCoordinates(ms, ratio);
  } catch (error) {}
  return coordinates;
};
const fillCoordinates = async ({ commit, state }, { ms, ratio }) => {
  const restCoordinates = state.coordinates.filter(item => item.ms > ms);
  const newCoordinates = await getCoordinates(ms, ratio);
  const coordinates = restCoordinates.concat(newCoordinates);

  commit('completeCoordinates', coordinates);
};
const eraseDayInfo = async ({ commit }) => {
  commit('eraseDayInfo');
};
const getDayInfo = async (ms) => {
  let dayInfo = [];
  try {
    dayInfo = await PlanetsService.fetchDayInfo(ms);
  } catch (error) {}
  return dayInfo;
};
const fillDayInfo = async ({ commit }, { ms, dayNumber }) => {
  const dayInfo = await getDayInfo(ms, dayNumber);
  if (Object.entries(dayInfo).length !== 0) {
    commit('completeDayInfo', { day: dayNumber, info: dayInfo });
  }
};
const setShowPaths = ({ commit }, settings) => {
  settings.forEach((element, index) => {
    commit('setShowPath', { index, value: element });
  });
};

export default {
  fillCoordinates,
  clearCoordinates,
  completeCoordinates,
  setScale,
  setShowPaths,
  eraseDayInfo,
  fillDayInfo,
};
