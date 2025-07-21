// src/hooks/useSocket.js
import { useEffect } from 'react';
import { io } from 'socket.io-client';

// Create the socket instance just once for the entire application
const socket = io('http://localhost:3001');

export function useSocket(eventName, onEvent) {
  useEffect(() => {
    // A safety check to make sure we have a valid event handler function
    if (typeof onEvent === 'function') {
      // Attach the listener
      socket.on(eventName, onEvent);
    }

    // The cleanup function that runs when the component unmounts
    return () => {
      if (typeof onEvent === 'function') {
        // Detach the listener
        socket.off(eventName, onEvent);
      }
    };
  }, [eventName, onEvent]); // Re-run this effect if the event name or handler function changes
}

// We can also export the socket instance itself for emitting events
export { socket };