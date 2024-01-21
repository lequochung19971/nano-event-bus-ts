var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// index.ts
var event_bus_exports = {};
__export(event_bus_exports, {
  createEventBus: () => createEventBus
});
module.exports = __toCommonJS(event_bus_exports);
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createEventBus
});
