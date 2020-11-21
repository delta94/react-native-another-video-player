import React, {FC, useEffect, useMemo, useRef, useState} from 'react';
import {StyleSheet, View, Text, Pressable} from 'react-native';
import PanContainer from './PanContainer';
import {ProgressBarProps, SeekState} from './types';
import constants from './constants';
import utils from './utils';

const ProgressBar: FC<ProgressBarProps> = (props) => {
  const [seekState, setSeekState] = useState<SeekState>({
    prevPositionMillis: 0,
    nextPositionMillis: 0,
    isSeeking: false,
    isGranted: false,
  });

  const propsRef = useRef(props);
  useEffect(() => {
    propsRef.current = props;
  }, [props]);

  function onPanGrant() {
    // Handlers need to be passed references,
    // as they'll always have the scope from when PanResponder gets created and the handlers assigned.
    const {playbackStatus} = propsRef.current;
    let prevPositionMillis: number = playbackStatus?.positionMillis || 0;

    setSeekState({
      prevPositionMillis,
      nextPositionMillis: prevPositionMillis,
      isSeeking: true,
      isGranted: true,
    });

    props.fadeIn();
  }

  function onPanMove(x: number) {
    // Handlers need to be passed references,
    // as they'll always have the scope from when PanResponder gets created and the handlers assigned.
    var durationMillis: number;
    var nextPositionMillis: number;
    var fullTrackWidth: number;

    const {playbackStatus, videoDimensions, hasSettings} = propsRef.current;
    const {width, baseWidth} = videoDimensions;

    durationMillis = playbackStatus?.durationMillis || 1;

    if (hasSettings) {
      fullTrackWidth = width - baseWidth * constants.SMALL_ICON_SCALE * 2 * 3.5;
    } else {
      fullTrackWidth = width - baseWidth * constants.SMALL_ICON_SCALE * 2 * 2.5;
    }

    setSeekState((s) => {
      let oldProgressRatio = s.prevPositionMillis / durationMillis;
      let oldTrackWidth = oldProgressRatio * fullTrackWidth;
      let newTrackWidth = oldTrackWidth + x;
      let newProgressRatio = newTrackWidth / fullTrackWidth;

      nextPositionMillis = newProgressRatio * durationMillis;
      nextPositionMillis = Math.max(0, nextPositionMillis);
      nextPositionMillis = Math.min(nextPositionMillis, durationMillis);

      return {...s, nextPositionMillis};
    });

    props.fadeIn();
  }

  function onPanRelease(x: number) {
    // Handlers need to be passed references,
    // as they'll always have the scope from when PanResponder gets created and the handlers assigned.
    var durationMillis: number;
    var nextPositionMillis: number;
    var fullTrackWidth: number;

    const {playbackStatus, videoDimensions, hasSettings} = propsRef.current;
    const {width, baseWidth} = videoDimensions;

    durationMillis = playbackStatus?.durationMillis || 1;

    if (hasSettings) {
      fullTrackWidth = width - baseWidth * constants.SMALL_ICON_SCALE * 2 * 3.5;
    } else {
      fullTrackWidth = width - baseWidth * constants.SMALL_ICON_SCALE * 2 * 2.5;
    }

    // Needs to called beforehand, since props.onSeek will cause the playbackStatusUpdate
    // event to get received before isGranded === true.
    setSeekState((s) => {
      return {...s};
    });

    setSeekState((s) => {
      let oldProgressRatio = s.prevPositionMillis / durationMillis;
      let oldTrackWidth = oldProgressRatio * fullTrackWidth;
      let newTrackWidth = oldTrackWidth + x;
      let newProgressRatio = newTrackWidth / fullTrackWidth;

      nextPositionMillis = newProgressRatio * durationMillis;
      nextPositionMillis = Math.max(0, nextPositionMillis);
      nextPositionMillis = Math.min(nextPositionMillis, durationMillis);

      props.onSeek(nextPositionMillis).then((_) =>
        setSeekState({
          prevPositionMillis: 0,
          nextPositionMillis: 0,
          isSeeking: false,
          isGranted: false,
        }),
      );

      return {...s, nextPositionMillis, isGranted: false};
    });

    props.fadeIn();
  }

  const styles = useMemo(() => {
    const {width, baseWidth} = props.videoDimensions;
    var positionMillis: number;
    var durationMillis: number;
    var progressRatio: number;
    var fullTrackWidth: number;
    var fullTrackHeight: number;

    if (seekState.isSeeking) {
      positionMillis = seekState.nextPositionMillis;
    } else {
      positionMillis = props.playbackStatus?.positionMillis || 0;
    }
    durationMillis = props.playbackStatus?.durationMillis || 1;

    progressRatio = positionMillis / durationMillis;

    if (props.hasSettings) {
      fullTrackWidth = width - baseWidth * constants.SMALL_ICON_SCALE * 2 * 3.5;
    } else {
      fullTrackWidth = width - baseWidth * constants.SMALL_ICON_SCALE * 2 * 2.5;
    }

    if (props.isFullscreen && props.avoidSafeAreas) {
      fullTrackWidth -= 2 * utils.screen.getHorizontalSafeMargin();
    }

    fullTrackHeight = (baseWidth * constants.SMALL_ICON_SCALE) / 4;

    const containerWidth: number = fullTrackWidth;
    const containerHeight: number = baseWidth * constants.SMALL_ICON_SCALE * 2;

    return StyleSheet.create({
      container: {
        position: 'absolute',
        bottom:
          props.isFullscreen && props.avoidSafeAreas
            ? utils.screen.getBottomSafeMargin()
            : 0,
        left:
          props.isFullscreen && props.avoidSafeAreas
            ? utils.screen.getHorizontalSafeMargin() +
              baseWidth * constants.SMALL_ICON_SCALE * 2.5
            : baseWidth * constants.SMALL_ICON_SCALE * 2.5,
        height: containerHeight,
        width: containerWidth,
        justifyContent: 'center',
        alignItems: 'center',
      },
      backgroundTrack: {
        width: fullTrackWidth,
        height: fullTrackHeight,
        borderRadius: 100,
        borderWidth: 2,
        borderColor: props.color,
      },
      progressTrack: {
        position: 'absolute',
        left: 0,
        bottom: containerHeight / 2 - fullTrackHeight / 2,
        width: progressRatio * fullTrackWidth,
        height: (baseWidth * constants.SMALL_ICON_SCALE) / 4,
        borderRadius: 100,
        backgroundColor: props.color,
      },
      dotContainer: {
        position: 'absolute',
        left:
          progressRatio * fullTrackWidth -
          baseWidth * constants.SMALL_ICON_SCALE,
        bottom: 0,
        width: baseWidth * constants.SMALL_ICON_SCALE * 2,
        height: baseWidth * constants.SMALL_ICON_SCALE * 2,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
      },
      dot: {
        width: (baseWidth * constants.SMALL_ICON_SCALE) / 1.5,
        height: (baseWidth * constants.SMALL_ICON_SCALE) / 1.5,
        borderRadius: 100,
        backgroundColor: props.color,
      },
      timeContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
      },
      positionTime: {
        fontSize: 12,
        fontWeight: 'bold',
        color: props.color,
      },
      durationTime: {
        fontSize: 12,
        fontWeight: 'bold',
        color: props.color,
      },
    });
  }, [props, seekState]);

  return (
    <Pressable onPress={(event) => onPanRelease(event.nativeEvent.locationX)}>
      <View style={styles.container}>
        {/* Progress Track */}
        <View style={styles.progressTrack} />

        <View style={styles.timeContainer}>
          {/* Position */}
          <Text style={styles.positionTime}>
            {utils.other.formatProgressBarTime(
              props.playbackStatus?.positionMillis || 0,
            )}
          </Text>

          {/* Duration */}
          <Text style={styles.durationTime}>
            {utils.other.formatProgressBarTime(
              props.playbackStatus?.durationMillis || 0,
            )}
          </Text>
        </View>

        {/* Background Track */}
        <View style={styles.backgroundTrack} />

        {/* Dot */}
        <PanContainer
          style={styles.dotContainer}
          onPanGrant={onPanGrant}
          onPanMove={onPanMove}
          onPanRelease={onPanRelease}>
          <View style={styles.dot} />
        </PanContainer>
      </View>
    </Pressable>
  );
};

export default ProgressBar;
