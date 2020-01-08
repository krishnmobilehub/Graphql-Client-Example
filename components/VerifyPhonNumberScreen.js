import React, { Component } from 'react';
import { StyleSheet, ScrollView, AsyncStorage, View, TextInput, Text } from 'react-native';
import { Button } from 'react-native-elements';
import gql from "graphql-tag";
import { withApollo, Mutation } from 'react-apollo';

const CREATE_USER = gql`
    mutation CreateUser($username: String!, $password: String!, $phoneNumber: String!, $verificationCode: String!) {
      createUser(username: $username, password: $password,phoneNumber: $phoneNumber,verificationCode: $verificationCode)
    }
`;

class VerifyPhoneNumberScreen extends Component {
  static navigationOptions = {
    header: null
  };

  state = {
    verifyCode: '',
    verifyCodeError: ''
  }

  updateTextInput = (text, field) => {
    this.setState({
       [field] : text,
       verifyCodeError: ''
      });
  }

  render() {
    const { verifyCode, verifyCodeError } =  this.state;
    const { navigation } = this.props;
    return (
          <Mutation mutation={CREATE_USER}>
            {(createUser, { data }) => (
              <ScrollView style={styles.container}>
                <View style={styles.subContainer}>
                  <TextInput
                      style={styles.textInput}
                      placeholder={'Verify Code'}
                      value={verifyCode}
                      onChangeText={(text) => this.updateTextInput(text, 'verifyCode')}
                  />
                </View>
                { {verifyCodeError} && <Text style={styles.errorText}>{verifyCodeError}</Text>}
                <View style={styles.container}>
                  <Button
                    large
                    leftIcon={{name: 'Next'}}
                    title='Save'
                    onPress={() => {
                      AsyncStorage.getItem('USER_DATA', (err, result) => {
                        const userData = JSON.parse(result)
                        if(verifyCode !== ""  && verifyCode === userData.code) {
                          createUser({
                            variables: { 
                              username: userData.username,
                              password: userData.password,
                              phoneNumber: userData.phoneNumber,
                              verificationCode: userData.code
                              }
                          })
                          .then(res => {
                            if (res.data.createUser === "Success") {
                              AsyncStorage.removeItem("USER_DATA",() => {
                                AsyncStorage.setItem("USER_SESSION", JSON.stringify(userData) ,()=>{
                                  navigation.navigate('UserScreen');
                                })
                              })
                            } else {
                              this.setState({verifyCodeError : "Something went wrong. Please try again!"})
                            }
                          })
                          .catch(err => {
                            this.setState({verifyCodeError : err.message})
                          });
                      } else {
                        this.setState({verifyCodeError : "Please enter valid code"})
                      }
                      });
                    }} />
                </View>
              </ScrollView>
            )}
          </Mutation>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginTop:80,
  },
  subContainer: {
    flex: 1,
    marginBottom: 20,
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

export default withApollo(VerifyPhoneNumberScreen);