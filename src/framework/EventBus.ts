class EventBus {
  protected listeners: Record<string, ((...args: unknown[]) => void)[]> = {};

  on(event: string, callback: (...args: unknown[]) => void) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }

    this.listeners[event].push(callback);
  }

  off(event: string, callback: (...args: unknown[]) => void) {
    if (!this.listeners[event]) {
      throw new Error(`No such event: ${event}`);
    }

    this.listeners[event] = this.listeners[event].filter(
      (listener) => listener !== callback,
    );
  }

  emit(event: string, ...args: unknown[]) {
    if (!this.listeners[event]) {
      throw new Error(`No such event: ${event}`);
    }

    this.listeners[event].forEach((listener) => {
      listener(...args);
    });
  }
}
export { EventBus };
