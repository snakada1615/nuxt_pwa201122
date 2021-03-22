<template>
  <div>Hello world!</div>
</template>

<script>
  /**
   * @vue-prop {Number} initialCounter - Initial counter's value
   * @vue-prop {Number} [step=1] - Step
   * @vue-data {Number} counter - Current counter's value
   * @param {string} somebody
   * @vue-computed {String} message
   * @vue-computed {String} message
   * @vue-event {Number} increment - Emit counter's value after increment
   * @vue-event {Number} decrement - Emit counter's value after decrement
   */
  export default {
    props: {
      initialCounter: {
        type: Number,
        default: "8",
      },
      step: {
        type: Number,
        default: 1,
      },
    },
    data () {
      return {
        counter: 0,
      }
    },
    computed: {
      message() {
        return `Current value is ${this.counter}`;
      }
    },
    methods: {
      increment() {
        this.counter += 1;
        this.$emit('increment', this.counter);
      },
      decrement() {
        this.counter -= 1;
        this.$emit('decrement', this.counter);
      }
    }
  }
</script>
