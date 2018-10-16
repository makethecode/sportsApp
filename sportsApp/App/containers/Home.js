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
import Mall from './mall/FirstPage';
import Activity from '../components/groupActivity/Activity';
import Competition from '../components/competition/CompetitionPage';
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
} from '../action/UserActions';
import EmptyFilter from '../utils/EmptyFilter'
import  {
    getRTMPPushUrl
} from '../action/LiveActions';

import HomePage from '../components/live/HomePage'
import NewsDetail from '../components/news/NewsDetail'

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

    navigate2CoachMessage(){
        const { navigator } = this.props;
        if(navigator) {
            navigator.push({
                name: 'CoachMressage',
                component: CoachMessage,
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

    dateFormat(date)
    {
        //object时间转时间格式"yyyy-mm-dd hh:mm:ss"
        return (new Date(date)).toLocaleDateString() + " " + (new Date(date)).toLocaleTimeString();
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
        }
    }


    render() {

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
            this.props.userType==1?
                <View style={{flex:1,backgroundColor:'#fff'}}>

                    <View style={{flex:1}}>

                        <View style={{width:width,flex:2}}>
                            <Image
                                source={ require('../../img/tt1@2x.png')}
                                style={{width:width,flex:3}}
                                resizeMode={"stretch"}
                            >
                                <View style={{height:55,width:width,paddingTop:20,flexDirection:'row',justifyContent:'center',alignItems: 'center',
                backgroundColor:'transparent',borderBottomWidth:1,borderColor:'transparent',}}>
                                    <TouchableOpacity style={{flex:1,justifyContent:'center',alignItems: 'center',}}
                                                      onPress={()=>{this.goBack();}}>

                                    </TouchableOpacity>
                                    <View style={{flex:3,justifyContent:'center',alignItems: 'center',}}>

                                    </View>
                                    <TouchableOpacity style={{flex:1,justifyContent:'center',alignItems: 'center',}}
                                                      onPress={()=>{ _scrollView.scrollToEnd({animated: true});}}>

                                        {/*<Text> 底部</Text>*/}
                                    </TouchableOpacity>
                                </View>

                            </Image>
                        </View>

                        {/*内容区*/}
                        <View style={{flex:6,justifyContent:'center',backgroundColor:'#eee'}}>

                            <View style={{flex:2,backgroundColor:'#fff',padding:0,marginBottom:10}}>
                                <View style={{flex:1,flexDirection:'row',justifyContent:'center',alignItems: 'center',}}>

                                    <TouchableOpacity style={{flex:1,justifyContent:'flex-start',alignItems:'center',padding:8}}
                                                      onPress={ ()=>{
                                             this.navigate2BadmintonCourse();
                                             //this.navigate2BadmintonCourseForCoach();

                                          }}>
                                        {/*<CommIcon name="tag-plus" size={32} color="#0adc5e" style={{backgroundColor:'transparent'}}/>*/}
                                        <Image resizeMode="stretch" source={require('../../img/dingzhi@2x.png')} />
                                        <View style={{marginTop:0,paddingTop:15}}>
                                            <Text style={{fontSize:13,color:'#646464'}}>课程</Text>
                                        </View>
                                    </TouchableOpacity>

                                    <TouchableOpacity style={{flex:1,justifyContent:'flex-start',alignItems:'center',padding:5}}
                                                      onPress={ ()=>{
                                        this.navigate2Activity();
                                      }}>
                                        <Image resizeMode="stretch" source={require('../../img/dd@2x.png')} />
                                        <View style={{marginTop:0,paddingTop:15}}>
                                            <Text style={{fontSize:13,color:'#646464'}}>活动</Text>
                                        </View>
                                    </TouchableOpacity>

                                    <TouchableOpacity style={{flex:1,justifyContent:'flex-start',alignItems:'center',padding:5}}
                                                      onPress={ ()=>{
                                                         this.navigate2Competition()
                                       }}>
                                        {/*<Icon name="video-camera" size={30} color="#8968CD" />*/}
                                        <Image resizeMode="stretch" source={require('../../img/zhibo-@2x.png')} />
                                        <View style={{marginTop:0,paddingTop:15}}>
                                            <Text style={{fontSize:13,color:'#646464'}}>比赛</Text>
                                        </View>
                                    </TouchableOpacity>

                                    <TouchableOpacity style={{flex:1,justifyContent:'flex-start',alignItems:'center',padding:5}}
                                                      onPress={ ()=>{
                                          this.navigate2Mall();
                                      }}>
                                        <Image resizeMode="stretch" source={require('../../img/shangc-@2x.png')} />
                                        <View style={{marginTop:0,paddingTop:15}}>
                                            <Text style={{fontSize:13,color:'#646464'}}>商城</Text>
                                        </View>
                                    </TouchableOpacity>

                                </View>

                            </View>


                            <View style={{flex:5,flexDirection:'row',justifyContent:'center',alignItems: 'center',backgroundColor:'#fff',marginBottom:10}}>
                                {newsList}
                            </View>

                        </View>
                    </View>
                </View>
                :
            <View style={{flex:1,backgroundColor:'#fff'}}>
                    <View style={{flex:1}}>
                        <View style={{width:width,flex:2.5}}>
                            <Image
                                source={ require('../../img/tt1@2x.png')}
                                style={{width:width,flex:3}}
                                resizeMode={"stretch"}
                            >
                            <View style={{height:55,width:width,paddingTop:20,flexDirection:'row',justifyContent:'center',alignItems: 'center',
                backgroundColor:'transparent',borderBottomWidth:1,borderColor:'transparent',}}>
                                <TouchableOpacity style={{flex:1,justifyContent:'center',alignItems: 'center',}}
                                      onPress={()=>{this.goBack();}}>

                                </TouchableOpacity>

                                <TouchableOpacity style={{flex:1,justifyContent:'center',alignItems: 'center',}}
                                                  onPress={()=>{ _scrollView.scrollToEnd({animated: true});}}>

                                    {/*<Text> 底部</Text>*/}
                                </TouchableOpacity>
                            </View>

                            </Image>
                        </View>

                        {/*内容区*/}
                        <View style={{flex:8,justifyContent:'center',backgroundColor:'#eee'}}>

                            <View style={{flex:5,backgroundColor:'#fff',padding:0,marginBottom:10}}>
                                 <View style={{flex:1,flexDirection:'column',justifyContent:'center',alignItems: 'center',}}>
                                    <View
                                        style={{flex:1,flexDirection:'row',justifyContent:'center',alignItems: 'center',}}>

                                        <TouchableOpacity
                                            style={{flex:1,justifyContent:'flex-start',alignItems:'center',padding:5}}
                                            onPress={ ()=>{
                                             this.navigate2BadmintonCourse();
                                             //this.navigate2BadmintonCourseForCoach();

                                          }}>
                                            {/*<CommIcon name="tag-plus" size={32} color="#0adc5e" style={{backgroundColor:'transparent'}}/>*/}
                                            <Image resizeMode="stretch" source={require('../../img/dingzhi@2x.png')}/>
                                            <View style={{marginTop:0,paddingTop:15}}>
                                                <Text style={{fontSize:13,color:'#646464'}}>课程制定</Text>
                                            </View>
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            style={{flex:1,justifyContent:'flex-start',alignItems:'center',padding:5}}
                                            onPress={ ()=>{
                                        this.navigate2Activity();
                                        //this.navigate2CoachMessage();
                                      }}>
                                            <Image resizeMode="stretch" source={require('../../img/dd@2x.png')}/>
                                            <View style={{marginTop:0,paddingTop:15}}>
                                                <Text style={{fontSize:13,color:'#646464'}}>活动</Text>
                                            </View>
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            style={{flex:1,justifyContent:'flex-start',alignItems:'center',padding:5}}
                                            onPress={ ()=>{
                                                this.navigate2Mall();
                                            }}>

                                            {/*<Icon name="shopping-cart" size={36} color="#EEAD0E" style={{backgroundColor:'transparent'}}/>*/}
                                            <Image resizeMode="stretch" source={require('../../img/shangc-@2x.png')}/>
                                            <View style={{marginTop:0,paddingTop:15}}>
                                                <Text style={{fontSize:13,color:'#646464'}}>商城</Text>
                                            </View>
                                        </TouchableOpacity>

                                    </View>

                                    < View style={{
                                flex: 1,
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}>

                                        <TouchableOpacity
                                            style={{flex:1,justifyContent:'flex-start',alignItems:'center',padding:5}}
                                            onPress={ ()=>{
                                                this.navigate2Competition()
                                            }}>
                                            {/*<Icon name="video-camera" size={30} color="#8968CD" />*/}
                                            <Image resizeMode="stretch" source={require('../../img/zhibo-@2x.png')}/>
                                            <View style={{marginTop:0,paddingTop:15}}>
                                                <Text style={{fontSize:13,color:'#646464'}}>比赛</Text>
                                            </View>
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            style={{flex:1,justifyContent:'flex-start',alignItems:'center',padding:5}}
                                            onPress={ ()=>{
                                                this.navigate2Profit();
                                            }}>

                                            {/*<Icon name="shopping-cart" size={36} color="#EEAD0E" style={{backgroundColor:'transparent'}}/>*/}
                                            <Image resizeMode="stretch" source={require('../../img/shangc-@2x.png')}/>
                                            <View style={{marginTop:0,paddingTop:15}}>
                                                <Text style={{fontSize:13,color:'#646464'}}>收益</Text>
                                            </View>
                                        </TouchableOpacity>

                                <TouchableOpacity
                                    style={{flex:1,justifyContent:'flex-start',alignItems:'center',padding:5}}
                                    onPress={ ()=>{
                                        this.navigate2Statistics();
                                        //this.navigate2CoachMessage();
                                      }}>
                                    <Image resizeMode="stretch" source={require('../../img/dd@2x.png')}/>
                                    <View style={{marginTop:0,paddingTop:15}}>
                                        <Text style={{fontSize:13,color:'#646464'}}>统计</Text>
                                    </View>
                                </TouchableOpacity>

                                    </View>
                              </View>

                            </View>
                            <View style={{flex:5,flexDirection:'row',justifyContent:'center',alignItems: 'center',backgroundColor:'#fff',marginBottom:10}}>
                                {newsList}
                            </View>

                        </View>
                    </View>

            </View>

        );
    }

    componentDidMount()
    {
        InteractionManager.runAfterInteractions(() => {

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

        });

        this.Listener = DeviceEventEmitter.addListener('news',(data)=>{
            var newsList = data.result;
            this.setState({news:newsList});
        })

    }

    componentWillUnmount(){
        this.Listener.remove();
    }

}

var styles = StyleSheet.create({

    container: {
        flex: 1,
    },
    flexContainer: {
        flexDirection: 'row',
    },
});

async function updateEvents() {
    try {
        var events=await CalendarManager.testCallbackEventTwo();
        alert(events)
    } catch (e) {
        console.error(e);
    }
}

const mapStateToProps = (state, ownProps) => {

    var personInfo=state.user.personInfo;
    var personInfoAuxiliary = state.user.personInfoAuxiliary;
    var trainerInfo=state.user.trainer

    const props = {
        userType:parseInt(state.user.personInfo.perTypeCode),
    }

    // if(trainerInfo)
    // {
    //     props.sportLevelValidateFailed=(!(trainerInfo.sportLevel!==undefined&&trainerInfo.sportLevel!==null))//运动水平没验证
    //     props.perNameValidateFailed=(!(personInfo.perName&&personInfo.perName!=''))//真实姓名没验证
    //     props.perIdCardValidateFailed=(!(personInfo.perIdCard&&personInfo.perIdCard!=''))//身份证没验证
    // }
    //
    // //手机号没验证
    // if(mobilePhone&&mobilePhone!=''&&checkedMobile==true)
    //     props.mobilePhoneValidateFailed=false
    // else
    //     props.mobilePhoneValidateFailed=true

    return props
}

export default connect(mapStateToProps)(Home);


