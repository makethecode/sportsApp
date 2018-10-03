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
    TouchableOpacity,
    RefreshControl,
    Animated,
    Easing,
    TextInput,
    BackAndroid,
    DeviceEventEmitter
} from 'react-native';
import {connect} from 'react-redux';
import TextInputWrapper from 'react-native-text-input-wrapper';
import QRCode from 'react-native-qrcode'
import Bridge from '../../native/Bridge'
import GridView from 'react-native-super-grid'
import {Toolbar,OPTION_SHOW,OPTION_NEVER,ACTION_VEDIO} from 'react-native-toolbar-wrapper'
import  {
    getRTMPPushUrl,
    updatePlayingUrls,
} from '../../action/LiveActions';
import Config from "../../../config";
import Proxy from "../../utils/Proxy";
import ViewPager from 'react-native-viewpager';
import CreateLiveHome from './CreateLiveHome'
import Ionicons from 'react-native-vector-icons/Ionicons'

var {height, width,scale} = Dimensions.get('window');
var WeChat = require('react-native-wechat');

var IMGS = [
    require('../../../img/zhibo1.jpeg'),
    require('../../../img/zhibo2.jpeg'),
    require('../../../img/zhibo3.jpeg'),
];

class HomePage extends Component{

    goBack(){
        const { navigator } = this.props;
        if(navigator) {
            navigator.pop();
        }
    }

    navigate2CreateLiveHome(urls) {
        const { navigator } = this.props;
        if (navigator) {
            navigator.push({
                name: 'CreateLiveHome',
                component: CreateLiveHome,
                params: {
                    urls:urls
                }
            })
        }
    }

    _renderPage(data,pageID){
        return (
            <View style={{width:width}}>
                <Image
                    source={data}
                    style={{width:width,flex:3}}
                    resizeMode={"stretch"}
                />
            </View>
        );
    }

    constructor(props) {
        super(props);
        var ds=new ViewPager.DataSource({pageHasChanged:(p1,p2)=>p1!==p2});
        this.state={
            isRefreshing:false,
            activity:{name:"sda"},
           playingList:[],
            code_url:null,
            dataSource:ds.cloneWithPages(IMGS),
        };
    }

    render(){

        const items = [
            { name: 'TURQUOISE', code: '#1abc9c' },
            { name: 'EMERALD', code: '#2ecc71' },
            { name: 'PETER RIVER', code: '#3498db' }, { name: 'AMETHYST', code: '#9b59b6' },
            { name: 'WET ASPHALT', code: '#34495e' }, { name: 'GREEN SEA', code: '#16a085' },
            { name: 'NEPHRITIS', code: '#27ae60' }, { name: 'BELIZE HOLE', code: '#2980b9' },
            { name: 'WISTERIA', code: '#8e44ad' }, { name: 'MIDNIGHT BLUE', code: '#2c3e50' },
            { name: 'SUN FLOWER', code: '#f1c40f' }, { name: 'CARROT', code: '#e67e22' },
            { name: 'ALIZARIN', code: '#e74c3c' }, { name: 'CLOUDS', code: '#ecf0f1' },
            { name: 'CONCRETE', code: '#95a5a6' }, { name: 'ORANGE', code: '#f39c12' },
            { name: 'PUMPKIN', code: '#d35400' }, { name: 'POMEGRANATE', code: '#c0392b' },
            { name: 'SILVER', code: '#bdc3c7' }, { name: 'ASBESTOS', code: '#7f8c8d' },
        ];

        return (
            <View style={styles.container}>
                <Toolbar width={width} title="直播间" navigator={this.props.navigator} actions={[{icon:ACTION_VEDIO,show:OPTION_SHOW}]}
                         onPress={(i)=>{
                             if(i==0){
                                 this.props.dispatch(getRTMPPushUrl(this.props.personId)).then((json)=>{
                                     var urls
                                     if(json.re==1){
                                         //{[rtmppushurl],[rtmpplayurl],[snapshot]}
                                         urls=json.data;
                                         this.navigate2CreateLiveHome(urls);

                                     }else{
                                         alert('申请地址失败');
                                         //TODO:微信分享邀请好友
                                     }
                                 });
                                 }
                         }}>

                    <ScrollView style={{flex:1,height:height-100,width:width,backgroundColor:'#fff',flexDirection:'column'}}>

                        <View style={{width:width,height:140}}>
                            <ViewPager
                                style={this.props.style}
                                dataSource={this.state.dataSource}
                                renderPage={this._renderPage}
                                isLoop={true}
                                autoPlay={true}
                            />
                        </View>

                        <View style={{width:width,height:30,justifyContent:'center',paddingHorizontal:5,backgroundColor:'#eee'}}>
                            <Text style={{fontSize:13,color:'#666'}}>全部直播</Text>
                        </View>

                        <View style={{flex:1,alignItems:'center',justifyContent:'center',flexDirection:'column',padding:2}}>
                            <GridView
                                itemsPerRow={2}
                                spacing={3}
                                items={this.state.playingList}
                                style={styles.gridView}
                                renderItem={this.renderRow.bind(this)}
                            />
                        </View>

                    </ScrollView>

                </Toolbar>
            </View>
        )
    }

    renderRow(rowData)
    {

        //{brief=单纯测试, longbrief=单纯测试1111, snapShotUrl=http://live-snapshot/sportshot/EEvvee.jpg,
        // personId=4, perNum=lxq, id=5, title=reTest的直播间, playUrl=rtmp://pili-live-rtmp.sportshot.cn/sportshot/EEvvee}

        return(
        <TouchableOpacity style={{height:150,width:width/2-10,}}
                          onPress={()=>{
                              //播放source1的直播
                              var playUrl = 'rtmp://pili-live-rtmp.sportshot.cn/sportshot/source1'
                              Bridge.playVideo(playUrl)
                          }}
        >
            <Image style={{height:150,width:width/2-10,padding:5,}} source={require('../../../img/zhibologo.jpeg')} resizeMode={'stretch'}>
                <View style={{flex:6,backgroundColor:'transparent'}}>
                    <Text style={[styles.itemName,{backgroundColor:'transparent'}]}>{rowData.title}</Text>
                    <Text style={[styles.itemCode,{backgroundColor:'transparent'}]}>{rowData.brief}</Text>
                </View>
                <View style={{flex:1,backgroundColor:'transparent',flexDirection:'row'}}>
                    <Ionicons name={'md-person'} size={13} color="#fff"/>
                    <Text style={[styles.itemPlayer,{backgroundColor:'transparent',marginLeft:6}]}>{rowData.perNum}</Text>
                </View>
            </Image>
        </TouchableOpacity>
        );
    }

    componentWillMount(){

        //获得正在直播的房间
        Proxy.postes({
            url: Config.server + '/func/allow/getRtmpPlayUrl',
            headers: {
                'Content-Type': 'application/json'
            },
            body: {}

        }).then((json) => {
            this.setState({playingList:json.data})
            //this.props.dispatch(updatePlayingUrls({ url:json.data }));
        }).catch((e) => {
            reject(e)
        })
    }
}

const styles = StyleSheet.create({
    itemName: {
        fontSize: 16,
        color: '#fff',
        fontWeight:'bold'
    },
    itemCode: {
        fontSize: 12,
        color: '#fff',
    },
    itemPlayer: {
        fontSize: 13,
        color: '#fff',
    },
    itemContainer: {
        flex:1,
        justifyContent: 'flex-end',
    },
    gridView: {
        flex: 1,
        paddingTop:5,
    },
    container:{
        flex:1,
        backgroundColor:'#fff'
    },
    popoverContent: {
        width: 100,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    popoverText: {
        color: '#ccc',
        fontSize:14
    },
    itemStyle:{
        height: 150,
        width:150,
        padding:5
    }
});


const mapStateToProps = (state, ownProps) => {

    var personInfo=state.user.personInfo

    const props = {
        username:state.user.user.username,
        perName:personInfo.perName,
        personId:personInfo.personId,
        wechat:personInfo.wechat,
        perIdCard:personInfo.perIdCard,
    }
    return props
}



export default connect(mapStateToProps)(HomePage);



