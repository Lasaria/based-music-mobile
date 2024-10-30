import React, { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import { router } from "expo-router";
import { debounce } from "lodash";

const debug = (message, data = null) => {
  const timestamp = new Date().toISOString();
  console.log(`[AudioPlayer ${timestamp}]`, message, data ? data : "");
};

const AudioPlayer = ({ isPlaying: isPlayingProp, onPlayPause, onReady }) => {
  const [sound, setSound] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAudioReady, setIsAudioReady] = useState(false);
  const [playerState, setPlayerState] = useState("initializing");
  const [trackInfo, setTrackInfo] = useState(null);
  const isMounted = useRef(true);
  const loadAttempts = useRef(0);
  const currentSound = useRef(null);
  const MAX_LOAD_ATTEMPTS = 3;

  const TRACK_ID = "d599e983-9996-4b70-bb90-0f338ae55ee1";
  const BASE_URL = "http://localhost:3000";

  // Initialization
  useEffect(() => {
    debug("Component mounted");
    isMounted.current = true;
    initializeAudio();
    return () => {
      debug("Component unmounting");
      isMounted.current = false;
      cleanupAudio();
    };
  }, []);

  // Handle play/pause prop changes
  useEffect(() => {
    if (sound && isAudioReady) {
      debug("Playback state change triggered", { isPlayingProp });
      handlePlaybackStateChange();
    }
  }, [isPlayingProp, sound, isAudioReady]);

  // Notify parent when player is ready
  useEffect(() => {
    if (isAudioReady && sound && onReady) {
      debug("Player ready - notifying parent");
      onReady();
    }
  }, [isAudioReady, sound]);

  const debouncedSetIsAudioReady = useRef(
    debounce((value) => {
      if (isMounted.current) {
        setIsAudioReady(value);
      }
    }, 100)
  ).current;

  const debouncedSetPlayerState = useRef(
    debounce((value) => {
      if (isMounted.current) {
        setPlayerState(value);
      }
    }, 100)
  ).current;

  useEffect(() => {
    return () => {
      debouncedSetIsAudioReady.cancel();
      debouncedSetPlayerState.cancel();
    };
  }, []);

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
      if (!response.ok) throw new Error("Failed to fetch track info");

      const data = await response.json();
      const track = data.tracks[0];
      debug("Track info received", track);
      setTrackInfo(track);
      return track;
    } catch (err) {
      debug("Error fetching track info", err);
      throw err;
    }
  };

  const initializeAudio = async () => {
    try {
      debug("Initializing audio system");
      setPlayerState("initializing");
      setIsLoading(true);

      const track = await fetchTrackInfo();
      if (!track) {
        throw new Error("Track not found");
      }

      // Debug URL access
      try {
        debug("Testing S3 URL access");
        const response = await fetch(track.audio_url, { method: "HEAD" });
        debug("S3 URL test result", {
          status: response.status,
          headers: Object.fromEntries(response.headers.entries()),
        });
      } catch (err) {
        debug("S3 URL test failed", err);
      }

      const isConfigured = await configureAudioSession();
      if (!isConfigured) {
        throw new Error("Failed to configure audio session");
      }

      await loadAudio(track);
      setIsAudioReady(true);
      setPlayerState("ready");
      debug("Audio system initialized successfully");
    } catch (err) {
      const errorMessage = "Failed to initialize audio system";
      debug(errorMessage, err);
      setError({ message: errorMessage, details: err.message });
      setPlayerState("error");
    } finally {
      setIsLoading(false);
    }
  };

  const loadAudio = async (track) => {
    try {
      if (loadAttempts.current >= MAX_LOAD_ATTEMPTS) {
        throw new Error("Maximum load attempts reached");
      }

      loadAttempts.current += 1;
      const streamingUrl = `${BASE_URL}/tracks/stream/${track.track_id}`;
      debug("Loading audio file", {
        url: streamingUrl,
        attempt: loadAttempts.current,
      });

      // Clean up any existing sound
      await cleanupAudio();

      let newSound = null;
      try {
        const { sound } = await Audio.Sound.createAsync(
          {
            uri: streamingUrl,
            headers: {
              Accept: "audio/mpeg",
              "Cache-Control": "no-cache",
            },
          },
          {
            shouldPlay: false,
            progressUpdateIntervalMillis: 500,
            positionMillis: 0,
            volume: 1.0,
            rate: 1.0,
            shouldCorrectPitch: true,
            staysActiveInBackground: true,
          },
          onPlaybackStatusUpdate
        );
        newSound = sound;
      } catch (createError) {
        debug("Error creating sound", createError);
        throw createError;
      }

      // Only proceed if still mounted
      if (!isMounted.current) {
        if (newSound) {
          await newSound.unloadAsync();
        }
        return false;
      }

      currentSound.current = newSound;
      setSound(newSound);

      // Wait for initial load
      let loadTimeout = null;
      try {
        await new Promise((resolve, reject) => {
          loadTimeout = setTimeout(
            () => reject(new Error("Load timeout")),
            5000
          );

          const checkStatus = async () => {
            const status = await newSound.getStatusAsync();
            if (status.isLoaded) {
              resolve();
            } else if (status.error) {
              reject(new Error(status.error));
            } else {
              setTimeout(checkStatus, 100);
            }
          };
          checkStatus();
        });
      } catch (loadError) {
        throw loadError;
      } finally {
        if (loadTimeout) {
          clearTimeout(loadTimeout);
        }
      }

      loadAttempts.current = 0; // Reset attempts on success
      debug("Audio loaded successfully");
      return true;
    } catch (err) {
      debug("Error loading audio", err);

      if (loadAttempts.current < MAX_LOAD_ATTEMPTS) {
        debug(
          `Retrying audio load (${loadAttempts.current}/${MAX_LOAD_ATTEMPTS})`
        );
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return loadAudio(track);
      }

      setError({
        message: "Failed to load audio",
        details: err.message,
      });
      throw err;
    }
  };

  const onPlaybackStatusUpdate = (status) => {
    if (!isMounted.current) return;

    const isSignificantChange =
      status.isLoaded !== isAudioReady ||
      status.error ||
      status.didJustFinish ||
      status.isBuffering;

    if (isSignificantChange) {
      debug("Playback status update", {
        isLoaded: status.isLoaded,
        isPlaying: status.isPlaying,
        positionMillis: status.positionMillis,
        durationMillis: status.durationMillis,
        isBuffering: status.isBuffering,
        error: status.error,
        didJustFinish: status.didJustFinish,
      });
    }

    if (status.isLoaded && !isAudioReady) {
      debug("Audio initially loaded");
      setIsAudioReady(true);
      setError(null);
    } else if (status.error) {
      debug("Playback status error", status.error);
      setError({ message: "Playback error", details: status.error });
    } else if (status.didJustFinish) {
      debug("Audio playback finished");
      handleTrackFinish();
    }
  };

  // New method to handle track finish
  const handleTrackFinish = async () => {
    debug("Handling track finish");
    try {
      // Reset position to start
      await sound.setPositionAsync(0);

      // Notify parent that playback has finished
      if (isMounted.current) {
        onPlayPause(false);
      }

      setPlayerState("ready");
    } catch (err) {
      debug("Error handling track finish", err);
      setError({
        message: "Failed to reset track",
        details: err.message,
      });
    }
  };

  const handlePlaybackStateChange = async () => {
    try {
      if (!sound) {
        debug("No sound loaded");
        return;
      }

      if (!isAudioReady) {
        debug("Audio not ready");
        return;
      }

      const status = await sound.getStatusAsync();
      debug("Current sound status before state change", status);

      if (isPlayingProp) {
        debug("Attempting to start playback");

        // Reset position to start if we're at the end
        if (status.positionMillis >= status.durationMillis - 50) {
          debug("Resetting position to start");
          await sound.setPositionAsync(0);
        }

        const playResult = await sound.playAsync();
        debug("Play result", playResult);
        setPlayerState("playing");
      } else {
        debug("Attempting to pause playback");
        const pauseResult = await sound.pauseAsync();
        debug("Pause result", pauseResult);
        setPlayerState("paused");
      }

      // Verify the state change
      const newStatus = await sound.getStatusAsync();
      debug("Sound status after state change", newStatus);

      if (newStatus.isPlaying !== isPlayingProp) {
        throw new Error(
          `Failed to ${isPlayingProp ? "play" : "pause"} audio - state mismatch`
        );
      }
    } catch (err) {
      debug("Playback state change error", err);
      setError({
        message: `Failed to ${isPlayingProp ? "play" : "pause"} audio`,
        details: err.message,
      });
      setPlayerState("error");
      onPlayPause(false);
    }
  };

  const cleanupAudio = async () => {
    if (sound) {
      debug("Cleaning up audio");
      try {
        await sound.unloadAsync();
        setSound(null);
        setIsAudioReady(false);
      } catch (err) {
        debug("Error cleaning up audio", err);
      }
    }
  };

  const handlePlayPause = async (event) => {
    event.stopPropagation();

    if (isLoading) {
      debug("Play/Pause ignored - system is loading");
      return;
    }

    if (!isAudioReady) {
      debug("Play/Pause ignored - audio not ready");
      setError({ message: "Audio system not ready" });
      return;
    }

    try {
      const currentStatus = await sound.getStatusAsync();
      debug("Current status before play/pause", currentStatus);

      // Reset position if we're at the end
      if (currentStatus.positionMillis >= currentStatus.durationMillis - 50) {
        debug("Resetting position to start before playing");
        await sound.setPositionAsync(0);
      }

      // Toggle the playing state
      const newPlayingState = !isPlayingProp;
      debug(`Attempting to ${newPlayingState ? "play" : "pause"} audio`);

      setPlayerState(newPlayingState ? "playing" : "pausing");
      onPlayPause(newPlayingState);
    } catch (err) {
      const errorMessage = `Failed to ${
        isPlayingProp ? "pause" : "play"
      } audio`;
      debug(errorMessage, err);
      setError({ message: errorMessage, details: err.message });
      setPlayerState("error");
    }
  };

  const handleNavigateToStream = () => {
    debug("Navigating to stream view");
    try {
      router.push("/streamMusic");
    } catch (err) {
      debug("Navigation error", err);
      setError({ message: "Navigation failed", details: err.message });
    }
  };

  const getStatusText = () => {
    if (error) return "Error";
    if (isLoading) return "Loading...";
    if (!isAudioReady) return "Initializing...";
    return playerState.charAt(0).toUpperCase() + playerState.slice(1);
  };

  return (
    <TouchableOpacity
      onPress={handleNavigateToStream}
      style={{
        padding: 10,
        backgroundColor: "#333",
        borderRadius: 10,
        marginBottom: 10,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Image
          source={{
            uri: trackInfo?.cover_image_url || "https://via.placeholder.com/50",
          }}
          style={{
            width: 50,
            height: 50,
            borderRadius: 10,
            backgroundColor: "#444",
          }}
        />

        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={{ color: "white", fontSize: 16, fontWeight: "500" }}>
            {trackInfo?.title || "Loading..."}
          </Text>
          <Text style={{ color: "gray", fontSize: 12 }}>
            Genre: {trackInfo?.genre || "Unknown"}
          </Text>
          <Text style={{ color: "#888", fontSize: 10, marginTop: 4 }}>
            Status: {getStatusText()}
          </Text>
          {error && (
            <View>
              <Text style={{ color: "red", fontSize: 10, marginTop: 4 }}>
                Error: {error.message}
              </Text>
              {error.details && (
                <Text style={{ color: "#ff6b6b", fontSize: 8, marginTop: 2 }}>
                  {error.details}
                </Text>
              )}
            </View>
          )}
        </View>

        <TouchableOpacity
          onPress={handlePlayPause}
          disabled={isLoading || !isAudioReady}
          style={{
            padding: 8,
            opacity: isLoading || !isAudioReady ? 0.5 : 1,
          }}
        >
          <Ionicons
            name={
              isLoading
                ? "sync"
                : isPlayingProp
                ? "pause-circle"
                : "play-circle"
            }
            size={32}
            color="white"
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export default AudioPlayer;
