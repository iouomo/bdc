const clearCoordinates = (state) => {
  state.coordinates = [];
};
const completeCoordinates = (state, coordinates) => {
  state.coordinates = coordinates.slice();
};
const setScale = (state, value) => {
  state.scale = value;
};
const setShowPath = (state, params) => {
  state.planets[params.index].showPath = params.value;
};
const completeDayInfo = (state, params) => {
  state.daysInfo = [...state.daysInfo, params];
};
const eraseDayInfo = (state) => {
  state.daysInfo = [];
};

export default {
  clearCoordinates,
  completeCoordinates,
  setScale,
  setShowPath,
  eraseDayInfo,
  completeDayInfo,
};
