import React, {Component} from 'react';
import {
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
    InteractionManager,
    Alert,
    Modal,
    ActivityIndicator,
} from 'react-native';
import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import _ from 'lodash';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CommIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Toolbar,OPTION_SHOW,OPTION_NEVER,ACTION_ADD} from 'react-native-toolbar-wrapper';
import CompetitionTeamList from './CompetitionTeamList'
import CompetitionGamesList from './CompetitionGamesList'
import CompetitionGameList from './CompetitionGameList'
import CompetitionPage from './CompetitionPage'
import CreateProject from './CreateProject'
import {
    fetchGames,disableCompetitionOnFresh,enableCompetitionOnFresh,fetchCompetitions,fetchProjects
} from '../../action/CompetitionActions';

var { height, width } = Dimensions.get('window');

class CompetitionProjectList extends Component {

    goBack(){
        const { navigator } = this.props;
        if(navigator) {
            navigator.pop();
        }
    }

    constructor(props) {
        super(props);
        this.state={
            projects:[
                {'id':1,'name':'男双','num':'20170101','maxNum':6,'nowNum':3,'personNum':7,'gamesNum':10,'type':1},
                {'id':2,'name':'混合团体','num':'20170101','maxNum':10,'nowNum':7,'personNum':8,'gamesNum':3,'type':2},
            ],
        };
    }

    navigate2CompetitionPage(competitionId,projectId,type,startTime,projectType)
    {
        const {navigator} =this.props;

        if(navigator) {
            navigator.push({
                name: 'CompetitionPage',
                component: CompetitionPage,
                params: {
                    competitionId:competitionId,
                    projectId:projectId,
                    type:type,
                    startTime:startTime,
                    projectType:projectType,
                }
            })
        }
    }

    navigate2CreateProject(competitionId)
    {
        const {navigator} =this.props;

        if(navigator) {
            navigator.push({
                name: 'CreateProject',
                component: CreateProject,
                params: {
                    competitionId:competitionId
                }
            })
        }
    }

    render()
    {
        //{'id':1,'name':'男双','maxNum':6,'nowNum':3,'personNum':7,'gamesNum':10,'num':'20170101',type:1},
        var projectList = [];
        var {projects}=this.state;

        if(projects&&projects.length>0)
        {
            projects.map((project,i)=>{

                var projectType='';

                switch (project.type){
                    case '1':projectType='男单';break;
                    case '2':projectType='女单';break;
                    case '3':projectType='男双';break;
                    case '4':projectType='女双';break;
                    case '5':projectType='混双';break;
                    case '6':projectType='团体';break;
                }

                projectList.push(
                    <TouchableOpacity key={i} style={{flexDirection:'column',marginTop:4,backgroundColor:'#fff'}}
                    onPress={()=>{
                        this.navigate2CompetitionPage(this.props.competitionId,project.id,project.type,this.props.startTime,projectType)
                    }}>

                        <View style={{ padding: 6,flexDirection:'row',marginTop:3}}>
                            <View style={{flex:1,justifyContent:'center',alignItems: 'center'}}>
                                <Image resizeMode="stretch" style={{height: 40, width: 40, borderRadius: 20}}
                                       source={require('../../../img/project_icon.png')}/>
                            </View>
                            <View style={{flex:4,flexDirection:'column',alignItems:'flex-start',justifyContent:'center'}}>
                                <Text style={{ color: '#222', fontSize: 15,marginBottom:5}}>{project.name}</Text>
                                <Text style={{ color: '#666', fontSize: 13}}>{project.num}</Text>
                            </View>
                        </View>

                        <View style={{height:0.7,width:width,backgroundColor:'#c2c2c2'}}></View>

                        <View style={{flex:3,padding:10,flexDirection:'column'}}>
                            <View style={{flex:3,flexDirection:'row',marginBottom:3}}>
                                <View style={{flex:1,justifyContent:'flex-start',alignItems: 'center',backgroundColor:'#fff',borderRadius:5,padding:5}}>
                                    <Text style={{color:'#66CDAA'}}>项目类型</Text>
                                </View>
                                <View style={{flex:1,padding:5,marginLeft:5}}>
                                    <Text style={{color:'#5c5c5c',justifyContent:'flex-start',alignItems: 'center'}}>{projectType}</Text>
                                </View>

                                <View style={{flex:1,justifyContent:'flex-start',alignItems: 'center',backgroundColor:'#fff',borderRadius:5,padding:5}}>
                                    <Text style={{color:'#66CDAA'}}>比赛场次</Text>
                                </View>
                                <View style={{flex:1,padding:5,marginLeft:5}}>
                                    <Text style={{color:'#5c5c5c',justifyContent:'flex-start',alignItems: 'center'}}>{project.gamesNum}</Text>
                                </View>
                            </View>

                            <View style={{flex:3,flexDirection:'row',marginBottom:3}}>
                                <View style={{flex:1,justifyContent:'flex-start',alignItems: 'center',backgroundColor:'#fff',borderRadius:5,padding:5}}>
                                    <Text style={{color:'#66CDAA'}}>队数上限</Text>
                                </View>
                                <View style={{flex:1,padding:5,marginLeft:5}}>
                                    <Text style={{color:'#5c5c5c',justifyContent:'flex-start',alignItems: 'center'}}>{project.maxNum}</Text>
                                </View>

                                <View style={{flex:1,justifyContent:'flex-start',alignItems: 'center',backgroundColor:'#fff',borderRadius:5,padding:5}}>
                                    <Text style={{color:'#66CDAA'}}>队员上限</Text>
                                </View>
                                <View style={{flex:1,padding:5,marginLeft:5}}>
                                    <Text style={{color:'#5c5c5c',justifyContent:'flex-start',alignItems: 'center'}}>{project.personNum}</Text>
                                </View>
                            </View>
                        </View>

                        <View style={{height:0.8,width:width,backgroundColor:'#aaa'}}></View>

                    </TouchableOpacity>
                )
            })
        }

        return (
            <View style={styles.container}>
                <Toolbar width={width} title="项目列表" navigator={this.props.navigator}
                         actions={[{icon:ACTION_ADD,show:OPTION_SHOW}]}
                         onPress={(i)=>{
                             if(i==0){
                                 //添加项目
                                 this.navigate2CreateProject(this.props.competitionId)
                             }
                         }}>
                    <ScrollView style={{ flex: 1, width: width, backgroundColor: '#eee' }}>

                        <Animated.View style={{flex: 1, opacity: this.state.fadeAnim,backgroundColor:'#eee' }}>
                            {projectList}
                        </Animated.View>

                    </ScrollView>

                </Toolbar>
            </View>
        )
    }

    componentWillMount()
    {
        //获取所有项目列表
        //{'id':1,'name':'男双','maxNum':6,'nowNum':3,'personNum':7,'gamesNum':10,'num':'20170101',type:1},

        this.props.dispatch(fetchProjects(this.props.competitionId)).then((json)=>{
            if(json.re==1)
            {
                this.setState({projects:json.data});
            }
            else {
                if(json.re=-100){
                    this.props.dispatch(getAccessToken(false))
                }
            }
        })
    }

}

const styles = StyleSheet.create({

    container: {
        flex: 1,
    },
    modalContainer:{
        flex:1,
        justifyContent: 'center',
        padding: 20
    },
    modalBackgroundStyle:{
        backgroundColor:'transparent'
    },
});


module.exports = connect(state=>({
        accessToken:state.user.accessToken,
        personInfo:state.user.personInfo,
    })
)(CompetitionProjectList);



