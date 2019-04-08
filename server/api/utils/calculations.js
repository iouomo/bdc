const swisseph = require("swisseph");
const resolve = require("path").resolve;

const calculations = {
  getJulianDay: async ms => {
    try {
      return await getEphemerisTime(ms);
    } catch (error) {
      throw new Error("Can`t get Julian day: " + error.message);
    }
  },
  daysInMonth: ms => {
    try {
      return daysInMonth(ms);
    } catch (error) {
      throw new Error("Can`t get days in month: " + error.message);
    }
  }
};
const getEphemerisTime = ms => {
  let currentDate = new Date(ms);
  let fullPath = resolve("ephemeris");
  swisseph.swe_set_ephe_path(fullPath);

  let year = currentDate.getFullYear();
  let month = currentDate.getMonth() + 1;
  let day = currentDate.getDate();
  let hour = currentDate.getHours();
  let min = currentDate.getMinutes();
  let sec = currentDate.getSeconds();

  let jd = swisseph.swe_utc_to_jd(
    year,
    month,
    day,
    hour,
    min,
    sec,
    swisseph.SE_GREG_CAL
  );

  return jd.julianDayUT;
};
const daysInMonth = ms => {
  let newDate = new Date(ms);
  let year = newDate.getFullYear();
  let month = newDate.getMonth() + 1;
  return new Date(year, month, 0).getDate();
};

module.exports = calculations;
