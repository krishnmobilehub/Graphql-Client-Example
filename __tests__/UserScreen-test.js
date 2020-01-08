import React from 'react';
import UserScreen from '../components/UserScreen';

import renderer from 'react-test-renderer';

test('renders correctly', () => {
  const tree = renderer.create(<UserScreen />).toJSON();
  expect(tree).toMatchSnapshot();
});