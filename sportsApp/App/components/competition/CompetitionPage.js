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
import Bridge from '../../native/Bridge'
import GridView from 'react-native-super-grid'
import {Toolbar,OPTION_SHOW,OPTION_NEVER,ACTION_VEDIO,ACTION_BARCODE} from 'react-native-toolbar-wrapper'
import Config from "../../../config";
import Proxy from "../../utils/Proxy";
import ViewPager from 'react-native-viewpager';
import Ionicons from 'react-native-vector-icons/Ionicons'
import proxy from "../../utils/Proxy";
import CompetitionList from './CompetitionList'
import HomePage from '../../components/live/HomePage'
import {
    fetchGames,disableCompetitionOnFresh,enableCompetitionOnFresh,fetchCompetitions,fetchProjects,fetchGameList,fetchAllGameList
} from '../../action/CompetitionActions';

var {height, width,scale} = Dimensions.get('window');
var WeChat = require('react-native-wechat');

var IMGS = [
    require('../../../img/zhibo1.jpeg'),
    require('../../../img/zhibo2.jpeg'),
    require('../../../img/zhibo3.jpeg'),
];

class CompetitionPage extends Component{

    goBack(){
        const { navigator } = this.props;
        if(navigator) {
            navigator.pop();
        }
    }

    _renderPage(data,pageID){
        return (
            <View style={{width:width}}>
                <Image
                    source={data}
                    style={{width:width,flex:3}}
                    resizeMode={"stretch"}
                />
            </View>
        );
    }

    navigate2CompetitionList()
    {
        const { navigator } = this.props;
        if(navigator) {
            navigator.push({
                name: 'CompetitionList',
                component: CompetitionList,
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

    constructor(props) {
        super(props);
        var ds=new ViewPager.DataSource({pageHasChanged:(p1,p2)=>p1!==p2});
        this.state={
            isRefreshing:false,
            dataSource:ds.cloneWithPages(IMGS),
            itemList:[
                {'title':'比赛列表','icon':require('../../../img/com_on.png')},
                {'title':'赛事安排','icon':require('../../../img/com_sign.png')},
                {'title':'参赛队伍','icon':require('../../../img/com_team.png')},
                {'title':'战绩查询','icon':require('../../../img/com_record.png')},
                {'title':'直播间','icon':require('../../../img/com_live.png')},
                {'title':'排行榜','icon':require('../../../img/com_more.png')}],
            notice:[]
        };
    }

    render(){

        var noticeList=null
        if(this.state.notice&&this.state.notice.length>0)
        {
            var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
            noticeList=(
                    <ListView
                        automaticallyAdjustContentInsets={false}
                        dataSource={ds.cloneWithRows(this.state.notice)}
                        renderRow={this.renderNoticeRow.bind(this)}
                    />
            );
        }

        return (
            <View style={styles.container}>
                <Toolbar width={width} title="比赛" navigator={this.props.navigator}
                         actions={[{icon:ACTION_BARCODE,show:OPTION_SHOW}]}
                         onPress={(i)=>{
                             if(i==0)
                             {//扫码报名
                             }
                         }}>

                    <ScrollView style={{flex:1,height:height-100,width:width,backgroundColor:'#fff',flexDirection:'column'}}>

                        <View style={{width:width,height:140}}>
                            <ViewPager
                                style={this.props.style}
                                dataSource={this.state.dataSource}
                                renderPage={this._renderPage}
                                isLoop={true}
                                autoPlay={true}
                            />
                        </View>

                        <View style={{width:width,height:10,justifyContent:'center',paddingHorizontal:5,backgroundColor:'#eee'}}>
                        </View>

                        <View style={{flex:1,alignItems:'center',justifyContent:'center',flexDirection:'row',padding:2}}>
                            <GridView
                                itemDimension={width/3-20}
                                items={this.state.itemList}
                                style={styles.gridView}
                                renderItem={this.renderRow.bind(this)}
                            />
                        </View>

                        <View style={{width:width,height:40,justifyContent:'center',paddingHorizontal:5,backgroundColor:'#eee'}}>
                            <Text style={{size:15,color:'#666'}}>实时战事</Text>
                        </View>

                        <View style={{flex:1,flexDirection:'row',justifyContent:'center',alignItems: 'center',backgroundColor:'#fff',marginBottom:10}}>
                            {noticeList}
                        </View>

                    </ScrollView>
                </Toolbar>
            </View>
        );
    }

    renderRow(rowData,rowId)
    {
        return(
        <TouchableOpacity style={{height:width/3-20,width:width/3-20,flexDirection:'column'}}
                          onPress={()=>{
                              switch(rowId){
                                  case 0:this.navigate2CompetitionList();break;//比赛列表
                                  case 1:break;//赛事安排
                                  case 2:break;//比赛队伍
                                  case 3:break;//战绩查询
                                  case 4:this.navigate2LiveHome();break;//直播间
                                  case 5:break;//排行榜
                              }
                          }}
        >
            <View style={{flex:1,padding:10,justifyContent:'center',alignItems:'center'}}>
                <View style={{height:60,width:60,padding:10,justifyContent:'center',alignItems:'center'}}>
                    <Image style={{height:45,width:45}}
                               source={rowData.icon} resizeMode={'stretch'}/>
                </View>
            <Text style={{flex:1,marginTop:5,color:'#666',fontSize:13}}>{rowData.title}</Text>
            </View>
        </TouchableOpacity>
        );
    }

    renderNoticeRow(rowData,rowId)
    {
        var gameClass = '';
        switch (rowData.gameClass){
            case '1':gameClass='小组赛';break;
            case '2':gameClass='32进16';break;
            case '3':gameClass='16进8';break;
            case '4':gameClass='8进4';break;
            case '5':gameClass='半决赛';break;
            case '6':gameClass='冠亚军决赛';break;
        }

        return(
                <View style={{flex:1,padding:10,justifyContent:'center',alignItems:'center',flexDirection:'row'}}>
                    <Text style={{flex:2,color:'#333',fontSize:13}}>{rowData.teamA} vs {rowData.teamB} {gameClass}</Text>
                    <Text style={{flex:1,color:'#ccc',fontSize:11}}>{rowData.time}</Text>
                </View>
        );
    }

    componentWillMount(){

        //获取比赛列表
        // {'teamA':'陈海云','teamB':'李学庆','gameClass':1,'time':'2018-01-01 10:10'}

        this.props.dispatch(fetchAllGameList()).then((json)=>{
            if(json.re==1)
            {
                this.setState({notice:json.data});
            }
            else {
                if(json.re=-100){
                    this.props.dispatch(getAccessToken(false))
                }
            }
        })

    }

    componentWillUnmount(){
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



