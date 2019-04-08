import actions from './actions';
import getters from './getters';
import mutations from './mutations';

function initialState() {
  const date = new Date();
  const timeZoneOffset = -date.getTimezoneOffset() / 60;
  const state = {
    currentDate: date,
    currentView: 'clock',
    locale: 'en-GB', // window.navigator.language,
    editMode: false,
    ratio: 1, // 86400,
    currentUTCDate: 0,
    year: date.getFullYear(),
    month: date.getMonth(),
    date: date.getDate(),
    hours: date.getHours(),
    minutes: date.getMinutes(),
    seconds: date.getSeconds(),
    timeZoneOffset,
    timeZoneOffsetSign: timeZoneOffset < 0 ? -1 : 1,
    daysInTheMonth: 0,
    timeZoneList: [],
    timeZoneIndex: 0,
    handlesLabelsProps: [],
    displayProps: [],
    firstHandleProps: [],
    secondHandleProps: [],
    firstHandleAngle: 0,
    secondHandleAngle: 0,
    formattedDate: '',
    formattedTime: '',
    timerID: '',
    requestTimerID: '',
  };
  return state;
}
export default {
  namespaced: true,
  state: initialState,
  actions,
  getters,
  mutations,
};
