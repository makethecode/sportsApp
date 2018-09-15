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
import{
    fetchCoaches,
    onCoachUpdate,
    searchCoaches
} from '../../action/CoachActions';

import {
    getAccessToken,
} from '../../action/UserActions';

import CoachDetail from './CoachDetail'
import {distributeCourse} from "../../action/CourseActions"
import { SearchBar } from 'react-native-elements'

var {height, width} = Dimensions.get('window');

class SelectCoach extends Component {

    goBack(){
        const { navigator } = this.props;
        if(navigator) {
            navigator.pop();
        }
    }

    navigate2CoachDetail(rowData){
        const { navigator } = this.props;
        if(navigator) {
            navigator.push({
                name: 'coachDetail',
                component: CoachDetail,
                params: {
                    coachDetail:rowData
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

    addItem = item => {
        this.setState({coached: [...this.state.coached, item]})
    };
    removeItem = removedItem => {
        this.setState({
            coached: this.state.coached.filter(item => {
                if (item.perName!== removedItem.perName)
                    return item;
            })
        });
    };

    addItem1 = item => {
        this.setState({coachId: [...this.state.coachId, item]})
    };
    removeItem1 = removedItem => {
        this.setState({
            coachId: this.state.coachId.filter(item => {
                if (item.trainerId!== removedItem.trainerId)
                    return item;
            })
        });
    };

    constructor(props) {
        super(props);
        this.state={
            memberLevel:['','体育本科','国家一级运动员','国家二级运动员','国家三级运动员'],
            isRefreshing:true,
            fadeAnim: new Animated.Value(1),
            coaches:this.props.coaches,
            coached:[],
            coachId:null,
        };
    }

    render()
    {
        var field="";
        var coachId="";
        this.state.coached.map((coach,i)=>{
            field+=coach.state+",";
            coachId+=coach.coachId+",";
        });
        field=field.substring(0,field.length-1);

        var coachList = [];
        var {coaches}=this.state;

        if(coaches&&coaches.length>0)
        {

            coaches.map((person,i)=>{
                coachList.push(
                    <TouchableOpacity key={i} style={{flexDirection:'column',marginTop:4}}
                                      onPress={()=>{
                                          var _relative=_.cloneDeep(coaches);
                                          _relative.map((_person,j)=>{
                                              if(_person.perName==person.perName)
                                              {
                                                  if(_person.checked==true)
                                                  {
                                                      _person.checked = false;
                                                      this.removeItem({state: person.perName,perName:person.perName,coachId:person.trainerId});
                                                      //this.removeItem1({state:person.trainerId,trainerId:person.trainerId});
                                                  }
                                                  else{
                                                      this.addItem({state:person.perName,perName:person.perName,coachId:person.trainerId});
                                                      _person.checked=true;
                                                  }
                                              }
                                          })
                                          this.setState({coaches:_relative})
                                      }}>

                        <View style={{ padding: 6,flexDirection:'row',marginTop:3}}>
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
                                <Text style={{ color: '#222', fontSize: 14,marginBottom:5}}>{person.perName}</Text>
                                <Text style={{ color: '#666', fontSize: 13}}>{person.mobilePhone}</Text>
                            </View>
                            <View style={{flexDirection:'row',alignItems:'center',justifyContent:'flex-end',paddingHorizontal:10,width:70}}>
                                {
                                    person.checked==true?
                                        <Ionicons name='md-checkbox-outline' size={20} color="#5c5c5c"/>:
                                        <Ionicons name='md-square-outline' size={20} color="#5c5c5c"/>
                                }
                            </View>
                        </View>

                        <View style={{flex:3,padding:10,flexDirection:'column'}}>
                            <View style={{flex:3,flexDirection:'row',marginBottom:3}}>
                                <View style={{flex:1,justifyContent:'flex-start',alignItems: 'center',backgroundColor:'#66CDAA',borderRadius:5,padding:5}}>
                                    <Text style={{color:'#ffffff'}}>级别</Text>
                                </View>
                                <View style={{flex:7,padding:5,marginLeft:5}}>
                                    <Text style={{color:'#5c5c5c',justifyContent:'flex-start',alignItems: 'center'}}>{person.sportLevel}</Text>
                                </View>
                            </View>

                            <View style={{flex:3,flexDirection:'row',marginBottom:3}}>
                                <View style={{flex:1,justifyContent:'flex-start',alignItems: 'center',backgroundColor:'#ffffff',borderRadius:5,padding:5}}>
                                    <Text style={{color:'#66CDAA'}}>水平</Text>
                                </View>
                                <View style={{flex:7,padding:5,marginLeft:5}}>
                                    <Text style={{color:'#5c5c5c',justifyContent:'flex-start',alignItems: 'center'}}>{person.coachLevel}</Text>
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
                <Toolbar width={width}  title="教练列表" navigator={this.props.navigator}
                         actions={[]}
                         onPress={(i)=>{
                             this.goBack()
                         }}>
                    <SearchBar
                        lightTheme
                        onChangeText={
                            //模糊查询
                            (text)=>{
                                this.searchByText(text)
                            }
                        }
                        placeholder='姓名\电话\级别\水平' />
                    <View style={{width:width,height:40,backgroundColor:'#eee',padding:10,alignItems:'flex-start',justifyContent:'center',textAlign:'left'}}>
                        <Text style={{color:'#888',fontSize:13}}>教练名单</Text>
                    </View>
                    <ScrollView style={{ flex: 1, width: width, backgroundColor: '#fff' }}>

                        <Animated.View style={{flex: 1, padding: 4,paddingTop:10,opacity: this.state.fadeAnim,backgroundColor:'#fff' }}>
                            {coachList}
                        </Animated.View>

                    </ScrollView>

                    <View style={{flexDirection:'row',height:60,justifyContent:'center',alignItems:'center',width:width,marginBottom:10}}>
                        <TouchableOpacity style={{width:width*1/3,backgroundColor:'#fc6254',padding:10,flexDirection:'row',
                            justifyContent:'center'}}
                                          onPress={()=>{
                                              this.goBack();
                                              this.props.setCoach(field,coachId);
                                          }}>
                            <Text style={{color:'#fff',fontSize:15}}>确定</Text>
                        </TouchableOpacity>
                    </View>

                </Toolbar>

            </View>
        )
    }

    searchByText(text){

        //前端实现模糊查询

        if(text==null || text=='')
        {
            var {coaches} = this.props;
            this.setState({coaches:coaches})
        }
        else {
            var {coaches} = this.props;
            var coachList = [];

            if (coaches && coaches.length > 0) {
                coaches.map((person, i) => {
                    if (person.perName) {
                        if (person.perName.indexOf(text) != -1)
                            coachList.push(person)
                    }
                })
            }

            this.setState({coaches: coachList})
        }
    }

    revertCoach(){

        var {coaches} = this.props;
        this.setState({coaches:coaches})
    }

    componentWillMount()
    {
       // InteractionManager.runAfterInteractions(() => {
            this.props.dispatch(fetchCoaches()).then((json)=>{
                if(json.re==1)
                {
                    this.props.dispatch(onCoachUpdate(json.data))
                    this.setState({coaches:this.props.coaches})
                }
                else{
                    if(ison.re=-100) {
                        this.props.dispatch(getAccessToken(false))
                    }
                }
            })
       // });
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
        coaches:state.coach.coaches,
    })
)(SelectCoach);

