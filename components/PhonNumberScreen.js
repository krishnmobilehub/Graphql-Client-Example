import React, { Component } from 'react';
import { StyleSheet, ScrollView, ActivityIndicator, View, TextInput, Text } from 'react-native';
import { Button } from 'react-native-elements';
import gql from "graphql-tag";
import { withApollo } from 'react-apollo';

const PHONE_NUMBER_VERIFICATION = gql`
    query InitiatePhoneNumberVerification($phoneNumber: String!, $code: String!) {
      initiatePhoneNumberVerification(phoneNumber: $phoneNumber, code: $code)
    }
`;

class PhoneNumberScreen extends Component {
  static navigationOptions = {
    title: 'Phone Number',
  };

  state = {
    phoneNumber: '',
    code:'',
    phoneNumberError:''
  }

  updateTextInput = (text, field) => {
    this.setState({ 
      [field] : text,
      phoneNumberError: ''
    });
  }

  runQuery = () => {
    const { navigation, client} = this.props;
    const { phoneNumber } =  this.state;
    console.log("-------phoneNumber-----",typeof phoneNumber)
    if(phoneNumber !== "") {
      var code = Math.floor(Math.random() * 100) + 1 ;
      console.log("-------code-----",code)
      client.query({
        query: PHONE_NUMBER_VERIFICATION,
        variables: { phoneNumber: "+919860500580", code: "2386"}
      })
      .then(res => {
        if (res.data.initiatePhoneNumberVerification) {
          navigation.navigate('VerifyPhonNumberScreen');
        } else {
          this.setState({
            userNameError : "Something went wrong! Please try again."
          })
        }
      })
      .catch(err => console.log("-------err-----",err));
    } else {
      this.setState({
        phoneNumberError : "Field can't be blank"
      })
    }
  }
  
  render() {
    const { phoneNumber, phoneNumberError } =  this.state;
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
              { {phoneNumberError} && <Text>{phoneNumberError}</Text>}
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

export default withApollo(PhoneNumberScreen);