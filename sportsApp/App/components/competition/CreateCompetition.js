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
import DatePicker from 'react-native-datepicker';
import {
    fetchMaintainedVenue
} from '../../action/MapActions';
import {
    fetchGames,disableCompetitionOnFresh,enableCompetitionOnFresh,fetchCompetitions,AddCompetition
} from '../../action/CompetitionActions';

const slideAnimation = new SlideAnimation({ slideFrom: 'bottom' });
const scaleAnimation = new ScaleAnimation();
const defaultAnimation = new DefaultAnimation({ animationDuration: 150 });
var {height, width} = Dimensions.get('window');

class CreateCompetition extends Component{

    goBack(){
        const { navigator } = this.props;
        if(navigator) {
            navigator.pop();
        }
    }

    //选场地
    _handlePress(index) {

        if(index!==0){
            var venueStr = this.state.venueButtons[index];
            var venueIdx = index;
            this.setState({competition:Object.assign(this.state.competition,{unitName:venueStr})});
        }
    }

    //选类型
    _handlePress1(index) {

        if(index!==0){
            var typeStr = this.state.typeButtons[index];
            var typeIdx = index;
            this.setState({competition:Object.assign(this.state.competition,{type:typeStr,typeIdx:typeIdx})});
        }
    }

    show(actionSheet) {
        this[actionSheet].show();
    }

    constructor(props) {
        super(props);
        this.state={

            //{brief=鼓励学生学习, unitName=山东体育学院羽毛球馆, headImgUrl=https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83eqhGvzphLhtWoG1KjVLF1VFb9tD2ZqlRQ2IcI6jWGz9ZBib38jyd4oBh9BgicfRqQ4469Rzzkj46k7w/132,
            // name=山大实验室友谊赛, host=软件实验室, unitId=1, personId=3, perNum=wbh, startTime=2018-02-01 09:00, id=1, endTime=2018-03-01 18:00}

            competition:{name:null,brief:null,host:null,unitName:null,startTime:null,endTime:null,type:null,typeIdx:null},
            venueButtons:['取消','山东体育学院羽毛球馆','济南联通羽毛球馆','平阴县青少年学生校外活动中心','历城文博中心','莱芜全民健身中心'],
            typeButtons:['取消','平台','委托'],
        }
        this.showScaleAnimationDialog = this.showScaleAnimationDialog.bind(this);
    }

    showScaleAnimationDialog() {
        this.scaleAnimationDialog.show();
    }


    render() {

        const CANCEL_INDEX = 0;
        const DESTRUCTIVE_INDEX = 1;

        return (
            <View style={{flex:1,backgroundColor:'#eee'}}>
                <Toolbar width={width} title="发布比赛" actions={[]} navigator={this.props.navigator}>
                <KeyboardAwareScrollView style={{height:height-180,width:width}}>
                <View style={{flex:5,backgroundColor:'#fff'}}>

                    <View style={{height:30,width:width,justifyContent:'center',textAlign:'left',backgroundColor:'#eee',padding:5}}>
                        <Text style={{color:'#666',fontSize:13}}>比赛基本信息</Text>
                    </View>

                    {/*比赛名称*/}
                    <View style={{height:40,flexDirection:'row',justifyContent:'flex-end',alignItems: 'center',backgroundColor:'#fff',marginBottom:1,padding:5}}>
                        <View style={{flex:1}}>
                            <Text style={{color:'#343434'}}>比赛名称</Text>
                        </View>
                        <View style={{flex:3,flexDirection:'row',justifyContent:'flex-end',alignItems: 'center',backgroundColor:'#fff',
                            borderRadius:10}}>
                            <TextInput
                                placeholderTextColor='#888'
                                style={{fontSize:14,color:'#222',justifyContent:'flex-end',textAlign:'right',height:40,flex:3,padding:0}}
                                placeholder="请输入比赛名称"
                                value={this.state.competition.name}
                                underlineColorAndroid={'transparent'}
                                onChangeText={
                                    (value)=>{
                                        this.setState({competition:Object.assign(this.state.competition,{name:value})})
                                    }}
                            />
                        </View>
                    </View>

                    {/*承办单位*/}
                    <View style={{height:40,flexDirection:'row',justifyContent:'flex-end',alignItems: 'center',backgroundColor:'#fff',marginBottom:1,padding:5}}>
                        <View style={{flex:1}}>
                            <Text style={{color:'#343434'}}>承办单位</Text>
                        </View>
                        <View style={{flex:3,flexDirection:'row',justifyContent:'flex-end',alignItems: 'center',backgroundColor:'#fff',
                            borderRadius:10}}>
                            <TextInput
                                placeholderTextColor='#888'
                                style={{fontSize:14,color:'#222',justifyContent:'flex-end',textAlign:'right',height:40,flex:3,padding:0}}
                                placeholder="请输入承办单位"
                                value={this.state.competition.host}
                                underlineColorAndroid={'transparent'}
                                onChangeText={
                                    (value)=>{
                                        this.setState({competition:Object.assign(this.state.competition,{host:value})})
                                    }}
                            />
                        </View>
                    </View>

                    {/*比赛类型*/}
                    <View style={{height:40,flexDirection:'row',justifyContent:'center',alignItems: 'center',backgroundColor:'#fff',marginBottom:1,padding:5}}>
                        <View style={{flex:1}}>
                            <Text style={{color:'#343434'}}>比赛类型</Text>
                        </View>
                        <TouchableOpacity style={{flex:3,flexDirection:'row',justifyContent:'center',alignItems: 'center',backgroundColor:'#fff',
                            borderRadius:10}}
                                          onPress={()=>{ this.show('actionSheet1'); }}>
                            {
                                this.state.competition.type==null?
                                    <View style={{flex:1,paddingRight:8,justifyContent:'flex-end',alignItems: 'center',flexDirection:'row'}}>
                                        <Text style={{color:'#888',fontSize:14}}>请选择比赛类型 ></Text>
                                    </View> :
                                    <View style={{flex:1,marginLeft:20,justifyContent:'flex-end',alignItems: 'center',flexDirection:'row'}}>
                                        <Text style={{color:'#444',fontSize:14}}>{this.state.competition.type}</Text>
                                    </View>

                            }
                            <ActionSheet
                                ref={(p) => {
                                    this.actionSheet1 =p;
                                }}
                                title="请选择比赛类型"
                                options={this.state.typeButtons}
                                cancelButtonIndex={CANCEL_INDEX}
                                destructiveButtonIndex={DESTRUCTIVE_INDEX}
                                onPress={
                                    (data)=>{ this._handlePress1(data); }
                                }
                            />
                        </TouchableOpacity>
                    </View>

                    {/*承办地点*/}
                    <View style={{height:40,flexDirection:'row',justifyContent:'center',alignItems: 'center',backgroundColor:'#fff',marginBottom:1,padding:5}}>
                        <View style={{flex:1}}>
                            <Text style={{color:'#343434'}}>承办地点</Text>
                        </View>
                        <TouchableOpacity style={{flex:3,flexDirection:'row',justifyContent:'center',alignItems: 'center',backgroundColor:'#fff',
                            borderRadius:10}}
                                          onPress={()=>{ this.show('actionSheet'); }}>
                            {
                                this.state.competition.unitName==null?
                                    <View style={{flex:1,paddingRight:8,justifyContent:'flex-end',alignItems: 'center',flexDirection:'row'}}>
                                        <Text style={{color:'#888',fontSize:14}}>请选择承办地点 ></Text>
                                    </View> :
                                    <View style={{flex:1,marginLeft:20,justifyContent:'flex-end',alignItems: 'center',flexDirection:'row'}}>
                                        <Text style={{color:'#444',fontSize:14}}>{this.state.competition.unitName}</Text>
                                    </View>

                            }
                            <ActionSheet
                                ref={(p) => {
                                    this.actionSheet =p;
                                }}
                                title="请选择承办地点"
                                options={this.state.venueButtons}
                                cancelButtonIndex={CANCEL_INDEX}
                                destructiveButtonIndex={DESTRUCTIVE_INDEX}
                                onPress={
                                    (data)=>{ this._handlePress(data); }
                                }
                            />
                        </TouchableOpacity>
                    </View>

                    {/*开始时间*/}
                    <View style={{height:40,flexDirection:'row',justifyContent:'center',alignItems: 'center',backgroundColor:'#fff',marginBottom:1,padding:5}}>
                        <View style={{flex:1}}>
                            <Text style={{color:'#343434'}}>开始时间</Text>
                        </View>
                        <View style={{flex:3,flexDirection:'row',justifyContent:'flex-start',alignItems: 'center',backgroundColor:'#fff',
                            borderRadius:10}}>
                            <TextInput
                                placeholderTextColor='#888'
                                style={{fontSize:14,color:'#222',justifyContent:'flex-end',textAlign:'right',height:40,flex:3,padding:0}}
                                placeholder="请选择开始时间"
                                value={this.state.competition.startTime}
                                underlineColorAndroid={'transparent'}
                                onChangeText={
                                    (value)=>{
                                        this.setState({competition:Object.assign(this.state.competition,{startTime:value})})
                                    }}
                            />
                            <View style={{height:35,marginRight:5,flexDirection:'row',alignItems:'center'}}>
                                <DatePicker
                                    style={{width:60,marginLeft:0,borderWidth:0}}
                                    customStyles={{
                                        placeholderText:{color:'transparent',fontSize:12},
                                        dateInput:{height:30,borderWidth:0},
                                        dateTouchBody:{marginRight:0,height:25,borderWidth:0},
                                    }}
                                    placeholder="选择"
                                    mode="datetime"
                                    format="YYYY-MM-DD HH:mm"
                                    minDate={"2018-01-01 00:00"}
                                    confirmBtnText="确认"
                                    cancelBtnText="取消"
                                    showIcon={true}
                                    iconComponent={<Icon name={'calendar'} size={20} color="#888"/>}
                                    onDateChange={(date) => {
                                        this.setState({competition:Object.assign(this.state.competition,{startTime:date})})
                                    }}
                                />
                            </View>
                        </View>
                    </View>

                    {/*结束时间*/}
                    <View style={{height:40,flexDirection:'row',justifyContent:'center',alignItems: 'center',backgroundColor:'#fff',marginBottom:1,padding:5}}>
                        <View style={{flex:1}}>
                            <Text style={{color:'#343434'}}>结束时间</Text>
                        </View>
                        <View style={{flex:3,flexDirection:'row',justifyContent:'flex-start',alignItems: 'center',backgroundColor:'#fff',
                            borderRadius:10}}>
                            <TextInput
                                placeholderTextColor='#888'
                                style={{fontSize:14,color:'#222',justifyContent:'flex-end',textAlign:'right',height:40,flex:3,padding:0}}
                                placeholder="请选择结束时间"
                                value={this.state.competition.endTime}
                                underlineColorAndroid={'transparent'}
                                onChangeText={
                                    (value)=>{
                                        this.setState({competition:Object.assign(this.state.competition,{endTime:value})})
                                    }}
                            />
                            <View style={{height:35,marginRight:5,flexDirection:'row',alignItems:'center'}}>
                                <DatePicker
                                    style={{width:60,marginLeft:0,borderWidth:0}}
                                    customStyles={{
                                        placeholderText:{color:'transparent',fontSize:12},
                                        dateInput:{height:30,borderWidth:0},
                                        dateTouchBody:{marginRight:0,height:25,borderWidth:0},
                                    }}
                                    placeholder="选择"
                                    mode="datetime"
                                    format="YYYY-MM-DD HH:mm"
                                    minDate={"2018-01-01 00:00"}
                                    confirmBtnText="确认"
                                    cancelBtnText="取消"
                                    showIcon={true}
                                    iconComponent={<Icon name={'calendar'} size={20} color="#888"/>}
                                    onDateChange={(date) => {
                                        this.setState({competition:Object.assign(this.state.competition,{endTime:date})})
                                    }}
                                />
                            </View>
                        </View>
                    </View>

                    {/*比赛简介*/}
                    <View style={{height:40,flexDirection:'row',justifyContent:'center',alignItems: 'center',backgroundColor:'#fff',marginBottom:1,padding:5}}>
                        <View style={{flex:1}}>
                            <Text style={{color:'#343434'}}>比赛简介</Text>
                        </View>
                        <View style={{flex:3,flexDirection:'row',justifyContent:'flex-start',alignItems: 'center',backgroundColor:'#fff',
                            borderRadius:10}}>
                            <TextInput
                                placeholderTextColor='#888'
                                style={{fontSize:14,color:'#222',justifyContent:'flex-end',textAlign:'right',height:40,flex:3,padding:0}}
                                placeholder="请输入比赛简介"
                                value={this.state.competition.brief}
                                underlineColorAndroid={'transparent'}
                                onChangeText={
                                    (value)=>{
                                        this.setState({competition:Object.assign(this.state.competition,{brief:value})})
                                    }}
                            />
                        </View>
                    </View>

                    <View style={{backgroundColor:'#fff',padding:10}}>
                        <Text style={{color:'#aaa',fontSize:11}}>
                            温馨提示：您发布的内容应合法、真实、健康、共创文明的网络环境
                        </Text>
                    </View>
                </View>
                    <View style={{flexDirection:'row',height:50,justifyContent:'center',alignItems:'center',width:width,backgroundColor:'#fff',marginBottom:20}}>
                        <TouchableOpacity style={{width:width*1/3,backgroundColor:'#fc6254',padding:10,flexDirection:'row',
                            justifyContent:'center'}}
                                          onPress={()=>{
                                              //发布比赛

                                              this.props.dispatch(AddCompetition(this.state.competition)).then((json)=>{
                                                  if(json.re==1)
                                                  {
                                                      Alert.alert('成功','比赛发布成功')
                                                      this.goBack()
                                                  }
                                                  else {

                                                      Alert.alert('失败','比赛发布失败')

                                                      if(json.re=-100){
                                                          this.props.dispatch(getAccessToken(false))
                                                      }
                                                  }
                                              })

                                          }}>
                            <Text style={{color:'#fff',fontSize:15}}>发布</Text>
                        </TouchableOpacity>

                    </View>
                </KeyboardAwareScrollView>

                </Toolbar>
            </View>
        );
    }

    componentDidMount()
    {
        //查询所有地点
        // this.props.dispatch(fetchMaintainedVenue()).then((json)=>{
        //     if(json.re==1)
        //     {
        //         var venues = json.data;
        //         var venueList = ['取消'];
        //
        //         venues.map((venue)=>{
        //             venueList.add(venue.name)
        //         })
        //
        //         this.setState({venueButtons:venueList});
        //     }
        //     else {
        //         if(json.re=-100){
        //             this.props.dispatch(getAccessToken(false))
        //         }
        //
        //     }
        // })
    }

    componentWillUnmount()
    {
    }

}

var styles = StyleSheet.create({
    dialogContentView: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },

});

module.exports = connect(state=>({
        accessToken:state.user.accessToken,
        personInfo:state.user.personInfo,
    })
)(CreateCompetition);


