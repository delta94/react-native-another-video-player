import React, {FC, useMemo} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {LivestreamBarProps} from '../types';
import constants from '../constants';
import screen from '../utils/screen';

const LivestreamBar: FC<LivestreamBarProps> = (props) => {
  const styles = useMemo(() => {
    const {videoDimensions, color} = props;
    const {baseWidth} = videoDimensions;

    const containerHeight: number = baseWidth * constants.SMALL_ICON_SCALE * 2;

    return StyleSheet.create({
      container: {
        position: 'absolute',
        bottom:
          props.isFullscreen && props.avoidSafeAreas
            ? screen.getBottomSafeMargin()
            : 0,
        left:
          props.isFullscreen && props.avoidSafeAreas
            ? screen.getHorizontalSafeMargin() +
              baseWidth * constants.SMALL_ICON_SCALE * 2.5
            : baseWidth * constants.SMALL_ICON_SCALE * 2.5,
        height: containerHeight,
        flexDirection: 'row',
        alignItems: 'center',
      },
      dot: {
        width: (baseWidth * constants.SMALL_ICON_SCALE) / 2,
        height: (baseWidth * constants.SMALL_ICON_SCALE) / 2,
        borderRadius: 100,
        marginRight: (baseWidth * constants.SMALL_ICON_SCALE) / 3,
        backgroundColor: 'transparent',
      },
      text: {
        fontSize: 14,
        fontWeight: 'bold',
        color: color,
      },
    });
  }, [props]);

  return (
    <View style={styles.container}>
      <View style={styles.dot} />
      <Text style={styles.text}>Live</Text>
    </View>
  );
};

export default LivestreamBar;
