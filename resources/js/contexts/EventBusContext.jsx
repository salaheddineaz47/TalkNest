// import React from "react";

// export const EventBusContext = React.createContext();

// export const EventBusProvider = ({ children }) => {
//     const [events, setEvents] = React.useState({});

//     const emit = (name, data) => {
//         if (events[name]) {
//             for (let callback of events[name]) {
//                 callback(data);
//             }
//         }
//     };

//     const on = (name, cb) => {
//         if (!events[name]) {
//             events[name] = [];
//         }
//         events[name].push(cb);

//         return () => {
//             events[name] = events[name].filter((callback) => callback !== cb);
//         };
//     };

//     return (
//         <EventBusContext.Provider value={{ emit, on }}>
//             {children}
//         </EventBusContext.Provider>
//     );
// };

// export const useEventBus = () => {
//     const context = React.useContext(EventBusContext);
//     if (!context) {
//         throw new Error("useEventBus must be used within an EventBusProvider");
//     }
//     return context;
// };
import React, { useCallback, useRef } from "react";

export const EventBusContext = React.createContext();

export const EventBusProvider = ({ children }) => {
    // Use useRef to avoid stale closures
    const eventsRef = useRef({});

    const emit = useCallback((name, data) => {
        const callbacks = eventsRef.current[name];
        if (callbacks) {
            callbacks.forEach((callback) => callback(data));
        }
    }, []);

    const on = useCallback((name, callback) => {
        if (!eventsRef.current[name]) {
            eventsRef.current[name] = [];
        }
        eventsRef.current[name].push(callback);

        // Return cleanup function
        return () => {
            const callbacks = eventsRef.current[name];
            if (callbacks) {
                eventsRef.current[name] = callbacks.filter(
                    (cb) => cb !== callback,
                );
            }
        };
    }, []);

    return (
        <EventBusContext.Provider value={{ emit, on }}>
            {children}
        </EventBusContext.Provider>
    );
};

const useEventBus = () => {
    const context = React.useContext(EventBusContext);
    if (!context) {
        throw new Error("useEventBus must be used within an EventBusProvider");
    }
    return context;
};

export { useEventBus };
