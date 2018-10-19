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
    fetchGames,disableCompetitionOnFresh,enableCompetitionOnFresh,fetchCompetitions,fetchProjects,fetchGamesList,createProject
} from '../../action/CompetitionActions';

const slideAnimation = new SlideAnimation({ slideFrom: 'bottom' });
const scaleAnimation = new ScaleAnimation();
const defaultAnimation = new DefaultAnimation({ animationDuration: 150 });
var {height, width} = Dimensions.get('window');

class CreateProject extends Component{

    goBack(){
        const { navigator } = this.props;
        if(navigator) {
            navigator.pop();
        }
    }

    //选项目类型
    _handlePress(index) {

        if(index!==0){
            var typeStr = this.state.typeButtons[index];
            var typeIdx = index;
            this.setState({project:Object.assign(this.state.project,{typeStr:typeStr,typeIdx:typeIdx})});
        }

    }

    show(actionSheet) {
        this[actionSheet].show();
    }

    constructor(props) {
        super(props);
        this.state={

        //{'id':1,'name':'男双','num':'20170101','maxNum':6,'nowNum':3,'personNum':7,'gamesNum':10,'typeStr':'男单',typeIdx:1},

            project:{id:null,name:null,maxNum:null,nowNum:null,personNum:null,gamesNum:null,typeStr:null,typeIdx:null},
            typeButtons:['取消','男单','女单','男双','女双','混双','团体']
        }
        this.showScaleAnimationDialog = this.showScaleAnimationDialog.bind(this);
    }

    showScaleAnimationDialog() {
        this.scaleAnimationDialog.show();
    }


    render() {

        const CANCEL_INDEX = 0;
        const DESTRUCTIVE_INDEX = 1;

        // project:{id:null,name:null,maxNum:null,nowNum:null,personNum:null,gamesNum:null,typeStr:null,typeIdx:null},

        return (
            <View style={{flex:1,backgroundColor:'#eee'}}>
                <Toolbar width={width} title="创建项目" actions={[]} navigator={this.props.navigator}>
                <KeyboardAwareScrollView style={{height:height-180,width:width}}>
                <View style={{flex:5,backgroundColor:'#fff'}}>

                    <View style={{height:30,width:width,justifyContent:'center',textAlign:'left',backgroundColor:'#eee',padding:5}}>
                        <Text style={{color:'#666',fontSize:13}}>项目基本信息</Text>
                    </View>

                    {/*项目名称*/}
                    <View style={{height:40,flexDirection:'row',justifyContent:'flex-end',alignItems: 'center',backgroundColor:'#fff',marginBottom:1,padding:5}}>
                        <View style={{flex:1}}>
                            <Text style={{color:'#343434'}}>项目名称</Text>
                        </View>
                        <View style={{flex:3,flexDirection:'row',justifyContent:'flex-end',alignItems: 'center',backgroundColor:'#fff',
                            borderRadius:10}}>
                            <TextInput
                                placeholderTextColor='#888'
                                style={{fontSize:14,color:'#222',justifyContent:'flex-end',textAlign:'right',height:40,flex:3,padding:0}}
                                placeholder="请输入项目名称"
                                value={this.state.project.name}
                                underlineColorAndroid={'transparent'}
                                onChangeText={
                                    (value)=>{
                                        this.setState({project:Object.assign(this.state.project,{name:value})})
                                    }}
                            />
                        </View>
                    </View>

                    {/*项目类型*/}
                    <View style={{height:40,flexDirection:'row',justifyContent:'center',alignItems: 'center',backgroundColor:'#fff',marginBottom:1,padding:5}}>
                        <View style={{flex:1}}>
                            <Text style={{color:'#343434'}}>项目类型</Text>
                        </View>
                        <TouchableOpacity style={{flex:3,flexDirection:'row',justifyContent:'center',alignItems: 'center',backgroundColor:'#fff',
                            borderRadius:10}}
                                          onPress={()=>{ this.show('actionSheet'); }}>
                            {
                                this.state.project.typeStr==null?
                                    <View style={{flex:1,paddingRight:8,justifyContent:'flex-end',alignItems: 'center',flexDirection:'row'}}>
                                        <Text style={{color:'#888',fontSize:14}}>请选择项目类型 ></Text>
                                    </View> :
                                    <View style={{flex:1,marginLeft:20,justifyContent:'flex-end',alignItems: 'center',flexDirection:'row'}}>
                                        <Text style={{color:'#444',fontSize:14}}>{this.state.project.typeStr}</Text>
                                    </View>

                            }
                            <ActionSheet
                                ref={(p) => {
                                    this.actionSheet =p;
                                }}
                                title="请选择项目类型"
                                options={this.state.typeButtons}
                                cancelButtonIndex={CANCEL_INDEX}
                                destructiveButtonIndex={DESTRUCTIVE_INDEX}
                                onPress={
                                    (data)=>{ this._handlePress(data); }
                                }
                            />
                        </TouchableOpacity>
                    </View>

                    {/*队数上限*/}
                    <View style={{height:40,flexDirection:'row',justifyContent:'center',alignItems: 'center',backgroundColor:'#fff',marginBottom:1,padding:5}}>
                        <View style={{flex:1}}>
                            <Text style={{color:'#343434'}}>队数上限</Text>
                        </View>
                        <View style={{flex:3,flexDirection:'row',justifyContent:'flex-start',alignItems: 'center',backgroundColor:'#fff',
                            borderRadius:10}}>
                            <TextInput
                                placeholderTextColor='#888'
                                style={{fontSize:14,color:'#222',justifyContent:'flex-end',textAlign:'right',height:40,flex:3,padding:0}}
                                placeholder="请输入队数上限"
                                value={this.state.project.maxNum}
                                underlineColorAndroid={'transparent'}
                                onChangeText={
                                    (value)=>{
                                        this.setState({project:Object.assign(this.state.project,{maxNum:value})})
                                    }}
                            />
                        </View>
                    </View>

                    {/*队员上限*/}
                    <View style={{height:40,flexDirection:'row',justifyContent:'center',alignItems: 'center',backgroundColor:'#fff',marginBottom:1,padding:5}}>
                        <View style={{flex:1}}>
                            <Text style={{color:'#343434'}}>队员上限</Text>
                        </View>
                        <View style={{flex:3,flexDirection:'row',justifyContent:'flex-start',alignItems: 'center',backgroundColor:'#fff',
                            borderRadius:10}}>
                            <TextInput
                                placeholderTextColor='#888'
                                style={{fontSize:14,color:'#222',justifyContent:'flex-end',textAlign:'right',height:40,flex:3,padding:0}}
                                placeholder="请输入队员上限"
                                value={this.state.project.personNum}
                                underlineColorAndroid={'transparent'}
                                onChangeText={
                                    (value)=>{
                                        this.setState({project:Object.assign(this.state.project,{personNum:value})})
                                    }}
                            />
                        </View>
                    </View>

                    {/*比赛场次*/}
                    <View style={{height:40,flexDirection:'row',justifyContent:'center',alignItems: 'center',backgroundColor:'#fff',marginBottom:1,padding:5}}>
                        <View style={{flex:1}}>
                            <Text style={{color:'#343434'}}>比赛场次</Text>
                        </View>
                        <View style={{flex:3,flexDirection:'row',justifyContent:'flex-start',alignItems: 'center',backgroundColor:'#fff',
                            borderRadius:10}}>
                            <TextInput
                                placeholderTextColor='#888'
                                style={{fontSize:14,color:'#222',justifyContent:'flex-end',textAlign:'right',height:40,flex:3,padding:0}}
                                placeholder="请输入比赛场次"
                                value={this.state.project.gamesNum}
                                underlineColorAndroid={'transparent'}
                                onChangeText={
                                    (value)=>{
                                        this.setState({project:Object.assign(this.state.project,{gamesNum:value})})
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
                                              this.props.dispatch(createProject(this.state.project,this.props.competitionId)).then((json)=>{
                                                  if(json.re==1)
                                                  {
                                                      Alert.alert('成功','项目创建成功')
                                                      this.goBack()
                                                  }
                                                  else {

                                                      Alert.alert('失败','项目创建失败')

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
)(CreateProject);


