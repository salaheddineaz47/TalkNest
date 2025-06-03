import React from "react";

export const EventBusContext = React.createContext();

export const EventBusProvider = ({ children }) => {
    const [events, setEvents] = React.useState({});

    const emit = (name, data) => {
        if (events[name]) {
            for (let callback of events[name]) {
                callback(data);
            }
        }
    };

    const on = (name, cb) => {
        if (!events[name]) {
            events[name] = [];
        }
        events[name].push(cb);

        return () => {
            events[name] = events[name].filter((callback) => callback !== cb);
        };
    };

    return (
        <EventBusContext.Provider value={{ emit, on }}>
            {children}
        </EventBusContext.Provider>
    );
};

export const useEventBus = () => {
    const context = React.useContext(EventBusContext);
    if (!context) {
        throw new Error("useEventBus must be used within an EventBusProvider");
    }
    return context;
};
