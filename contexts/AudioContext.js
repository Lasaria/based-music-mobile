// contexts/AudioContext.js
import React, { createContext, useState, useEffect, useRef } from "react";
import { Audio } from "expo-av";
import { tokenManager } from "../utils/tokenManager";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AudioContext = createContext();

const debug = (message, data = null) => {
  const timestamp = new Date().toISOString();
  const readableTimestamp = new Date(timestamp).toLocaleString();
  console.log(`[AudioContext ${readableTimestamp}]`, message, data ? data : "");
};

// Constants for optimized streaming
const BASE_URL = "http://localhost:3000";
const INITIAL_CHUNK_SIZE = 65536; // 64KB initial load
const CACHE_PREFIX = "audio_metadata_";
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour

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

export const AudioProvider = ({ children }) => {
  // State Variables
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
  const currentAudioState = useRef({
    trackId: null,
    isLoaded: false,
  });

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

  // These two useEffect hooks are used to keep the `useRef` variables `isPlayerReadyRef` and `trackInfoRef`
  // synchronized with the latest values of `isPlayerReady` and `trackInfo`, respectively.
  //
  // By storing these state values in refs, we create persistent references to the current values
  // without causing re-renders when they change. This is especially useful in scenarios where
  // the latest values need to be accessed by functions or event handlers outside of the React render cycle.
  //
  // Specifically:
  // - `isPlayerReadyRef` is updated whenever `isPlayerReady` changes, allowing us to access the latest
  //   player readiness status without triggering a re-render.
  // - `trackInfoRef` is updated whenever `trackInfo` changes, enabling access to the most recent track information
  //   for use in asynchronous functions, callbacks, or other parts of the component that need up-to-date values.
  //
  // Using refs this way optimizes performance by avoiding unnecessary re-renders while ensuring that the most
  // current data is accessible to any logic that relies on these values.

  //todo: @Deprecated =  Effect: Update Refs for Player Ready and Track Info
  //todo: I think it is slowing down the streaming by 300 milliseconds
  // useEffect(() => {
  //   isPlayerReadyRef.current = isPlayerReady;
  // }, [isPlayerReady]);

  // useEffect(() => {
  //   trackInfoRef.current = trackInfo;
  // }, [trackInfo]);

  //TODO: @Deprecated =  Effect: Initialize Audio When Track ID Changes
  // useEffect(() => {
  //   if (currentTrackId) {
  //     debug("Track ID changed, initializing audio", currentTrackId);
  //     if (!isInitializing.current) {
  //       isInitializing.current = true;
  //       initializeAudio(currentTrackId).finally(() => {
  //         isInitializing.current = false;
  //       });
  //     }
  //   }

  //   return () => {
  //     if (soundRef.current) {
  //       debug("Cleaning up sound object");
  //       soundRef.current.unloadAsync();
  //       soundRef.current = null;
  //     }
  //   };
  // }, [currentTrackId]);

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

  //TODO: @Depricated = Function: Initialize Audio System
  const initializeAudio = async (trackId) => {
    debug("Initializing audio system for track", trackId);
    if (isInitializing.current) {
      debug("Already initializing, skipping");
      return;
    }

    try {
      setIsInitializing(true);
      setIsPlayerReady(false);
      setError(null);

      // Configure audio session
      const isConfigured = await configureAudioSession();
      debug("Audio session configured:", isConfigured);
      if (!isConfigured) {
        throw new Error("Failed to configure audio session");
      }

      // Fetch track info first and wait for it
      const track = await fetchTrackInfo(trackId);
      debug("Track info fetched:", track);
      if (!track) {
        throw new Error("Track not found");
      }

      // Set track info before loading audio
      setTrackInfo(track);

      // Load audio
      await loadAudio(track);
      debug("Audio loaded successfully");

      setIsPlayerReady(true);
      debug("Audio system initialized successfully");
    } catch (err) {
      debug("Audio initialization error", err);
      setError({
        message: "Failed to initialize audio system",
        details: err.message,
      });
      setIsPlayerReady(false);
    } finally {
      setIsInitializing(false);
    }
  };

  //TODO: @Depricated = Helper Function: Create Sound Object

  const createSound = async (audioConfig, soundConfig, statusCallback) => {
    try {
      debug("=== Starting Sound Creation ===");
      debug("Audio Config:", audioConfig);
      debug("Sound Config:", soundConfig);

      // Validate inputs
      if (!audioConfig.uri) {
        throw new Error("Invalid audio configuration: missing URI");
      }

      debug("Attempting to create sound object...");
      const createResult = await Audio.Sound.createAsync(
        audioConfig,
        {
          ...soundConfig,
          progressUpdateIntervalMillis: 500,
          shouldPlay: false,
        },
        (status) => {
          debug("Detailed Status Update:", {
            isLoaded: status.isLoaded,
            isBuffering: status.isBuffering,
            positionMillis: status.positionMillis,
            durationMillis: status.durationMillis,
            didJustFinish: status.didJustFinish,
            error: status.error,
            isPlaying: status.isPlaying,
            rate: status.rate,
            shouldPlay: status.shouldPlay,
            volume: status.volume,
          });
          statusCallback(status);
        }
      );

      debug("Initial creation result:", {
        hasSound: !!createResult.sound,
        status: {
          isLoaded: createResult.status.isLoaded,
          error: createResult.status.error,
          durationMillis: createResult.status.durationMillis,
        },
      });

      // Verify sound creation
      if (!createResult.sound) {
        throw new Error("Sound creation failed - no sound object returned");
      }

      debug("Checking sound status...");
      const statusCheck = await createResult.sound.getStatusAsync();
      debug("Sound status check:", {
        isLoaded: statusCheck.isLoaded,
        error: statusCheck.error,
        durationMillis: statusCheck.durationMillis,
        isBuffering: statusCheck.isBuffering,
      });

      if (!statusCheck.isLoaded) {
        throw new Error(
          `Sound not properly loaded: ${statusCheck.error || "Unknown error"}`
        );
      }

      debug("=== Sound Creation Successful ===");
      return createResult;
    } catch (err) {
      debug("=== Sound Creation Failed ===");
      debug("Error details:", {
        message: err.message,
        code: err.code,
        stack: err.stack,
      });
      throw err;
    }
  };

  // Function: Load Audio
  const loadAudio = async (track) => {
    const startTime = performance.now();
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
      // Prevent multiple simultaneous load attempts
      if (isLoading.current) {
        debug("[loadAudio()] BLOCKED: Already loading audio, skipping");
        return;
      }

      debug("loadAudio() Setting loading flag to true");
      setIsLoading(true);
      isLoading.current = true;

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

      // Construct streaming URL with initial range request
      debug("[loadAudio()] Starting new sound creation");
      const streamUrl = `${BASE_URL}/tracks/stream/${track.track_id}`;
      debug("Using stream URL:", streamUrl);

      // Configure audio session
      debug("[loadAudio()] Configuring audio session");
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });

      // Add range request for initial chunk
      const initialHeaders = {
        Range: `bytes=0-${65536}`, // Request first 64KB
      };

      debug("[loadAudio] Creating sound object with range request");
      const { sound, status } = await Audio.Sound.createAsync(
        {
          uri: streamUrl,
          headers: initialHeaders,
          progressUpdateIntervalMillis: 500,
        },
        {
          shouldPlay: false,
          progressUpdateIntervalMillis: 500,
          positionMillis: 0,
          volume: volume,
          rate: 1.0,
          androidImplementation: "MediaPlayer",
        },
        (status) => {
          debug("[loadAudio()] Status callback received:", {
            isLoaded: status.isLoaded,
            trackId: track.track_id,
            currentAudioStateTrackId: currentAudioState.current.trackId,
          });

          if (status.isLoaded) {
            debug("[loadAudio()] Setting player ready state");
            if (currentAudioState.current.trackId === track.track_id) {
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
      soundRef.current = sound;

      debug("[loadAudio()] Verifying initial sound status");
      const initialStatus = await sound.getStatusAsync();
      debug("Initial sound status:", initialStatus);

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
          endTime - startTime
        } milliseconds---------- \n \n \n`
      );
    }
  };

  // Callback: Playback Status Update
  const onPlaybackStatusUpdate = (status) => {
    const statusTime = performance.now();
    debug("[onPlayBackStatusUpdate()] Status update received:", {
      isLoaded: status.isLoaded,
      error: status.error,
      position: status.positionMillis,
      duration: status.durationMillis,
      isPlaying: status.isPlaying,
      isBuffering: status.isBuffering,
      playableDuration: status.playableDurationMillis,
    });

    try {
      // Early return if status hasn't changed significantly
      if (!status || !currentAudioState.current.isLoaded) {
        debug(
          "[onPlayBackStatusUpdate()] Skipping update - no significant changes"
        );
        return;
      }

      // Batch state updates for performance
      const stateUpdates = [];

      // Handle loading state
      if (status.isLoaded) {
        stateUpdates.push(() => setIsPlayerReady(true));

        // Update buffering state
        if (status.isBuffering !== undefined) {
          stateUpdates.push(() => setIsBuffering(status.isBuffering));
          debug(
            "[onPlayBackStatusUpdate()] Buffering state:",
            status.isBuffering
          );
        }

        // Track playback progress
        if (status.playableDurationMillis) {
          const progress =
            (status.playableDurationMillis / status.durationMillis) * 100;
          debug(
            "[onPlayBackStatusUpdate()] Loading progress:",
            `${progress.toFixed(2)}%`
          );
        }

        // Handle duration update
        if (status.durationMillis && status.durationMillis > 0) {
          stateUpdates.push(() => setDuration(status.durationMillis / 1000));
          debug(
            "[onPlayBackStatusUpdate()] Duration updated:",
            status.durationMillis / 1000
          );
        }
      } else {
        stateUpdates.push(() => setIsPlayerReady(false));

        if (status.error) {
          debug(
            "[onPlayBackStatusUpdate()] Playback error encountered:",
            status.error
          );
          stateUpdates.push(() =>
            setError({
              message: "Playback error",
              details: status.error,
            })
          );
        }
      }

      // Update playing state
      const newIsPlaying = status.isPlaying || false;
      stateUpdates.push(() => setIsPlaying(newIsPlaying));
      debug("[onPlayBackStatusUpdate()] Playing state:", newIsPlaying);

      // Update time position if changed
      if (status.positionMillis !== undefined) {
        const newPosition = status.positionMillis / 1000;
        stateUpdates.push(() => setCurrentTime(newPosition));
        debug("[onPlayBackStatusUpdate()] Position updated:", newPosition);
      }

      // Handle track completion
      if (status.didJustFinish) {
        debug("[onPlayBackStatusUpdate()] Track finished playing");
        stateUpdates.push(() => setIsPlaying(false));

        if (soundRef.current) {
          soundRef.current.setPositionAsync(0).catch((err) => {
            debug("[onPlayBackStatusUpdate()] Error resetting position:", err);
          });
        }
      }

      // Apply all state updates in one batch
      debug("[onPlayBackStatusUpdate()] Applying batch state updates");
      stateUpdates.forEach((update) => update());
    } catch (err) {
      debug("[onPlayBackStatusUpdate()] Error processing status update:", err);
      setError({
        message: "Status update error",
        details: err.message,
      });
    } finally {
      const endTime = performance.now();
      if (endTime - statusTime > 16.67) {
        // Longer than one frame (60fps)
        debug("[onPlayBackStatusUpdate()] Status update took too long:", {
          duration: `${(endTime - statusTime).toFixed(2)}ms`,
          status: {
            isPlaying: status.isPlaying,
            position: status.positionMillis,
            buffering: status.isBuffering,
          },
        });
      }
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
      hasSound: soundRef.current ? true : false,
      isPlayerReady,
      currentTrackId,
      trackInfo: trackInfo?.track_id,
      isBuffering: false,
      currentAudioState: currentAudioState.current,
    });

    try {
      // Early validation checks
      if (!soundRef.current) {
        debug("[togglePlayPause()] BLOCKED: No sound object");
        return;
      }

      if (!isPlayerReadyRef.current) {
        debug("[togglePlayPause()] BLOCKED: Player not ready");
        setError({
          message: "Player not ready",
          details: "Attempting to play before audio is loaded",
        });
        return;
      }

      // Get current status with timeout protection
      debug("[togglePlayPause()] Getting current status");
      const statusPromise = soundRef.current.getStatusAsync();
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Status check timed out")), 3000)
      );

      const status = await Promise.race([statusPromise, timeoutPromise]).catch(
        (err) => {
          debug("[togglePlayPause()] Status check failed:", err);
          throw err;
        }
      );

      debug("[togglePlayPause()] Current status:", status);

      // Handle unloaded state
      if (!status.isLoaded) {
        debug("[togglePlayPause()] Sound not loaded, attempting reload");
        if (trackInfoRef.current) {
          debug("[togglePlayPause()] Reloading audio");
          await loadAudio(trackInfo);

          // Verify reload success
          const newStatus = await soundRef.current.getStatusAsync();
          debug("[togglePlayPause()] Status after reload:", newStatus);

          if (!newStatus.isLoaded) {
            debug("[togglePlayPause()] BLOCKED: Reload failed");
            throw new Error("Failed to reload audio");
          }
        } else {
          debug("[togglePlayPause()] BLOCKED: No track info for reload");
          return;
        }
      }

      // Performance optimization: Prepare next action before executing
      const shouldPlay = !status.isPlaying;
      const action = shouldPlay ? "playAsync" : "pauseAsync";

      debug(`[togglePlayPause()] Executing ${action}`);
      setIsBuffering(true);

      // Execute playback toggle with timeout protection
      const actionPromise = soundRef.current[action]();
      const actionTimeout = new Promise((_, reject) =>
        setTimeout(() => reject(new Error(`${action} timed out`)), 5000)
      );

      await Promise.race([actionPromise, actionTimeout]);

      // Update state
      setIsPlaying(shouldPlay);
      setIsBuffering(false);

      debug(`[togglePlayPause()] ${shouldPlay ? "Play" : "Pause"} complete`);

      // Verify final state
      const finalStatus = await soundRef.current.getStatusAsync();
      if (finalStatus.isPlaying !== shouldPlay) {
        debug("[togglePlayPause()] State mismatch after toggle:", {
          expected: shouldPlay,
          actual: finalStatus.isPlaying,
        });

        // Attempt to correct state
        setIsPlaying(finalStatus.isPlaying);
      }

      debug("=== TOGGLE PLAY/PAUSE SUCCESS ===\n");
    } catch (err) {
      debug("=== TOGGLE PLAY/PAUSE FAILED ===");
      debug("Error details:", {
        message: err.message,
        stack: err.stack,
        state: {
          isPlayerReady,
          currentTrackId,
          hasSound: !!soundRef.current,
        },
      });

      // Reset states on error
      setIsBuffering(false);
      setIsPlaying(false);

      setError({
        message: "Failed to toggle playback",
        details: err.message,
      });

      // Attempt to recover player state
      try {
        if (soundRef.current) {
          const recoveryStatus = await soundRef.current.getStatusAsync();
          setIsPlaying(recoveryStatus.isPlaying || false);
        }
      } catch (recoveryErr) {
        debug("[togglePlayPause()] Recovery attempt failed:", recoveryErr);
      }
    } finally {
      const endTime = performance.now();
      const executionTime = endTime - startTime;

      // Log warning if toggle takes too long
      if (executionTime > 150) {
        // More than 150ms is considered slow
        debug("[togglePlayPause()] Warning: Toggle operation was slow", {
          executionTime: `${executionTime.toFixed(2)}ms`,
          threshold: "150ms",
        });
      }

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

  // Function: Seek to Position
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
