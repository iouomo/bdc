import { mapGetters } from 'vuex';

export default {
  created() {},
  mounted() {
    this.initPlanets();
  },
  beforeDestroy() {},
  props: {},
  methods: {
    initPlanets() {
      this.planetsModel.forEach((elem, index) => {
        const planet = this.initNewPlanet(elem, index);
        this.planets.push(planet);
      });
    },
    initNewPlanet(model, index) {
      const color = this.getColor(model.color);
      const stroke = this.getColor(model.stroke);
      const signColor = this.getColor(model.signColor);
      const radius = this.getPlanetRadius(model.maxRadius);
      let x = 0;
      let y = 0;
      const minDistance = model.minDistance === undefined ? this.au : model.minDistance;
      if (index !== 0) {
        // except the Earth
        x = this.coords.cartesian[index].x * minDistance;
        y = this.coords.cartesian[index].y * minDistance;
      }
      return {
        name: model.name,
        stroke,
        minDistance,
        showPath: model.showPath,
        x,
        y,
        sign: new Konva.Path({
          x,
          y,
          data: model.sign,
          fill: signColor,
          scaleY: -2,
          scaleX: 2,
          verticalAlign: 'top',
          offset: {
            x: radius * 0.25,
            y: radius * 0.25,
          },
          perfectDrawEnabled: false,
          listening: false,
        }),
        head: new Konva.Circle({
          x,
          y,
          radius,
          fill: color,
          transformsEnabled: 'position',
          perfectDrawEnabled: false,
          listening: false,
        }),
        tail: new Konva.Line({
          points: [],
          stroke: color,
          strokeWidth: 1,
          lineCap: 'round',
          lineJoin: 'round',
          transformsEnabled: 'position',
          perfectDrawEnabled: false,
          listening: false,
        }),
      };
    },
    getPlanetRadius(maxRadius) {
      if (maxRadius !== undefined) {
        return maxRadius;
      }
      return this.planetRadius;
    },
    drawHead(planet) {
      planet.sign.x(planet.x);
      planet.sign.y(planet.y);

      planet.head.x(planet.x);
      planet.head.y(planet.y);
    },
    drawTail(planet) {
      // console.log(planet.head);
      planet.tail.points(planet.tail.points().concat([planet.x, planet.y]));
    },
    clearPoints(planet) {
      planet.tail.points([]);
    },
  },
  computed: {
    ...mapGetters({
      planetsModel: 'universe/planets',
    }),
    au() {
      return this.diameter * 0.3;
    },
  },
  data() {
    return {
      planets: [],
      planetRadius: 10,
    };
  },
};
