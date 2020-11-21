import {TextStyle, ViewStyle} from 'react-native';

export interface AnotherVideoPlayerProps {
  style?: ViewStyle;
  textStyle?: TextStyle;
  iconColor?: string;
  overlayColor?: string;
  overlayOpacity?: number;
  overlayActiveMillis?: number;
  overlayFadeMillis?: number;
  seekMillis?: number;
  useSeekControls?: boolean;
  forceHorizontalFullscreen?: boolean;
  avoidSafeAreas?: boolean;

  onPressSettings?: () => void;
}

export interface OverlayProps {
  playbackStatus?: AVPlaybackStatus;
  isFullscreen: boolean;
  videoDimensions: VideoDimensions;
  textStyle?: TextStyle;
  iconColor?: string;
  overlayColor?: string;
  overlayOpacity?: number;
  overlayActiveMillis?: number;
  overlayFadeMillis?: number;
  avoidSafeAreas?: boolean;

  onPressBack?: () => void;
  onPressBackward?: () => void;
  onPressForward?: () => void;
  onSeek: (positionMillis: number) => void;
  onPressPlay?: () => void;
  onPressPause?: () => void;
  onPressVolume?: () => void;
  onPressSettings?: () => void;
  onPressFullscreen?: () => void;
}

export interface ProgressBarProps {
  isFullscreen?: boolean;
  avoidSafeAreas?: boolean;
  playbackStatus?: AVPlaybackStatus;
  videoDimensions: VideoDimensions;
  hasSettings: boolean;
  textStyle?: string;
  iconColor?: string;

  fadeIn: (keepOverlayActive?: boolean) => void;
  onSeek: (positionMillis: number) => Promise<AVPlaybackStatus>;
}

export interface LivestreamBarProps {
  isFullscreen?: boolean;
  avoidSafeAreas?: boolean;
  videoDimensions: VideoDimensions;
  textStyle?: string;
  iconColor?: string;
}

export declare type AVPlaybackStatus = {
  isLoaded: true;
  androidImplementation?: string;
  uri: string;
  progressUpdateIntervalMillis: number;
  durationMillis?: number;
  positionMillis: number;
  playableDurationMillis?: number;
  seekMillisToleranceBefore?: number;
  seekMillisToleranceAfter?: number;
  shouldPlay: boolean;
  isPlaying: boolean;
  isBuffering: boolean;
  rate: number;
  shouldCorrectPitch: boolean;
  volume: number;
  isMuted: boolean;
  isLooping: boolean;
  didJustFinish: boolean;
};

export declare type VideoDimensions = {
  baseWidth: number;
  baseHeight: number;
  width: number;
  height: number;
};

export declare type SeekState = {
  prevPositionMillis: number;
  nextPositionMillis: number;
  isSeeking: boolean;
  isGranted: boolean;
};
