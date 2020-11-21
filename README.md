## react-native-another-video-player

A customizable video player wrapper for the the Video component of the expo-av package.

## Installation

Using npm:

```shell
npm install --save react-native-another-video-player`
```

Using yarn:

```shell
yarn add react-native-another-video-player
```

## Usage

```javascript
// Load the Video module
import Video from 'react-native-video';

// Load the wrapper module
import wrapper from 'react-native-another-video-player';

// Wrap the expo-av Video module
const AnotherVideoPlayer = wrapper(Video)

<AnotherVideoPlayer
    style={{height: 200, width: '100%', backgroundColor: 'black'}}
    source={{
    uri: 'http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4',
    }}
    shouldPlay={true}
    isLooping={true}
    isMuted={false}
    resizeMode={'contain'}
    onPressSettings={() => {}}
    forceHorizontalFullscreen={true}
    avoidSafeAreas={true}
/>
```

## Props

Set of props relative to the video player wrapper. The Video component props from the expo-av package are implemented, but not included in this list.

### Configurable props
* [color](#color)
* [overlayColor](#overlayColor)
* [overlayOpacity](#overlayOpacity)
* [seekMillis](#seekMillis)
* [useSeekControls](#useSeekControls)
* [forceHorizontalFullscreen](#forceHorizontalFullscreen)
* [avoidSafeAreas](#avoidSafeAreas)

### Event props
* [onPressSettings](#onPressSettings)

### Configurable props

#### color
A string value to determine the color of icons and text.

#### overlayColor
A string value to determine the color of the overlay.

#### overlayOpacity
A number value (float) to determine the opacity of the overlay.

#### seekMillis
A number value to determine amount of milliseconds to skip when seeking back or forward.

#### useSeekControls
A boolean value to determine if the seek controls should be available.

#### forceHorizontalFullscreen
A boolean value to determine if fullscreen mode should automatically rotate the device orientation to landscape.

#### avoidSafeAreas
A boolean value to determine if iOS safe areas should be avoided by the different overlay elements.

### Event props

#### onPressSettings
Callback function that is called when the settings cog wheel is pressed.
