var app = new Vue({
  el: '#app',
  data: {
    countdownTimer: 0,
    countdownDisplay: 0.0,
    countdownTimeout: null,
    countdownWarning: false,
    countdownState: 'ready',
  },
  created: function () {
    this.countdownTimer = 0;
    this.countdownDisplay = '0.0';
    this.countdownState = 'ready';
  },
  watch: {
    countdownTimer: {
      handler(value) {
        if (value > 0) {
          this.setTimer();
        }
      },
      immediate: true,
    },
    countdownState: {
      handler(value) {
        console.log('Timer state:', value);
      },
      immediate: true,
    }
  },
  methods: {
    setTimer: function() {
      this.countdownTimeout = window.setTimeout(() => {
        this.countdownTimer--;
        this.countdownDisplay = (this.countdownTimer/10).toFixed(1);
        if (this.countdownTimer <= 20) {
          this.countdownWarning = true;
        }
        if (this.countdownTimer == 0) {
          this.countdownState = 'stop';
        }
      }, 100);
    },
    resetTimer: function() {
      if (this.countdownTimeout != null) {
        window.clearTimeout(this.countdownTimeout);
      }
    },
    handleSetTimer: function (sec) {
      console.log(`Start timer of ${sec}s`);
      this.resetTimer();
      this.countdownWarning = false;
      this.countdownTimer = sec * 10;
      this.countdownState = 'running';
    },
    handleResetTimer: function () {
      console.log('Reset timer');
      this.resetTimer();
      this.countdownTimer = 0;
      this.countdownDisplay = '0.0';
      this.countdownState = 'ready';
    },
    handlePauseTimer: function () {
      if (this.countdownState == 'paused') {
        console.log('Resume timer');
        this.countdownState = 'running';
        this.setTimer();
      } else if (this.countdownState == 'running') {
        console.log('Pause timer');
        this.countdownState = 'paused';
        this.resetTimer();
      }
    },
  },
});
