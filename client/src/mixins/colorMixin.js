import { mapGetters } from 'vuex';

export default {
  methods: {
    getColor(colorName) {
      if (colorName === undefined) {
        return '#ffffff';
      }
      const colorItem = this.colors.filter(item => item.name === colorName);
      return colorItem[0].hex;
    },
  },
  computed: {
    ...mapGetters({
      colors: 'universe/colors',
    }),
  },
};
