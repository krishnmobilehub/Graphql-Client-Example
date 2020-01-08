import React, { Component } from 'react';
import { StyleSheet, ScrollView, AsyncStorage, View, TextInput, Text } from 'react-native';
import { Button } from 'react-native-elements';
import { withApollo } from 'react-apollo';

class PasswordScreen extends Component {
 
  state = {
    password: '',
    passwordError: '',
    confirmPassword: '',
    confirmPasswordError: ''
  }

  updateTextInput = (text, field) => {
    this.setState({ 
      [field] : text,
      passwordError: '',
      confirmPasswordError: ''
    });
  }

  runQuery = () => {
    const { navigation } = this.props;
    const { password, confirmPassword} =  this.state;
    const isPasswordValid =  this.isValidPassword(password);
    const isConfirmPasswordValid =  this.isValidConfirmPassword(password, confirmPassword);
    if (isPasswordValid && isConfirmPasswordValid) {
      AsyncStorage.getItem("USER_DATA", (err, result) =>{
        AsyncStorage.mergeItem('USER_DATA', JSON.stringify({password:password}), () => {
          navigation.navigate('PhonNumberScreen');
        });
      });
    }
  }

  isValidPassword = (text) => {
   let error = '';
    if(text.length < 8) {
        error = "Your password must be at least 8 characters";
    } else if (text.search(/[a-z]/i) < 0) {
      error = "Your password must contain at least one lowercase letter.";
    } else if (text.search(/[A-Z]/i) < 0) {
      error = "Your password must contain at least one uppercase letter.";
    } else if (text.search(/[0-9]/) < 0) {
      error = "Your password must contain at least one digit.";
    }
    if (error.length > 0) {
      this.setState({ passwordError : error});
      return false;
    }
    return true
  }

  isValidConfirmPassword = (password, confirmPassword) => {
    let error = '';
    if(confirmPassword === "" || password !== confirmPassword) {
        error = "Password doesn't match";
    } 
    
    if (error.length > 0) {
      this.setState({ confirmPasswordError : error});
      return false;
    }
    return true
  }
  
  render() {
    const { password, confirmPassword,passwordError,confirmPasswordError } =  this.state;
    return (
            <ScrollView style={styles.container}>
              <View style={styles.subContainer}>
                <TextInput
                    style={styles.textInput}
                    placeholder={'Password'}
                    value={password}
                    secureTextEntry={true}
                    onChangeText={(text) => this.updateTextInput(text, 'password')}
                />
              </View>
              { {passwordError} && <Text style={styles.errorText}>{passwordError}</Text>}
              <View style={styles.subContainer}>
                <TextInput
                    style={styles.textInput}
                    placeholder={'Confirm Password'}
                    value={confirmPassword}
                    secureTextEntry={true}
                    onChangeText={(text) => this.updateTextInput(text, 'confirmPassword')}
                />
              </View>
              { {confirmPasswordError} && <Text style={styles.errorText}>{confirmPasswordError}</Text>}
              <View style={styles.container}>
                <Button
                  large
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

export default withApollo(PasswordScreen);