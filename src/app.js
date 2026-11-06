import {
  applyCounterSelection,
  createTeam,
  getCounterTimerAction,
  isValidCounterSelection,
  resetTeamCounters,
} from './match-state.js';

Vue.component('team-panel', {
  props: ['team', 'teamId', 'name'],
  template: `
    <section class="panel" :id="'team' + teamId" :aria-labelledby="'team-title-' + teamId">
      <h3 class="panel-title" :id="'team-title-' + teamId">
        {{ name }}
      </h3>
      <div class="panel-content">
        <div class="panel-section" v-for="section in sections" :key="section.key">
          <div class="panel-subtitle">{{ section.label }}</div>
          <div class="panel-operator" :class="{'panel-operator-two': section.values.length === 2}" role="group" :aria-label="name + ' ' + section.label">
            <button v-for="n in section.values"
              :key="n"
              class="panel-btn"
              :class="{'panel-btn-clicked': team[section.key] == n}"
              :aria-pressed="team[section.key] == n"
              :aria-label="name + ' ' + section.label + ' ' + n"
              @click="$emit('click-button', teamId, section.key, n)">
              {{ n }}
            </button>
          </div>
        </div>
      </div>
    </section>
  `,
  data() {
    return {
      sections: [
        { label: 'Games', key: 'games', values: [1, 2, 3] },
        { label: 'Timeouts', key: 'timeouts', values: [1, 2] },
        { label: 'Jars', key: 'jars', values: [1, 2, 3] },
        { label: 'Resets', key: 'resets', values: [1, 2, 3] },
      ]
    }
  }
});

var app = new Vue({
  el: '#app',
  data: {
    team1: createTeam(),
    team2: createTeam(),
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
        name: 'Botanical',
        value: 'botanical',
      },
      {
        name: 'Minimal',
        value: 'minimal',
      },
      {
        name: 'Mizu',
        value: 'mizu',
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
  computed: {
    timerStatus: function () {
      return {
        ready: 'Ready',
        running: 'Running',
        paused: 'Paused',
        stop: 'Time up',
      }[this.countdownState];
    },
    timerHint: function () {
      if (this.countdownState === 'running') return 'Tap timer to pause';
      if (this.countdownState === 'paused') return 'Tap timer to resume';
      return 'Choose a duration to start';
    },
  },
  mounted: function () {
    document.addEventListener('keyup', this.handleKeyup);
  },
  beforeDestroy: function () {
    document.removeEventListener('keyup', this.handleKeyup);
  },
  methods: {
    handleButton: function (team, key, value) {
      this.pushLog(`Clicked Team: ${team} Key: ${key} Value: ${value}`);
      if (!isValidCounterSelection(team, key, value)) {
        return;
      }
      const teamName = `team${team}`;
      const selection = applyCounterSelection(this[teamName], key, value);
      this[teamName] = selection.team;

      const timerAction = getCounterTimerAction(key, selection.enabled, value);
      if (timerAction.type === 'set') {
        this.handleSetTimer(timerAction.seconds);
      } else if (timerAction.type === 'reset') {
        this.resetCountdown();
      }

      if (key == 'games') {
        this.resetCounter();
      }
    },
    resetCounter: function() {
      this.team1 = resetTeamCounters(this.team1);
      this.team2 = resetTeamCounters(this.team2);
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
        this.handleResetMatch();
      }
    },
    setTimer: function () {
      this.countdownTimeout = window.setTimeout(() => {
        this.countdownTimeout = null;
        if (this.countdownState !== 'running') {
          return;
        }
        this.countdownTimer--;
        this.countdownDisplay = (this.countdownTimer / 10).toFixed(1);
        if (this.countdownTimer <= 20) {
          this.countdownWarning = true;
        }
        if (this.countdownTimer == 0) {
          this.countdownState = 'stop';

          this.pushLog('Player ran out of time');
          if (typeof navigator.vibrate === 'function') {
            navigator.vibrate(500);
          }
        } else {
          this.setTimer();
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
        this.countdownTimeout = null;
      }
    },
    handleSetTimer: function (sec) {
      this.pushLog(`Start timer of ${sec}s`);
      this.resetTimer();
      this.countdownWarning = false;
      this.countdownTimer = sec * 10;
      this.countdownDisplay = (this.countdownTimer / 10).toFixed(1);
      this.countdownState = 'running';
      this.setTimer();
    },
    handleResetMatch: function () {
      if (!window.confirm('Reset both teams\' match records?')) {
        return;
      }
      this.pushLog('Reset match record');
      this.team1 = createTeam();
      this.team2 = createTeam();
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
      if (this.logs.length > 5000) {
        this.logs.shift();
      }
      this.logOutput = this.logs.join('\n');
    },
    resetLog: function () {
      this.logs = [];
      this.logOutput = '';
    },
  },
});
