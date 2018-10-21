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
    Platform,
    TouchableOpacity,
    RefreshControl,
    Animated,
    Easing,
    ToastAndroid
} from 'react-native';
import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import PopupDialog,{ScaleAnimation,DefaultAnimation,SlideAnimation} from 'react-native-popup-dialog';
import {getAccessToken,} from '../../action/UserActions';
import {Toolbar,OPTION_SHOW,OPTION_NEVER,ACTION_ADD} from 'react-native-toolbar-wrapper'
import ModalDropdown from 'react-native-modal-dropdown';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CompetitionTeamPerson from './CompetitionTeamPersonList'
import ActionSheet from 'react-native-actionsheet';
import {
    fetchGames,disableCompetitionOnFresh,enableCompetitionOnFresh,fetchCompetitions,fetchProjects,fetchTeamList,fetchRankList,fetchGroupList,createGroupList
} from '../../action/CompetitionActions';

var {height, width} = Dimensions.get('window');

class CompetitionGroupList extends Component {

    goBack() {
        const {navigator} = this.props;
        if (navigator) {
            navigator.pop();
        }
    }

    //选比赛等级
    _handlePress(index) {
        if(index!==0){
            var gameClassStr = this.state.gameClassButtons[index];
            var gameClass = index;
            this.setState({gameClass:gameClass,gameClassStr:gameClassStr});
        }
    }

    show(actionSheet) {
        this[actionSheet].show();
    }


    renderRow(rowData,sectionId,rowId){

        //{winCount=0, groupId=1, teamId=202, gameClass=6, rank=1, id=1, team=单打1队,
        // avatar=https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83eqhGvzphLhtWoG1KjVLF1VFb9tD2ZqlRQ2IcI6jWGz9ZBib38jyd4oBh9BgicfRqQ4469Rzzkj46k7w/132,
        // lostCount=0}

        var imguri = rowData.avatar;
        var no = parseInt(rowId)+1

        var row=(
            <View style={{padding:5,backgroundColor:'#fff',flexDirection:'row',marginTop:1}}>

                {/*队伍*/}
                <View style={{flex:3,flexDirection:'row',padding:5,backgroundColor:'transparent'}}>
                    <View style={{flex:1,justifyContent:'center',alignItems: 'flex-start'}}>
                        <Text style={{color:'#5c5c5c',marginLeft:5}}>{no}</Text>
                    </View>
                    <View style={{flex:1,justifyContent:'center',alignItems: 'center'}}>
                    <Image resizeMode="stretch" style={{height:30,width:30,borderRadius:15}} source={{uri:imguri}}/>
                    </View>
                    <View style={{flex:2,justifyContent:'center',alignItems: 'center'}}>
                        <Text style={{color:'#5c5c5c'}}>{rowData.team}</Text>
                    </View>
                </View>
                {/*得分*/}
                <View style={{flex:1,padding:5,justifyContent:'center',alignItems: 'center'}}>
                    <Text style={{color:'#5c5c5c'}}>{rowData.winCount}</Text>
                </View>
                {/*失分*/}
                <View style={{flex:1,padding:5,justifyContent:'center',alignItems: 'center'}}>
                    <Text style={{color:'#5c5c5c'}}>{rowData.lostCount}</Text>
                </View>
                {/*排名*/}
                <View style={{flex:1,padding:5,justifyContent:'center',alignItems: 'center'}}>
                    <Text style={{color:'#5c5c5c'}}>{rowData.rank}</Text>
                </View>
                {/*删除*/}
                <TouchableOpacity style={{flex:1,padding:5,justifyContent:'center',alignItems: 'flex-end'}}
                onPress={()=>{

                }}>
                    <Ionicons name='md-close' size={18} color="#666"/>
                </TouchableOpacity>
                </View>
        );

        return row;
    }

    constructor(props) {
        super(props);
        this.state = {
            doingFetch: false,
            isRefreshing: false,
            fadeAnim: new Animated.Value(1),
            teams:[],
            //初始
            gameClass:7,
            gameClassStr:null,
            gameClassButtons:['取消','冠亚军决赛','半决赛','8进4','16进8','32进16','小组赛'],

            //分组
            ListA:[],
            ListB:[],
            ListC:[],
            ListD:[],
            ListE:[],
            ListF:[],
            ListG:[],
            ListH:[],
        }

    }

    render() {

        const CANCEL_INDEX = 0;
        const DESTRUCTIVE_INDEX = 1;



        //A组
        var ListAView = null;
        var ListA = this.state.ListA;

            var dsA = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
            if (ListA !== undefined && ListA !== null && ListA.length > 0) {
                ListAView = (
                    <ListView
                        automaticallyAdjustContentInsets={false}
                        dataSource={dsA.cloneWithRows(ListA)}
                        renderRow={this.renderRow.bind(this)}
                    />
                );
            }

        //B组
        var ListBView = null;
        var ListB = this.state.ListB;

        var dsB = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        if (ListB !== undefined && ListB !== null && ListB.length > 0) {
            ListBView = (
                <ListView
                    automaticallyAdjustContentInsets={false}
                    dataSource={dsB.cloneWithRows(ListB)}
                    renderRow={this.renderRow.bind(this)}
                />
            );
        }

        //C组
        var ListCView = null;
        var ListC = this.state.ListC;

        var dsC = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        if (ListC !== undefined && ListC !== null && ListC.length > 0) {
            ListCView = (
                <ListView
                    automaticallyAdjustContentInsets={false}
                    dataSource={dsC.cloneWithRows(ListC)}
                    renderRow={this.renderRow.bind(this)}
                />
            );
        }

        //D组
        var ListDView = null;
        var ListD = this.state.ListD;

        var dsD = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        if (ListD !== undefined && ListD !== null && ListD.length > 0) {
            ListDView = (
                <ListView
                    automaticallyAdjustContentInsets={false}
                    dataSource={dsD.cloneWithRows(ListD)}
                    renderRow={this.renderRow.bind(this)}
                />
            );
        }

        //E组
        var ListEView = null;
        var ListE = this.state.ListE;

        var dsE = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        if (ListE !== undefined && ListE !== null && ListE.length > 0) {
            ListEView = (
                <ListView
                    automaticallyAdjustContentInsets={false}
                    dataSource={dsE.cloneWithRows(ListE)}
                    renderRow={this.renderRow.bind(this)}
                />
            );
        }

        //F组
        var ListFView = null;
        var ListF = this.state.ListF;

        var dsF = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        if (ListF !== undefined && ListF !== null && ListF.length > 0) {
            ListFView = (
                <ListView
                    automaticallyAdjustContentInsets={false}
                    dataSource={dsF.cloneWithRows(ListF)}
                    renderRow={this.renderRow.bind(this)}
                />
            );
        }

        //G组
        var ListGView = null;
        var ListG = this.state.ListG;

        var dsG = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        if (ListG !== undefined && ListG !== null && ListG.length > 0) {
            ListGView = (
                <ListView
                    automaticallyAdjustContentInsets={false}
                    dataSource={dsG.cloneWithRows(ListG)}
                    renderRow={this.renderRow.bind(this)}
                />
            );
        }

        //H组
        var ListHView = null;
        var ListH = this.state.ListH;

        var dsH = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        if (ListH !== undefined && ListH !== null && ListH.length > 0) {
            ListHView = (
                <ListView
                    automaticallyAdjustContentInsets={false}
                    dataSource={dsH.cloneWithRows(ListH)}
                    renderRow={this.renderRow.bind(this)}
                />
            );
        }

        //表头
        var head = (
            <View style={{padding:5,backgroundColor:'#eee',flexDirection:'row',marginTop:1}}>
                {/*队伍*/}
            <View style={{flex:3,padding:5,backgroundColor:'transparent',justifyContent:'center',alignItems:'center'}}>
                    <Text style={{color:'#5c5c5c'}}>队伍</Text>
            </View>
            {/*得分*/}
            <View style={{flex:1,padding:5,justifyContent:'center',alignItems: 'center'}}>
                <Text style={{color:'#5c5c5c'}}>得分</Text>
            </View>
            {/*失分*/}
            <View style={{flex:1,padding:5,justifyContent:'center',alignItems: 'center'}}>
                <Text style={{color:'#5c5c5c'}}>失分</Text>
            </View>
            {/*排名*/}
            <View style={{flex:1,padding:5,justifyContent:'center',alignItems: 'center'}}>
                <Text style={{color:'#5c5c5c'}}>排名</Text>
            </View>
            {/*增加*/}
            <TouchableOpacity style={{flex:1,padding:5,justifyContent:'center',alignItems: 'flex-end'}}
                              onPress={()=>{

                              }}>
                <Ionicons name='md-add' size={18} color="#666"/>
            </TouchableOpacity>
        </View>
        )

        return (
            <View style={{flex:1}}>
                <Toolbar width={width}  title="赛事安排" navigator={this.props.navigator}
                         actions={[]}
                         onPress={(i)=>{
                             this.goBack()
                         }}>
                    <View style={{width:width,height:40,backgroundColor:'#fff',flexDirection:'row',marginTop:0.7,marginBottom:0.7}}>
                        <TouchableOpacity style={{flex:3,flexDirection:'row',justifyContent:'center',alignItems: 'center',backgroundColor:'#66CDAA'}}
                                          onPress={()=>{ this.show('actionSheet'); }}>
                            {
                                this.state.gameClassStr==null?
                                    <View style={{flex:1,justifyContent:'center',alignItems: 'center',flexDirection:'row'}}>
                                        <Text style={{color:'#fff',fontSize:14}}>请选择比赛等级</Text>
                                    </View> :
                                    <View style={{flex:1,justifyContent:'center',alignItems: 'center',flexDirection:'row'}}>
                                        <Text style={{color:'#fff',fontSize:14}}>{this.state.gameClassStr}</Text>
                                    </View>

                            }
                            <ActionSheet
                                ref={(p) => {
                                    this.actionSheet =p;
                                }}
                                title="请选择比赛等级"
                                options={this.state.gameClassButtons}
                                cancelButtonIndex={CANCEL_INDEX}
                                destructiveButtonIndex={DESTRUCTIVE_INDEX}
                                onPress={
                                    (data)=>{ this._handlePress(data); }
                                }
                            />
                        </TouchableOpacity>
                        <TouchableOpacity style={{flex:1,justifyContent:'center',alignItems: 'center',backgroundColor:'#66CDAA',marginLeft:0.7}}
                                          onPress={()=>{
                                              this.createGroupList();
                                          }}>
                        <Text style={{color:'#fff',fontSize:14}}>生成名单</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{flex:1,justifyContent:'center',alignItems: 'center',backgroundColor:'#66CDAA',marginLeft:0.7}}
                                          onPress={()=>{  }}>
                           <Text style={{color:'#fff',fontSize:14}}>保存修改</Text>
                        </TouchableOpacity>
                    </View>
                    {<ScrollView>
                        {//A组
                            (ListA==null || ListA.length==0)?null:
                                <View><View style={{height:30,width:width,backgroundColor:'#66CDAA',alignItems:'center',justifyContent:'center',flexDirection:'column'}}>
                                    <Text style={{color:'#fff',fontSize:14}}>{this.props.projectType} A组</Text></View>
                                    {head}
                                    {ListAView}
                                    </View>
                        }
                        {//B组
                            (ListB==null || ListB.length==0)?null:
                                <View><View style={{height:30,width:width,backgroundColor:'#66CDAA',alignItems:'center',justifyContent:'center'}}>
                                    <Text style={{color:'#fff',fontSize:14}}>{this.props.projectType} B组</Text></View>{head}{ListBView}</View>
                        }
                        {//C组
                            (ListC==null || ListC.length==0)?null:
                                <View><View style={{height:30,width:width,backgroundColor:'#66CDAA',alignItems:'center',justifyContent:'center'}}>
                                    <Text style={{color:'#fff',fontSize:14}}>{this.props.projectType} C组</Text></View>{head}{ListCView}</View>
                        }
                        {//D组
                            (ListD==null || ListD.length==0)?null:
                                <View><View style={{height:30,width:width,backgroundColor:'#66CDAA',alignItems:'center',justifyContent:'center'}}>
                                    <Text style={{color:'#fff',fontSize:14}}>{this.props.projectType} D组</Text></View>{head}{ListDView}</View>
                        }
                        {//E组
                            (ListE==null || ListE.length==0)?null:
                                <View><View style={{height:30,width:width,backgroundColor:'#66CDAA',alignItems:'center',justifyContent:'center'}}>
                                    <Text style={{color:'#fff',fontSize:14}}>{this.props.projectType} E组</Text></View>{head}{ListEView}</View>
                        }
                        {//F组
                            (ListF==null || ListF.length==0)?null:
                                <View><View style={{height:30,width:width,backgroundColor:'#66CDAA',alignItems:'center',justifyContent:'center'}}>
                                    <Text style={{color:'#fff',fontSize:14}}>{this.props.projectType} F组</Text></View>{head}{ListFView}</View>
                        }
                        {//G组
                            (ListG==null || ListG.length==0)?null:
                                <View><View style={{height:30,width:width,backgroundColor:'#66CDAA',alignItems:'center',justifyContent:'center'}}>
                                    <Text style={{color:'#fff',fontSize:14}}>{this.props.projectType} G组</Text></View>{head}{ListGView}</View>
                        }
                        {//H组
                            (ListH==null || ListH.length==0)?null:
                                <View><View style={{height:30,width:width,backgroundColor:'#66CDAA',alignItems:'center',justifyContent:'center'}}>
                                    <Text style={{color:'#fff',fontSize:14}}>{this.props.projectType} H组</Text></View>{head}{ListHView}</View>
                        }
                    </ScrollView>
                    }
                </Toolbar>
            </View>
        );
    }

    createGroupList(){
        this.props.dispatch(createGroupList(this.props.projectId,this.state.gameClass)).then((json)=>{
            if(json.re==1)
            {
                this.setState({teams:json.data});
                var teams = json.data;
                var listA=[];var listB=[];var listC=[];var listD=[];
                var listE=[];var listF=[];var listG=[];var listH=[];

                for(var i=0;i<teams.length;i++){
                    var team = teams[i]
                    switch(team.groupId){
                        case 0:listA.push(team);break;
                        case 1:listB.push(team);break;
                        case 2:listC.push(team);break;
                        case 3:listD.push(team);break;
                        case 4:listE.push(team);break;
                        case 5:listF.push(team);break;
                        case 6:listG.push(team);break;
                        case 7:listH.push(team);break;
                    }
                }

                this.setState({ListA:listA,ListB:listB,ListC:listC,ListD:listD,ListE:listE,ListF:listF,ListG:listG,ListH:listH});
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

    componentDidMount(){

        //{winCount=0, groupId=1, teamId=202, gameClass=6, rank=1, id=1, team=单打1队,
        // avatar=https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83eqhGvzphLhtWoG1KjVLF1VFb9tD2ZqlRQ2IcI6jWGz9ZBib38jyd4oBh9BgicfRqQ4469Rzzkj46k7w/132,
        // lostCount=0}

        this.props.dispatch(fetchGroupList(this.props.projectId)).then((json)=>{
            if(json.re==1)
            {
                this.setState({teams:json.data});
                var teams = json.data;
                var listA=[];var listB=[];var listC=[];var listD=[];
                var listE=[];var listF=[];var listG=[];var listH=[];

                for(var i=0;i<teams.length;i++){
                    var team = teams[i]

                    switch(team.groupId){
                        case 0:listA.push(team);break;
                        case 1:listB.push(team);break;
                        case 2:listC.push(team);break;
                        case 3:listD.push(team);break;
                        case 4:listE.push(team);break;
                        case 5:listF.push(team);break;
                        case 6:listG.push(team);break;
                        case 7:listH.push(team);break;
                    }
                }

                this.setState({ListA:listA,ListB:listB,ListC:listC,ListD:listD,ListE:listE,ListF:listF,ListG:listG,ListH:listH});
            }
            else {
                if(json.re=-100){
                    this.props.dispatch(getAccessToken(false))
                }
            }
        })

    }

}

var styles = StyleSheet.create({
    container: {
    },
    siftWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        backgroundColor: '#fff',
        height: 44,
        borderBottomColor: '#cdcdcd',
    },
    viewWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        backgroundColor: '#f5f5f5',
        height: 50,
        borderBottomColor: '#cdcdcd',
    },
    siftCell: {
        height: 44,
        flexDirection: 'row',
        alignItems: 'center',
    },
    viewCell: {
        height: 50,
        flexDirection: 'column',
        alignItems: 'flex-start',
    },
    orderByFont: {
        color:'#5c5c5c',
        marginRight: 5
    },
    paymentItem: {
        height: 80,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        backgroundColor: '#fff',
    },
    flexContainer: {
        flexDirection: 'row',
    },
    textstyle: {
        fontSize: 13,
        textAlign: 'center',
        color:'#646464',
        justifyContent:'center',
    },
});


module.exports = connect(state=>({
        accessToken:state.user.accessToken,
        personInfo:state.user.personInfo,
    })
)(CompetitionGroupList);



