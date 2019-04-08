const zodiac = state => state.zodiac;
const planets = state => state.planets;
const elements = state => state.elements;
const plantParts = state => state.plantParts;
const nodes = state => state.nodes;
const colors = state => state.colors;
const coordinates = state => state.coordinates;
const filteredCoordinates = (state, getters, rootState, rootGetters) => state.coordinates.filter(
  item => item.ms === rootGetters['dashboard/ms'],
)[0];
const coordinatesSize = state => state.coordinates.length;
const scale = state => state.scale;
const daysInfo = state => state.daysInfo;
const daysInfoLength = state => state.daysInfo.length;
const dayInfo = state => dayNumber => state.daysInfo.filter(elem => elem.day === dayNumber);

export default {
  zodiac,
  planets,
  elements,
  plantParts,
  nodes,
  colors,
  coordinates,
  coordinatesSize,
  filteredCoordinates,
  scale,
  daysInfo,
  daysInfoLength,
  dayInfo,
};
