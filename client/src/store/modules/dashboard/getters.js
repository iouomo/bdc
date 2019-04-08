const currentView = state => state.currentView;
const editMode = state => state.editMode;
const ratio = state => state.ratio;

// 'currentDate' and it`s parts
//
const currentDate = state => state.currentDate;
const ms = (state, getters) => {
  if (state.editMode) {
    return 0;
  }
  const timeZoneOffset = getters.appOffset;
  return getUTCTime(state.currentDate, timeZoneOffset);
};
const firstOfTheMonth = (state, getters) => {
  if (state.editMode) {
    return 0;
  }
  const firstDay = new Date(state.year, state.month);
  const { appOffset } = getters;
  return getUTCTime(firstDay, appOffset);
};
const appOffset = (state, getters) => getters.timeZoneOffset * getters.timeZoneOffsetSign;
const msToDate = (state, getters) => (ms, options) => {
  const clientOffset = new Date().getTimezoneOffset();
  const appOffset = getters.appOffset * -60;
  const date = new Date(ms - 3600000 * (clientOffset - appOffset));

  return date.toLocaleString(state.locale, options);
};
const year = state => state.currentDate.getFullYear();
const month = state => state.currentDate.getMonth();
const date = state => state.currentDate.getDate();
const hours = state => state.currentDate.getHours();
const minutes = state => state.currentDate.getMinutes();
const seconds = state => state.currentDate.getSeconds();
const timeZoneOffset = state => state.timeZoneOffset;
const timeZoneOffsetSign = state => state.timeZoneOffsetSign;

const daysInTheMonth = (state, getters) => {
  const { year } = state;
  const month = state.month + 1;
  return new Date(year, month, 0).getDate();
};
const timeZoneString = (state, getters) => {
  const sign = getters.timeZoneOffsetSign > 0 ? '+' : '';
  return `UTC${sign}${getters.timeZoneOffset}`;
};
const timeZoneList = (state, getters) => {
  const timeZoneListMinusGMT = [
    { value: -0, text: 'GMT', visible: true },
    { value: -1, text: '01:00', visible: true },
    { value: -2, text: '02:00', visible: true },
    { value: -3, text: '03:00', visible: true },
    { value: -3.5, text: '03:30', visible: true },
    { value: -4, text: '04:00', visible: true },
    { value: -5, text: '05:00', visible: true },
    { value: -6, text: '06:00', visible: true },
    { value: -7, text: '07:00', visible: true },
    { value: -8, text: '08:00', visible: true },
    { value: -9, text: '09:00', visible: true },
    { value: -10, text: '10:00', visible: true },
    { value: -11, text: '11:00', visible: true },
    { value: -12, text: '12:00', visible: true },
  ];
  const timeZoneListPlusGMT = [
    { value: 0, text: 'GMT', visible: true },
    { value: 1, text: '01:00', visible: true },
    { value: 2, text: '02:00', visible: true },
    { value: 3, text: '03:00', visible: true },
    { value: 4, text: '04:00', visible: true },
    { value: 4.5, text: '04:30', visible: true },
    { value: 5, text: '05:00', visible: true },
    { value: 5.5, text: '05:30', visible: true },
    { value: 5.75, text: '05:45', visible: true },
    { value: 6, text: '06:00', visible: true },
    { value: 7, text: '07:00', visible: true },
    { value: 8, text: '08:00', visible: true },
    { value: 9, text: '09:00', visible: true },
    { value: 9.5, text: '09:30', visible: true },
    { value: 10, text: '10:00', visible: true },
    { value: 11, text: '11:00', visible: true },
    { value: 12, text: '12:00', visible: true },
  ];
  if (getters.timeZoneOffsetSign === -1) {
    return timeZoneListMinusGMT;
  }
  return timeZoneListPlusGMT;
};
const timeZoneIndex = (state, getters) => {
  let index = getters.timeZoneList.findIndex(
    item => item.value === getters.timeZoneOffset,
  );
  if (index === -1) {
    index = 0;
  }
  return index;
};
const ratioValuesList = (state, getters) => [
  { value: 0, text: 'now', visible: true },
  { value: 1, text: 'sec', visible: true },
  { value: 60, text: 'min', visible: true },
  { value: 3600, text: 'hour', visible: true },
  { value: 86400, text: 'day', visible: true },
];
const ratioIndex = (state, getters) => {
  let index = getters.ratioValuesList.findIndex(
    item => item.value === getters.ratio,
  );
  if (index === -1) {
    index = 0;
  }
  return index;
};

// component`s properties
//
const handlesLabelsProps = (state, getters) => {
  const props = [];
  props.push({
    name: 'ratio',
    sectorDegree: 360 / getters.ratioValuesList.length,
    labels: getters.ratioValuesList,
    degOffset: 90,
  });
  switch (state.currentView) {
    case 'clock':
      props.push({
        name: 'minutes',
        sectorDegree: 6,
        labels: labels(0, 60, 5),
        degOffset: 90,
      });
      props.push({
        name: 'hours',
        sectorDegree: 15,
        labels: labels(0, 24, 1),
        degOffset: 90,
      });
      break;
    case 'calendar':
      props.push({
        name: 'date',
        sectorDegree: 360 / getters.daysInTheMonth,
        labels: labels(0, getters.daysInTheMonth, 1, true),
        degOffset: 90,
      });
      props.push({
        name: 'month',
        sectorDegree: 30,
        labels: labels(0, 12, 1, true),
        degOffset: 90,
      });
      break;
    case 'location':
      props.push({
        name: 'timeZoneOffset',
        sectorDegree: 360 / getters.timeZoneList.length,
        labels: getters.timeZoneList,
        degOffset: 90,
      });
      props.push({
        name: 'timeZoneOffsetSign',
        sectorDegree: 180,
        labels: [
          { value: 1, text: '+', visible: true },
          { value: -1, text: '-', visible: true },
        ],
        degOffset: 0,
      });
  }
  return props;
};
const displayProps = (state, getters) => {
  const props = {
    width: 0.22,
    buttons: [
      { icon: 'clock', view: 'clock' },
      { icon: 'calendar', view: 'calendar' },
      { icon: 'map-marked-alt', view: 'location' },
    ],
    cities: timeZoneCities(state.timeZoneOffset),
    firstColor: '#fbfbfb',
    secondColor: '#18bdf0',
  };
  return props;
};
const firstHandleProps = (state) => {
  const props = {
    width: 0.95,
    strokeColor: '#bcbcbc',
    textColor: '#212121',
    handleColor: '#bcbcbc',
    fillColor: '#ffffff',
    handleRadius: 5,
  };
  return props;
};
const secondHandleProps = (state) => {
  const props = {
    width: 0.78,
    strokeColor: '#bcbcbc',
    textColor: '#212121',
    handleColor: '#fa3635',
    fillColor: '#ffffff',
    handleRadius: 5,
  };
  return props;
};
const thirdHandleProps = (state) => {
  const props = {
    width: 0.61,
    strokeColor: '#bcbcbc',
    textColor: '#212121',
    handleColor: '#ffe135',
    fillColor: 'none',
    handleRadius: 5,
  };
  return props;
};
const firstHandleAngle = (state, getters) => getters.ratioIndex * getters.handlesLabelsProps[0].sectorDegree;
const thirdHandleAngle = (state, getters) => {
  if (state.currentView === 'clock') {
    return state.hours * 15;
  } if (state.currentView === 'calendar') {
    return (state.month + 1) * 30;
  } if (state.currentView === 'location') {
    return getters.timeZoneOffsetSign === -1 ? 180 : 0;
  }
  return 0;
};
const timeZoneCities = (timeZoneOffset) => {
  const timeZoneCitiesList = [
    { value: -12, cities: ['Eniwetok', 'Kwaialein'] },
    { value: -11, cities: ['Midway Island', 'Samoa'] },
    { value: -10, cities: ['Hawaii'] },
    { value: -9, cities: ['Alaska'] },
    { value: -8, cities: ['Los Angeles', 'San Diego', 'San Francisco'] },
    { value: -7, cities: ['Denver', 'Edmonton', 'Phoenix', 'Salt Lake City'] },
    { value: -6, cities: ['Chicago', 'Dallas', 'Houston'] },
    {
      value: -5,
      cities: ['Boston', 'Miami', 'New York', 'Quebec', 'Washington'],
    },
    { value: -4, cities: ['Caracas', 'Labrador', 'Santiago'] },
    { value: -3.5, cities: ['Newfoundland'] },
    {
      value: -3,
      cities: ['Brasilia', 'Buenos Aires', 'Georgetown', 'Rio de Janeiro'],
    },
    { value: -2, cities: ['Mid-Atlantic'] },
    { value: -1, cities: ['Azores', 'Cape Verde Is'] },
    {
      value: -0,
      cities: ['Dublin', 'London', 'Lisbon', 'Edinburgh', 'Morocco', 'Portugal'],
    },
    {
      value: 0,
      cities: ['Dublin', 'London', 'Lisbon', 'Edinburgh', 'Morocco', 'Portugal'],
    },
    {
      value: 1,
      cities: [
        'Amsterdam',
        'Berlin',
        'Vienna',
        'Rome',
        'Madrid',
        'Malta',
        'Prague',
        'Paris',
      ],
    },
    {
      value: 2,
      cities: [
        'Athens',
        'Istanbul',
        'Israel',
        'Helsinki',
        'Riga',
        'Latvia',
        'Cyprus',
      ],
    },
    {
      value: 3,
      cities: [
        'Moscow',
        'St. Petersburg',
        'Baghdad',
        'Tehran',
        'Kuwait',
        'Ankara',
      ],
    },
    {
      value: 4,
      cities: ['Baku', 'Tbilisi', 'Abu Dhabi', 'Kazan', 'Volgograd'],
    },
    { value: 4.5, cities: ['Kabul'] },
    { value: 5, cities: ['Karachi', 'Tashkent', 'Malé'] },
    { value: 5.5, cities: ['India'] },
    { value: 5.75, cities: ['Nepal'] },
    {
      value: 6,
      cities: ['Almaty', 'Dhakar', 'Kathmandu', 'Colombo', 'Sri Lanka'],
    },
    { value: 7, cities: ['Bangkok', 'Hanoi', 'Jakarta', 'Phnom Penh'] },
    {
      value: 8,
      cities: [
        'Chongqing',
        'Hong Kong',
        'Manila',
        'Perth',
        'Singapore',
        'Taipei',
      ],
    },
    { value: 9, cities: ['Osaka', 'Seoul', 'Tokyo', 'Yakutsk'] },
    { value: 9.5, cities: ['Adelaide', 'Darwin'] },
    { value: 10, cities: ['Brisbane', 'Melbourne', 'Sydney', 'Vladivostok'] },
    { value: 11, cities: ['Magadan', 'New Caledonia', 'Solomon Is'] },
    {
      value: 12,
      cities: [
        'Auckland',
        'Fiji',
        'Kamchatka',
        'Marshall Is',
        'Samoa',
        'Wellington',
      ],
    },
  ];

  const timeZoneCities = timeZoneCitiesList.find(
    item => item.value === timeZoneOffset,
  );

  if (timeZoneCities === undefined) {
    return timeZoneCitiesList[0].cities;
  }
  return timeZoneCities.cities;
};
const formattedDate = (state) => {
  const formatter = Intl.DateTimeFormat(state.locale);
  return formatter.format(state.currentDate);
};
const formattedTime = (state) => {
  const formatter = new Intl.DateTimeFormat(state.locale, {
    hour12: false,
    hour: 'numeric',
    minute: 'numeric',
  });
  return formatter.format(state.currentDate);
};
const monthForCalendar = (state, getters) => {
  const { year } = state;
  const { month } = state;
  const date = new Date(year, month, 1);

  const options = {
    year: 'numeric',
    month: 'long',
  };
  return date.toLocaleString(state.locale, options);
};
const dateForCalendar = (state, getters) => (dayNumber) => {
  const { year } = state;
  const { month } = state;
  const date = new Date(year, month, dayNumber);

  const options = {
    weekday: 'short',
    day: 'numeric',
  };
  return date.toLocaleString(state.locale, options);
};
const secondHandleAngle = (state, getters) => {
  if (state.currentView === 'clock') {
    return state.minutes * 6;
  } if (state.currentView === 'calendar') {
    return (state.date * 360) / getters.daysInTheMonth;
  } if (state.currentView === 'location') {
    return getters.timeZoneIndex * getters.handlesLabelsProps[1].sectorDegree;
  }
  return 0;
};
const getUTCTime = (date, timeZoneOffset) => {
  // convert to msec, add local time zone offset and get UTC time in msec
  const utc = date.getTime() + date.getTimezoneOffset() * 60000;
  // return msec for current timezone using supplied offset
  return utc + 3600000 * timeZoneOffset;
};
const labels = (minValue, maxValue, step, lastToFirst = false) => {
  const labels = [];

  for (let i = minValue; i < maxValue; i++) {
    const text = (`0${i}`).slice(-2);
    const visible = i % step === 0;
    const label = { value: i, text, visible };
    labels.push(label);
  }

  if (lastToFirst) {
    labels[0].value = labels.length;
    labels[0].text = (`0${labels.length}`).slice(-2);
  }
  return labels;
};

export default {
  currentView,
  editMode,
  ratio,
  ratioIndex,
  ratioValuesList,
  currentDate,
  ms,
  firstOfTheMonth,
  appOffset,
  year,
  month,
  date,
  hours,
  minutes,
  seconds,
  timeZoneOffset,
  timeZoneOffsetSign,
  daysInTheMonth,
  timeZoneString,
  timeZoneList,
  timeZoneIndex,
  handlesLabelsProps,
  displayProps,
  firstHandleProps,
  secondHandleProps,
  thirdHandleProps,
  firstHandleAngle,
  secondHandleAngle,
  thirdHandleAngle,
  formattedDate,
  formattedTime,
  dateForCalendar,
  monthForCalendar,
  msToDate,
};
