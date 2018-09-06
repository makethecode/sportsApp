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
    Linking
} from 'react-native';

import {connect} from 'react-redux';
var {height, width} = Dimensions.get('window');
import ViewPager from 'react-native-viewpager';


import BadmintonCourse from '../components/course/BadmintonCourseRecord';
import MyProfit from '../components/my/Myprofit'
import Mall from './mall/FirstPage';
import Activity from '../components/groupActivity/Activity';
import Competition from '../components/competition/CompetitionList';
import Statistics from '../components/statistics/MainStatistics';
import SexModal from '../components/groupActivity/SexModal';
import CoachMessage from '../components/my/MyInformation'
import PopupDialog,{ScaleAnimation} from 'react-native-popup-dialog';
const scaleAnimation = new ScaleAnimation();
import { NativeModules } from "react-native";
const CalendarManager = NativeModules.CalendarManager;
import MobilePhoneModal from '../components/my/modal/ValidateMobilePhoneModal';
import ValidateMyInformationModal from '../components/my/modal/ValidateMyInformationModal';
import Bridge from '../native/Bridge'
import LiveHome from '../components/live/LiveHome'
import HomePage from '../components/live/HomePage'
import {
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

import  {
    getRTMPPushUrl
} from '../action/LiveActions';

var IMGS = [
    require('../../img/tt1@2x.png'),
    require('../../img/tt2@2x.jpeg'),
    require('../../img/tt3@2x.jpeg'),
    require('../../img/tt4@2x.jpeg'),
];
import {
    fetchMaintainedVenue
} from '../action/MapActions';
import ModalDropdown from 'react-native-modal-dropdown';

const dropdownWidth = width/3;

class Home extends Component {

    navigate2Activity(){
        const { navigator } = this.props;

        var clubflag = false;
        var clubId = -1;
        var venueId = -1;
        var typeId = -1;
        for(var i=0;i<this.state.clubs.length;i++)
            if(this.state.clubs[i].name == this.state.clubName)
            {
                clubId=this.state.clubs[i].id;
                clubflag = true;
            }
        if(clubflag==false)clubId = -1;

        var venueflag = false;
        for(var i=0;i<this.state.venues.length;i++)
            if(this.state.venues[i].name == this.state.venueName)
            {
                venueId = this.state.venues[i].unitId;
                venueflag = true
            }
        if(venueflag==false)venueId = -1;

        if(navigator) {
            navigator.push({
                name: 'Activity',
                component: Activity,
                params: {
                    clubId:clubId,
                    venueId:venueId,
                    typeId:typeId,
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
        var clubflag = false;
        var clubId = -1;
        var venueId = -1;
        var typeId = -1;
        for(var i=0;i<this.state.clubs.length;i++)
            if(this.state.clubs[i].name == this.state.clubName)
            {
                clubId=this.state.clubs[i].id;
                clubflag = true;
            }
        if(clubflag==false)clubId = -1;

        var venueflag = false;
        for(var i=0;i<this.state.venues.length;i++)
            if(this.state.venues[i].name == this.state.venueName)
            {
                venueId = this.state.venues[i].unitId;
                venueflag = true
            }
        if(venueflag==false)venueId = -1;

        if(navigator) {
            navigator.push({
                name: 'BadmintonCourse',
                component: BadmintonCourse,
                params: {
                    clubId:clubId,
                    venueId:venueId,
                    typeId:typeId,
                }
            })
        }
    }

    //课程定制
    navigate2Profit()
    {
        const {navigator} =this.props;
        var clubflag = false;
        var clubId = -1;
        var venueId = -1;
        var typeId = -1;
        for(var i=0;i<this.state.clubs.length;i++)
            if(this.state.clubs[i].name == this.state.clubName)
            {
                clubId=this.state.clubs[i].id;
                clubflag = true;
            }
        if(clubflag==false)clubId = -1;

        var venueflag = false;
        for(var i=0;i<this.state.venues.length;i++)
            if(this.state.venues[i].name == this.state.venueName)
            {
                venueId = this.state.venues[i].unitId;
                venueflag = true
            }
        if(venueflag==false)venueId = -1;

        if(navigator) {
            navigator.push({
                name: 'MyProfit',
                component: MyProfit,
                params: {
                    club:clubId,
                    venueId:venueId,
                    typeId:typeId,
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
        return(
            <TouchableOpacity style={{flexDirection:'row',borderBottomWidth:1,borderColor:'#ddd',marginTop:4,padding:5}}
                onPress={()=>{
                    {/*this.props.dispatch(getNewsContentUrl(rowData.themeId)).then((json)=>{*/}
                        {/*if(json.re==1)*/}
                        {/*{*/}
                            {/*var url=json.data*/}
                            {/*this.navigate2NewsContentDetail(url)*/}
                        {/*}*/}
                    {/*})*/}

                    Linking.openURL("http://114.215.99.2:8880/news/"+rowData.newsNum+"/index.html").catch(err => console.error('An error occurred', err));

                }}
            >

                <View style={{flexDirection:'column',width:70,justifyContent:'center',alignItems:'center'}}>
                    <Image  resizeMode="stretch" style={{width:65,height:65}}
                    source={{uri: rowData.img}}
                    />

                </View>

                <View style={{flex:1,flexDirection:'column',alignItems:'flex-start'}}>
                    <View style={{padding:4,paddingHorizontal:12}}>
                        <Text style={{color:'#646464',fontWeight:'bold',fontSize:15}}>
                            {rowData.title}
                        </Text>
                    </View>

                    <View style={{padding:4,paddingHorizontal:12}}>
                        <Text style={{color:'#646464',fontSize:13}}>
                            {rowData.brief}
                        </Text>
                    </View>

                    <View style={{paddingTop:12,paddingBottom:4,paddingHorizontal:12,flexDirection:'row',alignItems:'center'}}>
                        <View style={{padding:4,paddingHorizontal:6,}}>
                            <Text style={{color:'#323232',fontSize:13}}>
                                阅读：{rowData.readCount}
                            </Text>
                        </View>

                        <View style={{padding:4,paddingHorizontal:6,}}>
                            <Text style={{color:'#323232',fontSize:13}}>
                                {this.dateFormat(rowData.createTime)}
                            </Text>
                        </View>
                    </View>
                </View>

            </TouchableOpacity>)
    }

    constructor(props) {
        super(props);
        var ds = new ViewPager.DataSource({pageHasChanged: (p1, p2) => p1 !== p2});
        this.state = {
            dataSource: ds.cloneWithPages(IMGS),
            isRefreshing:false,

            clubName:'俱乐部',
            venueName:'场馆',
            sportsType:'项目',
            showClubDropdown:false,
            showVenueDropdown:false,
            showTypeDropdown:false,
            clubList:[],clubs:[],
            venueList:[],venues:[],
            typeList:['羽毛球','乒乓球'],
        }
    }


    render() {

        let clubicon = this.state.showClubDropDown ? require('../../img/test_up.png') : require('../../img/test_down.png');
        let venueicon = this.state.showVenueDropDown ? require('../../img/test_up.png') : require('../../img/test_down.png');
        let typeicon = this.state.showTypeDropDown ? require('../../img/test_up.png') : require('../../img/test_down.png');

        var clubName_show = this.lengthFilter(this.state.clubName);
        var venueName_show = this.lengthFilter(this.state.venueName);
        var typeName_show = this.lengthFilter(this.state.sportsType);

        //针对教练,需要完成手机号，运动水平、真实姓名、身份证的验证
        if(this.props.userType==1){
            if(this.props.mobilePhoneValidateFailed==true&&this.mobilePhoneDialog&&this.validateMyInformationDialog)
            {
                this.validateMyInformationDialog.show()
            }
            else if((this.props.sportLevelValidateFailed==true||this.props.perNameValidateFailed==true||this.props.perIdCardValidateFailed==true)&&
                this.validateMyInformationDialog)
            {
                this.validateMyInformationDialog.show()
            }
        }

        //针对用户,需要完成手机号的验证
        if(this.props.userType==0){
            if(this.props.mobilePhoneValidateFailed==true&&this.mobilePhoneDialog&&this.validateMyInformationDialog)
            {
                this.mobilePhoneDialog.show()
            }
        }

        var newsList=null
        if(this.props.news&&this.props.news.length>0)
        {
            var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
            newsList=(
                <ScrollView
                    ref={(scrollView) => { _scrollView = scrollView; }}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.isRefreshing}
                            onRefresh={this._onRefresh.bind(this)}
                            tintColor="#ff0000"
                            title="拉取球讯..."
                            titleColor="#00ff00"
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
                        dataSource={ds.cloneWithRows(this.props.news)}
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
                                        <Text style={{color:'#fff',fontSize:18}}>羽毛球热</Text>
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
                                            <Text style={{fontSize:13,color:'#646464'}}>课程制定</Text>
                                        </View>
                                    </TouchableOpacity>

                                    <TouchableOpacity style={{flex:1,justifyContent:'flex-start',alignItems:'center',padding:5}}
                                                      onPress={ ()=>{
                                        {/*this.navigate2Activity();*/}
                                        //this.navigate2CoachMessage();
                                        alert("该模块暂定");
                                      }}>
                                        <Image resizeMode="stretch" source={require('../../img/dd@2x.png')} />
                                        <View style={{marginTop:0,paddingTop:15}}>
                                            <Text style={{fontSize:13,color:'#646464'}}>活动</Text>
                                        </View>
                                    </TouchableOpacity>


                                    <TouchableOpacity style={{flex:1,justifyContent:'flex-start',alignItems:'center',padding:5}}
                                                      onPress={ ()=>{
                                           alert("暂未开通");
                                           {/*CalendarManager.addEvent("Birthday Party", "4 Privet Drive, Surrey");*/}
                                           {/*updateEvents();*/}
                                            {/*this.navigate2Competition();*/}
                                      }}>

                                        {/*<Icon name="shopping-cart" size={36} color="#EEAD0E" style={{backgroundColor:'transparent'}}/>*/}
                                        <Image resizeMode="stretch" source={require('../../img/shangc-@2x.png')} />
                                        <View style={{marginTop:0,paddingTop:15}}>
                                            <Text style={{fontSize:13,color:'#646464'}}>比赛</Text>
                                        </View>
                                    </TouchableOpacity>



                                    <TouchableOpacity style={{flex:1,justifyContent:'flex-start',alignItems:'center',padding:5}}
                                                      onPress={ ()=>{
                                                          // Bridge.raisePLStream("rtmp://pili-publish.sportshot.cn/sportshot/EEvvee?e=1517628206&token=2M63A85U1GpU37_hxw6zmCYt7ia0YPIEpOjLeJt5:y2fLXXG5llHsrwJlOmVzl_2h0OM=")

                                                          // this.props.dispatch(getRTMPPushUrl()).then((json)=>{
                                                          //     var urlsList=null;
                                                          //     var pushUrl=null;
                                                          //     if(json==null){
                                                          //
                                                          //     }
                                                          //     if(json.re==1){
                                                          //         urlsList=json.json;
                                                          //         pushUrl=urlsList.rtmppushurl;
                                                          //         Bridge.raisePLStream(pushUrl);
                                                          //     }else{
                                                          //
                                                          //         alert('申请地址失败');
                                                          //         //TODO:微信分享邀请好友
                                                          //
                                                          //     }
                                                          // });


                                                            this.navigate2LiveHome()

                                       }}>
                                        {/*<Icon name="video-camera" size={30} color="#8968CD" />*/}
                                        <Image resizeMode="stretch" source={require('../../img/zhibo-@2x.png')} />
                                        <View style={{marginTop:0,paddingTop:15}}>
                                            <Text style={{fontSize:13,color:'#646464'}}>直播间</Text>
                                        </View>
                                    </TouchableOpacity>

                                    <TouchableOpacity style={{flex:1,justifyContent:'flex-start',alignItems:'center',padding:5}}
                                                      onPress={ ()=>{
                                          this.navigate2Mall();
                                      }}>

                                        {/*<Icon name="shopping-cart" size={36} color="#EEAD0E" style={{backgroundColor:'transparent'}}/>*/}
                                        <Image resizeMode="stretch" source={require('../../img/shangc-@2x.png')} />
                                        <View style={{marginTop:0,paddingTop:15}}>
                                            <Text style={{fontSize:13,color:'#646464'}}>商城</Text>
                                        </View>
                                    </TouchableOpacity>

                                    {/*                                    <TouchableOpacity style={{flex:1,justifyContent:'flex-start',alignItems:'center',padding:5}}
                                     onPress={ ()=>{
                                     this.navigate2Mall();
                                     }}>
                                     /!*<Icon name="shopping-cart" size={36} color="#EEAD0E" style={{backgroundColor:'transparent'}}/>*!/
                                     <Image resizeMode="stretch" source={require('../../img/shangc-@2x.png')} />
                                     <View style={{marginTop:0,paddingTop:15}}>
                                     <Text style={{fontSize:13,color:'#646464'}}>暑假班</Text>
                                     </View>
                                     </TouchableOpacity>*/}

                                </View>

                            </View>


                            <View style={{flex:5,flexDirection:'row',justifyContent:'center',alignItems: 'center',backgroundColor:'#fff',marginBottom:10}}>
                                {newsList}
                            </View>

                        </View>


                        <PopupDialog
                            ref={(popupDialog) => {
                                    this.mobilePhoneDialog = popupDialog;
                                }}
                            dialogAnimation={scaleAnimation}
                            dismissOnTouchOutside={false}
                            actions={[]}
                            width={0.8}
                            height={0.4}
                        >

                            <MobilePhoneModal
                                val={this.props.mobilePhone}
                                onVerify={(data)=>{
                                            this.props.dispatch(verifyMobilePhone(data)).then((json)=>{
                                                if(json.re==1)
                                                {
                                                    this.state.verifyCode=json.data
                                                }
                                            })
                                        }}
                                onClose={()=>{
                                            this.mobilePhoneDialog.dismiss();
                                        }}
                                onConfirm={(data)=>{
                                            var {mobilePhone,verifyCode}=data
                                            if(this.state.verifyCode==verifyCode)
                                            {
                                                  this.props.dispatch(updateMobilePhone(mobilePhone)).then((json)=>{
                                                    if(json.re==1)
                                                    {
                                                        this.props.dispatch(onMobilePhoneUpdate(mobilePhone))
                                                    }
                                                    this.mobilePhoneDialog.dismiss();
                                                    Alert.alert('信息','手机号验证通过',[{text:'确认',onPress:()=>{
                                                         console.log();
                                                    }}]);
                                                })
                                            }

                                        }}
                            />

                        </PopupDialog>


                        <PopupDialog
                            ref={(popupDialog) => {
                                    this.validateMyInformationDialog = popupDialog;
                                }}
                            dialogAnimation={scaleAnimation}
                            dismissOnTouchOutside={false}
                            actions={[]}
                            width={0.8}
                            height={0.2}
                        >

                            <ValidateMyInformationModal
                                val=''

                                onClose={()=>{
                                        }}
                                onConfirm={(data)=>{

                                        }}
                            />

                        </PopupDialog>



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
                                <View style={{flex:3,justifyContent:'center',alignItems: 'center',}}>
                                    <Text style={{color:'#fff',fontSize:18}}>羽毛球热</Text>
                                </View>
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
                                <View style={styles.flexContainer}>
                                    <ModalDropdown
                                        style={styles.cell}
                                        textStyle={styles.textstyle}
                                        dropdownStyle={styles.dropdownstyle}
                                        options={this.state.clubList}
                                        renderRow={this.dropdown_renderRow.bind(this)}
                                        onSelect={(idx, value) => this.dropdown_1_onSelect(idx, value)}
                                        onDropdownWillShow={this.dropdown_1_willShow.bind(this)}
                                        onDropdownWillHide={this.dropdown_1_willHide.bind(this)}
                                    >
                                        <View style={styles.viewcell}>
                                            <Text style={styles.textstyle}>
                                                {clubName_show}
                                            </Text>
                                            <Image
                                                style={styles.dropdown_image}
                                                source={clubicon}
                                            />
                                        </View>
                                    </ModalDropdown>

                                    <ModalDropdown
                                        style={styles.cell}
                                        textStyle={styles.textstyle}
                                        dropdownStyle={styles.dropdownstyle}
                                        options={this.state.venueList}
                                        renderRow={this.dropdown_renderRow.bind(this)}
                                        onSelect={(idx, value) => this.dropdown_2_onSelect(idx, value)}
                                        onDropdownWillShow={this.dropdown_2_willShow.bind(this)}
                                        onDropdownWillHide={this.dropdown_2_willHide.bind(this)}
                                    >
                                        <View style={styles.viewcell}>
                                            <Text style={styles.textstyle}>
                                                {venueName_show}
                                            </Text>
                                            <Image
                                                style={styles.dropdown_image}
                                                source={venueicon}
                                            />
                                        </View>
                                    </ModalDropdown>

                                    <ModalDropdown
                                        style={styles.cell}
                                        textStyle={styles.textstyle}
                                        dropdownStyle={styles.dropdownstyle}
                                        options={this.state.typeList}
                                        renderRow={this.dropdown_renderRow.bind(this)}
                                        onSelect={(idx, value) => this.dropdown_3_onSelect(idx, value)}
                                        onDropdownWillShow={this.dropdown_3_willShow.bind(this)}
                                        onDropdownWillHide={this.dropdown_3_willHide.bind(this)}
                                    >
                                        <View style={styles.viewcell}>
                                            <Text style={styles.textstyle}>
                                                {typeName_show}
                                            </Text>
                                            <Image
                                                style={styles.dropdown_image}
                                                source={typeicon}
                                            />
                                        </View>
                                    </ModalDropdown>
                                </View>

                                 <View style={{flex:1,flexDirection:'column',justifyContent:'center',alignItems: 'center',}}>
                                    <View
                                        style={{flex:1,flexDirection:'row',justifyContent:'center',alignItems: 'center',}}>

                                        <TouchableOpacity
                                            style={{flex:1,justifyContent:'flex-start',alignItems:'center',padding:8}}
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
                                            alert("暂未开通");
                                      }}>

                                            {/*<Icon name="shopping-cart" size={36} color="#EEAD0E" style={{backgroundColor:'transparent'}}/>*/}
                                            <Image resizeMode="stretch" source={require('../../img/shangc-@2x.png')}/>
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
                                                          // Bridge.raisePLStream("rtmp://pili-publish.sportshot.cn/sportshot/EEvvee?e=1517628206&token=2M63A85U1GpU37_hxw6zmCYt7ia0YPIEpOjLeJt5:y2fLXXG5llHsrwJlOmVzl_2h0OM=")

                                                          // this.props.dispatch(getRTMPPushUrl()).then((json)=>{
                                                          //     var urlsList=null;
                                                          //     var pushUrl=null;
                                                          //     if(json==null){
                                                          //
                                                          //     }
                                                          //     if(json.re==1){
                                                          //         urlsList=json.json;
                                                          //         pushUrl=urlsList.rtmppushurl;
                                                          //         Bridge.raisePLStream(pushUrl);
                                                          //     }else{
                                                          //
                                                          //         alert('申请地址失败');
                                                          //         //TODO:微信分享邀请好友
                                                          //
                                                          //     }
                                                          // });


                                                            this.navigate2LiveHome()

                                       }}>
                                    {/*<Icon name="video-camera" size={30} color="#8968CD" />*/}
                                    <Image resizeMode="stretch" source={require('../../img/zhibo-@2x.png')}/>
                                    <View style={{marginTop:0,paddingTop:15}}>
                                        <Text style={{fontSize:13,color:'#646464'}}>直播间</Text>
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

                                <TouchableOpacity
                                    style={{flex:1,justifyContent:'flex-start',alignItems:'center',padding:5}}
                                    onPress={ ()=>{
                                           alert("暂未开通");
                                            {/*this.navigate2Competition();*/}
                                      }}>

                                    {/*<Icon name="shopping-cart" size={36} color="#EEAD0E" style={{backgroundColor:'transparent'}}/>*/}
                                    <Image resizeMode="stretch" source={require('../../img/shangc-@2x.png')}/>
                                    <View style={{marginTop:0,paddingTop:15}}>
                                        <Text style={{fontSize:13,color:'#646464'}}>更多</Text>
                                    </View>
                                </TouchableOpacity>
                                    </View>
                              </View>

                            </View>



                            <View style={{flex:5,flexDirection:'row',justifyContent:'center',alignItems: 'center',backgroundColor:'#fff',marginBottom:10}}>
                                {newsList}
                            </View>

                        </View>


                        <PopupDialog
                            ref={(popupDialog) => {
                                    this.mobilePhoneDialog = popupDialog;
                                }}
                            dialogAnimation={scaleAnimation}
                            dismissOnTouchOutside={false}
                            actions={[]}
                            width={0.8}
                            height={0.4}
                        >

                            <MobilePhoneModal
                                val={this.props.mobilePhone}
                                onVerify={(data)=>{
                                            this.props.dispatch(verifyMobilePhone(data)).then((json)=>{
                                                if(json.re==1)
                                                {
                                                    this.state.verifyCode=json.data
                                                }
                                            })
                                        }}
                                onClose={()=>{
                                            this.mobilePhoneDialog.dismiss();
                                        }}
                                onConfirm={(data)=>{
                                            var {mobilePhone,verifyCode}=data
                                            if(this.state.verifyCode==verifyCode)
                                            {
                                                  this.props.dispatch(updateMobilePhone(mobilePhone)).then((json)=>{
                                                    if(json.re==1)
                                                    {
                                                        this.props.dispatch(onMobilePhoneUpdate(mobilePhone))
                                                    }
                                                    this.mobilePhoneDialog.dismiss();
                                                    Alert.alert('信息','手机号验证通过',[{text:'确认',onPress:()=>{
                                                         console.log();
                                                    }}]);
                                                })
                                            }

                                        }}
                            />

                        </PopupDialog>


                        <PopupDialog
                            ref={(popupDialog) => {
                                    this.validateMyInformationDialog = popupDialog;
                                }}
                            dialogAnimation={scaleAnimation}
                            dismissOnTouchOutside={false}
                            actions={[]}
                            width={0.8}
                            height={0.2}
                        >

                            <ValidateMyInformationModal
                                val=''

                                onClose={()=>{
                                        }}
                                onConfirm={(data)=>{

                                        }}
                            />

                        </PopupDialog>



                    </View>

            </View>

        );
    }

    dropdown_renderRow(rowData, rowID, highlighted){
        return (
            <TouchableOpacity >
                <View style={[styles.dropdown_row]}>
                    <Text style={[styles.dropdown_row_text, highlighted && {color: 'mediumaquamarine'}]}>
                        {rowData}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    }

    dropdown_1_onSelect(idx, value) {
        this.setState({
            clubName:value,
        });
    }

    dropdown_2_onSelect(idx, value) {
        this.setState({
            venueName:value,
        });
    }

    dropdown_3_onSelect(idx, value) {
        this.setState({
            sportsType:value,
        });
    }

    dropdown_1_willShow() {
        this.setState({
            showClubDropDown:true,
        });
    }

    dropdown_2_willShow() {
        this.setState({
            showVenueDropDown:true,
        });
    }

    dropdown_3_willShow() {
        this.setState({
            showTypeDropDown:true,
        });
    }

    dropdown_1_willHide() {
        this.setState({
            showClubDropDown:false,
        });
    }

    dropdown_2_willHide() {
        this.setState({
            showVenueDropDown:false,
        });
    }

    dropdown_3_willHide() {
        this.setState({
            showTypeDropDown:false,
        });
    }

    lengthFilter(data){
        if(data.length>5){
            data=data.substring(0,4);
            data = data+'...'
        }
        return data;
    }

    componentDidMount()
    {
        InteractionManager.runAfterInteractions(() => {
            this.props.dispatch(fetchNewsInfo()).then((json)=>{
                if(json.re==1)
                {
                    this.props.dispatch(updateNewsInfo(json.data));
                    // this.props.dispatch(fetchGames()).then((json)=>{
                    //     if(json.re==1){
                    //         this.state.games = json.data;
                    //     }
                    //
                    //
                    // });

                }else{
                    if(json.re==-100){
                        this.props.dispatch(getAccessToken(false));
                    }
                }
            })

            //获取所有俱乐部
            this.props.dispatch(fetchClubList()).then((json)=>{
                if(json.re==1)
                {
                    var clubDataList = [];
                    for(var i=0;i<json.data.length;i++)
                        clubDataList.push(json.data[i].name);
                    this.setState({clubList:clubDataList,clubs:json.data});
                }
                else {
                    if(json.re=-100){
                        this.props.dispatch(getAccessToken(false))
                    }

                }
            })

            //获取所有场馆
            this.props.dispatch(fetchMaintainedVenue()).then((json)=>{
                if(json.re==1)
                {
                    var venueDataList = [];
                    for(var i=0;i<json.data.length;i++)
                        venueDataList.push(json.data[i].name);
                    this.setState({venueList:venueDataList,venues:json.data});
                }
                else {
                    if(json.re=-100){
                        this.props.dispatch(getAccessToken(false))
                    }

                }
            })
        });
    }
}

var styles = StyleSheet.create({

    container: {
        flex: 1,
    },
    flexContainer: {
        flexDirection: 'row',
    },
    cell: {
        width:dropdownWidth,
        alignItems:'center',
        flexDirection:'row',
        height:32,
        borderRightColor:'#cdcdcd',
        borderRightWidth:0.7,
        borderBottomColor:'#cdcdcd',
        borderBottomWidth:0.7,
    },
    viewcell: {
        width:dropdownWidth-0.7,
        backgroundColor:'#ffffff',
        alignItems:'center',
        height:32,
        justifyContent:'center',
        flexDirection:'row',
    },
    textstyle: {
        fontSize: 13,
        textAlign: 'center',
        color:'#646464',
        justifyContent:'center',
    },
    dropdownstyle: {
        height: 100,
        width:dropdownWidth,
        borderColor: '#cdcdcd',
        borderWidth: 0.7,
    },
    dropdown_row: {
        flexDirection: 'row',
        height: 50,
        alignItems: 'center',
    },
    dropdown_row_text: {
        fontSize: 13,
        color: '#646464',
        textAlignVertical: 'center',
        justifyContent:'center',
        marginLeft: 5,
    },
    dropdown_image: {
        width: 20,
        height: 20,
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
    var mobilePhone=personInfo.mobilePhone;

    var personInfoAuxiliary = state.user.personInfoAuxiliary;
    var checkedMobile = personInfoAuxiliary.checkedMobile;

    var trainerInfo=state.user.trainer

    const props = {
        news:state.newsTheme.news,
        mobilePhone:mobilePhone,
        userType:parseInt(state.user.personInfo.perTypeCode),
        perName:personInfo.perName,
        perIdCard:personInfo.perIdCard,
    }

    if(trainerInfo)
    {
        props.sportLevelValidateFailed=(!(trainerInfo.sportLevel!==undefined&&trainerInfo.sportLevel!==null))//运动水平没验证
        props.perNameValidateFailed=(!(personInfo.perName&&personInfo.perName!=''))//真实姓名没验证
        props.perIdCardValidateFailed=(!(personInfo.perIdCard&&personInfo.perIdCard!=''))//身份证没验证
    }

    //手机号没验证
    if(mobilePhone&&mobilePhone!=''&&checkedMobile==true)
        props.mobilePhoneValidateFailed=false
    else
        props.mobilePhoneValidateFailed=true

    return props
}

export default connect(mapStateToProps)(Home);


