// index.ts
var createEventBus = () => {
  const emittedEvents = {};
  const listeners = {};
  const on = (event, listenerName, handler, isLateListening = false) => {
    var _a, _b, _c, _d;
    const listenersOfEvent = listeners[event];
    if (!listenersOfEvent) {
      listeners[event] = {};
    }
    if (!listeners[event][listenerName]) {
      listeners[event][listenerName] = {
        handler,
        hasInitialized: false
      };
    }
    listeners[event][listenerName].handler = handler;
    const hasEmittedEvent = emittedEvents[event] !== void 0;
    const hasInitialized = (_a = listeners[event][listenerName]) == null ? void 0 : _a.hasInitialized;
    const hasHandler = (_b = listeners[event][listenerName]) == null ? void 0 : _b.handler;
    if (isLateListening && hasHandler && hasInitialized && hasEmittedEvent) {
      (_d = (_c = listeners[event][listenerName]) == null ? void 0 : _c.handler) == null ? void 0 : _d.call(_c, {
        value: emittedEvents[event],
        lifecycle: "initialized"
      });
    }
    return () => {
      var _a2;
      if ((_a2 = listeners[event]) == null ? void 0 : _a2[listenerName])
        delete listeners[event][listenerName];
    };
  };
  const emit = (event, value) => {
    var _a, _b;
    emittedEvents[event] = value;
    const listenersOfEvent = listeners[event] || {};
    const listenerHandlers = Object.values(listenersOfEvent);
    for (let index = 0; index < listenerHandlers.length; index++) {
      (_b = (_a = listenerHandlers[index]).handler) == null ? void 0 : _b.call(_a, {
        value: emittedEvents[event],
        lifecycle: "emitted"
      });
    }
    return () => {
      if (emittedEvents[event])
        delete emittedEvents[event];
    };
  };
  return {
    on,
    emit
  };
};
export {
  createEventBus
};
