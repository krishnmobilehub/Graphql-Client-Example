import React, { Component } from 'react';
import { StyleSheet, AsyncStorage, View, Text, Button } from 'react-native';
import { withApollo } from 'react-apollo';

class UserScreen extends Component {

    static navigationOptions = ({ navigation }) => {
        return {
            title: 'User'
        };
    };

    state = {
        user: {
            username: '',
            phoneNumber: ''
        }
    }

    componentDidMount() {
        const {navigation} = this.props;
        AsyncStorage.getItem("USER_SESSION", (err, result) =>{
            if (result) {
                const userData = JSON.parse(result)
                this.setState({
                    user:{
                        username: userData.username,
                        phoneNumber: userData.phoneNumber
                    }
                })
            } else {
                navigation.navigate('UserNameScreen')
            }
        })
    }

    onNextButtonClick = () => {
        const {navigation} = this.props;
        AsyncStorage.removeItem("USER_SESSION",() => {
            navigation.navigate('UserNameScreen')
        })
    }

    render() {
        const {user} = this.state;
        return (
                <View style={styles.container}>
                    <Text style={styles.textField}>{user.username}</Text>
                    <Text style={styles.textField}>{user.phoneNumber}</Text>
                    <View style={styles.container}>
                        <Button
                        large
                        title='Logout'
                        onPress={()=>this.onNextButtonClick()} />
                    </View>
                </View>
        );
    }
}

const styles = StyleSheet.create({
    textField: {
        fontSize: 18,
        color:'#FF0000'
    },
    container: {
        flex: 1,
        width: '100%',
        padding: 20,
        marginTop:80,
        alignItems: 'center',
        justifyContent: 'center'
    }
})

export default withApollo(UserScreen);