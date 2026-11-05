const COUNTER_VALUES = {
  games: [1, 2, 3],
  timeouts: [1, 2],
  jars: [1, 2, 3],
  resets: [1, 2, 3],
};

export function createTeam() {
  return {
    games: 0,
    timeouts: 0,
    jars: 0,
    resets: 0,
  };
}

export function isValidCounterSelection(team, key, value) {
  return Boolean((team === 1 || team === 2)
    && COUNTER_VALUES[key]
    && COUNTER_VALUES[key].includes(value));
}

export function applyCounterSelection(team, key, value) {
  const enabled = team[key] !== value;
  return {
    team: { ...team, [key]: enabled ? value : 0 },
    enabled,
  };
}

export function getCounterTimerAction(key, enabled, value) {
  if (key === 'timeouts') {
    return enabled ? { type: 'set', seconds: 30 } : { type: 'reset' };
  }

  if (key === 'games') {
    return enabled && value !== 3
      ? { type: 'set', seconds: 90 }
      : { type: 'reset' };
  }

  return { type: 'none' };
}

export function resetTeamCounters(team) {
  return {
    ...team,
    timeouts: 0,
    jars: 0,
    resets: 0,
  };
}
