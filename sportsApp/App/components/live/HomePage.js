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
    BackAndroid
} from 'react-native';
import {connect} from 'react-redux';
import TextInputWrapper from 'react-native-text-input-wrapper';
import QRCode from 'react-native-qrcode'
import Bridge from '../../native/Bridge'
import GridView from 'react-native-super-grid'
import {
    wechatPay,
} from '../../action/UserActions';
import {
    fetchActivityList,disableActivityOnFresh,enableActivityOnFresh,signUpActivity,fetchEventMemberList,exitActivity,exitFieldTimeActivity,signUpFieldTimeActivity
} from '../../action/ActivityActions';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Toolbar,OPTION_SHOW,OPTION_NEVER} from 'react-native-toolbar-wrapper'
import {getAccessToken,} from '../../action/UserActions';
import  {
    getRTMPPushUrl,
    updatePlayingUrls,
} from '../../action/LiveActions';
import Config from "../../../config";
import Proxy from "../../utils/Proxy";
var {height, width,scale} = Dimensions.get('window');
var WeChat = require('react-native-wechat');
class HomePage extends Component{
    goBack(){
        const { navigator } = this.props;
        if(navigator) {
            navigator.pop();
        }
    }

    constructor(props) {
        super(props);
        this.state={
            isRefreshing:false,
            activity:{name:"sda"},
           playingList:[],
            code_url:null,
        };
    }

    render(){

        const items = [
            { name: 'TURQUOISE', code: '#1abc9c' }, { name: 'EMERALD', code: '#2ecc71' },
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
                <Toolbar width={width} title="直播间" actions={[]} navigator={this.props.navigator}>

                    <View style={{flex:1,height:height-100,width:width,backgroundColor:'#66CDAA',padding:5,flexDirection:'column'}}>

                        <View style={{flex:2,padding:10,margin:5,alignItems:'center',justifyContent:'center'}}>
                            <View style={{flex:1}}>

                                <TouchableOpacity style={{flex:1,width:0.9*width,alignItems:'center',justifyContent:'center',backgroundColor:'grey',borderWidth:2,borderRadius:10,borderColor:'black',}}
                                    onPress={()=>{

                                        this.props.dispatch(getRTMPPushUrl(this.props.personId)).then((json)=>{
                                            var urlsList=null;
                                            var pushUrl=null;
                                            if(json.re==1){
                                                urlsList=json.json;
                                                pushUrl=urlsList.rtmppushurl;
                                                Bridge.raisePLStream(pushUrl);
                                            }else{

                                                alert('申请地址失败');
                                                //TODO:微信分享邀请好友

                                            }
                                        });

                                    }}>
                                    {/*<Icon name={'plug'} size={50} color={'#aaa'}/>*/}
                                    <Text style={{fontSize:20,color:'#fff',fontWeight:'bold'}}>---您尚未开播---</Text>
                                    <Text style={{fontSize:16,color:'#fff',fontWeight:'bold'}}>点击开播</Text>
                                </TouchableOpacity>

                            </View>
                        </View>

                        <View style={{flex:2,padding:10,margin:5,alignItems:'center',justifyContent:'center',flexDirection:'column'}}>
                            <GridView
                                itemDimension={130}
                                items={this.state.playingList}
                                style={styles.gridView}
                                renderItem={item => (
                                    <TouchableOpacity style={[styles.itemContainer, { backgroundColor: '#7f8c8d' }]}>
                                        <Text style={styles.itemName}>{item.title}</Text>

                                        <Text style={styles.itemCode}>{item.brief}</Text>
                                    </TouchableOpacity>
                                )}
                            />
                        </View>

                    </View>

                </Toolbar>
            </View>
        )
    }

    componentWillMount(){

        Proxy.postes({
            url: Config.server + '/func/allow/getRtmpPlayUrl',
            headers: {
                'Content-Type': 'application/json'
            },
            body: {}

        }).then((json) => {
            this.setState({playingList:json.data.data})
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
        fontWeight: '600',
    },
    itemCode: {
        fontWeight: '600',
        fontSize: 12,
        color: '#fff',
    },
    itemContainer: {
        justifyContent: 'flex-end',
        borderRadius: 5,
        padding: 10,
        height: 150,
    },
    gridView: {
        paddingTop: 25,
        flex: 1,
    },
    container:{
        flex:1,
        backgroundColor:'#66CDAA'
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
        playingList:state.playingList
    }
    return props
}



export default connect(mapStateToProps)(HomePage);



