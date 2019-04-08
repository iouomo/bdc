const Swisseph = require("swisseph");
const Bluebird = require("bluebird");
const Calculations = require("../utils/calculations");
const Utils = require("../utils/utils");

const planets = {
  coordinates: async params => {
    try {
      let ms = +params.ms;
      let ratio = +params.ratio;
      let flag = Utils.defaultFlag();
      let planets = Utils.planets();
      let requests = [];
      for (let i = 0; i < 11; i++) {
        // 10+1 minutes or hours or days or months
        requests.push(getCoordinates(ms, flag, planets));
        ms += 1000 * ratio;
      }
      let data = await Promise.all(requests);
      return data;
    } catch (error) {
      return {
        ms: params.ms,
        error: error.message
      };
    }
  },
  aspects: async params => {
    let ms = +params.ms;
    let flag = Utils.defaultFlag();
    let planets = Utils.planets(false);

    let values = [];
    for (let i = 0; i < 1440; i++) {
      // 1440 minutes a day
      values.push(ms);
      ms += 1000 * 60; // plus one minute
    }

    return await Bluebird.map(
      values,
      item => {
        return getAspects(item, flag, planets);
      }, // async function that returns promise
      { concurrency: 300 }
    )
      .then(results => {
        // results is an array of data from all the resolved promises
        // return results
        let moonAP = apogeePerigee(results);
        let data = {
          ms: params.ms,
          moonDistance: moonDistance(results),
          moonPhase: moonPhase(results),
          moonApogee: moonAP.apogee,
          moonPerigee: moonAP.perigee,
          aspects: checkAspects(results)
        };
        return data;
      })
      .catch(err => {
        return err;
      });
  }
};
const getCoordinates = async (ms, flag, planets) => {
  try {
    let julianDay = await Calculations.getJulianDay(ms);

    let data = {
      ms: ms
    };

    // polar coordinates
    data.polar = await planets.map(planet => {
      let coord = Swisseph.swe_calc_ut(julianDay, planet.number, flag);
      return {
        longitude: coord.longitude,
        distance: coord.distance
      };
    });

    // cartesian coordinates
    flag |= Swisseph.SEFLG_XYZ;
    data.cartesian = await planets.map(planet => {
      let coord = Swisseph.swe_calc_ut(julianDay, planet.number, flag);
      return {
        x: coord.x,
        y: coord.y
      };
    });

    data.zodiac = data.polar.map(elem => Utils.zodiacSign(elem.longitude));

    return data;
  } catch (error) {
    return {
      ms: ms,
      lineNumber: error.lineNumber,
      error: error.message
    };
  }
};
const getAspects = async (ms, flag, planets) => {
  try {
    let julianDay = await Calculations.getJulianDay(ms);

    let data = {
      ms: ms
    };

    let polar = await planets.map(planet => {
      let coord = Swisseph.swe_calc_ut(julianDay, planet.number, flag);
      return {
        longitude: coord.longitude,
        distance: coord.distance
      };
    });

    // MOON
    data.moonDistance = polar[0].distance;
    data.moonVisibility = moonVisibility(
      polar[0].longitude,
      polar[3].longitude
    );

    let fixedLong = polar[0].longitude.toFixed(2);
    let nothNode = await Swisseph.swe_calc_ut(
      julianDay,
      Swisseph.SE_TRUE_NODE,
      flag
    ).longitude.toFixed(2);
    data.nothNode = fixedLong === nothNode;
    data.southNode = fixedLong === +nothNode + 180;

    let roundedLong = polar[0].longitude.toFixed(2);
    data.ascendent = roundedLong === 90.0;
    data.descendent = roundedLong === 270.0;

    // other info
    data.zodiac = polar.map(elem => Utils.zodiacSign(elem.longitude));
    data.trine = calcAspect(polar, 120);
    data.conjunction = calcAspect(polar, 0);
    data.opposition = calcAspect(polar, 180);

    return data;
  } catch (error) {
    return {
      ms: ms,
      lineNumber: error.lineNumber,
      error: error.message
    };
  }
};
const moonDistance = data => {
  return (
    data.reduce(
      (acc, elem) => (acc += elem.moonDistance),
      data[0].moonDistance
    ) / 1440
  ); // 1440
};
const moonVisibility = (moonPos, sunPos) => {
  let angle = +Swisseph.swe_difdegn(moonPos, sunPos).degreeDiff.toFixed(1);
  return angle;
};
const moonPhase = data => {
  let maxAngle = Math.max(
    ...data.map(elem => elem.moonVisibility),
    data[0].moonVisibility
  );
  let newMoon = data.filter(elem => elem.moonVisibility === 0);
  let fullMoon = data.filter(elem => elem.moonVisibility === 180);
  return {
    maxAngle: maxAngle === 360 ? 0 : (maxAngle / 180).toFixed(2),
    newMoon: newMoon.length > 0 ? newMoon[0].ms : undefined,
    fullMoon: fullMoon.length > 0 ? fullMoon[0].ms : undefined
  };
};
const apogeePerigee = data => {
  let apogee = {};
  let perigee = {};

  data.forEach((elem, index, arr) => {
    if (index == 0) {
      apogee.ms = elem.ms;
      apogee.distance = elem.moonDistance;
      perigee.ms = elem.ms;
      perigee.distance = elem.moonDistance;
    } else {
      let previous = arr[index - 1];
      if (elem.moonDistance < previous.moonDistance) {
        perigee.ms = elem.ms;
        perigee.distance = elem.moonDistance;
      }
      if (elem.moonDistance > previous.moonDistance) {
        apogee.ms = elem.ms;
        apogee.distance = elem.moonDistance;
      }
    }
  });
  return { apogee, perigee };
};
const calcAspect = (data, diff) => {
  let copy = data.slice();
  let newData = data.map((first, i) => {
    let filtered = copy.filter((second, j) => {
      if (i === j) {
        return false; // itself, refuse...
      }
      let calculated = first.longitude - second.longitude;
      if (calculated < 0) {
        calculated += 360;
      }
      return calculated === diff;
    });
    if (filtered.length > 0) return true;
    else return false;
  }, copy);

  if (newData.includes(true)) {
    return newData;
  } else {
    return undefined;
  }
};
const checkAspects = data => {
  let newData = data.filter((elem, index, arr) => {
    if (
      index == 0 || // first element
      elem.trine || // ... or, there is a trine
      elem.conjunction || // ... or, there is a conjunction
      elem.opposition || // ... or, there is an opposition
      elem.ascendent ||
      elem.descendent ||
      elem.nothNode ||
      elem.southNode
    ) {
      return true;
    } else {
      let previous = arr[index - 1];
      let sameZodiac = elem.zodiac.every((e, i) => {
        return e === previous.zodiac[i];
      }, previous);
      return !sameZodiac; // some planets move to another Zodiac
    }
  });
  return newData;
};

module.exports = planets;