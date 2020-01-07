import React, { Component } from 'react';
import { StyleSheet, ScrollView, ActivityIndicator, View, TextInput, Text } from 'react-native';
import { Button } from 'react-native-elements';
import { withApollo } from 'react-apollo';

class PasswordScreen extends Component {
  static navigationOptions = {
    title: 'Password',
  };

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
      navigation.navigate('PhonNumberScreen');
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
    if(confirmPassword === "" && password !== confirmPassword) {
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
              { {passwordError} && <Text>{passwordError}</Text>}
              <View style={styles.subContainer}>
                <TextInput
                    style={styles.textInput}
                    placeholder={'Confirm Password'}
                    value={confirmPassword}
                    secureTextEntry={true}
                    onChangeText={(text) => this.updateTextInput(text, 'confirmPassword')}
                />
              </View>
              { {confirmPasswordError} && <Text>{confirmPasswordError}</Text>}
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

export default withApollo(PasswordScreen);