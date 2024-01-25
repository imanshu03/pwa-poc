declare global {
  interface Window {
    _subscription: PushSubscription;
    _subscribeToNotifications?: () => Promise<unknown>;
    _deferredInstall?: any;
  }
}

export {};
