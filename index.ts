type Handler<T = any> = {
  /**
   * The event has lifecycle is `initialized` when `isLateListening` is true,
   * and this lifecycle is just returned once when initializing `on` method
   */
  (event: { lifecycle: 'initialized' | 'emitted'; value: T }): void;
};

type ListenerInfo = {
  hasInitialized?: boolean;
  handler?: Handler;
};

/**
 *
 */
export const createNanoEventBus = () => {
  const emittedEvents = {} as Record<string, any>;
  const listeners = {} as Record<string, Record<string, ListenerInfo>>;

  /**
   *
   * @param event
   * @param listenerName A unique listener name
   * @param handler A callback method to listen emitted event value
   * @param isLateListening
   * - Will listen the last emitted event lately.
   * - This property will support for case: listen an emitted event.
   * - As other libraries related to publish/subscribe event, they don't support late listening
   * - For example:
   * ```js
   * const user = {
   *  id: '1',
   *  name: 'John'
   * }
   *
   * emit('user.update', user);
   *
   * on('user.update-user', 'client.user.update-user', (event) => {
   *  console.log(event)
   * }, true);
   *
   * // => { lifecycle: 'initialized', value: { id: '1', name: 'John' } }
   * ```
   * @returns
   */
  const on = <T>(
    event: string,
    listenerName: string,
    handler: Handler<T>,
    isLateListening = false
  ) => {
    const listenersOfEvent = listeners[event];
    if (!listenersOfEvent) {
      listeners[event] = {};
    }

    if (!listeners[event][listenerName]) {
      listeners[event][listenerName] = {
        handler,
        hasInitialized: false,
      };
    }

    listeners[event][listenerName].handler = handler;

    /**
     * Late Emitting Event
     */
    const hasEmittedEvent = emittedEvents[event] !== undefined;
    const hasInitialized = listeners[event][listenerName]?.hasInitialized;
    const hasHandler = listeners[event][listenerName]?.handler;
    if (isLateListening && hasHandler && hasInitialized && hasEmittedEvent) {
      listeners[event][listenerName]?.handler?.({
        value: emittedEvents[event],
        lifecycle: 'initialized',
      });
    }

    return () => {
      if (listeners[event]?.[listenerName]) delete listeners[event][listenerName];
    };
  };

  /**
   *
   * @param event Unique event name
   * @param value The event value want to emit for listeners
   * @returns
   */
  const emit = <T>(event: string, value: T) => {
    emittedEvents[event] = value;
    const listenersOfEvent = listeners[event] || {};
    const listenerHandlers = Object.values(listenersOfEvent);

    for (let index = 0; index < listenerHandlers.length; index++) {
      listenerHandlers[index].handler?.({
        value: emittedEvents[event],
        lifecycle: 'emitted',
      });
    }

    return () => {
      if (emittedEvents[event]) delete emittedEvents[event];
    };
  };

  return {
    on,
    emit,
  };
};
