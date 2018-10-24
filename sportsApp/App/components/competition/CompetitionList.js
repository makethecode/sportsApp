import React, { Component } from 'react';
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
    Modal,
    ActivityIndicator,
} from 'react-native';
import { connect } from 'react-redux';
import {Toolbar,OPTION_SHOW,OPTION_NEVER,ACTION_ADD} from 'react-native-toolbar-wrapper'
import Icon from 'react-native-vector-icons/FontAwesome';
import {
    fetchGames,disableCompetitionOnFresh,enableCompetitionOnFresh,fetchCompetitions
} from '../../action/CompetitionActions';
import {getAccessToken} from '../../action/UserActions';
import CompetitionProjectList from './CompetitionProjectList';
import Calendar from 'react-native-calendar-select';
import CreateCompetition from './CreateCompetition'

var { height, width } = Dimensions.get('window');

class CompetitionList extends Component {

    goBack() {
        const { navigator } = this.props;
        if (navigator) {
            navigator.pop();
        }
    }


    _onRefresh() {
        this.setState({isRefreshing: true, fadeAnim: new Animated.Value(0)});
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
        }.bind(this), 500);

        //刷新比赛列表
        //this.props.dispatch(enableCompetitionOnFresh());

    }

    navigateCreateCompetition()
    {
        const { navigator } = this.props;
        if(navigator) {
            navigator.push({
                name: 'CreateCompetition',
                component: CreateCompetition,
                params: {

                }
            })
        }
    }

    navigateCompetitionProjectList(competitionId,startTime)
    {
        const { navigator } = this.props;
        if(navigator) {
            navigator.push({
                name: 'CompetitionProjectList',
                component: CompetitionProjectList,
                params: {
                    competitionId:competitionId,
                    startTime:startTime,
                }
            })
        }
    }

    renderRow(rowData,sectionId,rowId){

        //{brief=鼓励学生学习, unitName=山东体育学院羽毛球馆, headImgUrl=https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83eqhGvzphLhtWoG1KjVLF1VFb9tD2ZqlRQ2IcI6jWGz9ZBib38jyd4oBh9BgicfRqQ4469Rzzkj46k7w/132,
        // name=山大实验室友谊赛, host=软件实验室, unitId=1, personId=3, perNum=wbh, startTime=2018-02-01 09:00, id=1, endTime=2018-03-01 18:00}

        if(rowData.brief==null)rowData.brief='暂无简介'

        return (
            <TouchableOpacity style={{ flexDirection: 'column', borderBottomWidth: 1, borderColor: '#ccc', marginTop: 4 ,backgroundColor:'#fff'}}
                              onPress={()=>{
                                  this.navigateCompetitionProjectList(rowData.id,rowData.startTime);
                              }}>
                <View style={{ flex: 1, flexDirection: 'column', alignItems: 'flex-start',marginBotton:5}}>
                    <View style={{ padding: 6, paddingHorizontal: 10 ,flexDirection:'row',}}>
                        <View style={{padding:4,flex:1,alignItems:'center',flexDirection:'row'}}>
                            <Text style={{ color: '#222', fontSize: 19 }}>
                                {rowData.name}
                            </Text>
                        </View>
                    </View>

                    <View style={{ padding:6, paddingHorizontal: 12,flexDirection:'column'}}>
                        <Text style={{ color: '#666', fontSize: 13}}>
                            {rowData.brief}
                        </Text>
                    </View>

                    <View style={{ padding: 3,flexDirection:'row',marginTop:3}}>
                        {
                            rowData.headImgUrl!="" && rowData.headImgUrl!=null?
                            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                                <Image resizeMode="stretch" style={{height: 40, width: 40, borderRadius: 20}}
                                       source={{uri:rowData.headImgUrl}}/>
                            </View>:
                                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                                    <Image resizeMode="stretch" style={{height: 40, width: 40, borderRadius: 20}}
                                           source={require('../../../img/portrait.jpg')}/>
                                </View>
                        }
                        <View style={{flex:2,flexDirection:'column',alignItems:'flex-start',justifyContent:'center'}}>
                            <Text style={{ color: '#222', fontSize: 16,marginBottom:5}}>{rowData.host}</Text>
                            <Text style={{ color: '#666', fontSize: 13}}>{rowData.perNum}</Text>
                        </View>
                        <View style={{flex:3,flexDirection:'column',alignItems:'flex-end',justifyContent:'center',marginRight:10}}>
                            <View style={{flex:1,flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
                                <View style={{backgroundColor: '#efb66a', borderRadius:6, padding:4,marginRight:4 }}>
                                    <Text style={{ color: '#fff', fontSize: 13 }}>
                                        起
                                    </Text>
                                </View>
                                <Text style={{ color: '#555', fontSize: 14, marginBottom:2}}>{rowData.startTime}</Text>
                            </View>

                            <View style={{flex:1,flexDirection:'row',marginTop:3,alignItems:'center',justifyContent:'center'}}>
                                <View style={{backgroundColor: '#efb66a', borderRadius:6, padding:4,marginRight:4 }}>
                                    <Text style={{ color: '#fff', fontSize: 13 }}>
                                        终
                                    </Text>
                                </View>
                                <Text style={{ color: '#555', fontSize: 14, marginBottom:2}}>{rowData.endTime}</Text>
                            </View>
                        </View>
                    </View>

                    <View style={{ paddingTop: 6, paddingBottom: 4, paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center',marginBottom:5}}>
                        {/*场地*/}
                        <View style={{backgroundColor: '#fc3c3f', borderRadius: 6, padding: 4, paddingHorizontal: 6, }}>
                            <Text style={{ color: '#fff', fontSize: 13 }}>
                                {rowData.unitName}
                            </Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        )

    }

    constructor(props) {
        super(props);
        this.state = {
            doingFetch:false,
            isRefreshing:false,
            fadeAnim:new Animated.Value(1),
            competition:[],

            currentDate:'全部',
            nowDate:new Date().getTime(),
            startDate: new Date(new Date().getTime() - 7*24*3600*1000),
            endDate: new Date(),
        };

        this.confirmDate = this.confirmDate.bind(this);
        this.openCalendar = this.openCalendar.bind(this);
    }

    showScaleAnimationDialog() {
        this.scaleAnimationDialog.show();
    }

    openCalendar() {
        this.calendar && this.calendar.open();
    }

    confirmDate({startDate, endDate, startMoment, endMoment}) {
        this.setState({
            startDate,
            endDate
        });

        var startTime = startDate.getMonth()+1+'月'+startDate.getDate()+'日';
        var endTime = endDate.getMonth()+1+'月'+endDate.getDate()+'日';
        var currentTime = startTime+'~'+endTime;

        var resList=[];

    }

    render() {

        var competitionListView=null;
        var competition = this.state.competition;

            var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
            if (competition !== undefined && competition !== null && competition.length > 0)
            {
                competitionListView = (
                    <ListView
                        automaticallyAdjustContentInsets={false}
                        dataSource={ds.cloneWithRows(competition)}
                        renderRow={this.renderRow.bind(this)}
                    />
                );
            }

        let customI18n = {
            'w': ['', '周一', '周二', '周三', '周四', '周五', '周六', '周日'],
            'weekday': ['', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期天'],
            'text': {
                'start': '起始日期',
                'end': '结束日期',
                'date': '日期',
                'save': '确认',
                'clear': '重置'
            },
            'date': 'DD / MM'  // date format
        };
        // optional property, too.
        let color = {
            subColor: '#f0f0f0'
        };


        return (
            <View style={styles.container}>
                <Toolbar width={width} title="比赛列表" navigator={this.props.navigator}
                         actions={[{icon:ACTION_ADD,show:OPTION_SHOW}]}
                         onPress={(i)=>{
                             if(i==0){
                                 //添加比赛
                                 this.navigateCreateCompetition()
                             }
                         }}>
                    <View
                        style={[styles.viewWrapper, {zIndex: 1},{borderBottomWidth: StyleSheet.hairlineWidth}]}>
                        <View style={styles.viewCell}>
                            <Text style={{marginRight:5,fontSize:14,color:'#333'}}>{this.state.currentDate}</Text>
                        </View>
                        <TouchableOpacity style={{width: 22, height: 22, alignItems:'flex-end'}} onPress={this.openCalendar}>
                            <Image
                                style={{width: 22, height: 22, alignItems:'flex-end'}}
                                source={require('../../../img/canlendar.png')}
                            />
                        </TouchableOpacity>
                        <Calendar
                            i18n="en"
                            ref={(calendar) => {this.calendar = calendar;}}
                            customI18n={customI18n}
                            color={color}
                            format="YYYYMMDD"
                            minDate="20180101"
                            maxDate="20190101"
                            startDate={this.state.startDate}
                            endDate={this.state.endDate}
                            onConfirm={this.confirmDate}
                        />
                    </View>

                    {<View style={{flex:5,backgroundColor:'#eee'}}>
                        <Animated.View style={{opacity: this.state.fadeAnim,height:height-150,paddingTop:5,paddingBottom:5,}}>
                            <ScrollView
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
                            >
                                {competitionListView}
                                {
                                    competitionListView==null?
                                        null:
                                        <View style={{justifyContent:'center',alignItems: 'center',backgroundColor:'#eee',padding:10}}>
                                            <Text style={{color:'#343434',fontSize:13,alignItems: 'center',justifyContent:'center'}}>已经全部加载完毕</Text>
                                        </View>
                                }

                            </ScrollView>

                        </Animated.View>
                    </View>}

                </Toolbar>

            </View>
        )
    }

    componentDidMount()
    {
        //获取所有比赛信息
        //{brief=鼓励学生学习, unitName=山东体育学院羽毛球馆, headImgUrl=https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83eqhGvzphLhtWoG1KjVLF1VFb9tD2ZqlRQ2IcI6jWGz9ZBib38jyd4oBh9BgicfRqQ4469Rzzkj46k7w/132,
        // name=山大实验室友谊赛, host=软件实验室, unitId=1, personId=3, perNum=wbh, startTime=2018-02-01 09:00, id=1, endTime=2018-03-01 18:00}

        this.props.dispatch(fetchCompetitions()).then((json)=>{
            if(json.re==1)
            {
                this.setState({competition:json.data});
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
        backgroundColor: '#fff'
    },
    popoverContent: {
        width: 100,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    popoverText: {
        color: '#ccc',
        fontSize: 14
    },
    viewWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        backgroundColor: '#f5f5f5',
        height: 40,
        borderBottomColor: '#cdcdcd',
    },
    viewCell: {
        height: 40,
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent:'center'
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

const mapStateToProps = (state, ownProps) => {

    const props = {
        userType: state.user.usertype.perTypeCode,
    }
    return props
}


//export default connect(mapStateToProps)(CompetitionList);
module.exports = connect(state=>({
        accessToken:state.user.accessToken,
        competitionList:state.competitions.competitionList,
        competitionFresh:state.competitions.competitionFresh,
    })
)(CompetitionList);
