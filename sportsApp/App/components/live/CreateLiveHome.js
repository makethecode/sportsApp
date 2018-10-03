import React,{Component} from 'react';
import {
    Dimensions,
    ListView,
    ScrollView,
    Image,
    View,
    StyleSheet,
    Text,
    TextInput,
    Platform,
    TouchableOpacity,
    RefreshControl,
    Animated,
    Easing,
    Modal,
    DeviceEventEmitter,
    Alert,
    KeyboardAvoidingView,
    BackAndroid,
} from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import TextInputWrapper from 'react-native-text-input-wrapper';
import {Toolbar,OPTION_SHOW,OPTION_NEVER} from 'react-native-toolbar-wrapper';
import PopupDialog,{ScaleAnimation,DefaultAnimation,SlideAnimation} from 'react-native-popup-dialog';
import ActionSheet from 'react-native-actionsheet';
import InputScrollView from 'react-native-input-scroll-view'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import {getAccessToken,} from '../../action/UserActions';
import Bridge from '../../native/Bridge'
import  {
    getRTMPPushUrl,
    updatePlayingUrls,
    createLiveHome,
    closeLiveHome,
} from '../../action/LiveActions';
import Config from "../../../config";
import Proxy from "../../utils/Proxy";

const slideAnimation = new SlideAnimation({ slideFrom: 'bottom' });
const scaleAnimation = new ScaleAnimation();
const defaultAnimation = new DefaultAnimation({ animationDuration: 150 });
var {height, width} = Dimensions.get('window');

//主播
class CreateLiveHome extends Component{

    goBack(){
        const { navigator } = this.props;
        if(navigator) {
            navigator.pop();
        }
    }

    constructor(props) {
        super(props);
        this.state={
            title:null,
            brief:null,
            longbrief:null,
            //urls:
            // {rtmppushurl=rtmp://pili-publish.sportshot.cn/sportshot/source1?e=1538381806&token=2M63A85U1GpU37_hxw6zmCYt7ia0YPIEpOjLeJt5:vCqaZpqIQG4Gp0SmO1Hi69sPBZE=,
            // rtmpplayurl=rtmp://pili-live-rtmp.sportshot.cn/sportshot/source1,
            // snapshot=http://live-snapshot.sportshot.cn/sportshot/source1.jpg}
            urls:this.props.urls,
            rtmppushurl:this.props.urls.rtmppushurl,
            rtmpplayurl:this.props.urls.rtmpplayurl,
            snapshot:this.props.urls.snapshot,

            liveInfo:null,
            isPlay:true,
        }
    }

    render() {

        return (
            <View style={{flex:1,backgroundColor:'#fff'}}>
                <Toolbar width={width} title="创建直播间" actions={[]} navigator={this.props.navigator}>
                <KeyboardAwareScrollView style={{height:height-180,width:width,padding:5}}>
                <View style={{flex:5,backgroundColor:'#eee'}}>

                    <View style={{height:30,width:width,justifyContent:'center',textAlign:'left'}}>
                        <Text style={{color:'#666',fontSize:13}}>直播基本信息</Text>
                    </View>

                    {/*直播名称*/}
                    <View style={{height:40,flexDirection:'row',justifyContent:'flex-end',alignItems: 'center',backgroundColor:'#fff',marginBottom:1}}>
                        <View style={{flex:1}}>
                            <Text style={{color:'#343434'}}>直播名称</Text>
                        </View>
                        <View style={{flex:3,flexDirection:'row',justifyContent:'flex-end',alignItems: 'center',backgroundColor:'#fff',
                            borderRadius:10}}>
                            <TextInput
                                placeholderTextColor='#888'
                                style={{fontSize:14,color:'#222',justifyContent:'flex-end',textAlign:'right',height:40,flex:3}}
                                placeholder="请输入直播名称"
                                value={this.state.title}
                                underlineColorAndroid={false}
                                onChangeText={
                                    (value)=>{
                                        this.setState({title:value})
                                    }}
                            />
                        </View>
                    </View>

                    {/*直播简介*/}
                    <View style={{height:40,flexDirection:'row',justifyContent:'center',alignItems: 'center',backgroundColor:'#fff',marginBottom:1}}>
                        <View style={{flex:1}}>
                            <Text style={{color:'#343434'}}>直播简介</Text>
                        </View>
                        <View style={{flex:3,flexDirection:'row',justifyContent:'flex-start',alignItems: 'center',backgroundColor:'#fff',
                            borderRadius:10}}>
                            <TextInput
                                placeholderTextColor='#888'
                                style={{fontSize:14,color:'#222',justifyContent:'flex-end',textAlign:'right',height:40,flex:3}}
                                placeholder="请用一句话介绍你的直播"
                                value={this.state.brief}
                                underlineColorAndroid={false}
                                onChangeText={
                                    (value)=>{
                                        this.setState({brief:value})
                                    }}
                            />
                        </View>
                    </View>

                    {/*直播详介*/}
                    <View style={{height:120,width:width,flexDirection:'column',justifyContent:'flex-start',alignItems: 'center',backgroundColor:'#fff',marginBottom:1}}>
                        <View style={{height:40,width:width,justifyContent:'center',textAlign:'left'}}>
                            <Text style={{color:'#343434'}}>详细介绍</Text>
                        </View>
                        <TextInput
                            style={{height:80,width:width,fontSize:14,marginTop:5,borderRadius:5,backgroundColor:'#fff'}}
                            onChangeText={(text) =>
                            {
                                this.setState({longbrief:text});
                            }}
                            value={this.state.longbrief}
                            placeholder='请详细描述直播内容，让大家了解一下吧！'
                            placeholderTextColor="#888"
                            underlineColorAndroid="transparent"
                            multiline={true}
                        />
                    </View>
                </View>

                    <View style={{flex:1,backgroundColor:'#fff',flexDirection:'column'}}>

                        <View style={{backgroundColor:'#fff',padding:10}}>
                            <Text style={{color:'#aaa',fontSize:11}}>
                                温馨提示：您发布的内容应合法、真实、健康、共创文明的网络环境
                            </Text>
                        </View>

                    <View style={{flexDirection:'row',height:60,justifyContent:'center',alignItems:'center',width:width,backgroundColor:'#fff',marginBottom:10}}>
                        <TouchableOpacity style={{width:width*1/3,backgroundColor:'#fc6254',padding:10,flexDirection:'row',
                            justifyContent:'center'}}
                                          onPress={()=>{

                                              var personId = this.props.personId;
                                              var title = this.state.title;
                                              var brief = this.state.brief;
                                              var longbrief = this.state.longbrief;
                                              var rtmppushurl = this.state.rtmppushurl;
                                              var rtmpplayurl = this.state.rtmpplayurl;
                                              var snapshot = this.state.snapshot;

                                                  //生成推流地址交给原生安卓处理
                                              //Bridge.raisePLStream(pushUrl);

                                              this.props.dispatch(createLiveHome(personId,title,brief,longbrief,rtmppushurl,rtmpplayurl,snapshot)).
                                              then((json)=>{
                                                      //创建房间成功，开始直播
                                                      //用Promise进行原生模块与rn模块的交互(可用then接受返回值)
                                                      Bridge.raisePLStream(rtmppushurl).then(msg=>{
                                                          //alert(msg);
                                                      }).catch(e=>{alert(e)});

                                                      this.setState({liveInfo:json[0],isPlay:true})

                                              });

                                          }}>
                            <Text style={{color:'#fff',fontSize:15}}>开始直播</Text>
                        </TouchableOpacity>
                    </View>
                    </View>

                </KeyboardAwareScrollView>
                </Toolbar>
            </View>
        );
    }

    componentWillMount()
    {
        this.Listener = DeviceEventEmitter.addListener('EventName', (msg)=>{
            //alert(msg);
            //直播结束后处理
            //关闭直播间
            this.props.dispatch(closeLiveHome(this.state.liveInfo.id)).
            then((json)=>{

            this.goBack()
            });

        });
    }

    componentWillUnmount()
    {
        //需要移除监听器
        // DeviceEventEmitter.remove();
        this.Listener.remove();
    }

}

var styles = StyleSheet.create({
    dialogContentView: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },

});

const mapStateToProps = (state, ownProps) => {

    var personInfo=state.user.personInfo

    const props = {
        username:state.user.user.username,
        perName:personInfo.perName,
        personId:personInfo.personId,
        wechat:personInfo.wechat,
        perIdCard:personInfo.perIdCard,
        playingList:state.playingList
    }
    return props
}



export default connect(mapStateToProps)(CreateLiveHome);



