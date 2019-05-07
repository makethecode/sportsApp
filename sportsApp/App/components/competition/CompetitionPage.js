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
import CountDownTimer from 'react_native_countdowntimer'
import GridView from 'react-native-super-grid'
import {Toolbar,OPTION_SHOW,OPTION_NEVER,ACTION_VEDIO,ACTION_BARCODE} from 'react-native-toolbar-wrapper'
import ViewPager from 'react-native-viewpager';
import HomePage from '../../components/live/HomePage'
import {
    fetchGames,disableCompetitionOnFresh,enableCompetitionOnFresh,fetchCompetitions,fetchProjects,fetchGameList,fetchAllGameList
} from '../../action/CompetitionActions';
import CompetitionTeamList from './CompetitionTeamList'
import CompetitionGamesList from './CompetitionGamesList'
import CompetitionGameList from './CompetitionGameList'
import CompetitionGroupList from './CompetitionGroupList'
import CompetitionResult from './CompetitionResult'

var {height, width,scale} = Dimensions.get('window');
var WeChat = require('react-native-wechat');

class CompetitionPage extends Component{

    goBack(){
        const { navigator } = this.props;
        if(navigator) {
            navigator.pop();
        }
    }

    fetchAllGameList(){

        this.state.doingFetch=true;
        this.state.isRefreshing=true;

        this.props.dispatch(fetchAllGameList(this.props.projectId)).then((json)=>{
            this.setState({doingFetch:false,isRefreshing:false,noticeFresh:false})
            if(json.re==1)
            {
                this.setState({notice:json.data,isRefreshing:false});
            }
            else {
                if(json.re=-100){
                    this.props.dispatch(getAccessToken(false))
                }
            }
        })
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

    navigate2CompetitionResult()
    {
        const {navigator} =this.props;
        if(navigator) {
            navigator.push({
                name: 'CompetitionResult',
                component: CompetitionResult,
                params: {
                    projectId:this.props.projectId,
                    projectName:this.props.projectName,
                    projectType:this.props.projectType,
                }
            })
        }
    }

    navigate2CompetitionTeamList(projectId)
    {
        const {navigator} =this.props;

        if(navigator) {
            navigator.push({
                name: 'CompetitionTeamList',
                component: CompetitionTeamList,
                params: {
                    projectId:projectId
                }
            })
        }
    }

    //比赛场次（团体赛）
    navigate2CompetitionGamesList(projectId)
    {
        const {navigator} =this.props;

        if(navigator) {
            navigator.push({
                name: 'CompetitionGamesList',
                component: CompetitionGamesList,
                params: {
                    projectId:projectId,
                    projectName:this.props.projectName,
                    projectType:this.props.projectType,
                }
            })
        }
    }

    //比赛场次（单项赛）
    navigate2CompetitionGameList(projectId)
    {
        //单项赛（令this.props.gamesId=0）
        const {navigator} =this.props;

        if(navigator) {
            navigator.push({
                name: 'CompetitionGameList',
                component: CompetitionGameList,
                params: {
                    gamesId:0,
                    projectId:projectId,
                    projectName:this.props.projectName,
                    projectType:this.props.projectType,
                }
            })
        }
    }

    //赛事安排
    navigate2CompetitionGroupList(projectId,projectType)
    {
        const {navigator} =this.props;

        if(navigator) {
            navigator.push({
                name: 'CompetitionGroupList',
                component: CompetitionGroupList,
                params: {
                    projectId:projectId,
                    projectType:projectType,
                }
            })
        }
    }

    constructor(props) {
        super(props);
        var ds=new ViewPager.DataSource({pageHasChanged:(p1,p2)=>p1!==p2});
        this.state={
            itemList:[
                {'title':'比赛管理','icon':require('../../../img/com_on.png')},
                {'title':'分组名单','icon':require('../../../img/com_more.png')},
                {'title':'直播间','icon':require('../../../img/com_live.png')},
                {'title':'参赛队伍','icon':require('../../../img/com_record.png')},
                {'title':'对阵成绩','icon':require('../../../img/com_sign.png')},
                {'title':'个人榜','icon':require('../../../img/com_team.png')},
            ],

            competitionId:this.props.competitionId,
            projectId:this.props.projectId,
            type:this.props.type,

            isRefreshing: false,
            fadeAnim: new Animated.Value(1),
            doingFetch:false,
        };
    }

    render(){

        //RefreshControl:当ScrollView处于竖直方向的起点位置（scrollY: 0），此时下拉会触发一个onRefresh事件。
        //"2018-02-01T09:00:00+00:00"
        var endTime = this.props.startTime.substring(0,10)+'T'+this.props.startTime.substring(11,16)+':00+00:00';
        var competition = this.props.competition;

        return (
            <View style={styles.container}>
                <Toolbar width={width} title="比赛" actions={[]} navigator={this.props.navigator}>
                    <ScrollView style={{flex:1}}>
                    <View style={{flex:1,width:width,backgroundColor:'#fff',flexDirection:'column'}}>

                        <View style={{width:width,height:40,alignItems:'center',justifyContent:'center',paddingHorizontal:5,backgroundColor:'#eee',flexDirection:'row'}}>
                                <Text style={styles.cardItemTimeRemainTxt}>距离比赛开始还剩 </Text>
                                <CountDownTimer
                                    //date={new Date(parseInt(this.props.startTime+":00"))}
                                    date={endTime}
                                    days={{plural: '天 ',singular: '天 '}}
                                    hours=':'
                                    mins=':'
                                    segs=''

                                    daysStyle={styles.cardItemTimeRemainTxt}
                                    hoursStyle={styles.cardItemTimeRemainTxt}
                                    minsStyle={styles.cardItemTimeRemainTxt}
                                    secsStyle={styles.cardItemTimeRemainTxt}
                                    firstColonStyle={styles.cardItemTimeRemainTxt}
                                    secondColonStyle={styles.cardItemTimeRemainTxt}
                                />
                        </View>

                        <View style={{width:width,height:250,alignItems:'center',justifyContent:'center',flexDirection:'row'}}>
                            <GridView
                                itemDimension={width/3-20}
                                items={this.state.itemList}
                                style={styles.gridView}
                                renderItem={this.renderRow.bind(this)}
                            />
                        </View>

                        <View style={{flex:1,flexDirection:'row',justifyContent:'center',alignItems: 'center',backgroundColor:'#fff',marginBottom:10}}>
                            <Animated.View style={{opacity: this.state.fadeAnim,flex:1,paddingTop:5,paddingBottom:5,}}>
                                <ScrollView>
                                    {/*比赛安排*/}
                                    <View style={{width:width,height:40,justifyContent:'center',alignItems:'center',paddingHorizontal:5,backgroundColor:'#eee'}}>
                                        <Text style={{fontSize:14,color:'#444'}}>比赛安排</Text>
                                    </View>
                                    <View style={{width:width,flex:1,justifyContent:'center',alignItems:'center',padding:20,backgroundColor:'#fff'}}>
                                        <Text style={{fontSize:16,color:'#000'}}>比赛时间：{competition.startTime}</Text>
                                        <Text style={{fontSize:16,color:'#000'}}>比赛地点：{competition.unitName}</Text>
                                    </View>
                                    {/*比赛规程*/}
                                    <View style={{width:width,height:40,justifyContent:'center',alignItems:'center',paddingHorizontal:5,backgroundColor:'#eee'}}>
                                        <Text style={{fontSize:14,color:'#444'}}>赛事规程</Text>
                                    </View>
                                    <View style={{width:width,flex:1,justifyContent:'center',alignItems:'center',padding:20,backgroundColor:'#fff'}}>
                                        <Text style={{fontSize:16,color:'#000'}}>{competition.competitonSchedule}</Text>
                                    </View>
                                    {/*比赛注意事项*/}
                                    <View style={{width:width,height:40,justifyContent:'center',alignItems:'center',paddingHorizontal:5,backgroundColor:'#eee'}}>
                                        <Text style={{fontSize:14,color:'#444'}}>比赛注意事项</Text>
                                    </View>
                                    <View style={{width:width,flex:1,justifyContent:'center',alignItems:'center',padding:20,backgroundColor:'#fff'}}>
                                        <Text style={{fontSize:16,color:'#000'}}>{competition.competitionRule}</Text>
                                    </View>
                                    {/*场地*/}
                                    <View style={{width:width,height:40,justifyContent:'center',alignItems:'center',paddingHorizontal:5,backgroundColor:'#eee'}}>
                                        <Text style={{fontSize:14,color:'#444'}}>场地</Text>
                                    </View>
                                    <View style={{width:width,flex:1,justifyContent:'center',alignItems:'center',padding:20,backgroundColor:'#fff'}}>
                                        <Text style={{fontSize:16,color:'#000'}}>{competition.competitionArea}</Text>
                                    </View>
                                    {/*报名*/}
                                    <View style={{width:width,height:40,justifyContent:'center',alignItems:'center',paddingHorizontal:5,backgroundColor:'#eee'}}>
                                        <Text style={{fontSize:14,color:'#444'}}>报名</Text>
                                    </View>
                                    <View style={{width:width,flex:1,justifyContent:'center',alignItems:'center',padding:20,backgroundColor:'#fff'}}>
                                        <Text style={{fontSize:16,color:'#000'}}>{competition.competitionSign}</Text>
                                    </View>
                                    {/*奖项设置*/}
                                    <View style={{width:width,height:40,justifyContent:'center',alignItems:'center',paddingHorizontal:5,backgroundColor:'#eee'}}>
                                        <Text style={{fontSize:14,color:'#444'}}>奖项设置</Text>
                                    </View>
                                    <View style={{width:width,flex:1,justifyContent:'center',alignItems:'center',padding:20,backgroundColor:'#fff'}}>
                                        <Text style={{fontSize:16,color:'#000'}}>{competition.competitionReward}</Text>
                                    </View>
                                </ScrollView>
                            </Animated.View>
                        </View>
                    </View>
                    </ScrollView>
                </Toolbar>
            </View>
        );
    }

    renderRow(rowData,rowId)
    {
        return(
        <TouchableOpacity style={{height:width/4,width:width/3-20,flexDirection:'column'}}
                          onPress={()=>{
                              switch(rowId){
                                  case 0:
                                      if(this.props.projectType==6){this.navigate2CompetitionGamesList(this.props.projectId)}
                                      else{this.navigate2CompetitionGameList(this.props.projectId)};break;//比赛管理

                                  case 1:this.navigate2CompetitionGroupList(this.props.projectId,this.props.projectType);break;//分组名单
                                  case 2:this.navigate2LiveHome();break;//直播间
                                  case 3:this.navigate2CompetitionTeamList(this.props.projectId);break;//参赛队伍
                                  case 4:this.navigate2CompetitionResult();break;//对阵成绩
                              }
                          }}
        >
            <View style={{flex:1,padding:5,justifyContent:'center',alignItems:'center'}}>
                <View style={{height:60,width:60,padding:10,justifyContent:'center',alignItems:'center'}}>
                    <Image style={{height:45,width:45}}
                               source={rowData.icon} resizeMode={'stretch'}/>
                </View>
            <Text style={{flex:1,marginTop:5,color:'#666',fontSize:13}}>{rowData.title}</Text>
            </View>
        </TouchableOpacity>
        );
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
        flex: 1
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
    },
    cardItemTimeRemainTxt:{
        fontSize:15,
        color:'#666'
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



export default connect(mapStateToProps)(CompetitionPage);



