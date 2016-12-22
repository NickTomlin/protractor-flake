import {styles, supportsColor} from 'chalk'

function color_message (message, color) {
  if (supportsColor && color in styles) {
    return styles[color]['open'] + message + styles[color]['close']
  } else {
    return message
  }
}

export default color_message
