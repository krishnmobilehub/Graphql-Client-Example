import React, { Component } from 'react';
import { StyleSheet, ScrollView, AsyncStorage,ActivityIndicator, View, TextInput, Text } from 'react-native';
import { Button } from 'react-native-elements';
import gql from "graphql-tag";
import { withApollo } from 'react-apollo';

const PHONE_NUMBER_VERIFICATION = gql`
    query InitiatePhoneNumberVerification($phoneNumber: String!, $code: String!) {
      initiatePhoneNumberVerification(phoneNumber: $phoneNumber, code: $code)
    }
`;

class PhoneNumberScreen extends Component {

  state = {
    phoneNumber: "",
    code:"",
    phoneNumberError:""
  }

  updateTextInput = (text, field) => {
    this.setState({ 
      [field] : text,
      phoneNumberError: "",
      loading: false
    });
  }

  runQuery = () => {
    const { navigation, client} = this.props;
    const { phoneNumber } =  this.state;
    if(phoneNumber !== "") {
      var code = (Math.floor(Math.random() * 10000) + 1).toString() ;
      this.setState({loading : true})
      client.query({
        query: PHONE_NUMBER_VERIFICATION,
        variables: { phoneNumber: phoneNumber.toString(), code: code}
      })
      .then(res => {
        this.setState({loading : false})
        if (res.data.initiatePhoneNumberVerification) {
          AsyncStorage.getItem("USER_DATA", (err, result) =>{
            AsyncStorage.mergeItem('USER_DATA', JSON.stringify({phoneNumber:phoneNumber,code:code}), () => {
              navigation.navigate('VerifyPhonNumberScreen');
            });
          });
        } else {
          this.setState({userNameError : "Something went wrong! Please try again."})
        }
      })
      .catch(err => {
        this.setState({loading : false})
        this.setState({userNameError : err.message})
      });
    } else {
      this.setState({phoneNumberError : "Field can't be blank"})
    }
  }
  
  render() {
    const { phoneNumber, phoneNumberError,loading } =  this.state;
    return (
            <ScrollView style={styles.container}>
              <View style={styles.subContainer}>
                <TextInput
                    style={styles.textInput}
                    placeholder={'phone number'}
                    value={phoneNumber}
                    keyboardType = 'phone-pad'
                    onChangeText={(text) => this.updateTextInput(text, 'phoneNumber')}
                />
              </View>
              { {phoneNumberError} && <Text style={styles.errorText}>{phoneNumberError}</Text>}
              <View style={styles.container}>
                <Button
                  large
                  leftIcon={{name: 'Next'}}
                  title='Next'
                  onPress={() => this.runQuery()} />
              </View>
              {loading && <View style={styles.activity}>
                  <ActivityIndicator size="large" color="#0000ff" />
                </View>}
            </ScrollView>
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
  activity: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center'
  },
})

export default withApollo(PhoneNumberScreen);