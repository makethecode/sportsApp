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
            var typeStr = this.state.projectTypeButtons[index];
            var typeIdx = index;
            this.setState({project:Object.assign(this.state.project,{typeStr:typeStr,typeIdx:typeIdx})});
            if(index==6)this.setState({showGamesList:true})
            else this.setState({showGamesList:false})
        }

    }

    show(actionSheet) {
        this[actionSheet].show();
    }

    constructor(props) {
        super(props);
        this.state={

            project:{id:null,name:null,maxNum:null,nowNum:null,personNum:null,gamesNum:null,typeStr:null,typeIdx:null},
            projectTypeButtons:['取消','男单','女单','男双','女双','混双','团体'],
            gameTypeButtons:['取消','男单','女单','男双','女双','混双'],

            gameTypeStrList:[],
            gameTypeIdList:[],

            typeList:'',

            showGamesList:false,
        }
        this.showScaleAnimationDialog = this.showScaleAnimationDialog.bind(this);
    }

    showScaleAnimationDialog() {
        this.scaleAnimationDialog.show();
    }

    renderRow(rowData, sectionId, rowId) {

        const CANCEL_INDEX = 0;
        const DESTRUCTIVE_INDEX = 1;

        var gameTypeStr = this.state.gameTypeStrList[rowId];
        var gameTypeId = this.state.gameTypeIdList[rowId];

        return (
            <View style={{height:40,flexDirection:'row',justifyContent:'center',alignItems: 'center',backgroundColor:'#fff',marginBottom:1,padding:5}}>
                <View style={{flex:1}}>
                    <Text style={{color:'#343434'}}>第{parseInt(rowId)+1}场比赛</Text>
                </View>
                <TouchableOpacity style={{flex:3,flexDirection:'row',justifyContent:'center',alignItems: 'center',backgroundColor:'#fff',
                    borderRadius:10}}
                                  onPress={()=>{ this.show('actionSheet1'); }}>
                    {
                        gameTypeStr==''?
                            <View style={{flex:1,paddingRight:8,justifyContent:'flex-end',alignItems: 'center',flexDirection:'row'}}>
                                <Text style={{color:'#888',fontSize:14}}>请选择比赛类型 ></Text>
                            </View> :
                            <View style={{flex:1,marginLeft:20,justifyContent:'flex-end',alignItems: 'center',flexDirection:'row'}}>
                                <Text style={{color:'#444',fontSize:14}}>{gameTypeStr}</Text>
                            </View>

                    }
                    <ActionSheet
                        ref={(p) => {
                            this.actionSheet1 =p;
                        }}
                        title="请选择比赛类型"
                        options={this.state.gameTypeButtons}
                        cancelButtonIndex={CANCEL_INDEX}
                        destructiveButtonIndex={DESTRUCTIVE_INDEX}
                        onPress={
                            (data)=> {
                                if (data != 0) {
                                    var gameTypeStrList = this.state.gameTypeStrList;
                                    var gameTypeIdList = this.state.gameTypeIdList;
                                    gameTypeStrList[rowId] = this.state.gameTypeButtons[data];
                                    gameTypeIdList[rowId] = data;

                                    var typeList = '';
                                    for (var i = 0; i < gameTypeIdList.length; i++) {
                                        if (i == 0) typeList = gameTypeIdList[i];
                                        else typeList += ',' + gameTypeIdList[i];
                                    }

                                    this.setState({
                                        gameTypeStrList: gameTypeStrList,
                                        gameTypeIdList: gameTypeIdList,
                                        typeList: typeList
                                    })
                                }
                            }
                        }
                    />
                </TouchableOpacity>
            </View>
        )
    }


    render() {

        const CANCEL_INDEX = 0;
        const DESTRUCTIVE_INDEX = 1;

        var gameOfGamesListView=null;
        var gameOfGamesList = this.state.gameTypeStrList;

        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        if (gameOfGamesList !== undefined && gameOfGamesList !== null && gameOfGamesList.length > 0) {
            gameOfGamesListView = (
                <ListView
                    automaticallyAdjustContentInsets={false}
                    dataSource={ds.cloneWithRows(gameOfGamesList)}
                    renderRow={this.renderRow.bind(this)}
                />
            );
        }

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
                                options={this.state.projectTypeButtons}
                                cancelButtonIndex={CANCEL_INDEX}
                                destructiveButtonIndex={DESTRUCTIVE_INDEX}
                                onPress={
                                    (data)=>{ this._handlePress(data); }
                                }
                            />
                        </TouchableOpacity>
                    </View>

                    {
                        this.state.showGamesList?
                            <View>
                    <View style={{height:30,width:width,justifyContent:'center',alignItems:'center',textAlign:'left',paddingHorizontal:5,flexDirection:'row',backgroundColor:'#eee'}}>
                        <Text style={{color:'#666',fontSize:13}}>团体赛类型</Text>
                        <TouchableOpacity style={{flex:1,alignItems:'flex-end',justifyContent:'center'}}
                                          onPress={()=>{

                                              var flag = 1;

                                              var gameTypeStrList = this.state.gameTypeStrList;
                                              var gameTypeIdList = this.state.gameTypeIdList;

                                              for(var i=0;i<gameTypeIdList.length;i++)
                                                  if(gameTypeIdList[i]=='')flag=0;

                                              if(flag==0){
                                                  Alert.alert('失败','请输入完整上一场比赛信息')
                                              }
                                                  else{
                                                  gameTypeStrList.push('');
                                                  gameTypeIdList.push('')
                                                  this.setState({gameTypeStrList:gameTypeStrList,gameTypeIdList:gameTypeIdList})
                                              }
                                          }}>
                            <Ionicons name='md-add' size={20} color="#888"/>
                        </TouchableOpacity>
                    </View>

                                {gameOfGamesListView}</View>
                            :null
                    }

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

                                              var flag = 1;
                                              var gameTypeIdList = this.state.gameTypeIdList;

                                              for(var i=0;i<gameTypeIdList.length;i++)
                                                  if(gameTypeIdList[i]=='')flag=0;

                                              if(flag==0){
                                                  Alert.alert('失败','请输入完整上一场比赛信息')
                                              }else{

                                              var typeList = this.state.typeList;

                                              this.props.dispatch(createProject(this.state.project,this.props.competitionId,typeList)).then((json)=>{
                                                  if(json.re==1)
                                                  {
                                                      DeviceEventEmitter.emit('project_fresh',1)
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

                                              }
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


