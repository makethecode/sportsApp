/**
 * Created by dingyiming on 2017/8/1.
 */
import React, {Component} from 'react';
import {
    Dimensions,
    ListView,
    ScrollView,
    Image,
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
    RefreshControl,
    Animated,
    Easing,
    TextInput,
    InteractionManager, Alert
} from 'react-native';
import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import _ from 'lodash';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CommIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Toolbar,OPTION_SHOW,OPTION_NEVER} from 'react-native-toolbar-wrapper';
import MemberInformation from '../course/MemberInformation';
import {
    getAccessToken,
} from '../../action/UserActions';
import { SearchBar } from 'react-native-elements'
import {
    fetchGames,disableCompetitionOnFresh,enableCompetitionOnFresh,fetchCompetitions,fetchProjects,fetchTeamList,fetchTeamPersonList
} from '../../action/CompetitionActions';

var { height, width } = Dimensions.get('window');

class CompetitionTeamPersonList extends Component {

    goBack(){
        const { navigator } = this.props;
        if(navigator) {
            navigator.pop();
        }
    }

    navigate2MemberInformation(personId){
        const { navigator } = this.props;
        if (navigator) {
            navigator.push({
                name: 'MemberInformation',
                component: MemberInformation,
                params: {
                    personId:personId,
                }
            })
        }
    }

    _onRefresh() {
        this.setState({ isRefreshing: true, fadeAnim: new Animated.Value(0) });
        setTimeout(function () {
            this.setState({
                isRefreshing: false,
            });
            Animated.timing(          // Uses easing functions
                this.state.fadeAnim,    // The value to drive
                {
                    toValue: 1,
                    duration: 600,
                    easing: Easing.bounce
                },           // Configuration
            ).start();
        }.bind(this), 2000);
    }

    constructor(props) {
        super(props);
        this.state={
            isRefreshing:true,
            fadeAnim: new Animated.Value(1),
            teamPerson:[
                {'personId':3,'perNum':'wbh','mobilePhone':'13899303012','avatar':'https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83er7qoZtfnhNSGgsCAyiaaa6XE1D8RAJgTQouhudfRISF9ysc4ywfJK8NetUpScMUrsJCO8X0JYcobw/0'},
                {'personId':154,'perNum':'zp','mobilePhone':'18873820212','avatar':'https://wx.qlogo.cn/mmopen/vi_32/OpqHHsgWiaSQWXiaQExFffsLqTnZWCU2BnfJsYzO59DaFoBaicEYbaCnZdThAj2xf32ZMqYsq0oHZsaWAGoPuZz5A/132'}
            ]
        };
    }

    render()
    {

        var coachList = [];
        var {teamPerson}=this.state;

        if(teamPerson&&teamPerson.length>0)
        {

            teamPerson.map((person,i)=>{
                coachList.push(
                    <TouchableOpacity key={i} style={{flexDirection:'column'}}
                                      onPress={()=>{
                                          this.navigate2MemberInformation(person.personId)
                                      }}>

                        <View style={{ padding:8,flexDirection:'row',marginVertical:3}}>
                            <View style={{flex:1,justifyContent:'center',alignItems: 'center'}}>
                                {
                                    person.avatar!=""?
                                        <Image resizeMode="stretch" style={{height: 40, width: 40, borderRadius: 20}}
                                               source={{uri: person.avatar}}/>:
                                        <Image resizeMode="stretch" style={{height: 40, width: 40, borderRadius: 20}}
                                               source={require('../../../img/portrait.jpg')}/>
                                }
                            </View>

                            <View style={{flex:4,flexDirection:'column',alignItems:'flex-start',justifyContent:'center'}}>
                                <View style={{flexDirection:'row',marginBottom:5,}}><Ionicons name='md-person' size={13} color="#fca482"/><Text style={{ color: '#222', fontSize: 14,marginLeft:3}}>{person.perNum}</Text></View>
                                <View style={{flexDirection:'row'}}><Ionicons name='md-call' size={13} color="#fca482"/><Text style={{ color: '#666', fontSize: 12,marginLeft:3}}>{person.mobilePhone}</Text></View>
                            </View>

                            <View style={{flex:1,justifyContent:'center',alignItems: 'flex-end'}}>
                                <View style={{borderWidth:1,borderColor:'#fc3c3f',padding:3,paddingHorizontal:5,borderRadius:3}}>
                                    <Text style={{fontSize:13,color:'#fc3c3f'}}>{person.memberTypeStr}</Text>
                                </View>
                            </View>
                        </View>

                        <View style={{height:0.7,width:width,backgroundColor:'#c2c2c2'}}></View>

                    </TouchableOpacity>
                )
            })

        }

        return (
            <View style={styles.container}>
                <Toolbar width={width}  title="队员列表" navigator={this.props.navigator}
                         actions={[]}
                         onPress={(i)=>{
                             this.goBack()
                         }}>
                    <View style={{width:width,height:40,backgroundColor:'#eee',padding:10,alignItems:'flex-start',justifyContent:'center',textAlign:'left'}}>
                        <Text style={{color:'#888',fontSize:13}}>队员名单</Text>
                    </View>
                    <ScrollView style={{ flex: 1, width: width, backgroundColor: '#fff' }}>

                        <Animated.View style={{flex: 1, paddingHorizontal:4,opacity: this.state.fadeAnim,backgroundColor:'#fff' }}>
                            {coachList}
                        </Animated.View>

                    </ScrollView>

                </Toolbar>
            </View>
        )
    }

    componentWillMount()
    {
        //{'personId':3,'perNum':'wbh','mobilePhone':'13899303012','avatar':'https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83er7qoZtfnhNSGgsCAyiaaa6XE1D8RAJgTQouhudfRISF9ysc4ywfJK8NetUpScMUrsJCO8X0JYcobw/0'},
        this.props.dispatch(fetchTeamPersonList(this.props.teamId)).then((json)=>{
            if(json.re==1)
            {
                this.setState({teamPerson:json.data});
            }
            else {
                if(json.re=-100){
                    this.props.dispatch(getAccessToken(false))
                }
            }
        })
    }


}

const styles = StyleSheet.create({

    container: {
        flex: 1,
    },

});


module.exports = connect(state=>({
        accessToken:state.user.accessToken,
        personInfo:state.user.personInfo,
    })
)(CompetitionTeamPersonList);



