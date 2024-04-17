var app = new Vue({
  el: '#app',
  data: {
    team1: {
      games: 0,
      timeouts: 0,
      jars: 0,
      resets: 0,
    },
    team2: {
      games: 0,
      timeouts: 0,
      jars: 0,
      resets: 0,
    },
    countdownTimer: 0,
    countdownDisplay: 0.0,
    countdownTimeout: null,
    countdownWarning: false,
    countdownState: 'ready',
    themeName: 'theme-minimal',
    themeSelected: 'minimal',
    defaultTheme: 'minimal',
    themes: [
      {
        name: 'Minimal',
        value: 'minimal',
      },
      {
        name: 'Olivia',
        value: 'olivia',
      },
    ],
    logs: [],
    logOutput: '',
  },
  created: function () {
    this.pushLog('Loading themes...');
    this.loadTheme();

    this.pushLog('Initializing variables...');
    this.countdownTimer = 0;
    this.countdownDisplay = '0.0';
    this.countdownState = 'ready';
  },
  mounted: function () {
    document.addEventListener('keyup', this.handleKeyup);
  },
  beforeDestroy: function () {
    document.removeEventListener('keyup', this.handleKeyup);
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
      handler(_value) {
      },
      immediate: true,
    },
  },
  methods: {
    handleButton: function (team, key, value) {
      this.pushLog(`Clicked Team: ${team} Key: ${key} Value: ${value}`);
      if (team != 1 && team != 2) {
        return;
      }
      if (key != 'games' && key != 'timeouts' && key != 'jars' && key != 'resets') {
        return;
      }

      let data;
      let onOff = true;
      if (team == 1) {
        data = this.team1;
      } else {
        data = this.team2;
      }
      if (data[key] == value) {
        data[key] = 0;
        onOff = false;
      } else {
        data[key] = value;
      }
      if (team == 1) {
        this.team1 = data;
      } else {
        this.team2 = data;
      }

      if (key == 'timeouts') {
        if (onOff) {
          this.handleSetTimer(30);
        } else {
          this.resetCountdown();
        }
      } else if (key == 'games') {
        if (onOff && value != 3) {
          this.handleSetTimer(90);
        } else {
          this.resetCountdown();
        }
        this.resetCounter();
      }
    },
    resetCounter: function() {
      this.team1.timeouts = 0;
      this.team1.jars = 0;
      this.team1.resets = 0;
      this.team2.timeouts = 0;
      this.team2.jars = 0;
      this.team2.resets = 0;
    },
    handleKeyup: function (event) {
      if (event.code === 'Digit1') {
        this.handleSetTimer(15);
      } else if (event.code == 'Digit2') {
        this.handleSetTimer(10);
      } else if (event.code == 'Digit3') {
        this.handleSetTimer(5);
      } else if (event.code == 'Digit4') {
        this.handleSetTimer(3);
      } else if (event.code == 'Equal') {
        this.handlePauseTimer();
      } else if (event.code == 'Escape') {
        this.handleReset();
      }
    },
    setTimer: function () {
      this.countdownTimeout = window.setTimeout(() => {
        this.countdownTimer--;
        this.countdownDisplay = (this.countdownTimer / 10).toFixed(1);
        if (this.countdownTimer <= 20) {
          this.countdownWarning = true;
        }
        if (this.countdownTimer == 0) {
          this.countdownState = 'stop';

          this.pushLog('Player ran out of time');
          if (typeof navigator?.vibrate === 'function') {
            navigator.vibrate(500);
          }
        }
      }, 100);
    },
    resetCountdown: function () {
      this.pushLog('Reset countdown');
      this.resetTimer();
      this.countdownWarning = false;
      this.countdownTimer = 0;
      this.countdownDisplay = '0.0';
      this.countdownState = 'ready';
    },
    resetTimer: function () {
      if (this.countdownTimeout != null) {
        window.clearTimeout(this.countdownTimeout);
      }
    },
    handleSetTimer: function (sec) {
      this.pushLog(`Start timer of ${sec}s`);
      this.resetTimer();
      this.countdownWarning = false;
      this.countdownTimer = sec * 10;
      this.countdownState = 'running';
    },
    handleReset: function () {
      this.pushLog('Global reset');
      this.resetCountdown();
      this.team1 = {
        games: 0,
        timeouts: 0,
        jars: 0,
        resets: 0,
      };
      this.team2 = {
        games: 0,
        timeouts: 0,
        jars: 0,
        resets: 0,
      };
    },
    handlePauseTimer: function () {
      if (this.countdownState == 'paused') {
        this.pushLog('Resume timer');
        this.countdownState = 'running';
        this.setTimer();
      } else if (this.countdownState == 'running') {
        this.pushLog('Pause timer');
        this.countdownState = 'paused';
        this.resetTimer();
      }
    },
    loadTheme: function () {
      let theme = window.localStorage.getItem('theme');
      if (!theme) {
        theme = this.defaultTheme;
      }
      this.themeName = this.getThemeClass(theme);
      this.themeSelected = theme;
    },
    selectTheme: function (_event) {
      const themeName = this.getThemeClass(this.themeSelected);
      if (this.themeName == themeName) {
        return;
      }
      this.pushLog(`Selecting theme: ${this.themeSelected}`);
      this.themeName = themeName;
      window.localStorage.setItem('theme', this.themeSelected);
    },
    getThemeClass: function (name) {
      return `theme theme-${name}`;
    },
    pushLog: function (s) {
      // TODO
      console.log(s);
      this.logs.push(s);
      if (this.logs > 5000) {
        this.logs.splice(0, 2000);
      }
      this.logOutput = this.logs.join('\n');
    },
    resetLog: function () {
      this.logs = [];
      this.logOutput = '';
    },
  },
});
