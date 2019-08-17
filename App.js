import * as React from 'react';
import { Text, View, StyleSheet, TextInput, Button, FlatList, ToolbarAndroid, TouchableOpacity, Image, ScrollView} from 'react-native';
import Constants from 'expo-constants';
import {createStackNavigator, createAppContainer} from 'react-navigation';
import Modal from 'react-native-modal';

import axios from 'axios';

// You can import from local files
import AssetExample from './components/AssetExample';

// or any pure javascript modules available in npm
import { Card } from 'react-native-paper';


//I hope there is no question that could break down my nerve down to the core of the earth
//Please, help.
//This is final file, and yet still not perfect.

class Login extends React.Component {
  constructor(props) {
    super(props);
  }
  

  state = {
    username: ''
  }

  handleSubmit = () => {
    axios.get('https://jsonplaceholder.typicode.com/users?username='+this.state.username).then(res => {
      res.data[0] != null ? this.props.navigation.navigate('Home') : alert('Fail');
    });
  }

  render() {
    return(
      <View>
        <Text>Selamat belajar!</Text>
        <TextInput placeholder='Username' value={this.state.username}
            onChangeText={(event) => this.setState({username: event})}/>
        <Button title='Login' onPress={this.handleSubmit}/>
      </View>
    );
  }
}

class Home extends React.Component {
  constructor(props) {
    super(props);
  }
  state = {
    data: ''
  }
  componentWillMount() {
    axios.get('https://jsonplaceholder.typicode.com/posts').then(res => {
      this.setState({
        data: res.data
      })
    });

    axios.get('https://jsonplaceholder.typicode.com/photos').then(res => {
      this.setState({
        images: res.data
      })
    });
  }

  triggerModal = (data, id) => {
    this.setState({
      itemModal: true,
      editModal: false,
      title: data,
      key: id
    });
  }

  deleteItem = (key) => {
    axios.delete('https://jsonplaceholder.typicode.com/posts/'+this.state.key).then(res => {
      alert(res.status);
    });
  }

  handleEdit = (id) => {
    axios.put('https://jsonplaceholder.typicode.com/posts/'+this.state.key, {
      title: this.state.title
    }).then(res => {
      console.log(res);
      this.setState({
        editModal: false
      });
      alert(res.status);
    })
  }

  setkey = (item, index) => item.id;
  render() {
    return(
      <View>
      <ScrollView>
        <FlatList
          horizontal
          style={{height: 100, zIndex:0,position: 'relative'}}
          data={this.state.images}
          extraData={this.state}
          keyExtractor={this.setkey}
          renderItem={({item}) => (
            <TouchableOpacity>
              <Image source={{uri: item.url}} style={{width: 100, height: 100}} />
            </TouchableOpacity>
          )}
        />
        <FlatList 
          data={this.state.data}
          extraData={this.state}
          keyExtractor={this.setkey}
          renderItem={({item}) => (
            <TouchableOpacity style={{padding: 25, borderBottomWidth: 1}} onLongPress={this.triggerModal.bind(this, item.title, item.id)}>
              <Text>{item.title}</Text>
            </TouchableOpacity>
          )}
        />
      </ScrollView>
      <Modal isVisible={this.state.itemModal} hasBackdrop={true}
        onBackdropPress={() => this.setState({itemModal: false})} onModalHide={() => {this.setState({editModal: true})}}
        propagateSwipe
      >
        <View style={{padding: 8, backgroundColor: 'white'}}>
          <Text>{this.state.title}</Text>

          <Button title='Edit'
            onPress={()=> {this.setState({itemModal: false})}}/>
          <Button title='Delete' onPress={this.deleteItem.bind(this, this.state.key)}/>
        </View>
      </Modal>

      <Modal isVisible={this.state.editModal} hasBackdrop={true} onBackdropPress={() => this.setState({editModal: false})}>
        <View style={{padding: 8, backgroundColor: 'white'}}>
          <TextInput onChangeText={(event) => this.setState({title: event})} value={this.state.title}/>
          <Button title='Apply' onPress={this.handleEdit.bind(this, this.state.key)}/>
        </View>
      </Modal>
      </View>
    );
  }
}

const stack = createStackNavigator({
  Login: Login,
  Home: Home
}, {
  initialRouteName: 'Login'
});

const Container = createAppContainer(stack);

export default class App extends React.Component {
  render() {
    return(
      <Container />
    )
  }
}
