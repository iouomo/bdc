<template>
  <article class="aspectsContainer">
    <svg
      v-if="isLoaded"
      class="aspects"
      :width="width"
      :height="height"
      :viewBox="'0 0 ' + width + ' ' + height"
      :style="{opacity: opacity, }"
    >
      <g
        v-for="(planet, planetIndex) in otherPlanets"
        :ref="planet.name"
        :key="planet.name"
        :transform="transform(planetIndex)"
      >
        <app-planet-sign :planet="planet" :radius="radius"></app-planet-sign>
        <g
          v-for="(elem, aspIndex) in planetAspects(planetIndex + 1)"
          :key="planet.name + aspIndex + '_' + elem.date"
          :transform="'translate(' + 0 + ', ' + radius * 2 + ')'"
        >
          <g :transform="'translate(0, ' + shiftY * (aspIndex) + ')'">
            <app-zodiac-sign
              :key="elem.zodiac"
              :zodiacName="elem.zodiac"
              :transform="'scale(4) translate(-' + shiftX + ')'"
            ></app-zodiac-sign>
            <g :key="elem.zodiac + '_' + elem.date">
              <text class="aspectText" fill="#000" x="0" :y="radius * 3">{{ elem.date }}</text>
              <text class="aspectText" fill="#000" x="0" :y="radius * 3" :dy="12">{{ elem.time }}</text>
            </g>
          </g>
        </g>
      </g>
    </svg>
  </article>
</template>
<script>
import { mapGetters } from "vuex";
import ZodiacSign from "../zodiac/ZodiacSign";
import PlanetSign from "../planet/PlanetSign";

export default {
  created() {},
  destroyed() {},
  mounted() {},
  props: {
    width: {
      type: Number,
      required: false,
      default: 0
    },
    height: {
      type: Number,
      required: false,
      default: 0
    }
  },
  components: {
    appZodiacSign: ZodiacSign,
    appPlanetSign: PlanetSign
  },
  methods: {
    init() {
      this.getInfo();
      this.showInfo();
      TweenLite.to(this.$data, 2, {
        opacity: 1,
        delay: 2,
        ease: Power3.easeOut
      });
    },
    unmount() {
      this.isLoaded = false;
      this.aspects = [];
    },
    getInfo() {
      for (let i = 0; i < this.daysInfoLength; i++) {
        this.joinInfo(this.getDayInfo(i));
      }
    },
    getDayInfo(index) {
      const dayInfo = this.dayInfo(index + 1);
      if (dayInfo.length !== 0) {
        return dayInfo[0].info;
      }
    },
    joinInfo(dayInfo) {
      dayInfo.aspects.forEach(element => {
        const date = this.dateFromTime(element.ms).split(", ");
        this.aspects.push({
          date: date[0],
          time: date[1],
          zodiac: element.zodiac.slice()
        });
      });
    },
    showInfo() {
      this.isLoaded = true;
    },
    transform(index, shift = 0) {
      const x = this.elementWidth * index + this.elementWidth * 0.5;
      const y = this.height * 0.2 + shift;
      return `translate(${x}, ${y})`;
    },
    dateFromTime(ms) {
      if (ms === undefined) {
        return undefined;
      }
      const options = {
        year: "2-digit",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit"
      };
      return this.msToDate(ms, options);
    },
    planetAspects(planetIndex) {
      const newData = this.aspects.map(elem => ({
        date: elem.date,
        time: elem.time,
        zodiac: elem.zodiac[planetIndex]
      }));
      return newData.filter((elem, index, arr) => {
        if (index == 0) {
          return true;
        }
        return elem.zodiac !== arr[index - 1].zodiac;
      });
    }
  },
  computed: {
    ...mapGetters({
      msToDate: "dashboard/msToDate",
      daysInfo: "universe/daysInfo",
      planets: "universe/planets",
      daysInTheMonth: "dashboard/daysInTheMonth",
      daysInfoLength: "universe/daysInfoLength",
      dayInfo: "universe/dayInfo"
    }),
    qnt() {
      return this.otherPlanets.length;
    },
    otherPlanets() {
      return this.planets.slice(2);
    },
    elementWidth() {
      return this.width / this.qnt;
    },
    shiftX() {
      return this.radius * 0.2;
    },
    shiftY() {
      return this.height * 0.15;
    }
  },
  data() {
    return {
      isLoaded: false,
      aspects: [],
      radius: 12,
      opacity: 0
    };
  },
  watch: {
    daysInfoLength: {
      immediate: true,
      handler(value) {
        if (this.isLoaded && value === 0) {
          this.unmount();
        }
        if (this.daysInfoLength === this.daysInTheMonth) {
          this.init();
        }
      }
    }
  }
};
</script>
<style scoped lang="scss">
.aspectsContainer {
  position: relative;
  width: 100%;
  height: 100%;
}
.aspects {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}
.aspectText {
  font-family: "Roboto", sans-serif;
  font-weight: 300;
  font-size: 12px;
  text-anchor: middle;
  dominant-baseline: ideographic;
}
</style>
