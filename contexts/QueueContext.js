// QueueContext.js
import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const QUEUE_STORAGE_KEY = "@music_queue";

export const QueueContext = createContext();

export const QueueProvider = ({ children }) => {
  const [queue, setQueue] = useState([]);
  const [message, setMessage] = useState("");

  // Load saved queue on component mount
  useEffect(() => {
    console.log("[QueueProvider] Initializing...");
    loadQueue();
  }, []);

  // Save queue whenever it changes
  useEffect(() => {
    console.log("[QueueProvider] Queue updated, saving to storage:", queue);
    saveQueue();
  }, [queue]);

  const loadQueue = async () => {
    try {
      console.log("[loadQueue] Attempting to load queue from storage");
      const savedQueue = await AsyncStorage.getItem(QUEUE_STORAGE_KEY);
      if (savedQueue) {
        const parsedQueue = JSON.parse(savedQueue);
        console.log("[loadQueue] Successfully loaded queue:", parsedQueue);
        setQueue(parsedQueue);
      } else {
        console.log("[loadQueue] No saved queue found");
      }
    } catch (error) {
      console.error("[loadQueue] Error loading queue:", error);
    }
  };

  const saveQueue = async () => {
    try {
      // console.log("[saveQueue] Saving queue to storage:", queue);
      await AsyncStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(queue));
      console.log("[saveQueue] Queue saved successfully");
    } catch (error) {
      console.error("[saveQueue] Error saving queue:", error);
    }
  };

  const addToQueue = (track) => {
    console.log("[addToQueue] Attempting to add track:", track);
    const isDuplicate = queue.some((item) => item.track_id === track.track_id);

    if (!isDuplicate) {
      console.log("[addToQueue] Track not duplicate, adding to queue");
      setQueue((prevQueue) => [...prevQueue, track]);
      setMessage("Added to queue");
      setTimeout(() => setMessage(""), 3000);
    } else {
      console.log("[addToQueue] Duplicate track detected, not adding");
      setMessage("Track already in queue");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const removeFromQueue = (trackId) => {
    console.log("[removeFromQueue] Removing track with ID:", trackId);
    setQueue((prevQueue) => {
      const newQueue = prevQueue.filter((track) => track.track_id !== trackId);
      console.log("[removeFromQueue] New queue after removal:", newQueue);
      return newQueue;
    });
    setMessage("Removed from queue");
    setTimeout(() => setMessage(""), 3000);
  };

  const clearQueue = async () => {
    try {
      console.log("[clearQueue] Clearing entire queue");
      await AsyncStorage.removeItem(QUEUE_STORAGE_KEY);
      setQueue([]);
      setMessage("Queue cleared");
      setTimeout(() => setMessage(""), 3000);
      console.log("[clearQueue] Queue cleared successfully");
    } catch (error) {
      console.error("[clearQueue] Error clearing queue:", error);
    }
  };

  const reorderQueue = (fromIndex, toIndex) => {
    console.log(
      `[reorderQueue] Reordering queue from index ${fromIndex} to index ${toIndex}`
    );
    console.log("[reorderQueue] Current queue:", queue);

    // Validate indices
    if (
      fromIndex < 0 ||
      toIndex < 0 ||
      fromIndex >= queue.length ||
      toIndex >= queue.length
    ) {
      console.warn("[reorderQueue] Invalid indices detected:", {
        fromIndex,
        toIndex,
        queueLength: queue.length,
      });
      return;
    }

    setQueue((prevQueue) => {
      const newQueue = [...prevQueue];
      const [movedTrack] = newQueue.splice(fromIndex, 1);
      newQueue.splice(toIndex, 0, movedTrack);
      console.log("[reorderQueue] Queue after reordering:", newQueue);
      return newQueue;
    });
  };

  const contextValue = {
    queue,
    message,
    addToQueue,
    removeFromQueue,
    clearQueue,
    reorderQueue,
  };

  //console.log("[QueueProvider] Current context value:", contextValue);

  return (
    <QueueContext.Provider value={contextValue}>
      {children}
    </QueueContext.Provider>
  );
};

export const useQueue = () => {
  const context = useContext(QueueContext);
  if (!context) {
    throw new Error("[useQueue] useQueue must be used within a QueueProvider");
  }
  return context;
};
