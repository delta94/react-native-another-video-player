import React, {useState, useRef} from 'react';
import {Dimensions, Platform} from 'react-native';
import Overlay from './components/Overlay';
import ParentContainer from './components/ParentContainer';
import {
  AnotherVideoPlayerProps,
  VideoDimensions,
  AVPlaybackStatus,
} from './types';
import constants from './constants';
import res from './res';
import utils from './utils';
import Orientation from 'react-native-orientation';

var {width: initialScreenWidth, height: initialScreenHeight} = Dimensions.get(
  'screen',
);

const defaultProps: AnotherVideoPlayerProps = {
  textStyle: res.styles.TEXT_STYLE,
  iconColor: res.colors.WHITE,
  overlayColor: res.colors.BLACK,
  overlayOpacity: 0.25,
  overlayActiveMillis: constants.OVERLAY_ACTIVE_MILLIS,
  overlayFadeMillis: constants.OVERLAY_FADE_MILLIS,
  forceHorizontalFullscreen: false,
};

export default (WrappedComponent: React.ElementType) => {
  return (userProps: AnotherVideoPlayerProps) => {
    const props = {...defaultProps, ...userProps};

    const [playbackStatus, setPlaybackStatus] = useState<AVPlaybackStatus>();
    const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
    const [isPlaybackInSync, setIsPlaybackInSync] = useState<boolean>(true);
    const [videoDimensions, setVideoDimensions] = useState<VideoDimensions>({
      baseWidth: 0,
      baseHeight: 0,
      width: 0,
      height: 0,
    });

    const videoRef = useRef<any>(null);

    function _handleVideoRef(_videoRef: any) {
      videoRef.current = _videoRef;

      if (
        videoRef.current &&
        !!playbackStatus?.durationMillis &&
        !isPlaybackInSync
      ) {
        videoRef.current.setStatusAsync(playbackStatus);
        setIsPlaybackInSync(true);
      }
    }

    function onPlaybackStatusUpdate(_playbackStatus: AVPlaybackStatus) {
      if (!isPlaybackInSync) {
        return;
      }

      props.onPlaybackStatusUpdate?.(_playbackStatus);

      if (_playbackStatus.isLoaded) {
        setPlaybackStatus(_playbackStatus);
      }
    }

    function onPressBackward() {
      var seekMillis: number;
      var positionMillis: number = playbackStatus?.positionMillis || 0;
      var durationMillis = playbackStatus?.durationMillis || 0;

      if (props.seekMillis) {
        seekMillis = props.seekMillis;
      } else {
        seekMillis = durationMillis * 0.1;
      }

      positionMillis -= seekMillis;
      positionMillis = Math.max(0, positionMillis);

      videoRef.current.setStatusAsync?.({positionMillis});
    }

    function onPressForward() {
      var seekMillis: number;
      var positionMillis: number = playbackStatus?.positionMillis || 0;
      var durationMillis = playbackStatus?.durationMillis || 0;

      if (props.seekMillis) {
        seekMillis = props.seekMillis;
      } else {
        seekMillis = durationMillis * 0.1;
      }

      positionMillis += seekMillis;
      positionMillis = Math.min(positionMillis, durationMillis);

      videoRef.current.setStatusAsync?.({positionMillis});
    }

    async function onSeek(_positionMillis: number) {
      var positionMillis: number = _positionMillis;

      positionMillis = Math.max(0, positionMillis);

      if (videoRef) {
        return await videoRef.current
          .setStatusAsync({positionMillis})
          .then((_playbackStatus: AVPlaybackStatus) =>
            setPlaybackStatus(_playbackStatus),
          );
      }
    }

    function onPressPlay() {
      videoRef.current.setStatusAsync?.({shouldPlay: true, isPlaying: true});
    }

    function onPressPause() {
      videoRef.current.setStatusAsync?.({shouldPlay: false, isPlaying: false});
    }

    function onPressVolume() {
      videoRef.current.setStatusAsync?.({isMuted: !playbackStatus?.isMuted});
    }

    function onPressFullscreen() {
      if (!utils.other.isLivestream(playbackStatus)) {
        setIsPlaybackInSync(false);
      }

      if (props.forceHorizontalFullscreen) {
        Orientation.lockToLandscapeRight();
      }

      setIsFullscreen(true);
    }

    function onContainerLayout(event: any) {
      const {
        width: containerWidth,
        height: containerHeight,
      } = event.nativeEvent.layout;

      if (!videoDimensions?.baseHeight) {
        if (initialScreenWidth > initialScreenHeight) {
          if (Platform.OS === 'ios') {
            setVideoDimensions({
              baseWidth: initialScreenHeight,
              baseHeight: initialScreenWidth,
              width: containerHeight,
              height: containerWidth,
            });
          } else {
            setVideoDimensions({
              baseWidth: initialScreenHeight,
              baseHeight: initialScreenWidth,
              width: containerWidth,
              height: containerHeight,
            });
          }
        } else {
          setVideoDimensions({
            baseWidth: containerWidth,
            baseHeight: containerHeight,
            width: containerWidth,
            height: containerHeight,
          });
        }
      } else if (
        Platform.OS === 'ios' &&
        initialScreenWidth > initialScreenHeight &&
        containerWidth < containerHeight
      ) {
        let tmp = initialScreenWidth;
        initialScreenWidth = initialScreenHeight;
        initialScreenHeight = tmp;
        setVideoDimensions({
          baseWidth: containerWidth,
          baseHeight: containerHeight,
          width: containerWidth,
          height: containerHeight,
        });
      } else if (
        Platform.OS === 'android' &&
        initialScreenWidth > initialScreenHeight &&
        containerWidth > containerHeight
      ) {
        setVideoDimensions({
          baseWidth: containerWidth,
          baseHeight: containerHeight,
          width: containerWidth,
          height: containerHeight,
        });
      } else {
        setVideoDimensions((s: any) => {
          return {...s, width: containerWidth, height: containerHeight};
        });
      }
    }

    return (
      <ParentContainer
        style={isFullscreen ? res.styles.FULLSCREEN_CONTAINER : res.styles.CONTAINER}
        onLayout={onContainerLayout}
        isFullscreen={isFullscreen}
        onRequestClose={() => setIsFullscreen(false)}>
        <WrappedComponent
          {...props}
          style={!isFullscreen ? props.style : res.styles.VIDEO}
          ref={_handleVideoRef}
          onPlaybackStatusUpdate={onPlaybackStatusUpdate}
          shouldPlay={isPlaybackInSync && props.shouldPlay}
        />

        <Overlay
          playbackStatus={playbackStatus}
          isFullscreen={isFullscreen}
          videoDimensions={videoDimensions}
          textStyle={props.textStyle}
          iconColor={props.iconColor}
          overlayColor={props.overlayColor}
          overlayOpacity={props.overlayOpacity}
          overlayActiveMillis={props.overlayActiveMillis}
          overlayDurationMillis={props.overlayFadeMillis}
          avoidSafeAreas={props.avoidSafeAreas}
          onPressBackward={onPressBackward}
          onPressForward={onPressForward}
          onPressPlay={onPressPlay}
          onPressPause={onPressPause}
          onPressVolume={onPressVolume}
          onPressSettings={props.onPressSettings}
          onPressFullscreen={onPressFullscreen}
          onSeek={onSeek}
        />
      </ParentContainer>
    );
  };
};
