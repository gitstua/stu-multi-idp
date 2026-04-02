const listeners = new Set();

const state = {
  activeProvider: null,
  activeAccount: null,
};

function notify() {
  for (const listener of listeners) {
    listener(state);
  }
}

export function getAuthState() {
  return {
    activeProvider: state.activeProvider,
    activeAccount: state.activeAccount,
    isAuthenticated: Boolean(state.activeAccount),
  };
}

export function setSession(provider, account) {
  state.activeProvider = provider;
  state.activeAccount = account;
  notify();
}

export function subscribeAuth(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
