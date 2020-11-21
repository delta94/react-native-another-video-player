import {Platform} from 'react-native';
import DeviceInfo from 'react-native-device-info';

function getBottomSafeMargin() {
  if (Platform.OS === 'ios') {
    return DeviceInfo.hasNotch() ? 28 : 0;
  } else {
    return 0;
  }
}

function getHorizontalSafeMargin() {
  if (Platform.OS === 'ios') {
    return DeviceInfo.hasNotch() && DeviceInfo.isLandscapeSync() ? 28 : 0;
  } else {
    return 0;
  }
}

export default {getBottomSafeMargin, getHorizontalSafeMargin};
