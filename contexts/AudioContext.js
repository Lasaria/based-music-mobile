// contexts/AudioContext.js
import React, { createContext, useState, useEffect, useRef } from "react";
import { Audio } from "expo-av";
import { tokenManager } from "../utils/tokenManager";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AudioContext = createContext();

const debug = (message, data = null) => {
  const timestamp = new Date().getTime();
  const readableTimestamp = new Date(timestamp).toLocaleString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    fractionalSecondDigits: 3,
  });
  console.log(`[AudioContext ${readableTimestamp}]`, message, data ? data : "");
};

const PERFORMANCE_TARGETS = {
  loadAudio: {
    total: 150,
    initialStateSetup: 10,
    audioSessionConfig: 10,
    soundObjectCreation: 30,
    bufferAllocation: 20,
    initialChunkDownload: 50,
    stateVerification: 20,
    statusCallbackProcessing: 10,
  },
  togglePlayPause: {
    total: 50,
    statusCheck: 5,
    playerReadyState: 5,
    bufferCheck: 10,
    playCommand: 20,
    statusUpdate: 10,
  },
};

// Performance tracking singleton
const StateTracker = {
  lastUpdateTime: 0,
  lastPosition: 0,
  lastPlayingState: false,
  isUpdating: false,
  minimumUpdateInterval: 250, // ms between updates
  significantPositionChange: 100, // ms position change threshold
};

// Constants for optimized streaming
const BASE_URL = "http://localhost:3000";
const STREAMING_CONFIG = {
  CHUNK_SIZE: 256 * 1024, // 256KB - smaller chunks for faster initial load
  INITIAL_CHUNK: 512 * 1024, // 512KB - larger initial chunk for better startup
  MAX_CHUNK: 1024 * 1024, // 1MB - maximum chunk size for steady state
  STATUS_INTERVAL: 250, // More frequent updates for smoother progress
  BUFFER_THRESHOLD: 0.8, // Start buffering next chunk at 80% of current
};

// Audio session configuration
const AUDIO_MODE_CONFIG = {
  allowsRecordingIOS: false,
  playsInSilentModeIOS: true,
  staysActiveInBackground: true,
  shouldDuckAndroid: true,
  playThroughEarpieceAndroid: false,
};

// Create standard configurations
const createAudioConfig = (trackId) => ({
  uri: `${BASE_URL}/tracks/stream/${trackId}`,
  progressUpdateIntervalMillis: STREAMING_CONFIG.STATUS_INTERVAL,
  androidImplementation: "MediaPlayer",
});

const createSoundConfig = (volume = 1.0) => ({
  shouldPlay: false,
  progressUpdateIntervalMillis: STREAMING_CONFIG.STATUS_INTERVAL,
  positionMillis: 0,
  volume,
  rate: 1.0,
  shouldCorrectPitch: true,
});
const CACHE_PREFIX = "audio_metadata_";
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
// Metadata cache implementation
class MetadataCache {
  async get(trackId) {
    try {
      const cached = await AsyncStorage.getItem(`${CACHE_PREFIX}${trackId}`);
      if (!cached) return null;

      const data = JSON.parse(cached);
      if (Date.now() - data.timestamp > CACHE_DURATION) {
        await AsyncStorage.removeItem(`${CACHE_PREFIX}${trackId}`);
        return null;
      }
      return data.metadata;
    } catch (err) {
      debug("Cache read error:", err);
      return null;
    }
  }

  async set(trackId, metadata) {
    try {
      await AsyncStorage.setItem(
        `${CACHE_PREFIX}${trackId}`,
        JSON.stringify({
          metadata,
          timestamp: Date.now(),
        })
      );
    } catch (err) {
      debug("Cache write error:", err);
    }
  }
}

const metadataCache = new MetadataCache();

const measurePerformance = (phase, targetTime, actualTime) => {
  const diff = actualTime - targetTime;
  const status = diff <= 0 ? "within target" : "exceeded target";
  console.log(
    `[Performance] ${phase}: ${actualTime.toFixed(
      2
    )}ms (${status} by ${Math.abs(diff).toFixed(2)}ms)`
  );
};

export const AudioProvider = ({ children }) => {
  // State Management - Using refs for values that don't need re-renders
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [trackInfo, setTrackInfo] = useState(null);
  const [error, setError] = useState(null);
  const [volume, setVolume] = useState(1.0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTrackId, setCurrentTrackId] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isInitializing, setIsInitializing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);

  // Refs
  const soundRef = useRef(null);
  const loadingPromise = useRef(null);
  const loadAttempts = useRef(0);
  const isPlayerReadyRef = useRef(isPlayerReady);
  const trackInfoRef = useRef(trackInfo);
  const stateUpdatesRef = useRef({});
  const stateUpdateTimeoutRef = useRef(null);
  const currentAudioState = useRef({
    trackId: null,
    isLoaded: false,
  });

  // Batch state updates for better performance
  const batchStateUpdate = (updates) => {
    Object.assign(stateUpdatesRef.current, updates);

    if (stateUpdateTimeoutRef.current) {
      clearTimeout(stateUpdateTimeoutRef.current);
    }

    stateUpdateTimeoutRef.current = setTimeout(() => {
      const updates = stateUpdatesRef.current;

      if (updates.isPlaying !== undefined) setIsPlaying(updates.isPlaying);
      if (updates.isPlayerReady !== undefined)
        setIsPlayerReady(updates.isPlayerReady);
      if (updates.trackInfo !== undefined) setTrackInfo(updates.trackInfo);
      if (updates.error !== undefined) setError(updates.error);
      if (updates.currentTime !== undefined)
        setCurrentTime(updates.currentTime);
      if (updates.duration !== undefined) setDuration(updates.duration);
      if (updates.currentTrackId !== undefined)
        setCurrentTrackId(updates.currentTrackId);
      if (updates.isBuffering !== undefined)
        setIsBuffering(updates.isBuffering);

      stateUpdatesRef.current = {};
    }, 16); // One frame at 60fps
  };

  useEffect(() => {
    const initUserId = async () => {
      try {
        const id = await tokenManager.getUserId();
        setUserId(id);
      } catch (err) {
        debug("Error initializing user ID", err);
      }
    };
    initUserId();
  }, []);
  // Effect: Component Mount and Unmount
  useEffect(() => {
    debug("Component mounted");
    return () => {
      debug("Component unmounting - cleaning up audio");
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, []);

  useEffect(() => {
    isPlayerReadyRef.current = isPlayerReady;
  }, [isPlayerReady]);

  useEffect(() => {
    trackInfoRef.current = trackInfo;
  }, [trackInfo]);

  const THROTTLE_INTERVAL = 250; // ms
  let lastUpdate = 0;

  const throttledStatusUpdate = (status) => {
    const now = Date.now();
    if (now - lastUpdate < THROTTLE_INTERVAL) {
      return;
    }
    lastUpdate = now;
    onPlaybackStatusUpdate(status);
  };

  // Function: Configure Audio Session
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

  //validate and set duration
  const validateAndSetDuration = (status) => {
    if (!status || !status.isLoaded) return;

    // Check both durationMillis and playableDurationMillis
    const durationMillis =
      status.durationMillis || status.playableDurationMillis;

    if (!durationMillis || isNaN(durationMillis)) {
      debug("Invalid duration values:", {
        durationMillis: status.durationMillis,
        playableDurationMillis: status.playableDurationMillis,
      });
      return;
    }

    const durationSeconds = durationMillis / 1000;
    if (durationSeconds > 0) {
      batchStateUpdate({ duration: durationSeconds });
      debug("Duration set to:", durationSeconds);
    } else {
      debug("Invalid duration value (zero or negative):", durationSeconds);
    }
  };
  // Function: Fetch Track Info from Server
  const fetchTrackInfo = async (trackId) => {
    debug("Fetching track info", trackId);
    try {
      const url = `${BASE_URL}/tracks?track_id=${trackId}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }

      const data = await response.json();
      const track = data.track;

      if (!track) {
        throw new Error("Track data is missing in response");
      }

      debug("Track info fetched successfully", track);
      setTrackInfo(track);
      return track;
    } catch (err) {
      debug("Error fetching track info", err);
      setError({ message: "Failed to fetch track info", details: err.message });
      return null;
    }
  };

  // Function: Load Audio
  const loadAudio = async (track) => {
    const totalStartTime = performance.now();
    debug("=== LOAD AUDIO STARTING ===");
    debug("[loadAudio()] Initial state:", {
      trackId: track.track_id,
      isPlayerReady,
      currentTrackId,
      hasSound: soundRef.current ? true : false,
      isLoading: isLoading.current,
      currentAudioState: currentAudioState.current,
    });

    // Set up a timeout to prevent infinite loading states
    const loadingTimeout = setTimeout(() => {
      if (!currentAudioState.current.isLoaded) {
        debug("Audio loading timed out");
        setError({
          message: "Loading timed out",
          details: "Audio failed to load within timeout period",
        });
        setIsPlayerReady(false);
        setCurrentTrackId(null);
        isLoading.current = false;
      }
    }, 15000);

    try {
      // Initial state setup
      const setupStartTime = performance.now();

      // Prevent multiple simultaneous load attempts
      if (isLoading.current) {
        debug("[loadAudio()] BLOCKED: Already loading audio, skipping");
        return;
      }

      debug("loadAudio() Setting loading flag to true");
      setIsLoading(true);
      isLoading.current = true;
      const setupEndTime = performance.now();
      measurePerformance(
        "Initial State Setup",
        PERFORMANCE_TARGETS.loadAudio.initialStateSetup,
        setupEndTime - setupStartTime
      );
      // Clean up existing audio
      if (soundRef.current) {
        debug("Unloading existing sound");
        try {
          await soundRef.current.unloadAsync();
          setCurrentTrackId(null);
        } catch (err) {
          debug("Error unloading existing sound:", err);
        }
        soundRef.current = null;
      }

      // Configure audio session
      const configStartTime = performance.now();
      debug("[loadAudio()] Configuring audio session");
      await Audio.setAudioModeAsync(AUDIO_MODE_CONFIG);
      const configEndTime = performance.now();
      measurePerformance(
        "Audio Session Config",
        PERFORMANCE_TARGETS.loadAudio.audioSessionConfig,
        configEndTime - configStartTime
      );

      // Create configurations
      debug("[loadAudio()] Creating audio and sound configurations");

      const soundStartTime = performance.now();
      const audioConfig = createAudioConfig(track.track_id);
      const soundConfig = createSoundConfig(volume);

      debug("Using stream URL:", audioConfig.uri);

      debug("[loadAudio] Creating sound object with range request");
      const { sound, status } = await Audio.Sound.createAsync(
        audioConfig,
        soundConfig,
        (status) => {
          debug("[loadAudio()] Status callback received:", {
            isLoaded: status.isLoaded,
            trackId: track.track_id,
            currentAudioStateTrackId: currentAudioState.current.trackId,
          });
          const soundEndTime = performance.now();
          measurePerformance(
            "Sound Object Creation",
            PERFORMANCE_TARGETS.loadAudio.soundObjectCreation,
            soundEndTime - soundStartTime
          );
          if (status.isLoaded) {
            debug("[loadAudio()] Setting player ready state");
            if (track.track_id === currentAudioState.current.trackId) {
              setIsPlayerReady(true);
              isPlayerReadyRef.current = true;
              if (status.durationMillis) {
                setDuration(status.durationMillis / 1000);
              }
            } else {
              debug(
                "[loadAudio()] WARN: Track ID mismatch in status callback",
                {
                  expected: track.track_id,
                  current: currentAudioState.current.trackId,
                }
              );
            }
          } else {
            debug("[loadAudio()] Setting player not ready");
            setIsPlayerReady(false);
            isPlayerReadyRef.current = false;
            if (status.error) {
              debug("Playback error encountered:", status.error);
              setError({
                message: "Playback error",
                details: status.error,
              });
            }
          }
          if (status.durationMillis) {
            debug("Initial duration received:", status.durationMillis);
            validateAndSetDuration(status.durationMillis);
          } else {
            debug("No duration in initial status:", status);
          }
          // Log status update
          debug("[loadAudio()] Status update received:", {
            isLoaded: status.isLoaded,
            error: status.error,
            position: status.positionMillis,
            duration: status.durationMillis,
            isPlaying: status.isPlaying,
            isBuffering: status.isBuffering,
          });

          onPlaybackStatusUpdate(status);
        }
      );

      // Save reference and verify
      debug("[loadAudio()] Sound created, saving reference");
      const bufferStartTime = performance.now();
      soundRef.current = sound;

      debug("[loadAudio()] Verifying initial sound status");
      const initialStatus = await sound.getStatusAsync();
      debug("Initial sound status:", initialStatus);
      const bufferEndTime = performance.now();
      measurePerformance(
        "Buffer Allocation",
        PERFORMANCE_TARGETS.loadAudio.bufferAllocation,
        bufferEndTime - bufferStartTime
      );

      const verifyStartTime = performance.now();
      if (!initialStatus.isLoaded) {
        throw new Error("[loadAudio()] Initial sound verification failed");
      }

      // Update states sequentially
      debug("[loadAudio()] Setting states sequentially");

      setTrackInfo(track);
      debug("[loadAudio()] TrackInfo set useState");
      trackInfoRef.current = track;
      debug("[loadAudio()] TrackInfo set useRef");

      setCurrentTrackId(track.track_id);
      debug("[loadAudio()] CurrentTrackId set");

      setIsPlayerReady(true);
      debug("[loadAudio()] PlayerReady states set");
      const verifyEndTime = performance.now();
      measurePerformance(
        "State Verification",
        PERFORMANCE_TARGETS.loadAudio.stateVerification,
        verifyEndTime - verifyStartTime
      );

      if (initialStatus.durationMillis) {
        setDuration(initialStatus.durationMillis / 1000);
        debug("[loadAudio()] Duration set");
      }

      // Update audio state tracking
      debug("[loadAudio()] Updating audio state tracking");
      currentAudioState.current = {
        trackId: track.track_id,
        isLoaded: true,
      };

      // Final verification

      const verifyStatus = await soundRef.current.getStatusAsync();
      debug("[loadAudio()] Verify status:", verifyStatus);

      if (!verifyStatus.isLoaded) {
        throw new Error("[loadAudio()] Final sound verification failed");
      }

      loadAttempts.current = 0;

      const totalEndTime = performance.now();
      measurePerformance(
        "Total Load Audio Time",
        PERFORMANCE_TARGETS.loadAudio.total,
        totalEndTime - totalStartTime
      );
      debug("=== LOAD AUDIO SUCCESS ===\n");
      return true;
    } catch (err) {
      debug("=== LOAD AUDIO FAILED ===");
      debug("Error details:", {
        message: err.message,
        code: err.code,
        stack: err.stack,
      });

      debug("[loadAudio()] Resetting audio state due to load failure");
      currentAudioState.current = {
        trackId: null,
        isLoaded: false,
      };

      await Promise.all([
        setIsPlayerReady(false),
        setCurrentTrackId(null),
        setError({
          message: "Failed to load audio",
          details: err.message,
        }),
      ]);

      throw err;
    } finally {
      clearTimeout(loadingTimeout);
      isLoading.current = false;
      debug("[loadAudio()] Loading flag cleared");

      const endTime = performance.now();
      console.log(
        `\n \n \n ----------loadAudio() EXECUTED IN ${
          endTime - totalStartTime
        } milliseconds---------- \n \n \n`
      );
    }
  };

  // Callback: Playback Status Update
  const onPlaybackStatusUpdate = (status) => {
    const startTime = performance.now();
    const now = Date.now();

    // Skip updates that are too frequent
    if (
      now - StateTracker.lastUpdateTime <
      StateTracker.minimumUpdateInterval
    ) {
      return;
    }

    // Skip if position change is insignificant
    const positionChange = Math.abs(
      (status.positionMillis || 0) - StateTracker.lastPosition
    );
    if (
      !status.isPlaying !== StateTracker.lastPlayingState &&
      positionChange < StateTracker.significantPositionChange
    ) {
      return;
    }

    debug("[onPlayBackStatusUpdate()] Status update received:", {
      isLoaded: status.isLoaded,
      error: status.error,
      position: status.positionMillis,
      duration: status.durationMillis || status.playableDurationMillis,
      isPlaying: status.isPlaying,
      isBuffering: status.isBuffering,
      playableDuration: status.playableDurationMillis,
    });

    try {
      if (!status || !currentAudioState.current.isLoaded) {
        return;
      }

      const updates = {};

      if (status.isLoaded) {
        updates.isPlayerReady = true;
        updates.isBuffering = status.isBuffering || false;

        // Handle duration from either durationMillis or playableDurationMillis
        const durationMillis =
          status.durationMillis || status.playableDurationMillis;
        if (durationMillis) {
          const newDuration = durationMillis / 1000;
          if (newDuration !== duration) {
            debug("[onPlayBackStatusUpdate()] Duration update:", {
              previous: duration,
              new: newDuration,
              rawMillis: durationMillis,
              source: status.durationMillis
                ? "durationMillis"
                : "playableDurationMillis",
            });
            updates.duration = newDuration;
          }
        }

        // Update current playback position if available
        if (status.positionMillis !== undefined) {
          updates.currentTime = status.positionMillis / 1000;
        }

        // Update playing state
        updates.isPlaying = status.isPlaying || false;

        // Handle track completion
        if (status.didJustFinish) {
          debug(
            "[onPlayBackStatusUpdate()] Track finished, resetting position"
          );
          updates.isPlaying = false;
          if (soundRef.current) {
            soundRef.current.setPositionAsync(0).catch((err) => {
              debug(
                "[onPlayBackStatusUpdate()] Error resetting position:",
                err
              );
            });
          }
        }
      } else {
        // Handle unloaded state
        updates.isPlayerReady = false;
        if (status.error) {
          debug("[onPlayBackStatusUpdate()] Playback error:", status.error);
          updates.error = {
            message: "Playback error",
            details: status.error,
          };
        }
      }

      // Batch update all state changes
      batchStateUpdate(updates);

      // Update tracking state for throttling
      StateTracker.lastUpdateTime = now;
      StateTracker.lastPosition = status.positionMillis || 0;
      StateTracker.lastPlayingState = status.isPlaying || false;
    } catch (err) {
      debug("[onPlayBackStatusUpdate()] Error processing status update:", err);
      batchStateUpdate({
        error: {
          message: "Status update error",
          details: err.message,
        },
      });
    }

    // Performance monitoring
    const endTime = performance.now();
    if (endTime - startTime > 16.67) {
      // Longer than one frame
      debug("[onPlayBackStatusUpdate()] Status update took too long:", {
        duration: `${(endTime - startTime).toFixed(2)}ms`,
        status: {
          buffering: status.isBuffering,
          isPlaying: status.isPlaying,
          position: status.positionMillis,
        },
      });
    }
  };
  // Function: Update Current Track
  const updateCurrentTrack = async (trackId) => {
    const startTime = performance.now();
    debug("\n=== UPDATE TRACK STARTING ===");
    debug("[updateCurrentTrack()] Initial state:", {
      trackId,
      isPlayerReady,
      currentTrackId,
      hasSound: soundRef.current ? true : false,
    });

    try {
      setIsInitializing(true);
      setError(null);

      // Reset states
      setIsPlayerReady(false);
      setCurrentTrackId(null);
      currentAudioState.current.isLoaded = false;

      // Unload existing sound if any
      if (soundRef.current) {
        debug("[updateCurrentTrack()] Unloading previous sound");
        try {
          await soundRef.current.unloadAsync();
        } catch (err) {
          debug("[updateCurrentTrack()] Error unloading previous sound:", err);
        }
        soundRef.current = null;
      }

      // Check cache first
      debug("[updateCurrentTrack()] Checking metadata cache");
      let track = await metadataCache.get(trackId);

      if (track) {
        debug("[updateCurrentTrack()] Using cached metadata");
      } else {
        debug("[updateCurrentTrack()] Cache miss, fetching from server");
        // Fetch track info if not in cache
        track = await fetchTrackInfo(trackId);
        if (!track) {
          throw new Error("Failed to fetch track info");
        }
        // Cache the new metadata
        await metadataCache.set(trackId, track);
      }

      // Update states
      debug("[updateCurrentTrack()] Updating track info");
      setTrackInfo(track);
      trackInfoRef.current = track;

      // Load the audio with optimized settings
      debug("[updateCurrentTrack()] Starting audio load");
      await loadAudio(track);

      // Update states to indicate ready
      debug("[updateCurrentTrack()] Finalizing state updates");
      setIsPlayerReady(true);
      isPlayerReadyRef.current = true;
      setCurrentTrackId(trackId);
      currentAudioState.current = {
        trackId: track.track_id,
        isLoaded: true,
      };

      debug("=== UPDATE TRACK SUCCESS ===");
      return true;
    } catch (err) {
      debug("=== UPDATE TRACK FAILED ===");
      debug("[updateCurrentTrack()] Error details:", {
        message: err.message,
        stack: err.stack,
      });

      setError({
        message: "Failed to update track",
        details: err.message,
      });

      // Reset Audio states
      debug("[updateCurrentTrack()] Resetting states due to error");
      currentAudioState.current = {
        trackId: null,
        isLoaded: false,
      };
      setIsPlayerReady(false);
      isPlayerReadyRef.current = false;
      setCurrentTrackId(null);

      throw err;
    } finally {
      setIsInitializing(false);
      const endTime = performance.now();
      debug(`[updateCurrentTrack()] Execution time: ${endTime - startTime}ms`);
      console.log(
        `\n \n \n ----------updateCurrentTrack() EXECUTED IN ${
          endTime - startTime
        } milliseconds---------- \n \n \n`
      );
    }
  };

  // Function: Toggle Play/Pause
  const togglePlayPause = async () => {
    const startTime = performance.now();
    debug("\n=== TOGGLE PLAY/PAUSE START ===");
    debug("[togglePlayPause()] Initial state:", {
      currentAudioState: currentAudioState.current,
      currentTrackId,
      hasSound: !!soundRef.current,
      isBuffering,
      isPlayerReady,
      trackInfo: trackInfo?.track_id,
    });

    try {
      // If sound isn't loaded yet, load it and start playing immediately
      if (!soundRef.current || !currentAudioState.current.isLoaded) {
        debug("[togglePlayPause()] Sound not loaded, loading and playing");
        await loadAudio(trackInfo);
        await soundRef.current.playAsync();
        batchStateUpdate({
          isPlaying: true,
          isBuffering: false,
        });
        debug("[togglePlayPause()] Initial load and play complete");
        return;
      }

      // Sound is loaded, just toggle play state
      const status = await soundRef.current.getStatusAsync();
      const shouldPlay = !status.isPlaying;

      debug(
        `[togglePlayPause()] Executing ${
          shouldPlay ? "playAsync" : "pauseAsync"
        }`
      );
      await soundRef.current[shouldPlay ? "playAsync" : "pauseAsync"]();

      batchStateUpdate({
        isPlaying: shouldPlay,
        isBuffering: false,
      });

      debug(`[togglePlayPause()] ${shouldPlay ? "Play" : "Pause"} complete`);
    } catch (err) {
      debug("=== TOGGLE PLAY/PAUSE FAILED ===", {
        error: err.message,
        stack: err.stack,
      });

      batchStateUpdate({
        isBuffering: false,
        isPlaying: false,
        error: {
          message: "Failed to toggle playback",
          details: err.message,
        },
      });
    } finally {
      const executionTime = performance.now() - startTime;
      console.log(
        `\n \n \n ----------togglePlayPause() EXECUTED IN ${executionTime} milliseconds---------- \n \n \n`
      );
    }
  };

  // Function: Handle Volume Change
  const handleVolumeChange = async (newVolume) => {
    try {
      if (!soundRef.current || !isPlayerReady) return;

      debug("Changing volume to", newVolume);
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

  // Function: Validate and Convert Seek Time
  const validateAndConvertSeekTime = (seconds) => {
    if (typeof seconds !== "number" || isNaN(seconds)) {
      throw new Error("Invalid seek position");
    }
    return Math.max(0, Math.floor(seconds * 1000)); // Ensure positive and convert to ms
  };

  // Function: Seek to Position
  const seekTo = async (seconds) => {
    debug("[seekTo] Starting seek operation with seconds:", seconds);

    try {
      // Early validation
      if (!soundRef.current) {
        debug("[seekTo] No sound object available");
        return;
      }

      // Convert and validate the seek position
      const milliseconds = validateAndConvertSeekTime(seconds);
      debug("[seekTo] Converted milliseconds:", milliseconds);

      // Get current status
      const status = await soundRef.current.getStatusAsync();
      if (!status.isLoaded) {
        debug("[seekTo] Sound not loaded", status);
        return;
      }

      debug("[seekTo] Current status:", {
        position: status.positionMillis,
        duration: status.durationMillis,
        isPlaying: status.isPlaying,
        isLoaded: status.isLoaded,
      });

      // Store playing state
      const wasPlaying = status.isPlaying;

      // Create a promise that will reject if seeking takes too long
      const seekOperation = new Promise(async (resolve, reject) => {
        try {
          // Ensure we're paused
          if (wasPlaying) {
            await soundRef.current.pauseAsync();
            debug("[seekTo] Paused playback for seeking");
          }

          // Perform the seek
          debug("[seekTo] Executing setPositionAsync:", milliseconds);
          await soundRef.current.setPositionAsync(milliseconds);
          debug("[seekTo] Seek completed successfully");

          // Resume if needed
          if (wasPlaying) {
            await soundRef.current.playAsync();
            debug("[seekTo] Resumed playback");
          }

          resolve();
        } catch (error) {
          reject(error);
        }
      });

      // Wait for seek with timeout
      await Promise.race([
        seekOperation,
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Seek timeout")), 3000)
        ),
      ]);

      // Update UI state
      setCurrentTime(seconds);
      debug("[seekTo] State updated successfully");
    } catch (err) {
      debug("[seekTo] Error:", err);
      // Try to restore playback state
      try {
        const currentStatus = await soundRef.current?.getStatusAsync();
        if (currentStatus?.isLoaded && !currentStatus?.isPlaying) {
          await soundRef.current?.playAsync();
        }
      } catch (restoreErr) {
        debug("[seekTo] Error restoring state:", restoreErr);
      }

      setError({
        message: "Failed to seek",
        details: err.message,
      });
    }
  };

  // Function: Skip Forward
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

  // Function: Skip Backward
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

  // Function: Format Time
  const formatTime = (timeInSeconds) => {
    if (!timeInSeconds || isNaN(timeInSeconds)) return "0:00";

    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  // Function: Check Sound Status
  const checkSoundStatus = async () => {
    try {
      if (!soundRef.current) {
        return {
          isLoaded: false,
          isReady: false,
          trackId: currentAudioState.current.trackId,
        };
      }

      const status = await soundRef.current.getStatusAsync();

      if (status.isLoaded && status.durationMillis) {
        validateAndSetDuration(status.durationMillis);
      }
      debug(
        "[checkSoundStatus()] Sound duration status:",
        status.durationMillis
      );
      return {
        isLoaded: status.isLoaded,
        isReady: isPlayerReady,
        trackId: currentAudioState.current.trackId,
        isPlaying: status.isPlaying,
        position: status.positionMillis,
        duration: status.durationMillis,
      };
    } catch (err) {
      debug("Error checking sound status:", err);
      return {
        isLoaded: false,
        isReady: false,
        trackId: currentAudioState.current.trackId,
      };
    }
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
        updateCurrentTrack,
        currentTrackId,
        userId,
        setUserId,
        checkSoundStatus,
        isInitializing,
        soundRef,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};
