import colors from './colors'

const styles = {
  CONTAINER: {
    flex: 1,
  },
  FULLSCREEN_CONTAINER: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    backgroundColor: colors.BLACK,
  },
  TEXT_STYLE: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.WHITE,
  },
  VIDEO: {
    width: '100%',
    height: '100%'
  }
}

export default styles;