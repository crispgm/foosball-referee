import assert from 'node:assert/strict';
import { it } from 'node:test';

const pending = new Map();
let nextTimerId = 1;
let app;

globalThis.window = {
  localStorage: { getItem: () => null },
  confirm: () => true,
  setTimeout(callback) {
    const id = nextTimerId++;
    pending.set(id, callback);
    return id;
  },
  clearTimeout(id) {
    pending.delete(id);
  },
};

globalThis.Vue = class {
  static component() {}

  constructor(options) {
    Object.assign(this, options.data);
    for (const [name, method] of Object.entries(options.methods)) {
      this[name] = method.bind(this);
    }
    this.pushLog = () => {};
    app = this;
  }
};

await import('../src/app.js');

function tick() {
  assert.equal(pending.size, 1);
  const [id, callback] = pending.entries().next().value;
  pending.delete(id);
  callback();
}

it('continues counting when the same duration is started twice', () => {
  app.handleSetTimer(10);
  tick();
  assert.equal(app.countdownDisplay, '9.9');

  app.handleSetTimer(10);
  assert.equal(app.countdownDisplay, '10.0');
  assert.equal(pending.size, 1);
  tick();
  assert.equal(app.countdownDisplay, '9.9');
  app.resetCountdown();
});

it('pauses and resumes with exactly one pending tick', () => {
  app.handleSetTimer(3);
  app.handlePauseTimer();
  assert.equal(pending.size, 0);
  app.handlePauseTimer();
  tick();
  assert.equal(app.countdownDisplay, '2.9');
  assert.equal(pending.size, 1);
  app.resetCountdown();
});

it('stops scheduling ticks at zero', () => {
  app.handleSetTimer(0.1);
  tick();
  assert.equal(app.countdownDisplay, '0.0');
  assert.equal(app.countdownState, 'stop');
  assert.equal(pending.size, 0);
});

it('resets the match record without stopping the timer', () => {
  app.team1.games = 2;
  app.team2.jars = 1;
  app.handleSetTimer(15);

  app.handleResetMatch();

  assert.equal(app.team1.games, 0);
  assert.equal(app.team2.jars, 0);
  assert.equal(app.countdownState, 'running');
  assert.equal(app.countdownDisplay, '15.0');
  tick();
  assert.equal(app.countdownDisplay, '14.9');
  app.resetCountdown();
});
