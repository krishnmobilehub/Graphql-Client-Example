import React, { Component } from 'react';
import { StyleSheet, ScrollView, AsyncStorage, View, TextInput, Text } from 'react-native';
import { Button } from 'react-native-elements';
import gql from "graphql-tag";
import { withApollo } from 'react-apollo';

const CHECK_USER_NAME = gql`
    query UsernameAvailable($username: String!) {
        isUsernameAvailable(username: $username)
    }
`;

let userData = {
  username: '',
  password: '',
  phoneNumber: '',
  code: ''
}

class UserNameScreen extends Component {
 
  state = {
    user: {
      username: '',
      password: '',
      phoneNumber: '',
      code: ''
    },
    userName: '',
    userNameError: ''
  }

  updateTextInput = (text, field) => {
    this.setState({ 
      [field] : text,
      userNameError: ''
    });
  }

  onNextButtonClick = () => {
    const { navigation, client } = this.props;
    const { userName, user } =  this.state;
    if(userName !== "") {
      client.query({
        query: CHECK_USER_NAME,
        variables: { username: userName.toString() }
      })
      .then(res => {
        if (!res.data.isUsernameAvailable) {
          userData.username = userName
          AsyncStorage.setItem("USER_DATA", JSON.stringify(userData),()=>{
            navigation.navigate('PasswordScreen');
          });
        } else {
          this.setState({userNameError : "User already exist!"})
        }
      })
      .catch(err => {
        this.setState({userNameError : err.message})
      });
    } else {
      this.setState({userNameError : "Field can't be blank"})
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
              { {userNameError} && <Text style={styles.errorText}>{userNameError}</Text>}
              <View style={styles.container}>
                <Button
                  large
                  title='Next'
                  onPress={()=>this.onNextButtonClick()} />
              </View>
            </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    padding: 20,
    marginTop:80,
  },
  subContainer: {
    flex: 1,
    marginBottom: 10,
    padding: 5,
    borderBottomWidth: 2,
    borderBottomColor: '#CCCCCC',
  },
  errorText: {
    fontSize: 10,
    color:'#FF0000'
  },
  textInput: {
    fontSize: 18,
    margin: 5,
  },
})

export default withApollo(UserNameScreen);