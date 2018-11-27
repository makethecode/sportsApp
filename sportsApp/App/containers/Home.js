import React, {Component} from 'react';
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
    Easing,
    Alert,
    InteractionManager,
    Linking,
    DeviceEventEmitter,
} from 'react-native';
import {connect} from 'react-redux';
import ViewPager from 'react-native-viewpager';
import BadmintonCourse from '../components/course/BadmintonCourseRecord';
import MyProfit from '../components/my/Myprofit'
import Mall from './mall/MallPage';
import Activity from '../components/groupActivity/Activity';
import Competition from '../components/competition/CompetitionList';
import Statistics from '../components/statistics/MainStatistics';
import SexModal from '../components/groupActivity/SexModal';
import CoachMessage from '../components/my/MyInformation'
import PopupDialog,{ScaleAnimation} from 'react-native-popup-dialog';
import { NativeModules } from "react-native";
import MobilePhoneModal from '../components/my/modal/ValidateMobilePhoneModal';
import ValidateMyInformationModal from '../components/my/modal/ValidateMyInformationModal';
import Bridge from '../native/Bridge'
import LiveHome from '../components/live/LiveHome'
import {
    getNewsInfo,
    fetchNewsInfo,
    updateNewsInfo
} from '../action/NewsActions';
import {
    updateMobilePhone,
    onMobilePhoneUpdate,
    verifyMobilePhone,
    fetchClubList,
    getAccessToken,
    fetchMemberInformation, updatePortrait
} from '../action/UserActions';
import EmptyFilter from '../utils/EmptyFilter'
import  {
    getRTMPPushUrl
} from '../action/LiveActions';
import HomePage from '../components/live/HomePage'
import NewsDetail from '../components/news/NewsDetail'
import NewsList from '../components/my/NewsList'
import MyVideo from '../components/my/MyVideo';
import TrailStudent from '../components/trailClass/TrailStudentList'
import Config from "../../config";
import Proxy from "../utils/Proxy";
import GridView from 'react-native-super-grid'

var {height, width} = Dimensions.get('window');
var IMGS = [
    require('../../img/tt1@2x.png'),
    require('../../img/tt2@2x.jpeg'),
    require('../../img/tt3@2x.jpeg'),
    require('../../img/tt4@2x.jpeg'),
];
const CalendarManager = NativeModules.CalendarManager;
const scaleAnimation = new ScaleAnimation();

class Home extends Component {

    navigate2Activity(){
        const { navigator } = this.props;

        if(navigator) {
            navigator.push({
                name: 'Activity',
                component: Activity,
                params: {
                }
            })
        }
    }

    navigate2Competition(){
        const { navigator } = this.props;
        if(navigator) {
            navigator.push({
                name: 'competition',
                component: Competition,
                params: {

                }
            })
        }
    }

    navigate2Statistics(){
        const { navigator } = this.props;
        if(navigator) {
            navigator.push({
                name: 'statistics',
                component: Statistics,
                params: {

                }
            })
        }
    }

    navigate2Mall(){
        const { navigator } = this.props;
        if(navigator) {
            navigator.push({
                name: 'mall',
                component: Mall,
                params: {

                }
            })
        }
    }

    //课程定制
    navigate2BadmintonCourse()
    {
        const {navigator} =this.props;

        if(navigator) {
            navigator.push({
                name: 'BadmintonCourse',
                component: BadmintonCourse,
                params: {
                }
            })
        }
    }

    //课程定制
    navigate2Profit()
    {
        const {navigator} =this.props;

        if(navigator) {
            navigator.push({
                name: 'MyProfit',
                component: MyProfit,
                params: {
                }
            })
        }
    }

    navigate2LiveHome()
    {
        const {navigator} =this.props;
        if(navigator) {
            navigator.push({
                name: 'HomePage',
                component: HomePage,
                params: {
                }
            })
        }
    }

    navigate2NewsDetail(docid)
    {
        const {navigator} =this.props;
        if(navigator) {
            navigator.push({
                name: 'NewsDetail',
                component: NewsDetail,
                params: {
                    docid:docid
                }
            })
        }
    }

    //新闻
    navigate2NewsList(){
        const { navigator } = this.props;
        if(navigator) {
            navigator.push({
                name: 'NewsList',
                component: NewsList,
                params: {

                }
            })
        }
    }

    //视频
    navigate2MyVideo(){
        const { navigator } = this.props;
        if(navigator) {
            navigator.push({
                name: 'MyVideo',
                component: MyVideo,
                params: {

                }
            })
        }
    }

    //试课
    navigate2TrailStudent(){
        const { navigator } = this.props;
        if(navigator) {
            navigator.push({
                name: 'TrailStudent',
                component: TrailStudent,
                params: {
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

    renderRow(rowData,sectionId,rowId){

            return (
                <TouchableOpacity style={{flexDirection:'row',borderBottomWidth:1,borderColor:'#ddd',padding:5}}
                                  onPress={()=>{
                                      //Linking.openURL("http://114.215.99.2:8880/news/"+rowData.newsNum+"/index.html").catch(err => console.error('An error occurred', err));
                                      this.navigate2NewsDetail(rowData.docid)
                                  }}
                >

                        <View style={{
                            flexDirection: 'column',
                            width: 100,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <Image resizeMode="stretch" style={{width: 100, height: 75}}
                                   source={{uri: rowData.imgsrc}}
                            />
                        </View>
                    <View style={{flex:1,flexDirection:'column',alignItems:'flex-start'}}>
                        <View style={{padding:4,paddingHorizontal:12}}>
                            <Text style={{color:'#666',fontSize:16}}>
                                {rowData.title}
                            </Text>
                        </View>

                        <View style={{paddingTop:12,paddingBottom:4,flexDirection:'row',alignItems:'center'}}>

                            <View style={{padding:4,paddingHorizontal:12,}}>
                                <Text style={{color:'#888',fontSize:11}}>
                                    {rowData.ptime}
                                </Text>
                            </View>
                        </View>
                    </View>

                </TouchableOpacity>
            );
        }

    constructor(props) {
        super(props);
        var ds = new ViewPager.DataSource({pageHasChanged: (p1, p2) => p1 !== p2});
        this.state = {
            dataSource: ds.cloneWithPages(IMGS),
            isRefreshing:false,
            news:null,
            appItemList:[],
        }
    }


    render() {

        var appItemList = this.state.appItemList;

        var newsList=null
        if(this.state.news&&this.state.news.length>0)
        {
            var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
            newsList=(
                <ScrollView
                    ref={(scrollView) => { _scrollView = scrollView; }}
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
                    onScrollEndDrag={(event)=>{
                       var offsetY=event.nativeEvent.contentOffset.y
                       var limitY=event.nativeEvent.layoutMeasurement.height
                       console.log(offsetY+' , '+limitY)
                    }}
                >
                    <ListView
                        automaticallyAdjustContentInsets={false}
                        dataSource={ds.cloneWithRows(this.state.news)}
                        renderRow={this.renderRow.bind(this)}
                    />
                </ScrollView>
            );
        }

        return (

            <View style={{flex:1,backgroundColor:'#fff'}}>
                    <View style={{flex:1}}>
                        {/*顶端*/}
                        <View style={{width:width,flex:2}}>
                            <Image
                                source={ require('../../img/tt1@2x.png')}
                                style={{width:width,flex:3}}
                                resizeMode={"stretch"}
                            />
                        </View>
                        {/*功能列表*/}
                        <View style={{flex:6}}>
                        <View style={{height:200,width:width,justifyContent:'center',backgroundColor:'#fff'}}>
                            <View style={{flex:1,width:width,alignItems:'flex-start',justifyContent:'flex-start',flexDirection:'row'}}>
                                <GridView
                                    itemDimension={width/4-20}
                                    items={appItemList}
                                    style={styles.gridView}
                                    renderItem={this.renderAppRow.bind(this)}
                                />
                            </View>
                        </View>
                        {/*新闻列表*/}
                            <View style={{height:1,width:width,backgroundColor:'#ddd',justifyContent:'center',alignItems:'flex-start'}}/>
                        <View style={{flex:1,flexDirection:'row',justifyContent:'center',alignItems: 'center',backgroundColor:'#fff',marginBottom:10}}>
                                {newsList}
                        </View>
                        </View>

                        </View>
                    </View>
        );
    }

    renderAppRow(rowData,rowId)
    {

        // {'name':'活动','id':0,'isShow':false},

        var img = '';

        switch(rowData.id){
            case 0:img = require('../../img/mini_activity.png');break;//活动
            case 1:img = require('../../img/mini_course.png');break;//课程
            case 2:img = require('../../img/mini_competition.png');break;//比赛
            case 3:img = require('../../img/mini_mall.png');break;//商城
            case 4:img = require('../../img/mini_video.png');break;//视频
            case 5:img = require('../../img/mini_news.png');break;//新闻
            case 6:img = require('../../img/mini_statistic.png');break;//统计
            case 7:img = require('../../img/mini_trial.png');break;//试课
        }

        return(
            <TouchableOpacity style={{flex:1,flexDirection:'column',}}
            onPress={()=>{
                switch(rowData.id){
                    case 0:this.navigate2Activity();break;//活动
                    case 1:this.navigate2BadmintonCourse();break;//课程
                    case 2:this.navigate2Competition();break;//比赛
                    case 3:this.navigate2Mall();break;//商城
                    case 4:this.navigate2MyVideo();break;//视频
                    case 5:this.navigate2NewsList();break;//新闻
                    case 6:this.navigate2Profit();break;//统计
                    case 7:this.navigate2TrailStudent();break;//试课
                }
            }}>
                <View style={{flex:5,padding:5,justifyContent:'center',alignItems:'center'}}>
                    <View style={{height:60,width:60,padding:10,justifyContent:'center',alignItems:'center'}}>
                        <Image style={{height:45,width:45}}
                               source={img} resizeMode={'stretch'}/>
                    </View>
                    <Text style={{flex:2,marginTop:5,color:'#666',fontSize:13,textAlign:'center'}}>{rowData.name}</Text>
                </View>
            </TouchableOpacity>
        );
    }


    componentDidMount()
    {

            //只是用于ios不适用于android
            //通过网易新闻的接口获取新闻
            //体育类T1348649079062

            if(Platform.OS == 'ios' )
                {
                    //ios用网易接口
                    var newsKey = 'T1348649079062';
                    this.props.dispatch(getNewsInfo()).then((json)=>{
                        this.setState({
                        news:json
                    });
                })}
                else
                {
                    // //安卓用数据库
                    // this.props.dispatch(fetchNewsInfo()).then((json)=>{
                    //     this.setState({
                    //         news:json.data
                    //     })
                    // })
                    Bridge.getNews();

                }

                this.fetchAppItemList()

        this.Listener = DeviceEventEmitter.addListener('news',(data)=>{
            var newsList = data.result;
            this.setState({news:newsList});
        })

        this.itemListener = DeviceEventEmitter.addListener('item',(data)=>{
            this.fetchAppItemList();
        })

        this.fetchMemberInformation(this.props.personId)

    }
    fetchMemberInformation(personId){
        this.props.dispatch(fetchMemberInformation(personId)).then((json)=> {
            if(json.re==-100){
                this.props.dispatch(getAccessToken(false));
            }
            this.setState({member:json.data})
            this.props.dispatch(updatePortrait(json.data.avatar));
        }).catch((e)=>{
            alert(e)
        });
    }

    componentWillUnmount(){
        if(this.Listener)this.Listener.remove();
        if(this.itemListener)this.itemListener.remove();

    }

    fetchAppItemList(){

        Proxy.postes({
            url: Config.server + '/func/node/getAppItemList',
            headers: {
                'Content-Type': 'application/json',
            },
            body: {
                personId:this.props.personId,
            }
        }).then((json)=>{

            var appItemList = [];

            for(var i=0;i<json.data.length;i++){
                if(json.data[i].isShow)appItemList.push(json.data[i])
            }

            this.setState({appItemList:appItemList})

        }).catch((e)=>{
        })

    }

}

var styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor:'#fff'
    },
    flexContainer: {
        flexDirection: 'row',
    },
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
        flex: 1
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
    },
    cardItemTimeRemainTxt:{
        fontSize:13,
        color:'#666'
    }
});

const mapStateToProps = (state, ownProps) => {

    var personInfo=state.user.personInfo;
    var personInfoAuxiliary = state.user.personInfoAuxiliary;
    var trainerInfo=state.user.trainer

    const props = {
        userType:parseInt(state.user.personInfo.perTypeCode),
        personId:personInfo.personId,
    }

    return props
}

export default connect(mapStateToProps)(Home);


