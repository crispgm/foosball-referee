var app = new Vue({
  el: '#app',
  data: {
    team1: {
      games: 0,
      timeouts: 0,
      resets: 0,
    },
    team2: {
      games: 0,
      timeouts: 0,
      resets: 0,
    },
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
    handleButton: function(team, key, value) {
      console.log(`Clicked Team: ${team} Key: ${key} Value: ${value}`);
      if (team != 1 && team != 2) {
        return;
      }
      if (key != 'games' && key != 'timeouts' && key != 'resets') {
        return
      }

      let data;
      if (team == 1) {
        data = this.team1
      } else {
        data = this.team2
      }
      if (data[key] == value) {
        data[key] = 0;
      } else {
        data[key] = value
      }
      if (team == 1) {
        this.team1 = data
      } else {
        this.team2 = data
      }
    },
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
