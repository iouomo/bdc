<template>
  <path
    :fill="getColor(zodiacElement.color)"
    stroke="none"
    stroke-width="1"
    stroke-linecap="round"
    :d="zodiacElement.sign"
  ></path>
</template>
<script>
import { mapGetters } from 'vuex';
import colorMixin from '../../mixins/colorMixin.js';

export default {
  mixins: [colorMixin],
  created() {},
  mounted() {},
  components: {
    appElement: Element,
  },
  props: {
    zodiacName: {
      type: String,
      required: false,
      default: '',
    },
  },
  methods: {},
  computed: {
    ...mapGetters({
      zodiac: 'universe/zodiac',
    }),
    zodiacElement() {
      const filteredZodiac = this.zodiac.filter(
        item => item.name === this.zodiacName,
      );
      if (filteredZodiac.length > 0) {
        return filteredZodiac[0];
      }
      return {};
    },
  },
  data() {
    return {};
  },
};
</script>
<style lang="scss" scoped>
</style>
