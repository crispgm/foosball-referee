var app = new Vue({
  el: '#app',
  data: {
    countdownTimer: 0,
    countdownDisplay: 0.0,
    countdownTimeout: null,
    countdownWarning: false,
  },
  created: function () {
    this.countdownTimer = 0;
    this.countdownDisplay = '0.0';
  },
  watch: {
    countdownTimer: {
      handler(value) {
        if (value > 0) {
          this.countdownTimeout = window.setTimeout(() => {
            this.countdownTimer--;
            this.countdownDisplay = (this.countdownTimer/10).toFixed(1);
            console.log(this.countdownDisplay);
            if (this.countdownTimer <= 20) {
              this.countdownWarning = true;
            }
          }, 100);
        }
      },
      immediate: true,
    },
  },
  methods: {
    handleTimer: function (sec) {
      if (this.countdownTimeout != null) {
        window.clearTimeout(this.countdownTimeout);
      }
      this.countdownWarning = false;
      this.countdownTimer = sec * 10;
    },
  },
});
