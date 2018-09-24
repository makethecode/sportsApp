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
    InteractionManager
} from 'react-native';
import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import { SearchBar } from 'react-native-elements'
import {Toolbar,OPTION_SHOW,OPTION_NEVER} from 'react-native-toolbar-wrapper';
import {
    getAccessToken
}from '../../action/UserActions'
import {
    fetchActivityList,disableActivityOnFresh,enableActivityOnFresh,signUpActivity,fetchEventMemberList,exitActivity,exitFieldTimeActivity,deleteActivity,
} from '../../action/ActivityActions';
import activityMember from '../../components/groupActivity/ActivityMember';

var {height, width} = Dimensions.get('window');

class MyActivityRecord extends Component {

    goBack(){
        const { navigator } = this.props;
        if(navigator) {
            navigator.pop();
        }
    }

    constructor(props) {
        super(props);
        this.state={
            isRefreshing: false,
            fadeAnim: new Animated.Value(1),

            activities:null,
            allActivities:null,
        };
    }

    navigate2ActivityMember(activityId){
        const { navigator } = this.props;
        if(navigator) {
            navigator.push({
                name: 'activityMember',
                component: activityMember,
                params: {
                    activityId:activityId
                }
            })
        }
    }

    render()
    {

        var activityList = [];
        var {activities}=this.state;

        if(activities&&activities.length>0)
        {
            activities.map((rowData,i)=>{

                var imguri = rowData.avatar;
                var avatars = rowData.avatarList;

                var avatarList = (
                    <ScrollView
                        automaticallyAdjustContentInsets={false}
                        bounces ={false}
                        showsHorizontalScrollIndicator  ={true}
                        ref={(scrollView) => { this._scrollView = scrollView; }}
                        horizontal={true}
                    >
                        {this.renderAllAvatars(avatars)}
                    </ScrollView>
                );

                activityList.push(
                    <View style={{flex:1,backgroundColor:'#fff',marginTop:5,marginBottom:5,}}>
                        <View style={{flex:1,flexDirection:'row',padding:5,borderBottomWidth:1,borderColor:'#ddd',backgroundColor:'transparent',}}>
                            <View style={{flex:1,justifyContent:'center',alignItems: 'center'}}>
                                <Image resizeMode="stretch" style={{height:40,width:40,borderRadius:20}} source={{uri:imguri}}/>
                            </View>
                            <View style={{flex:2,justifyContent:'flex-start',alignItems: 'center',marginLeft:3,flexDirection:'row'}}>

                                <View style={{backgroundColor:'#fca482',borderRadius:5,padding:5}}><Text style={{color:'#ffffff'}}>组织者</Text></View>
                                <Text style={{color:'#5c5c5c',marginLeft:5}}>{rowData.creatorName}</Text>
                            </View>

                            <View style={{flex:2,marginRight:3,justifyContent:'center',alignItems:'flex-end'}}>
                                {
                                    rowData.status==1?
                                        //已结束1
                                        <View style={{flexDirection:'row'}}>
                                            <View style={{backgroundColor:'#fc6254',borderRadius:5,padding:5}}><Text style={{color:'#fff'}}>活动已结束</Text></View>
                                        </View>
                                        :
                                        //正在报名0
                                        <View style={{flexDirection:'row'}}>
                                            <View style={{backgroundColor:'#66CDAA',borderRadius:5,padding:5}}><Text style={{color:'#fff'}}>接受报名中</Text></View>
                                        </View>
                                }
                            </View>

                        </View>
                        <View style={{flex:3,padding:10}}>
                            <View style={{flex:3,flexDirection:'row',marginBottom:3}}>
                                <View style={{flex:1,justifyContent:'flex-start',alignItems: 'center',backgroundColor:'#66CDAA',borderRadius:5,padding:5}}>
                                    <Text style={{color:'#ffffff'}}>名称</Text>
                                </View>
                                <View style={{flex:7,padding:5,marginLeft:5}}>
                                    <Text style={{color:'#5c5c5c',justifyContent:'flex-start',alignItems: 'center'}}>{rowData.name}</Text>
                                </View>
                            </View>

                            <View style={{flex:3,flexDirection:'row',marginBottom:3}}>
                                <View style={{flex:1,justifyContent:'flex-start',alignItems: 'center',backgroundColor:'#ffffff',borderRadius:5,padding:5}}>
                                    <Text style={{color:'#66CDAA'}}>地点</Text>
                                </View>
                                <View style={{flex:7,padding:5,marginLeft:5}}>
                                    <Text style={{color:'#5c5c5c',justifyContent:'flex-start',alignItems: 'center'}}>{rowData.placeName}</Text>
                                </View>
                            </View>

                            <View style={{flex:3,flexDirection:'row',marginBottom:3}}>
                                <View style={{flex:1,justifyContent:'flex-start',alignItems: 'center',backgroundColor:'#66CDAA',borderRadius:5,padding:5}}>
                                    <Text style={{color:'#ffffff'}}>时间</Text>
                                </View>
                                <View style={{flex:7,padding:5,marginLeft:5}}>
                                    <Text style={{color:'#5c5c5c',justifyContent:'flex-start',alignItems: 'center'}}>{rowData.timeStart+'--'+rowData.timeEnd.substring(11,19)}</Text>
                                </View>
                            </View>
                            {
                                rowData.brief!=undefined&&rowData.brief!=null&&rowData.brief!=''?
                                    <View style={{flex:3,flexDirection:'row',marginBottom:3}}>
                                        <View style={{flex:1,justifyContent:'flex-start',alignItems: 'center',backgroundColor:'#fff',borderRadius:5,padding:5}}>
                                            <Text style={{color:'#66CDAA'}}>简介</Text>
                                        </View>
                                        <View style={{flex:7,padding:5,marginLeft:5}}>
                                            <Text style={{color:'#5c5c5c',justifyContent:'flex-start',alignItems: 'center'}}>{rowData.brief}</Text>
                                        </View>
                                    </View>
                                    :
                                    <View style={{flex:3,flexDirection:'row',marginBottom:3}}>
                                        <View style={{flex:1,justifyContent:'flex-start',alignItems: 'center',backgroundColor:'#fff',borderRadius:5,padding:5}}>
                                            <Text style={{color:'#66CDAA'}}>简介</Text>
                                        </View>
                                        <View style={{flex:7,padding:5,marginLeft:5}}>
                                            <Text style={{color:'#5c5c5c',justifyContent:'flex-start',alignItems: 'center'}}>无</Text>
                                        </View>
                                    </View>
                            }

                            <View style={{flex:3,flexDirection:'row',marginBottom:3}}>
                                <View style={{flex:1,justifyContent:'flex-start',alignItems: 'center',backgroundColor:'#66CDAA',borderRadius:5,padding:5}}>
                                    <Text style={{color:'#ffffff'}}>费用</Text>
                                </View>
                                <View style={{flex:7,padding:5,marginLeft:5}}>
                                    <Text style={{color:'#5c5c5c',justifyContent:'flex-start',alignItems: 'center'}}>{rowData.cost}元/人</Text>
                                </View>
                            </View>


                        </View>
                        <View style={{flex:1,flexDirection:'column',padding:10,borderTopWidth:1,borderColor:'#ddd'}}>

                            <View style={{flexDirection:'row',flex:2.5,alignItems:'flex-start'}}>
                                <View style={{flex:2,justifyContent:'flex-start',alignItems: 'center',marginLeft:3,flexDirection:'row',marginBottom:3}}>

                                    <View style={{backgroundColor:'#ffffff',borderRadius:5,padding:5}}><Text style={{color:'#fca482'}}>已报名</Text></View>
                                    <Text style={{color:'#5c5c5c',marginLeft:5}}>{rowData.nowNumber}/{rowData.maxNumber}人</Text>
                                </View>

                                <View style={{flex:4,backgroundColor:'#fff',justifyContent:'flex-start',marginBottom:3}}>
                                    <TouchableOpacity onPress={()=>{this.navigate2ActivityMember(rowData.activityId)}}>
                                        {avatarList}
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <View style={{flex:2,justifyContent:'flex-start',alignItems: 'center',marginLeft:3,flexDirection:'row',marginBottom:3}}>
                                <View style={{backgroundColor:'#fca482',borderRadius:5,padding:5}}><Text style={{color:'#ffffff'}}>已支付</Text></View>
                                <Text style={{color:'#5c5c5c',marginLeft:5}}>{rowData.nowPayment}元</Text>

                            </View>
                        </View>
                        <View style={{width:width,height:2,backgroundColor:'#eee'}}/>
                    </View>
                )
            })

        }

        return (
            <View style={styles.container}>
                <Toolbar width={width}  title="我的活动" navigator={this.props.navigator}
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
                        placeholder='活动名\场馆\俱乐部' />
                    <View style={{width:width,height:40,backgroundColor:'#eee',padding:10,alignItems:'flex-start',justifyContent:'center',textAlign:'left'}}>
                        <Text style={{color:'#888',fontSize:13}}>活动名单</Text>
                    </View>

                    <ScrollView style={{ flex: 1, width: width, backgroundColor: '#fff' }}>

                        <Animated.View style={{flex: 1, padding: 4,paddingTop:10,opacity: this.state.fadeAnim,backgroundColor:'#fff' }}>
                            {activityList}
                        </Animated.View>

                    </ScrollView>

                </Toolbar>
            </View>
        )

    }

    searchByText(text){

        //前端实现模糊查询

        if(text==null || text=='')
        {
            var activities = this.state.allActivities;
            this.setState({activities:activities})
        }
        else {
            var activities = this.state.allActivities;
            var activityList = [];

            if (activities && activities.length > 0) {
                activities.map((activity, i) => {
                    if (activity.name) {
                        if (activity.name.indexOf(text) != -1)
                            activityList.push(activity)
                    }
                })
            }

            this.setState({activities: activityList})
        }
    }

    componentDidMount()
    {
        InteractionManager.runAfterInteractions(() => {
            this.props.dispatch(fetchActivityList()).then((json)=> {

                var allActivity = json.data;
                var myActivity = [];

                if (allActivity!== undefined && allActivity !== null &&allActivity.length > 0) {

                    allActivity.map((activity,i)=>{

                        if(activity.idcreator==this.props.creatorId){
                            myActivity.push(activity);
                        }
                    });

                    this.setState({allActivities:myActivity,activities:myActivity})
                }

            }).catch((e)=>{
                alert(e)
            });
        });
    }

    renderAllAvatars(avatars){
        var allAvatars = [];
        if(avatars==null)return null;
        for(var i=0;i<avatars.length;i++) {
            var model = avatars[i]
            var item = this.getImageViewItem(model)
            allAvatars.push(item);
        }
        return allAvatars;
    }

    getImageViewItem(model){

        return (
            <View style={{flex:1,padding:1}}>
                <Image resizeMode="stretch" style={{height:25,width:25,borderRadius:13}} source={{uri:model}}/>
            </View>
        );
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
        creatorId:state.user.personInfo.personId,
    })
)(MyActivityRecord);


