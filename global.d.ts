declare global {
  interface Window {
    _subscription: PushSubscription;
    _subscribeToNotifications: () => Promise<unknown>;
  }
}

export {};
