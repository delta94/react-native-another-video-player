import React, {useMemo, useState, useRef} from 'react';
import {Dimensions, StyleSheet, Platform} from 'react-native';
import Overlay from './Overlay';
import ParentContainer from './ParentContainer';
import {
  AnotherVideoPlayerProps,
  VideoDimensions,
  AVPlaybackStatus,
} from './types';
import res from './res';
import utils from './utils/other';
import Orientation from 'react-native-orientation';

var {width: initialScreenWidth, height: initialScreenHeight} = Dimensions.get(
  'screen',
);

const defaultProps: AnotherVideoPlayerProps = {
  color: res.colors.WHITE,
  overlayColor: res.colors.BLACK,
  overlayOpacity: 0.25,
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

    console.log('props', props);

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

    function onReadyForDisplay(data: any) {
      props.onReadyForDisplay?.(data);
    }

    function onFullscreenUpdate(data: any) {
      props.onFullscreenUpdate?.(data);
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
      if (props.useNativeControls) {
        videoRef.current.presentFullscreenPlayer?.();
      } else if (isFullscreen) {
        if (!utils.isLivestream(playbackStatus)) {
          setIsPlaybackInSync(false);
        }

        if (props.forceHorizontalFullscreen) {
          Orientation.lockToPortrait();
          Orientation.unlockAllOrientations();
        }

        setIsFullscreen(false);
      } else {
        if (!utils.isLivestream(playbackStatus)) {
          setIsPlaybackInSync(false);
        }

        if (props.forceHorizontalFullscreen) {
          Orientation.lockToLandscapeRight();
        }

        setIsFullscreen(true);
      }
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

    const styles = useMemo(() => {
      var container: any;

      if (isFullscreen) {
        container = {
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          justifyContent: 'center',
          backgroundColor: res.colors.BLACK,
        };
      } else {
        container = {
          flex: 1,
        };
      }

      return StyleSheet.create({
        container,
      });
    }, [isFullscreen]);

    return (
      <ParentContainer
        style={styles.container}
        onLayout={onContainerLayout}
        isFullscreen={isFullscreen}
        onRequestClose={() => setIsFullscreen(false)}>
        <WrappedComponent
          {...props}
          style={!isFullscreen ? props.style : {width: '100%', height: '100%'}}
          ref={_handleVideoRef}
          onPlaybackStatusUpdate={onPlaybackStatusUpdate}
          onReadyForDisplay={onReadyForDisplay}
          onFullscreenUpdate={onFullscreenUpdate}
          rate={props.rate}
          shouldPlay={isPlaybackInSync && props.shouldPlay}
        />
        {!props.useNativeControls && (
          <Overlay
            playbackStatus={playbackStatus}
            isFullscreen={isFullscreen}
            videoDimensions={videoDimensions}
            color={props.color}
            overlayColor={props.overlayColor}
            overlayOpacity={props.overlayOpacity}
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
        )}
      </ParentContainer>
    );
  };
};
