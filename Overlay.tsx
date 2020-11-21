import React, {FC, useEffect, useRef, useMemo} from 'react';
import {
  Keyboard,
  Animated,
  Easing,
  View,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import res from './res';
import constants from './constants';
import {OverlayProps} from './types';
import {SvgXml} from 'react-native-svg';
import ProgressBar from './ProgressBar';
import LivestreamBar from './LivestreamBar';
import utils from './utils';
import {MaterialIndicator} from 'react-native-indicators';

const Overlay: FC<OverlayProps> = (props) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const fadeOutTimeout = useRef<NodeJS.Timeout | number>();

  useEffect(() => {
    if (props.playbackStatus?.isPlaying) {
      fadeIn(false);
    } else {
      fadeIn(true);
    }
  }, [props.playbackStatus?.isPlaying]);

  useEffect(() => {
    if (props.playbackStatus?.isBuffering) {
      fadeIn(true);
    } else {
      fadeIn(false);
    }
  }, [props.playbackStatus?.isBuffering]);

  useEffect(() => {
    if (props.playbackStatus?.isBuffering) {
      fadeIn(true);
    } else {
      fadeIn(false);
    }
  }, [props.playbackStatus?.isBuffering]);

  useEffect(() => {
    fadeImmedeatly();
  }, [props.isFullscreen]);

  function fadeImmedeatly(keepOverlayActive: boolean = false) {
    clearTimeout(fadeOutTimeout.current);

    fadeAnim.stopAnimation((value) => {
      fadeAnim.setValue(1);

      if (!keepOverlayActive) {
        clearTimeout(fadeOutTimeout.current);
        fadeOutTimeout.current = setTimeout(
          fadeOut,
          constants.OVERLAY_ACTIVE_DURATION,
        );
      }
    });
  }

  function fadeIn(keepOverlayActive: boolean = false) {
    clearTimeout(fadeOutTimeout.current);

    fadeAnim.stopAnimation((value) => {
      fadeAnim.setValue(value);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: (1 - value) * constants.OVERLAY_FADE_DURATION,
        easing: Easing.linear,
        useNativeDriver: false,
      }).start(() => {
        if (!keepOverlayActive) {
          clearTimeout(fadeOutTimeout.current);
          fadeOutTimeout.current = setTimeout(
            fadeOut,
            constants.OVERLAY_ACTIVE_DURATION,
          );
        }
      });
    });
  }

  function fadeOut() {
    fadeAnim.stopAnimation((value) => {
      fadeAnim.setValue(value);
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: value * constants.OVERLAY_FADE_DURATION,
        easing: Easing.linear,
        useNativeDriver: false,
      }).start();
    });
  }

  function isOverlayActive() {
    const opacity = fadeAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    });
    return opacity.__getValue() === 1;
  }

  function onPressBackward() {
    if (!isOverlayActive()) {
      fadeIn();
      return;
    }

    fadeIn();

    props.onPressBackward?.();
  }

  function onPressForward() {
    if (!isOverlayActive()) {
      fadeIn();
      return;
    }

    fadeIn();

    props.onPressForward?.();
  }

  function onPressPlay() {
    if (!isOverlayActive()) {
      fadeIn();
      return;
    }

    fadeIn();

    props.onPressPlay?.();
  }

  function onPressPause() {
    if (!isOverlayActive()) {
      fadeIn();
      return;
    }

    fadeIn();

    props.onPressPause?.();
  }

  function onPressVolume() {
    if (!isOverlayActive()) {
      fadeIn();
      return;
    }

    fadeIn();

    props.onPressVolume?.();
  }

  function onPressFullscreen() {
    if (!isOverlayActive()) {
      fadeIn();
      return;
    }

    // We call fadeImmedeatly in the respective useEffect.
    // fadeIn();

    props.onPressFullscreen?.();
  }

  function onPressSettings() {
    if (!isOverlayActive()) {
      fadeIn();
      return;
    }

    props.onPressSettings?.();
  }

  function onPressOverlay() {
    Keyboard.dismiss();

    if (isOverlayActive()) {
      fadeOut();
    } else {
      fadeIn();
    }
  }

  const styles = useMemo(() => {
    const {baseWidth, baseHeight, width, height} = props.videoDimensions;

    return StyleSheet.create({
      container: {
        position: 'absolute',
        width: '100%',
        height: '100%',
      },
      background: {
        width: '100%',
        height: '100%',
        backgroundColor: props.overlayColor,
        opacity: props.overlayOpacity,
      },
      backward: {
        position: 'absolute',
        top:
          (props.isFullscreen ? height : baseHeight) / 2 -
          (baseWidth * constants.MEDIUM_ICON_SCALE * 2) / 2,
        left:
          width / 2 -
          (baseWidth * constants.BIG_ICON_SCALE * 2) / 2 -
          baseWidth * constants.MEDIUM_ICON_SCALE * 2,
        height: baseWidth * constants.MEDIUM_ICON_SCALE * 2,
        width: baseWidth * constants.MEDIUM_ICON_SCALE * 2,
        justifyContent: 'center',
        alignItems: 'center',
      },
      forward: {
        position: 'absolute',
        top:
          (props.isFullscreen ? height : baseHeight) / 2 -
          (baseWidth * constants.MEDIUM_ICON_SCALE * 2) / 2,
        right:
          width / 2 -
          (baseWidth * constants.BIG_ICON_SCALE * 2) / 2 -
          baseWidth * constants.MEDIUM_ICON_SCALE * 2,
        height: baseWidth * constants.MEDIUM_ICON_SCALE * 2,
        width: baseWidth * constants.MEDIUM_ICON_SCALE * 2,
        justifyContent: 'center',
        alignItems: 'center',
      },
      center: {
        position: 'absolute',
        top:
          (props.isFullscreen ? height : baseHeight) / 2 -
          (baseWidth * constants.BIG_ICON_SCALE * 2) / 2,
        left: width / 2 - (baseWidth * constants.BIG_ICON_SCALE * 2) / 2,
        height: baseWidth * constants.BIG_ICON_SCALE * 2,
        width: baseWidth * constants.BIG_ICON_SCALE * 2,
        justifyContent: 'center',
        alignItems: 'center',
      },
      volume: {
        position: 'absolute',
        bottom:
          props.isFullscreen && props.avoidSafeAreas
            ? utils.screen.getBottomSafeMargin()
            : 0,
        left:
          props.isFullscreen && props.avoidSafeAreas
            ? utils.screen.getHorizontalSafeMargin()
            : 0,
        height: baseWidth * constants.SMALL_ICON_SCALE * 2,
        width: baseWidth * constants.SMALL_ICON_SCALE * 2,
        justifyContent: 'center',
        alignItems: 'center',
      },
      settings: {
        position: 'absolute',
        bottom:
          props.isFullscreen && props.avoidSafeAreas
            ? utils.screen.getBottomSafeMargin()
            : 0,
        right:
          props.isFullscreen && props.avoidSafeAreas
            ? utils.screen.getHorizontalSafeMargin() +
              baseWidth * constants.SMALL_ICON_SCALE * 2
            : baseWidth * constants.SMALL_ICON_SCALE * 2,
        height: baseWidth * constants.SMALL_ICON_SCALE * 2,
        width: baseWidth * constants.SMALL_ICON_SCALE * 2,
        justifyContent: 'center',
        alignItems: 'center',
      },
      fullscreen: {
        position: 'absolute',
        bottom:
          props.isFullscreen && props.avoidSafeAreas
            ? utils.screen.getBottomSafeMargin()
            : 0,
        right:
          props.isFullscreen && props.avoidSafeAreas
            ? utils.screen.getHorizontalSafeMargin()
            : 0,
        height: baseWidth * constants.SMALL_ICON_SCALE * 2,
        width: baseWidth * constants.SMALL_ICON_SCALE * 2,
        justifyContent: 'center',
        alignItems: 'center',
      },
    });
  }, [
    props.isFullscreen,
    props.videoDimensions,
    props.overlayColor,
    props.overlayOpacity,
    props.avoidSafeAreas,
  ]);

  const {baseWidth} = props.videoDimensions;

  return (
    <Animated.View style={[styles.container, {opacity: fadeAnim}]}>
      <TouchableOpacity style={styles.background} onPress={onPressOverlay} />

      {!!props.playbackStatus?.durationMillis && (
        <TouchableOpacity style={styles.backward} onPress={onPressBackward}>
          <SvgXml
            width={baseWidth * constants.MEDIUM_ICON_SCALE}
            height={baseWidth * constants.MEDIUM_ICON_SCALE}
            xml={res.images.BACKWARD_SVG}
            fill={props.color}
          />
        </TouchableOpacity>
      )}

      {!!props.playbackStatus?.durationMillis && (
        <TouchableOpacity style={styles.forward} onPress={onPressForward}>
          <SvgXml
            width={baseWidth * constants.MEDIUM_ICON_SCALE}
            height={baseWidth * constants.MEDIUM_ICON_SCALE}
            xml={res.images.FORWARD_SVG}
            fill={props.color}
          />
        </TouchableOpacity>
      )}

      {props.playbackStatus?.isLoaded &&
        !props.playbackStatus?.isBuffering &&
        !props.playbackStatus?.isPlaying && (
          <TouchableOpacity style={styles.center} onPress={onPressPlay}>
            <SvgXml
              width={baseWidth * constants.BIG_ICON_SCALE}
              height={baseWidth * constants.BIG_ICON_SCALE}
              xml={res.images.PLAY_SVG}
              fill={props.color}
            />
          </TouchableOpacity>
        )}

      {props.playbackStatus?.isLoaded &&
        !props.playbackStatus?.isBuffering &&
        props.playbackStatus?.isPlaying && (
          <TouchableOpacity style={styles.center} onPress={onPressPause}>
            <SvgXml
              width={baseWidth * constants.BIG_ICON_SCALE}
              height={baseWidth * constants.BIG_ICON_SCALE}
              xml={res.images.PAUSE_SVG}
              fill={props.color}
            />
          </TouchableOpacity>
        )}

      {(!props.playbackStatus?.isLoaded ||
        props.playbackStatus?.isBuffering) && (
        <View style={styles.center}>
          <MaterialIndicator
            color={props.color}
            size={baseWidth * constants.BIG_ICON_SCALE}
            trackWidth={5}
          />
        </View>
      )}

      <TouchableOpacity style={styles.volume} onPress={onPressVolume}>
        <SvgXml
          width={baseWidth * constants.SMALL_ICON_SCALE}
          height={baseWidth * constants.SMALL_ICON_SCALE}
          xml={
            props.playbackStatus?.isMuted
              ? res.images.VOLUME_MUTE_SVG
              : res.images.VOLUME_UP_SVG
          }
          fill={props.color}
        />
      </TouchableOpacity>

      {!!props.onPressSettings && (
        <TouchableOpacity style={styles.settings} onPress={onPressSettings}>
          <SvgXml
            width={baseWidth * constants.SMALL_ICON_SCALE}
            height={baseWidth * constants.SMALL_ICON_SCALE}
            xml={res.images.COG_SVG}
            fill={props.color}
          />
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.fullscreen} onPress={onPressFullscreen}>
        <SvgXml
          width={baseWidth * constants.SMALL_ICON_SCALE}
          height={baseWidth * constants.SMALL_ICON_SCALE}
          xml={
            props.isFullscreen ? res.images.COMPRESS_SVG : res.images.EXPAND_SVG
          }
          fill={props.color}
        />
      </TouchableOpacity>

      {props.playbackStatus?.isLoaded &&
      props.playbackStatus?.durationMillis ? (
        <ProgressBar
          isFullscreen={props.isFullscreen}
          avoidSafeAreas={props.avoidSafeAreas}
          playbackStatus={props.playbackStatus}
          videoDimensions={props.videoDimensions}
          color={props.color}
          fadeIn={fadeIn}
          onSeek={props.onSeek}
          hasSettings={!!props.onPressSettings}
        />
      ) : props.playbackStatus?.isLoaded ? (
        <LivestreamBar
          isFullscreen={props.isFullscreen}
          avoidSafeAreas={props.avoidSafeAreas}
          videoDimensions={props.videoDimensions}
          color={props.color}
        />
      ) : (
        <></>
      )}
    </Animated.View>
  );
};

export default Overlay;
