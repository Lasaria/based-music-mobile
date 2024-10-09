import {StyleSheet} from "react-native"
import { SCREEN_HEIGHT, SCREEN_WIDTH } from './constants/constants'

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabBar: {
    height: SCREEN_HEIGHT * 0.1,
    paddingBottom: SCREEN_HEIGHT * 0.04,
    paddingTop: SCREEN_HEIGHT * 0.01,
  },
  text: {
    fontSize: 20,
    color: '#000',
  }
})