import React from 'react';
import { Image,Text,Dimensions,Button,TextInput, TouchableOpacity, View,AsyncStorage, DeviceEventEmitter,ScrollView} from 'react-native';
import {StackNavigator, DrawerNavigator, DrawerItems, SafeAreaView } from 'react-navigation'; //https://reactnavigation.org/docs/api-reference.html
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
import * as Keychain from 'react-native-keychain';
//import Iconz from 'react-native-vector-icons/MaterialIcons'; //https://material.io/icons/
import Iconz from 'react-native-vector-icons/Ionicons';  //https://ionicframework.com/docs/ionicons/
//var styles = require('./Styles.js');
var Storage = require('./IStorage.js');


import * as Settings from './Settings.js' //Include on every page
import { CreateAccountScreen } from './CreateAccount'
import { DetailsScreen } from './Home'
import { LoggedInHome, NotLoggedInHome } from './Home'
import { LoginScreen } from './Login'
import {CreateOrganizationScreen} from "./CreateOrganization";





/*
const DrawerNavigation = StackNavigator({
  DrawerStack: { screen: DrawerStack }
}, {
  headerMode: 'float',
  navigationOptions: ({navigation}) => ({
    headerStyle: {backgroundColor: 'green'},
    title: 'Logged In to your app!',
    headerLeft: <Text onPress={() => navigation.navigate('DrawerStack')}>Menu</Text>
  })
})
*/


class HomeHeader extends React.Component {
    constructor(props) {
        super(props);
    }
  render() {
    return (
        <View style={{flexWrap: 'wrap',alignItems: 'flex-start',flexDirection:'row', justifyContent: 'center',alignItems: 'center', margin:10}}>
           <Text style={{paddingLeft:35,fontWeight: 'bold', color: '#fff', fontSize:22}}>Home</Text>
       </View>
    );
  }
}

class HomeScreen extends React.Component {
    static navigationOptions = ({navigation}) => ({
        drawerLabel: () => null,
        headerTitle: ( 
            <Text style={{paddingLeft:35,fontWeight: 'bold', color: '#fff', fontSize:22}}>Home</Text>
        ),
        headerLeft: (
            <Iconz name="md-menu" color ="#fff" size={28} style={{marginLeft: 10}} onPress={() => navigation.navigate('DrawerToggle')}/>
        )
    });

    constructor(props) {
        super(props);
         this.state = {
             username : '',
             userId   : '',
             ready: false
         };
    }
    componentWillMount() {
        this.UserInfoFetch().then((ret) => {
            if(ret = ''){
                ret = null;
            }
            this.setState({ready:true, username: ret});
        });
        //TODO: Store session info into cookie
    }

    //Fetch is inheriently async which messes with fetching user info
    UserInfoFetch(){
        return fetch( Settings.HOME_URL + '/LoginAuth', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
               "Content-type": "application/x-www-form-urlencoded",
            },
        })
        .then((response) => {
           return response.json().then(function (json) {
                username = json.username;
                return json.username;
            })
        }).catch((error) => {
            this.showError('Error Signing Up, Please Try Again.');
        });
    }

     //will rebuild login cookies and refresh homescreen with setState()
     buildCookies(props){
         /*let info = '';
         Keychain.getGenericPassword()
         .then(function(credentials) {info = credentials.username})
         .catch(function(error) {
             info = '';
         });*/
         console.log(props);
         this.setState({
            username : props,
        });
         console.log('Refreshing homepage...', props);
     }


  render() {
      if(!this.state.ready){
          return null; // wait until a session response has been returned
      }
    return (
        <View style={{ flex: 1}}>
        {this.HomeGreeting()}

        </View>
    );
  }


    //Decides if a user is logged in or not
    HomeGreeting() {
        var that = this;
        if(!this.state.username){
            //Try one more time to get UserInfo
            //AsyncStorage.getItem(('UserInfo'), (errors, value) => {that.setState({userInfo : value}));
        }
        console.log("home greeting: username",this.state.username);
        if(!!this.state.username){
            //Logged in
            return(<LoggedInHome navigation={this.props.navigation} username={this.state.username} userId={this.state.userId}/>);
        }
        else{
            return <NotLoggedInHome  navigation={this.props.navigation} />
        }
    }
}

const RootStack = StackNavigator(
  {
    Home: {
      screen: HomeScreen,
    },
    Details: {
      screen: DetailsScreen,
    },
    CreateAccount: {
        screen: CreateAccountScreen,
    },
    Created: {
        screen: LoggedInHome,
    },
    Login: {
        screen: LoginScreen,
    },
    CreateOrganization: {
        screen: CreateOrganizationScreen,
    }

  },
  {
    initialRouteName: 'Home',
    navigationOptions: {
     headerStyle: {
       backgroundColor: '#6b52ae',
     },
     headerTintColor: '#fff',
     headerTitleStyle: {
       fontWeight: 'bold',
     },
 },
  }
);

// slideable sidebar
const Drawer = DrawerNavigator({
    Stack: {
      screen: RootStack,
    },
    //CreateAccount: {
    //    screen: CreateAccountScreen,
    //},
},
{
  drawerWidth: () =>  {return (Dimensions.get('window').width * .75)}
})

export default Drawer;
