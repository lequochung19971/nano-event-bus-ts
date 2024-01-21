type Handler<T = any> = {
    /**
     * The event has lifecycle is `initialized` when `isLateListening` is true,
     * and this lifecycle is just returned once when initializing `on` method
     */
    (event: {
        lifecycle: 'initialized' | 'emitted';
        value: T;
    }): void;
};
/**
 *
 */
declare const createEventBus: () => {
    on: <T>(event: string, listenerName: string, handler: Handler<T>, isLateListening?: boolean) => () => void;
    emit: <T_1>(event: string, value: T_1) => () => void;
};

export { createEventBus };
