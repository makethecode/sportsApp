import React, {Component} from 'react';
import {
    Alert,
    Dimensions,
    ListView,
    ScrollView,
    Image,
    View,
    StyleSheet,
    Text,
    Platform,
    TouchableOpacity,
    RefreshControl,
    Animated,
    Easing,
    ToastAndroid,
    InteractionManager,
} from 'react-native';

import {connect} from 'react-redux';
var {height, width} = Dimensions.get('window');

import DateFilter from '../../utils/DateFilter';
import Icon from 'react-native-vector-icons/FontAwesome';
import AddActivity from './AddActivity';
import MyActivity from './MyActivity';
import ActivityDetail from './ActivityDetail';
import ActivityPay from './ActivityPay';
import ChooseField from './ChooseField';
import GroupJPush from './GroupJPush';
import goFieldOrder from './FieldOrder'
import PopupDialog,{ScaleAnimation,DefaultAnimation,SlideAnimation} from 'react-native-popup-dialog';
const slideAnimation = new SlideAnimation({ slideFrom: 'bottom' });
const scaleAnimation = new ScaleAnimation();
const defaultAnimation = new DefaultAnimation({ animationDuration: 150 });
import QrcodeModal from './QrcodeModal';
import {
    fetchActivityList,
    disableActivityOnFresh,
    enableActivityOnFresh,
    signUpActivity,
    fetchEventMemberList,
    exitActivity,
    exitFieldTimeActivity,
    fetchMemberListByActivityId,
} from '../../action/ActivityActions';

import {getAccessToken,} from '../../action/UserActions';
import WechatShare from '../WechatShare';
var WeChat=require('react-native-wechat');
import AddMember from '../../components/groupActivity/AddMember'
import {Toolbar,OPTION_SHOW,OPTION_NEVER,ACTION_PERSON_ADD} from 'react-native-toolbar-wrapper'
/**
 * 群活动成员
 */

class ActivityMember extends Component {

    goBack() {
        const {navigator} = this.props;
        if (navigator) {
            navigator.pop();
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

    navigate2AddMember(activityId){
        const { navigator } = this.props;
        if(navigator) {
            navigator.push({
                name: 'AddMember',
                component: AddMember,
                params: {
                    activityId:activityId
                }
            })
        }
    }

    renderRow(rowData,sectionId,rowId){

        var imguri = rowData.avatar;

        var row=(
            <View style={{flex:1,backgroundColor:'#fff',marginTop:5,marginBottom:5,}}>
                <View style={{flex:1,flexDirection:'row',padding:5,borderBottomWidth:1,borderColor:'#ddd',backgroundColor:'transparent',}}>
                    <View style={{flex:1,justifyContent:'center',alignItems: 'center'}}>
                        <Image resizeMode="stretch" style={{height:40,width:40,borderRadius:20}} source={{uri:imguri}}/>
                    </View>
                    <View style={{flex:3,justifyContent:'flex-start',alignItems: 'center',marginLeft:3,flexDirection:'row'}}>

                        <View style={{backgroundColor:'#fca482',borderRadius:5,padding:5}}><Text style={{color:'#ffffff'}}>姓名</Text></View>
                                <Text style={{color:'#5c5c5c',marginLeft:5}}>{rowData.name}</Text>
                    </View>

                     <View style={{flex:2,marginRight:3,justifyContent:'center',alignItems:'flex-end'}}>
                                 <View style={{backgroundColor:'#fc6254',borderRadius:5,padding:5}}><Text style={{color:'#fff'}}>{rowData.isPay}</Text></View>
                     </View>
                </View>
                <View style={{flex:3,padding:10}}>

                    <View style={{flex:3,flexDirection:'row',marginBottom:3}}>
                        <View style={{flex:1,justifyContent:'flex-start',alignItems: 'center',backgroundColor:'#ffffff',borderRadius:5,padding:5}}>
                            <Text style={{color:'#66CDAA'}}>携带人数</Text>
                        </View>
                        <View style={{flex:4,padding:5,marginLeft:5}}>
                            <Text style={{color:'#5c5c5c',justifyContent:'flex-start',alignItems: 'center'}}>{rowData.number}人</Text>
                        </View>
                    </View>

                    <View style={{flex:3,flexDirection:'row',marginBottom:3}}>
                        <View style={{flex:1,justifyContent:'flex-start',alignItems: 'center',backgroundColor:'#66CDAA',borderRadius:5,padding:5}}>
                            <Text style={{color:'#ffffff'}}>报名时间</Text>
                        </View>
                        <View style={{flex:4,padding:5,marginLeft:5}}>
                            <Text style={{color:'#5c5c5c',justifyContent:'flex-start',alignItems: 'center'}}>{rowData.joinTime}</Text>
                        </View>
                    </View>

                </View>
            </View>
        );
        return row;
    }

    constructor(props) {
        super(props);
        this.state = {
            doingFetch: false,
            isRefreshing: false,
            fadeAnim: new Animated.Value(1),
            signupedShow:false,
            share:{},
            activityMembers:[],
        }
    }

    render() {

        var activityMemberList = null;
        var {activityMembers}=this.state;
        var {memberList} = this.props;

        if(activityMembers&&activityMembers.length>0)
        {
            var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
            activityMemberList = (
                <ScrollView
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.isRefreshing}
                            onRefresh={this._onRefresh.bind(this)}
                            tintColor="#ff0000"
                            title="Loading..."
                            titleColor="#00ff00"
                            colors={['#ff0000', '#00ff00', '#0000ff']}
                            progressBackgroundColor="#ffff00"
                        />
                    }
                >
                    <ListView
                        automaticallyAdjustContentInsets={false}
                        dataSource={ds.cloneWithRows(memberList)}
                        renderRow={this.renderRow.bind(this)}
                    />
                </ScrollView>)

        }

        return (

            <View style={{flex:1}}>
                <Toolbar width={width} title="成员详情" navigator={this.props.navigator}
                         actions={[{icon:ACTION_PERSON_ADD,show:OPTION_SHOW}]}
                         onPress={(i)=>{
                             if(i==0)
                             {
                                  this.navigate2AddMember(this.props.activityId);
                             }
                        }}>
                    {/*内容区*/}
                    <View style={{flex:5,backgroundColor:'#eee'}}>
                        <Animated.View style={{opacity: this.state.fadeAnim,height:height-100,paddingTop:5,paddingBottom:5,}}>
                            <ScrollView
                                refreshControl={
                                <RefreshControl
                                    refreshing={this.state.isRefreshing}
                                    onRefresh={this._onRefresh.bind(this)}
                                    tintColor="#9c0c13"
                                    title="刷新..."
                                    titleColor="#9c0c13"
                                    colors={['#ff0000', '#00ff00', '#0000ff']}
                                    progressBackgroundColor="#ffff00"
                                />
                            }
                            >
                                {activityMemberList}

                                {
                                    activityMemberList==null?
                                        null:
                                        <View style={{justifyContent:'center',alignItems: 'center',backgroundColor:'#eee',padding:10}}>
                                            <Text style={{color:'#343434',fontSize:13,alignItems: 'center',justifyContent:'center'}}>已经全部加载完毕</Text>
                                        </View>
                                }

                            </ScrollView>
                        </Animated.View>
                    </View>
                </Toolbar>
            </View>
        );
    }

    componentDidMount(){
        InteractionManager.runAfterInteractions(() => {
            this.props.dispatch(fetchMemberListByActivityId(this.props.activityId)).then((json)=>{
                if(json.re==1)
                {
                    var activityMembers = json.data;
                    this.setState({activityMembers:activityMembers});
                }
                else {
                    if(json.re=-100){
                        this.props.dispatch(getAccessToken(false))
                    }

                }
            })
        });
    }

    componentWillUnmount()
    {
        this.props.dispatch(enableActivityOnFresh());
    }

}

var styles = StyleSheet.create({
    container: {
        flex:1,
    },
    defaultStyle1:{
        height:70,
        paddingTop:30,
        flexDirection:'row',
        justifyContent:'center',
        backgroundColor:'#66CDAA'
    },

});


module.exports = connect(state=>({
        accessToken:state.user.accessToken,
        personInfo:state.user.personInfo,
        trainer:state.user.trainer,
        activityList:state.activity.activityList,
        myEvents:state.activity.myEvents,
        myTakenEvents:state.activity.myTakenEvents,
        visibleEvents:state.activity.visibleEvents,
        activityOnFresh:state.activity.activityOnFresh,
        memberList:state.activity.memberList,
    })
)(ActivityMember);



