const React = require('react');
const { Text } = require('react-native');

const MockIcon = (props) => React.createElement(Text, props, props.name || 'icon');

module.exports = {
  Ionicons: MockIcon,
  MaterialIcons: MockIcon,
  FontAwesome: MockIcon,
  AntDesign: MockIcon,
  Entypo: MockIcon,
  EvilIcons: MockIcon,
  Feather: MockIcon,
  FontAwesome5: MockIcon,
  Foundation: MockIcon,
  MaterialCommunityIcons: MockIcon,
  Octicons: MockIcon,
  SimpleLineIcons: MockIcon,
  Zocial: MockIcon,
};
