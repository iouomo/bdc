const tickTack = ({ commit, getters, state }, value) => {
  const now = state.currentDate;
  const newDate = new Date(now.setTime(now.getTime() + 1000 * getters.ratio));
  setCurrentDate(newDate, commit);
};
const setCurrentView = ({ commit, state }, value) => {
  commit('setCurrentView', value);
};
const setEditMode = ({ commit }, value) => {
  commit('setEditMode', value);
};
const setRatio = ({ commit, state }, value) => {
  commit('setRatio', value);
};
const setNowDate = ({ commit, state }) => {
  setDate(new Date(), commit);
};
const adjustClock = ({
  dispatch, commit, getters, state,
}, settings) => {
  const { name } = settings;
  const { value } = settings;

  if (name === 'ratio') {
    const currentRatio = getters.ratio;
    const ratio = getters.ratioValuesList[value];
    if (ratio !== undefined) {
      const newRatio = ratio.value;
      commit('setRatio', newRatio);

      if (newRatio === 0) {
        setDate(new Date(), commit);
        setTimeout(() => {
          commit('setRatio', currentRatio);
        }, 1000);
      }
    }
  } else if (name === 'year') {
    const newDate = new Date(state.currentDate.setFullYear(value));
    setCurrentDate(newDate, commit);
  } else if (name === 'month') {
    const newDate = getCorrectedDate(state.currentDate, value, getters.date);
    setCurrentDate(newDate, commit);
  } else if (name === 'date') {
    const newDate = new Date(state.currentDate.setDate(value));
    setCurrentDate(newDate, commit);
  } else if (name === 'hours') {
    const newDate = new Date(state.currentDate.setHours(value));
    setCurrentDate(newDate, commit);
  } else if (name === 'minutes') {
    const newDate = new Date(state.currentDate.setMinutes(value));
    setCurrentDate(newDate, commit);
  } else if (name === 'timeZoneOffset') {
    const timeZone = getters.timeZoneList[value];
    if (timeZone !== undefined) {
      commit('setTimeZoneOffset', timeZone.value);
    }
  } else if (name === 'timeZoneOffsetSign') {
    const currentTimeZoneIndex = getters.timeZoneIndex;
    commit('setTimeZoneOffsetSign', value === 0 ? 1 : -1); // first, set timezone offset sign and get new timezone list
    const timeZoneOffset = getters.timeZoneList[currentTimeZoneIndex].value; // next, get timezone offset from timezone list based on timezone index
    commit('setTimeZoneOffset', timeZoneOffset); // finally, set timezone offset
  }
};
const setCurrentDate = (newDate, commit) => {
  commit('setCurrentDate', newDate);
  commit('setYear', newDate.getFullYear());
  commit('setMonth', newDate.getMonth());
  commit('setDate', newDate.getDate());
  commit('setHours', newDate.getHours());
  commit('setMinutes', newDate.getMinutes());
};
const setDate = (newDate, commit) => {
  setCurrentDate(newDate, commit);
  const timeZoneOffset = -newDate.getTimezoneOffset() / 60;
  commit('setTimeZoneOffset', timeZoneOffset);
  commit('setTimeZoneOffsetSign', timeZoneOffset < 0 ? -1 : 1);
};
const getCorrectedDate = (currentDate, month, date) => {
  const tempDate = new Date(currentDate);
  tempDate.setDate(1);
  tempDate.setMonth(month);
  tempDate.setDate(0);
  const daysInNewMonth = tempDate.getDate();

  if (date > daysInNewMonth) {
    date = daysInNewMonth;
  }
  tempDate.setDate(date);

  return tempDate;
};

export default {
  tickTack,
  setCurrentView,
  setNowDate,
  adjustClock,
  setEditMode,
};
