// contexts/AudioContext.js
import React, { createContext, useState, useEffect, useRef } from "react";
import { Audio } from "expo-av";

export const AudioContext = createContext();

const debug = (message, data = null) => {
  const timestamp = new Date().toISOString();
  console.log(`[AudioContext ${timestamp}]`, message, data ? data : "");
};

export const AudioProvider = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [trackInfo, setTrackInfo] = useState(null);
  const [error, setError] = useState(null);
  const [volume, setVolume] = useState(1.0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const soundRef = useRef(null);
  const loadAttempts = useRef(0);
  const seekingRef = useRef(false);
  const seekDebounceTimeout = useRef(null);
  const MAX_LOAD_ATTEMPTS = 3;

  const TRACK_ID = "08e58ba4-6067-4630-a528-07af70401a75";
  const BASE_URL = "http://localhost:3000";

  useEffect(() => {
    debug("AudioContext mounted");
    initializeAudio();

    return () => {
      debug("AudioContext unmounting - cleaning up audio");
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
      if (seekDebounceTimeout.current) {
        clearTimeout(seekDebounceTimeout.current);
      }
    };
  }, []);

  const initializeAudio = async () => {
    try {
      debug("Initializing audio system");
      setIsPlayerReady(false);
      setError(null);

      // Configure audio session
      const isConfigured = await configureAudioSession();
      if (!isConfigured) {
        throw new Error("Failed to configure audio session");
      }

      // Fetch track info and load audio
      const track = await fetchTrackInfo();
      if (!track) {
        throw new Error("Track not found");
      }
      await loadAudio(track);

      setIsPlayerReady(true);
      debug("Audio system initialized successfully");
    } catch (err) {
      debug("Audio initialization error", err);
      setError({
        message: "Failed to initialize audio system",
        details: err.message,
      });
      setIsPlayerReady(false);
    }
  };

  const configureAudioSession = async () => {
    try {
      debug("Configuring audio session");
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
        shouldDuckAndroid: true,
        allowsRecordingIOS: false,
        playThroughEarpieceAndroid: false,
      });
      debug("Audio session configured successfully");
      return true;
    } catch (err) {
      debug("Audio session configuration error", err);
      setError({
        message: "Failed to configure audio session",
        details: err.message,
      });
      return false;
    }
  };

  const fetchTrackInfo = async () => {
    try {
      debug("Fetching track info");
      const response = await fetch(`${BASE_URL}/tracks?track_id=${TRACK_ID}`);
      const data = await response.json();
      const track = data.track;
      setTrackInfo(track);
      return track;
    } catch (err) {
      debug("Error fetching track info", err);
      setError({ message: "Failed to fetch track info", details: err.message });
      return null;
    }
  };
  console.log("[AudioContext] Setting track info:", trackInfo);
  const loadAudio = async (track) => {
    try {
      if (loadAttempts.current >= MAX_LOAD_ATTEMPTS) {
        throw new Error("Maximum load attempts reached");
      }

      loadAttempts.current += 1;
      debug("Loading audio file", {
        url: `${BASE_URL}/tracks/stream/${track.track_id}`,
        attempt: loadAttempts.current,
      });

      const { sound } = await Audio.Sound.createAsync(
        { uri: `${BASE_URL}/tracks/stream/${track.track_id}` },
        {
          progressUpdateIntervalMillis: 500,
          positionMillis: 0,
          shouldPlay: false,
          volume: volume,
        },
        onPlaybackStatusUpdate
      );

      soundRef.current = sound;
      debug("Audio loaded successfully and sound object created");

      loadAttempts.current = 0; // Reset attempts on success
    } catch (err) {
      debug("Error loading audio", err);
      setError({
        message: "Failed to load audio",
        details: err.message,
      });

      if (loadAttempts.current < MAX_LOAD_ATTEMPTS) {
        debug(
          `Retrying audio load (${loadAttempts.current}/${MAX_LOAD_ATTEMPTS})`
        );
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return loadAudio(track);
      }

      throw err;
    }
  };

  const onPlaybackStatusUpdate = (status) => {
    if (!status.isLoaded) {
      if (status.error) {
        debug("Playback error encountered", status.error);
        setError({ message: "Playback error", details: status.error });
      }
      return;
    }

    setCurrentTime(status.positionMillis / 1000);
    setDuration(status.durationMillis / 1000);
    setIsPlaying(status.isPlaying);

    if (status.didJustFinish) {
      debug("Track finished playing");
      setIsPlaying(false);
      soundRef.current?.setPositionAsync(0);
    }
  };

  const togglePlayPause = async () => {
    try {
      if (!soundRef.current || !isPlayerReady) {
        debug("Sound not ready for playback");
        return;
      }

      const status = await soundRef.current.getStatusAsync();
      debug("Current playback status", status);

      if (status.isPlaying) {
        debug("Pausing playback");
        await soundRef.current.pauseAsync();
        setIsPlaying(false);
      } else {
        debug("Starting playback");
        await soundRef.current.playAsync();
        setIsPlaying(true);
      }
    } catch (err) {
      debug("Error toggling play/pause", err);
      setError({
        message: "Failed to toggle playback",
        details: err.message,
      });
    }
  };

  const handleVolumeChange = async (newVolume) => {
    try {
      if (!soundRef.current || !isPlayerReady) return;

      debug("Changing volume", newVolume);
      await soundRef.current.setVolumeAsync(newVolume);
      setVolume(newVolume);
    } catch (err) {
      debug("Error setting volume", err);
      setError({
        message: "Failed to change volume",
        details: err.message,
      });
    }
  };

  const seekTo = async (position) => {
    try {
      if (!soundRef.current || !isPlayerReady) return;

      debug("Seeking to position", position);
      await soundRef.current.setPositionAsync(position * 1000);
      setCurrentTime(position);
    } catch (err) {
      debug("Error seeking", err);
      setError({
        message: "Failed to seek",
        details: err.message,
      });
    }
  };

  const skipForward = async () => {
    try {
      if (!soundRef.current || !isPlayerReady) return;

      const newPosition = Math.min(currentTime + 10, duration);
      debug("Skipping forward to", newPosition);
      await soundRef.current.setPositionAsync(newPosition * 1000);
      setCurrentTime(newPosition);
    } catch (err) {
      debug("Error skipping forward", err);
      setError({
        message: "Failed to skip forward",
        details: err.message,
      });
    }
  };

  const skipBackward = async () => {
    try {
      if (!soundRef.current || !isPlayerReady) return;

      const newPosition = Math.max(currentTime - 10, 0);
      debug("Skipping backward to", newPosition);
      await soundRef.current.setPositionAsync(newPosition * 1000);
      setCurrentTime(newPosition);
    } catch (err) {
      debug("Error skipping backward", err);
      setError({
        message: "Failed to skip backward",
        details: err.message,
      });
    }
  };

  const formatTime = (timeInSeconds) => {
    if (!timeInSeconds || isNaN(timeInSeconds)) return "0:00";

    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <AudioContext.Provider
      value={{
        isPlaying,
        isPlayerReady,
        togglePlayPause,
        trackInfo,
        error,
        volume,
        setVolume: handleVolumeChange,
        currentTime,
        duration,
        seekTo,
        skipForward,
        skipBackward,
        formatTime,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};
