import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  applyCounterSelection,
  createTeam,
  getCounterTimerAction,
  isValidCounterSelection,
  resetTeamCounters,
} from '../src/match-state.js';

describe('match state', () => {
  it('creates independent, empty team counters', () => {
    const first = createTeam();
    const second = createTeam();

    first.games = 1;

    assert.deepEqual(second, { games: 0, timeouts: 0, jars: 0, resets: 0 });
  });

  it('accepts only counters and values represented in the UI', () => {
    assert.equal(isValidCounterSelection(1, 'games', 3), true);
    assert.equal(isValidCounterSelection(2, 'timeouts', 2), true);
    assert.equal(isValidCounterSelection(3, 'games', 1), false);
    assert.equal(isValidCounterSelection(1, 'games', 4), false);
    assert.equal(isValidCounterSelection(1, 'unknown', 1), false);
  });

  it('selects and toggles a counter without mutating the prior team state', () => {
    const original = { games: 1, timeouts: 0, jars: 2, resets: 0 };
    const selected = applyCounterSelection(original, 'timeouts', 1);
    const toggled = applyCounterSelection(selected.team, 'timeouts', 1);

    assert.equal(original.timeouts, 0);
    assert.deepEqual(selected, {
      team: { games: 1, timeouts: 1, jars: 2, resets: 0 },
      enabled: true,
    });
    assert.deepEqual(toggled, {
      team: { games: 1, timeouts: 0, jars: 2, resets: 0 },
      enabled: false,
    });
  });

  it('starts the correct automatic timer and resets it at the game boundary', () => {
    assert.deepEqual(getCounterTimerAction('timeouts', true, 1), { type: 'set', seconds: 30 });
    assert.deepEqual(getCounterTimerAction('timeouts', false, 1), { type: 'reset' });
    assert.deepEqual(getCounterTimerAction('games', true, 2), { type: 'set', seconds: 90 });
    assert.deepEqual(getCounterTimerAction('games', true, 3), { type: 'reset' });
    assert.deepEqual(getCounterTimerAction('jars', true, 1), { type: 'none' });
  });

  it('clears match counters while preserving games', () => {
    assert.deepEqual(resetTeamCounters({ games: 2, timeouts: 1, jars: 2, resets: 3 }), {
      games: 2,
      timeouts: 0,
      jars: 0,
      resets: 0,
    });
  });
});
