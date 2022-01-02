export function globBus<Event extends { type: string }>() {
  type Listener = (event: Event) => void;

  const listenersByGlob: Record<string, Set<Listener>> = {};

  return {
    /**
     * Register a listener of events.
     *
     * @example Listen to a single event
     * ```
     * bus.on('basket.product.add', fn);
     * ```
     * @example Listen to any event within a namespace
     * ```
     * bus.on('basket.product.*', fn);
     * bus.on('basket.*', fn);
     * bus.on('*', fn);
     * ```
     * @returns A function to remove the listener
     */
    on(glob: string, listener: Listener): () => void {
      const list = listenersByGlob[glob] || (listenersByGlob[glob] = new Set());
      list.add(listener);
      return () => {
        list.delete(listener);
      };
    },
    /**
     * Send an event and payload to all registered listeners.
     *
     * @example
     * ```
     * bus.on('basket.product.*', fn);
     * bus.on('basket.*', fn);
     * bus.on('*', fn);
     * bus.send({ type: 'basket.product.add', id: 567 })
     * ```
     */
    send(event: Event): void {
      for (const glob in listenersByGlob) {
        if (
          glob === '*' ||
          glob === event.type ||
          (glob.endsWith('.*') && event.type.startsWith(glob.slice(0, -1)))
        ) {
          listenersByGlob[glob].forEach((listener) => listener(event));
        }
      }
    },
  };
}
