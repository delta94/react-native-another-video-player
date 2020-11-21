import {AVPlaybackStatus} from '../types';

function formatProgressBarTime(millis: number) {
  let seconds: number = Math.round(millis / 1000);
  let minutes: number = Math.round(seconds / 60);
  let hours: number = Math.round(minutes / 60);

  // Mandatory 2 digits for seconds.
  var formattedSeconds: string;
  if (seconds < 10) {
    formattedSeconds = `0${seconds}`;
  } else {
    formattedSeconds = `${seconds}`;
  }

  if (hours) {
    return `${hours}:${minutes}:${formattedSeconds}:`;
  } else if (minutes) {
    return `${minutes}:${formattedSeconds}:`;
  } else {
    return `0:${formattedSeconds}`;
  }
}

function isLivestream(playbackStatus: AVPlaybackStatus) {
  return !!playbackStatus && !playbackStatus.durationMillis;
}

export default {
  formatProgressBarTime,
  isLivestream,
};
