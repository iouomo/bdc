const swisseph = require("swisseph");
const utils = {
  defaultFlag: () =>
    swisseph.SEFLG_SWIEPH | swisseph.SEFLG_TRUEPOS | swisseph.SEFLG_J2000,
  planets: value => {
    try {
      return planets(value);
    } catch (error) {
      throw new Error("Can`t get planets: " + error.message);
    }
  },
  zodiacSign: value => zodiacSign(value)
};
const planets = (withEarth = true) => {
  let planets = [
    {
      number: swisseph.SE_MOON,
      name: "Moon"
    },
    {
      number: swisseph.SE_VENUS,
      name: "Venus"
    },
    {
      number: swisseph.SE_MERCURY,
      name: "Mercury"
    },
    {
      number: swisseph.SE_SUN,
      name: "Sun"
    },
    {
      number: swisseph.SE_MARS,
      name: "Mars"
    },
    {
      number: swisseph.SE_JUPITER,
      name: "Jupiter"
    },
    {
      number: swisseph.SE_SATURN,
      name: "Saturn"
    },
    {
      number: swisseph.SE_URANUS,
      name: "Uranus"
    },
    {
      number: swisseph.SE_NEPTUNE,
      name: "Neptune"
    },
    {
      number: swisseph.SE_PLUTO,
      name: "Pluto"
    }
  ];
  if (withEarth) {
    planets.unshift({
      number: swisseph.SE_EARTH,
      name: "Earth"
    });
  }

  return planets;
};
const zodiacSign = longitude => {
  if (longitude >= 29 && longitude < 53) {
    return "Aries";
  } else if (longitude >= 53 && longitude < 89) {
    return "Taurus";
  } else if (longitude >= 89 && longitude < 117) {
    return "Gemini";
  } else if (longitude >= 117 && longitude < 138) {
    return "Cancer";
  } else if (longitude >= 138 && longitude < 173) {
    return "Leo";
  } else if (longitude >= 173 && longitude < 219) {
    return "Virgo";
  } else if (longitude >= 219 && longitude < 237) {
    return "Libra";
  } else if (longitude >= 237 && longitude < 268) {
    return "Scorpio";
  } else if (longitude >= 268 && longitude < 298) {
    return "Sagittarius";
  } else if (longitude >= 298 && longitude < 326) {
    return "Capricorn";
  } else if (longitude >= 326 && longitude < 351) {
    return "Aquarius";
  } else if (
    (longitude >= 351 && longitude < 360) ||
    (longitude >= 0 && longitude < 29)
  ) {
    return "Pisces";
  } else {
    return "";
  }
};

module.exports = utils;