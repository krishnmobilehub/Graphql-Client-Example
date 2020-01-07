import React, { Component } from 'react';
import { StyleSheet, ActivityIndicator, View, Text } from 'react-native';
import { Button } from 'react-native-elements';
import gql from 'graphql-tag';
import { withApollo } from 'react-apollo';

class UserScreen extends Component {

    state = {
        userId: "7",
        user: {
            username: '',
            phoneNumber: ''
        }
    }

    componentDidMount() {
        const { client } = this.props;
        const { userId } =  this.state;
        client.query({
            query: gql`
            query {
                user(id: ${userId}) {
                    username,
                    phoneNumber
                }
            }`
          })
          .then(res => {
            this.setState({
                user:{
                    username : res.data.user.username,
                    phoneNumber: res.data.user.phoneNumber
                }
            })
          })
          .catch(err => console.log("------err------",err));
    }

    static navigationOptions = ({ navigation }) => {
        return {
            title: 'User',
            headerRight: (
            <Button
                buttonStyle={{ padding: 0, backgroundColor: 'transparent' }}
                icon={{ name: 'add-circle', style: { marginRight: 0, fontSize: 28 } }}
                onPress={() => { navigation.push('UserNameScreen') }}
            />
            ),
        };
    };

    render() {
        const {user} = this.state;
        return (
                <View style={styles.activity}>
                    <Text>{user.username}</Text>
                    <Text>{user.phoneNumber}</Text>
                </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingBottom: 22
    },
    item: {
        padding: 10,
        fontSize: 18,
        height: 44,
    },
    activity: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
    }
})

export default withApollo(UserScreen);