const React = require('react');
const { View } = require('react-native');

module.exports = (props) => React.createElement(View, { testID: 'date-time-picker', ...props });
