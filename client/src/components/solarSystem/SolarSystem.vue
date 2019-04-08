<template>
  <div ref="solarSystem" class="solarSystem" @wheel="onWheel"></div>
</template>
<script>
import planetsMixin from '../../mixins/planetsMixin.js';
import colorMixin from '../../mixins/colorMixin.js';

export default {
  mixins: [planetsMixin, colorMixin],
  created() {},
  mounted() {
    this.setSize();
    this.init();
    this.animation.start();
  },
  beforeDestroy() {},
  components: {},
  props: {
    diameter: {
      type: Number,
      required: false,
      default: 0,
    },
    coords: {
      type: Object,
      required: false,
      default: () => {},
    },
  },
  methods: {
    init() {
      this.backgroundLayer = new Konva.Layer();
      this.headsLayer = new Konva.FastLayer();
      this.tailsLayer = new Konva.FastLayer();

      this.backgroundLayer.hitGraphEnabled(false);

      this.animation = new Konva.Animation(this.render, [
        this.headsLayer,
        this.tailsLayer,
      ]);

      this.stage = new Konva.Stage({
        width: this.diameter,
        height: this.diameter,
        container: this.$refs.solarSystem,
        scale: { x: 0.1, y: -0.1 },
        position: { x: this.center, y: this.center },
        opacity: 0,
        draggable: true,
      });

      for (const planet of this.planets) {
        this.headsLayer.add(planet.head);
        this.headsLayer.add(planet.sign);
        this.tailsLayer.add(planet.tail);

        planet.head.cache();
      }

      this.headsLayer.children.each((shape) => {
        shape.hitStrokeWidth = 0;
        shape.shadowForStrokeEnabled(false);
      });
      this.tailsLayer.children.each((shape) => {
        shape.hitStrokeWidth = 0;
        shape.shadowForStrokeEnabled(false);
      });

      this.stage.add(this.backgroundLayer);
      this.stage.add(this.tailsLayer);
      this.stage.add(this.headsLayer);
      TweenLite.to(this.stage, 1, { opacity: 1, ease: Linear.easeNone });
    },
    setLayersOffset() {
      this.backgroundLayer.offsetX(-this.center);
      this.backgroundLayer.offsetY(-this.center);

      this.headsLayer.offsetX(-this.center);
      this.headsLayer.offsetY(-this.center);

      this.tailsLayer.offsetX(-this.center);
      this.tailsLayer.offsetY(-this.center);
    },
    setSize() {
      this.$refs.solarSystem.style.width = `${this.diameter}px`;
      this.$refs.solarSystem.style.height = `${this.diameter}px`;
    },
    updatePlanetsCoords() {
      this.planets.forEach((planet, index) => {
        this.updatePlanetCoords(planet, this.coords.cartesian[index]);
      });
    },
    getPlanetCoords(planetName) {
      return this.coords.filter(item => item.name === planetName);
    },
    updatePlanetCoords(planet, coords) {
      const x = coords.x * planet.minDistance;
      const y = coords.y * planet.minDistance;

      TweenLite.to(planet, 0.95, { x, y, ease: Linear.easeNone });
    },
    onWheel(e) {
      const scaleBy = 1.1;
      e.preventDefault();
      const oldScale = this.stage.scaleX();

      const mousePointTo = {
        x:
          this.stage.getPointerPosition().x / oldScale
          - this.stage.x() / oldScale,
        y:
          this.stage.getPointerPosition().y / oldScale
          - this.stage.y() / oldScale,
      };

      const newScale = e.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;
      this.stage.scale({ x: newScale, y: -newScale });

      const newPos = {
        x:
          -(mousePointTo.x - this.stage.getPointerPosition().x / newScale)
          * newScale,
        y:
          -(mousePointTo.y - this.stage.getPointerPosition().y / newScale)
          * newScale,
      };
      this.stage.position(newPos);
      this.stage.batchDraw();
    },
    render() {
      if (this.changeLayers) {
        this.tailsLayer.children.forEach((child) => {
          const clone = child.clone();
          clone.moveTo(this.backgroundLayer);
          clone.draw();
          child.points([]);
        });
        this.changeLayers = false;
      }
      for (const planet of this.planets) {
        this.drawHead(planet);
        if (planet.showPath) {
          this.drawTail(planet);
        }
      }
    },
  },
  computed: {
    offset() {
      return this.diameter;
    },
    center() {
      return this.diameter * 0.5;
    },
  },
  data() {
    return {
      resolution: window.devicePixelRatio || 1,
      changeLayers: false,
      stage: undefined,
      backgroundLayer: undefined,
      headsLayer: undefined,
      tailsLayer: undefined,
      animation: undefined,
    };
  },
  watch: {
    diameter: {
      immediate: false,
      handler(value) {
        this.setSize();
      },
    },
    coords: {
      immediate: false,
      handler(value) {
        this.changeLayers = true;
        this.updatePlanetsCoords();
      },
    },
  },
};
</script>

<style scoped lang="scss">
.solarSystem {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  border-radius: 50%;
  margin: auto;
  overflow: hidden;
  z-index: 1;
}
</style>
