const setCurrentView = (state, newView) => {
  state.currentView = newView;
};
const setEditMode = (state, value) => {
  state.editMode = value;
};
const setRatio = (state, value) => {
  state.ratio = value;
};
const setCurrentDate = (state, currentDate) => {
  state.currentDate = currentDate;
};
const setYear = (state, year) => {
  state.year = year;
};
const setMonth = (state, month) => {
  state.month = month;
};
const setDate = (state, date) => {
  state.date = date;
};
const setHours = (state, hours) => {
  state.hours = hours;
};
const setMinutes = (state, minutes) => {
  state.minutes = minutes;
};
const setTimeZoneOffset = (state, timeZoneOffset) => {
  state.timeZoneOffset = timeZoneOffset;
};
const setTimeZoneOffsetSign = (state, timeZoneOffsetSign) => {
  state.timeZoneOffsetSign = timeZoneOffsetSign;
};

export default {
  setCurrentView,
  setRatio,
  setEditMode,
  setCurrentDate,
  setYear,
  setMonth,
  setDate,
  setHours,
  setMinutes,
  setTimeZoneOffset,
  setTimeZoneOffsetSign,
};
