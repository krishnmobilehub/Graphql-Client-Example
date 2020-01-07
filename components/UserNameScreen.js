import React, { Component } from 'react';
import { StyleSheet, ScrollView, ActivityIndicator, View, TextInput, Text } from 'react-native';
import { Button } from 'react-native-elements';
import gql from "graphql-tag";
import { withApollo } from 'react-apollo';

const CHECK_USER_NAME = gql`
    query UsernameAvailable($username: String!) {
        isUsernameAvailable(username: $username)
    }
`;

class UserNameScreen extends Component {
  static navigationOptions = {
    title: 'User Name',
  };

  state = {
    userName: '',
    userNameError: ''
  }

  updateTextInput = (text, field) => {
    this.setState({ 
      [field] : text,
      userNameError: ''
    });
  }

  runQuery = () => {
    const { navigation, client } = this.props;
    const { userName } =  this.state;
    if(userName !== "") {
      client.query({
        query: CHECK_USER_NAME,
        variables: { username: this.state.userName }
      })
      .then(res => {
        if (!res.data.isUsernameAvailable) {
          navigation.navigate('PasswordScreen');
        } else {
          this.setState({
            userNameError : "User already exist!"
          })
        }
      })
      .catch(err => console.log("------err------",err));
    } else {
      this.setState({
        userNameError : "Field can't be blank"
      })
    }
  }
  
  render() {
    const { userNameError, userName } =  this.state;
    return (
            <ScrollView style={styles.container}>
              <View style={styles.subContainer}>
                <TextInput
                    style={styles.textInput}
                    placeholder={'User Name'}
                    value={userName}
                    onChangeText={(text,event) => this.updateTextInput(text, 'userName')}
                />
              </View>
              { {userNameError} && <Text>{userNameError}</Text>}
              <View>
                <Button
                  large
                  leftIcon={{name: 'Next'}}
                  title='Next'
                  onPress={() => this.runQuery()} />
              </View>
            </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20
  },
  subContainer: {
    flex: 1,
    marginBottom: 20,
    padding: 5,
    borderBottomWidth: 2,
    borderBottomColor: '#CCCCCC',
  },
  activity: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center'
  },
  textInput: {
    fontSize: 18,
    margin: 5,
  },
})

export default withApollo(UserNameScreen);