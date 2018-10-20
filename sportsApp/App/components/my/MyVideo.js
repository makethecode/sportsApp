import React,{Component} from 'react';import {    Alert,    Dimensions,    ListView,    ScrollView,    Image,    View,    StyleSheet,    Text,    Platform,    TouchableOpacity,    RefreshControl,    Animated,    Easing,    DeviceEventEmitter} from 'react-native'import {connect} from 'react-redux'import {Toolbar,OPTION_SHOW,OPTION_NEVER,ACTION_ADD} from 'react-native-toolbar-wrapper';import ViewPager from 'react-native-viewpager'import AddVideo from './AddVideo';import Ionicons from 'react-native-vector-icons/Ionicons'import Bridge from '../../native/Bridge'import GridView from 'react-native-super-grid';import Config from '../../../config';import Proxy from '../../utils/Proxy';import setting from './Setting'var {height,width} = Dimensions.get('window');var IMGS = [    require('../../../img/zhibo1.jpeg'),    require('../../../img/zhibo2.jpeg'),    require('../../../img/zhibo3.jpeg'),];class MyVideo extends Component{    constructor(props){        var ds=new ViewPager.DataSource({pageHasChanged:(p1,p2)=>p1!==p2});        super(props);        this.state={            isRefreshing:false,            activity:{name:"sda"},            playingList:[],            code_url:null,            dataSource:ds.cloneWithPages(IMGS),        };    }    navigate2AddVideo(){        const { navigator } = this.props;        if (navigator){            navigator.push({                name: 'addVideo',                component:AddVideo,                params:{                }            })        }    }    _renderPage(data,pageID){        return (            <View style={{width:width}}>                <Image                    source={data}                    style={{width:width,flex:3}}                    resizeMode={"stretch"}                />            </View>        );    }    render(){        return(            <View style={styles.container}>                <Toolbar width={width} title="我的视频" navigator={this.props.navigator} actions={[{icon:ACTION_ADD,show:OPTION_SHOW}]}                         onPress={(i)=>{                             if(i==0){                                 //添加视频                                 this.navigate2AddVideo();                             }                         }}>                    <ScrollView style={{flex:1,height:height-100,width:width,backgroundColor:'#fff',flexDirection:'column'}}>                        <View style={{width:width,height:140}}>                            <ViewPager                                style={this.props.style}                                dataSource={this.state.dataSource}                                renderPage={this._renderPage}                                isLoop={true}                                autoPlay={true}                            />                        </View>                        <View style={{width:width,height:30,justifyContent:'center',paddingHorizontal:5,backgroundColor:'#eee'}}>                            <Text style={{fontSize:13,color:'#666'}}>我发布的视频</Text>                        </View>                        <View style={{flex:1,alignItems:'center',justifyContent:'center',flexDirection:'column',padding:2}}>                            <GridView                                itemsPerRow={2}                                spacing={2}                                items={this.state.playingList}                                style={styles.gridView}                                renderItem={this.renderRow.bind(this)}                            />                        </View>                    </ScrollView>                </Toolbar>            </View>        )    }    renderRow(rowData,rowId)    {        //{brief=单纯测试, longbrief=单纯测试1111, snapShotUrl=http://live-snapshot/sportshot/EEvvee.jpg,        // personId=4, perNum=lxq, id=5, title=reTest的直播间, playUrl=rtmp://pili-live-rtmp.sportshot.cn/sportshot/EEvvee}        return(            <TouchableOpacity style={{height:150,width:width/2-10,}}                              onPress={()=>{                                  //播放source1的直播                                  var playUrl = rowData.playUrl                                  var liveId = rowData.id                                  var personId = this.props.personId                                  Bridge.playVideo(playUrl,liveId,personId)                              }}            >                <Image style={{height:150,width:width/2-10,padding:5,}} source={require('../../../img/zhibo1.jpeg')} resizeMode={'stretch'}>                    <View style={{flex:6,backgroundColor:'transparent'}}>                        <Text style={[styles.itemName,{backgroundColor:'transparent'}]}>{rowData.title}</Text>                        <Text style={[styles.itemCode,{backgroundColor:'transparent'}]}>{rowData.brief}</Text>                    </View>                    <View style={{flex:1,backgroundColor:'transparent',flexDirection:'row'}}>                        <Ionicons name={'md-person'} size={13} color="#fff"/>                        <Text style={[styles.itemPlayer,{backgroundColor:'transparent',marginLeft:6}]}>{rowData.perNum}</Text>                    </View>                </Image>            </TouchableOpacity>        );    }    componentWillMount(){        //获得正在直播的房间        Proxy.postes({            url: Config.server + '/func/allow/getRtmpPlayUrl',            headers: {                'Content-Type': 'application/json'            },            body: {}        }).then((json) => {            this.setState({playingList:json.data})            //this.props.dispatch(updatePlayingUrls({ url:json.data }));        }).catch((e) => {            reject(e)        })        this.Listener = DeviceEventEmitter.addListener('addDanmaku',(data)=>{            proxy.postes({                url: Config.server + '/func/allow/addDanMaKu',                headers: {                    'Content-Type': 'application/json'                },                body: {                    //如何获得直播间id?                    liveId:1,                    text:data,                }            }).then((json) => {                if(json.re==1){                    console.log('success')                }                else{                    console.log('fail')                }            }).catch((err) => {                alert(err);            });        })    }    componentWillUnmount(){        this.Listener.remove();    }}const styles = StyleSheet.create({    container:{      flex:1,backgroundColor:'#eee'    },})//// const mapStateToProps = (state,ownProps) => {//     var personInfo = state.user.personInfo//     const props = {//         personId:personInfo.personId//     }//     return props//// }// export default connect(mapStateToProps)(MyVideo);module.exports = connect(state=>({        personId:state.user.personInfo.personId,    }))(MyVideo);