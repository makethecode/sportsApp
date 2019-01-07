import React,{Component} from 'react';
import {
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
    Easing
} from 'react-native';
import {Toolbar,OPTION_SHOW,OPTION_NEVER,ACTION_ADD} from 'react-native-toolbar-wrapper'
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
    fetchNotices,disableNoticeOnFresh,enableNoticeOnFresh
} from '../action/NoticeActions';
import { connect } from 'react-redux';
import { IndicatorViewPager,PagerTitleIndicator } from 'rn-viewpager'
import JPushModule from 'jpush-react-native';

var {height, width} = Dimensions.get('window');


class Notice extends Component{

    goBack() {
        const { navigator } = this.props;
        if (navigator) {
            navigator.pop();
        }
    }

    _onRefresh() {
        this.setState({isRefreshing: true, fadeAnim: new Animated.Value(0)});
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
        }.bind(this), 500);
        // this.props.dispatch(enableNoticeOnFresh());
        this.setState({noticeFresh:true})
    }

    renderRow(rowData,sectionId,rowId){

        // 通知类型：
        // 课程：
        // 0-XXXX ==系统通知
        // 1-XXX报名了XXX的课程XXXX 时间（给该教练）==报名通知
        // 2-XXX的课次只剩一次，请提醒XXX及时续费（给管理员）==续费通知
        // 自由（写通知）
        // 3-自由通知（考虑实现）

        var type = rowData.type;
        var typeStr = '';
        switch(type){
            case 0:typeStr = '系统通知';break;
            case 1:typeStr = '报名通知';break;
            case 2:typeStr = '续费通知';break;
        };

        var avatar = rowData.avatar;
        var content = rowData.content;
        var date = rowData.date;

        var row=(
            <View style={{flex:1,backgroundColor:'#eee',marginTop:3,borderBottomWidth:1,borderBottomColor:'#aaa'}}>
                <View style={{flex:1,flexDirection:'row',padding:5,borderBottomWidth:1,borderColor:'#ddd',backgroundColor:'transparent',}}>
                </View>

                <View style={{flex:3,paddingVertical:5,backgroundColor:'#fff'}}>

                    <View style={{flexDirection:'row',borderBottomWidth:1,borderColor:'#eee',paddingVertical:2}}>
                        <View style={{flex:1,justifyContent:'center',alignItems: 'center'}}>
                            <Ionicons name={'md-megaphone'} size={20} color="#aaa"/>
                        </View>
                        <View style={{flex:7,justifyContent:'center',alignItems: 'flex-start'}}>
                            <Text style={{fontSize:13,color:'#343434'}}>
                                {typeStr}
                            </Text>
                        </View>
                    </View>

                    <View style={{flexDirection:'row',padding:5}}>
                        <View style={{flex:1,justifyContent:'center',alignItems: 'flex-start',padding:3}}>
                            <Image resizeMode="stretch" style={{height: 40, width: 40, borderRadius: 20}}
                                   source={require('../../img/portrait.jpg')}/>
                        </View>
                        <View style={{flex:7,justifyContent:'center',alignItems: 'flex-start',flexDirection:'column',marginLeft:5}}>
                        <Text style={{fontSize:14,color:'#343434',marginBottom:5}}>
                            {content}
                        </Text>
                        <Text style={{fontSize:11,color:'#888'}}>
                            {date}
                         </Text>
                        </View>
                    </View>

                </View>

            </View>
        );
        return row;
    }

    fetchData(){
        this.state.doingFetch=true;
        this.state.isRefreshing=true;
        this.props.dispatch(fetchNotices()).then((json)=> {
            if(json.re==-100){
                this.props.dispatch(getAccessToken(false));
            }
            this.setState({noticeFresh:false,doingFetch:false,isRefreshing:false})
            //this.setState({noticeList:json.data})
        }).catch((e)=>{
            //this.props.dispatch(disableNoticeOnFresh());
            this.setState({noticeFresh:false,doingFetch:false,isRefreshing:false});
            alert(e)
        });
    }

    constructor(props) {
        super(props);
        this.state={
            doingFetch: false,
            isRefreshing: false,
            fadeAnim: new Animated.Value(1),

            noticeList:[
                {type:1,content:'陈海云报名了第一课',date:'2018-10-10'},
                {type:2,content:'陈海云的课程快要到期了，请提醒他续费',date:'2018-09-28'}],
            noticeFresh:true,
        };
    }

    render() {

        var noticeListView=null;
        var {noticeList,noticeFresh}=this.state;
        //var competitionList=this.state.competitionList;
        if(noticeFresh==true)
        {
            if(this.state.doingFetch==false)
                this.fetchData();
        }else{
            var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
            if (noticeList !== undefined && noticeList !== null && noticeList.length > 0)
            {
                noticeListView = (
                    <ListView
                        automaticallyAdjustContentInsets={false}
                        dataSource={ds.cloneWithRows(noticeList)}
                        renderRow={this.renderRow.bind(this)}
                    />
                );
            }
        }

        return (
        <View style={{flex:1}}>
            <View style={{flex:2}}>
                <Image style={{flex:2,width:width,position:'relative'}} source={require('../../img/tt2@2x.jpeg')} >

                </Image>
            </View>

            <View style={{flex:6,backgroundColor:'#eee'}}>
                <View style={{flex:12,backgroundColor:'#eee'}}>
                    <Animated.View style={{opacity: this.state.fadeAnim,height:height-150,paddingTop:5,paddingBottom:5,}}>
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
                            {noticeListView}
                            {
                                noticeListView==null?
                                    null:
                                    <View style={{justifyContent:'center',alignItems: 'center',backgroundColor:'#eee',padding:10}}>
                                        <Text style={{color:'#343434',fontSize:13,alignItems: 'center',justifyContent:'center'}}>已经全部加载完毕</Text>
                                    </View>
                            }
                        </ScrollView>
                    </Animated.View>
                </View>
                <View style={{flex:1,backgroundColor:'#eee'}}>
                </View>
            </View>

        </View>
        );
    }

    componentDidMount()
    {
        // 新版本必需写回调函数
        // JPushModule.notifyJSDidLoad();
        if(Platform.OS === 'android') {
            JPushModule.notifyJSDidLoad((resultCode) => {
                if (resultCode === 0) {
                }
            });
        }

        // 接收自定义消息
        JPushModule.addReceiveCustomMsgListener((message) => {
            this.setState({pushMsg: message});
        });
        // 接收推送通知
        JPushModule.addReceiveNotificationListener((message) => {
            console.log("receive notification: " + message);
        });
        // 打开通知
        JPushModule.addReceiveOpenNotificationListener((map) => {
            console.log("Opening notification!");
            console.log("map.extra: " + map.extras);
            // 可执行跳转操作，也可跳转原生页面
            // this.props.navigation.navigate("SecondActivity");
        });
    }

    componentWillUnmount(){
        JPushModule.removeReceiveCustomMsgListener();
        JPushModule.removeReceiveNotificationListener();

    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    popoverContent: {
        width: 100,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    popoverText: {
        color: '#ccc',
        fontSize: 14
    }
});

const mapStateToProps = (state, ownProps) => {

    const props = {
        userType: state.user.usertype.perTypeCode,
    }
    return props
}

module.exports = connect(state=>({
        accessToken:state.user.accessToken,
        noticeList:state.notice.noticeList,
        noticeFresh:state.notice.noticeFresh,
    })
)(Notice);

