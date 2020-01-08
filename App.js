import React from 'react';
import { AppRegistry } from 'react-native';
import { createStackNavigator, createAppContainer,createSwitchNavigator } from 'react-navigation';
import UserScreen from './components/UserScreen';
import PasswordScreen from './components/PasswordScreen';
import UserNameScreen from './components/UserNameScreen';
import PhonNumberScreen from './components/PhonNumberScreen';
import VerifyPhonNumberScreen from './components/VerifyPhonNumberScreen';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { ApolloProvider } from 'react-apollo';

const MainNavigator = createStackNavigator({
  UserNameScreen: { screen: UserNameScreen },
  PasswordScreen: { screen: PasswordScreen },
  PhonNumberScreen: { screen: PhonNumberScreen },
  VerifyPhonNumberScreen: { screen: VerifyPhonNumberScreen },
},{
    headerMode: 'none',
  },);

const AuthNavigation = createSwitchNavigator({
  UserScreen: { screen: UserScreen },
  MainNavigator: { screen: MainNavigator },
  },
  {
    initialRouteName: 'UserScreen',
  },
);

const cache = new InMemoryCache();
const client = new ApolloClient({
  cache,
  link: new HttpLink({
    uri: 'http://192.168.0.59:4000/graphql',
  }),
});

console.disableYellowBox = true;

const MyRootComponent = createAppContainer(AuthNavigation);

const App = () => (
  <ApolloProvider client={client}>
    <MyRootComponent />
  </ApolloProvider>
);

AppRegistry.registerComponent('MyApp', () => App);

export default App;