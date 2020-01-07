import React, { Component } from 'react';
import { StyleSheet, ScrollView, ActivityIndicator, View, TextInput, Text } from 'react-native';
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
    title: 'User Name',
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
                { {verifyCodeError} && <Text>{verifyCodeError}</Text>}
                <View>
                  <Button
                    large
                    leftIcon={{name: 'Next'}}
                    title='Save'
                    onPress={() => {
                      if(verifyCode !== "") {
                        createUser({
                          variables: { username: "neel", password:"test123", phoneNumber:"98875434553", verificationCode:"5764"}
                        })
                        .then(res => {
                          console.log("------res------",res)
                          if (res.data.createUser === "Success") {
                            navigation.navigate('UserScreen');
                          } else {
                            this.setState({
                              verifyCodeError : "User already exist!"
                            })
                          }
                        })
                        .catch(err => <Text>{err}</Text>);
                      } else {
                        this.setState({
                          verifyCodeError : "Please enter valid code"
                        })
                      }
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

export default withApollo(VerifyPhoneNumberScreen);