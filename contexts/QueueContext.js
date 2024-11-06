import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const QUEUE_STORAGE_KEY = "@music_queue";

export const QueueContext = createContext();

export const QueueProvider = ({ children }) => {
  const [queue, setQueue] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadQueue();
  }, []);

  useEffect(() => {
    saveQueue();
  }, [queue]);

  const loadQueue = async () => {
    try {
      const savedQueue = await AsyncStorage.getItem(QUEUE_STORAGE_KEY);
      if (savedQueue) {
        setQueue(JSON.parse(savedQueue));
      }
    } catch (error) {
      console.error("Error loading queue:", error);
    }
  };

  const saveQueue = async () => {
    try {
      await AsyncStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(queue));
    } catch (error) {
      console.error("Error saving queue:", error);
    }
  };

  const addToQueue = (track) => {
    const isDuplicate = queue.some((item) => item.track_id === track.track_id);

    if (!isDuplicate) {
      setQueue((prevQueue) => [...prevQueue, track]);
      setMessage("Added to queue");
      setTimeout(() => setMessage(""), 3000);
    } else {
      setMessage("Track already in queue");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const removeFromQueue = (trackId) => {
    setQueue((prevQueue) =>
      prevQueue.filter((track) => track.track_id !== trackId)
    );
    setMessage("Removed from queue");
    setTimeout(() => setMessage(""), 3000);
  };

  const clearQueue = async () => {
    try {
      await AsyncStorage.removeItem(QUEUE_STORAGE_KEY);
      setQueue([]);
      setMessage("Queue cleared");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Error clearing queue:", error);
    }
  };

  const reorderQueue = (fromIndex, toIndex) => {
    const newQueue = [...queue];
    const [movedTrack] = newQueue.splice(fromIndex, 1);
    newQueue.splice(toIndex, 0, movedTrack);
    setQueue(newQueue);
  };

  return (
    <QueueContext.Provider
      value={{
        queue,
        message,
        addToQueue,
        removeFromQueue,
        clearQueue,
        reorderQueue,
      }}
    >
      {children}
    </QueueContext.Provider>
  );
};

export const useQueue = () => {
  const context = useContext(QueueContext);
  if (!context) {
    throw new Error("useQueue must be used within a QueueProvider");
  }
  return context;
};
