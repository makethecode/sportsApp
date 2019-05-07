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
    DeviceEventEmitter
} from 'react-native';
import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import ModalDropdown from 'react-native-modal-dropdown';
import _ from 'lodash';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CommIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Toolbar,OPTION_SHOW,OPTION_NEVER} from 'react-native-toolbar-wrapper';
import ActionSheet from 'react-native-actionsheet';
import CompetitionGameModal from './CompetitonGameModal'
import {
    fetchGames,disableCompetitionOnFresh,enableCompetitionOnFresh,fetchCompetitions,fetchProjects,fetchGamesList,createCompetitonGames
} from '../../action/CompetitionActions';
import CompetitionGameOfGamesList from './CompetitionGameOfGamesList'
import GameFilter from '../../utils/GameFilter'
var Popover = require('react-native-popover');

var { height, width } = Dimensions.get('window');
const dropdownWidth = width/2-20;

class CompetitionGamesList extends Component {

    goBack(){
        const { navigator } = this.props;
        if(navigator) {
            navigator.pop();
        }
    }

    navigate2CompetitionGameOfGamesList(games)
    {
        //团体赛中的单项赛
        const {navigator} =this.props;

        if(navigator) {
            navigator.push({
                name: 'CompetitionGameOfGamesList',
                component: CompetitionGameOfGamesList,
                params: {
                    games:games,
                    projectId:this.props.projectId,
                    projectName:this.props.projectName,
                    projectType:this.props.projectType,
                }
            })
        }
    }

    constructor(props) {
        super(props);
        this.state={
            games:[],
            allgames:[],
            modalVisible:false,
            game:[],
            teamA:null,
            teamB:null,

            list1:[],//小组赛
            list2:[],//32进16
            list3:[],//16进8
            list4:[],//8进4
            list5:[],//半决赛
            list6:[],//冠亚军决赛

            showProgress:false,

            //下拉列表属性
            gameClassId:-1,
            groupId:-1,
            gameClassStr:'赛制',
            groupStr:'组别',
            gameClassList:['小组赛','32进16','16进8','8进4','半决赛','冠亚军决赛'],
            groupList:['A组','B组','C组','D组','E组','F组','G组','H组'],
            showGameClassDropdown:false,
            showGroupDropdown:false,
        };
    }

    renderGamesRow(rowData,sectionId,rowId){

        // {'id':33,'teamA':'陈海云','teamB':'李学庆','scoreA':0,'scoreB':10,'startTime':'2018-12-10 08:00','endTime':'2018-12-11 10:00',state:0,
        //     'teamAimg':'https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83er7qoZtfnhNSGgsCAyiaaa6XE1D8RAJgTQouhudfRISF9ysc4ywfJK8NetUpScMUrsJCO8X0JYcobw/0',
        //     'teamBimg':'https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83erqf66rr6j1HnoZhVfeIjBgaBTj4QoxjR2LicHTVB2ObPpia0EP6wrOllcMGktWBFWhlt0bsnH4txww/132',
        //     'gameClass':1,'groupId':1,
        //     'gameList':[{'personA':'陈海云、邓养吾','personB':'邹鹏、小吴','scoreA':1,'socreB':0,state:1},{'personA':'陈海云、邓养吾','personB':'邹鹏、小吴','scoreA':0,'socreB':0,state:0}]}

        var gameClass = '';
        switch (rowData.gameClass){
            case '1':gameClass='小组赛';break;
            case '2':gameClass='32进16';break;
            case '3':gameClass='16进8';break;
            case '4':gameClass='8进4';break;
            case '5':gameClass='半决赛';break;
            case '6':gameClass='冠亚军决赛';break;
        }

        var group = '';
        switch (rowData.groupId){
            case 0:group='A组';break;
            case 1:group='B组';break;
            case 2:group='C组';break;
            case 3:group='D组';break;
            case 4:group='E组';break;
            case 5:group='F组';break;
            case 6:group='G组';break;
            case 7:group='H组';break;
        }

        return (
            <TouchableOpacity style={{backgroundColor:'#fff',marginTop:4}}
                              onPress={()=>{
                                  //this.setState({game:rowData.gameList,teamA:rowData.teamA,teamB:rowData.teamB,modalVisible:true});
                                  //团体赛转单项赛
                                  this.navigate2CompetitionGameOfGamesList(rowData)
                              }}>
                <View style={{ flex: 1, flexDirection: 'column', alignItems: 'flex-start',marginBotton:1}}>

                    <View style={{width:width,height:100,padding:6, paddingHorizontal: 12,flexDirection:'row'}}>

                        <View style={{flex:1,flexDirection:'column',justifyContent:'center',alignItems:'center'}}>
                            {
                                rowData.teamAimg!=null && rowData.teamAimg!=''?
                                <View><Image style={{height: 45, width: 45, borderRadius: 23}}
                                             source={{uri: rowData.teamAimg}}/></View>:
                                    <View><Image style={{height: 45, width: 45, borderRadius: 23}}
                                                 source={require('../../../img/portrait.jpg')}/></View>
                            }
                        <Text style={{marginTop:10,fontSize:12,color:'#666'}}>{rowData.teamA}</Text>
                    </View>

                    {
                        rowData.state == '1'?
                        <View style={{flex: 2, flexDirection: 'row',justifyContent:'center',alignItems:'center',flexDirection:'column'}}>
                            <Text style={{fontSize:13,flex:1,color:'#333'}}>{gameClass} {group}</Text>
                            <Text style={{fontSize:12,flex:1,color:'#333'}}>{rowData.startTime}</Text>
                            <Text style={{fontSize:20,flex:3}}>{rowData.scoreA} - {rowData.scoreB}</Text>
                        </View>
                            :
                            <View style={{flex:2, flexDirection: 'row',justifyContent:'center',alignItems:'center',flexDirection:'column'}}>
                                <Text style={{fontSize:12,flex:1,color:'#333'}}>{gameClass} {group}</Text>
                                <Text style={{fontSize:12,flex:1,color:'#333'}}>{rowData.startTime}</Text>
                                <Text style={{fontSize:20,flex:3}}>未开始</Text>
                            </View>
                    }

                    <View style={{flex:1,flexDirection:'column',justifyContent:'center',alignItems:'center'}}>
                        {
                            rowData.teamBimg!=null && rowData.teamBimg!=''?
                                <View><Image style={{height: 45, width: 45, borderRadius: 23}}
                                             source={{uri: rowData.teamBimg}}/></View>:
                                <View><Image style={{height: 45, width: 45, borderRadius: 23}}
                                             source={require('../../../img/portrait.jpg')}/></View>
                        }
                        <Text style={{marginTop:10,fontSize:12,color:'#666'}}>{rowData.teamB}</Text>
                    </View>

                    </View>
                </View>
                <View style={{width:width,height:0.7,backgroundColor:'#aaa'}}/>
            </TouchableOpacity>
        )

    }

    render()
    {

        var displayArea = {x:5, y:10, width:width-10, height: height - 10};

        let gameClassIcon = this.state.showGameClassDropdown ? require('../../../img/up_icon.png') : require('../../../img/down_icon.png');
        let groupIcon = this.state.showGroupDropdown ? require('../../../img/up_icon.png') : require('../../../img/down_icon.png');

        //小组赛列表
        var ListView1=null;
        var List1 = GameFilter.filter(this.state.list1,this.state.gameClassId,this.state.groupId);//小组赛
        var ds1 = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        if (List1 !== undefined && List1 !== null && List1.length > 0)
        {
            ListView1 = (
                <ListView
                    automaticallyAdjustContentInsets={false}
                    dataSource={ds1.cloneWithRows(List1)}
                    renderRow={this.renderGamesRow.bind(this)}
                />
            );
        }

        //32进16列表
        var ListView2=null;
        var List2 = GameFilter.filter(this.state.list2,this.state.gameClassId,this.state.groupId);//32进16赛
        var ds2 = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        if (List2 !== undefined && List2 !== null && List2.length > 0)
        {
            ListView2 = (
                <ListView
                    automaticallyAdjustContentInsets={false}
                    dataSource={ds2.cloneWithRows(List2)}
                    renderRow={this.renderGamesRow.bind(this)}
                />
            );
        }

        //16进8列表
        var ListView3=null;
        var List3 = GameFilter.filter(this.state.list3,this.state.gameClassId,this.state.groupId);//16进8赛
        var ds3 = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        if (List3 !== undefined && List3 !== null && List3.length > 0)
        {
            ListView3 = (
                <ListView
                    automaticallyAdjustContentInsets={false}
                    dataSource={ds3.cloneWithRows(List3)}
                    renderRow={this.renderGamesRow.bind(this)}
                />
            );
        }

        //8进4列表
        var ListView4=null;
        var List4 = GameFilter.filter(this.state.list4,this.state.gameClassId,this.state.groupId);//8进4赛
        var ds4 = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        if (List4 !== undefined && List4 !== null && List4.length > 0)
        {
            ListView4 = (
                <ListView
                    automaticallyAdjustContentInsets={false}
                    dataSource={ds4.cloneWithRows(List4)}
                    renderRow={this.renderGamesRow.bind(this)}
                />
            );
        }

        //半决赛表
        var ListView5=null;
        var List5 = GameFilter.filter(this.state.list5,this.state.gameClassId,this.state.groupId);//半决赛
        var ds5 = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        if (List5 !== undefined && List5 !== null && List5.length > 0)
        {
            ListView5 = (
                <ListView
                    automaticallyAdjustContentInsets={false}
                    dataSource={ds5.cloneWithRows(List5)}
                    renderRow={this.renderGamesRow.bind(this)}
                />
            );
        }

        //决赛表
        var ListView6=null;
        var List6 = GameFilter.filter(this.state.list6,this.state.gameClassId,this.state.groupId);//决赛
        var ds6 = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        if (List6 !== undefined && List6 !== null && List6.length > 0)
        {
            ListView6 = (
                <ListView
                    automaticallyAdjustContentInsets={true}
                    dataSource={ds6.cloneWithRows(List6)}
                    renderRow={this.renderGamesRow.bind(this)}
                />
            );
        }

        return (
            <View style={styles.container}>

                {/*header*/}
                    <View style={styles.defaultStyle1}>
                        <TouchableOpacity style={{width:60,justifyContent:'center',alignItems: 'center',}}
                                          onPress={()=>{
                                this.goBack();
                        }}><Ionicons name={'md-arrow-back'} size={25} color="#fff"/></TouchableOpacity>
                        <View style={{flex:3,justifyContent:'flex-start',alignItems: 'center',flexDirection:'row'}}>
                            <Text style={{color:'#fff',fontSize:18}}>
                                团体赛场次
                            </Text>
                        </View>
                        <View style={{flex:1}}>
                        </View>
                    </View>

                    <View style={styles.flexContainer}>
                        {/*赛制类型*/}
                        <ModalDropdown
                            style={styles.cell}
                            textStyle={styles.textstyle}
                            dropdownStyle={styles.dropdownstyle}
                            options={this.state.gameClassList}
                            renderRow={this.dropdown_renderRow.bind(this)}
                            onSelect={(idx, value) => this.dropdown_1_onSelect(idx, value)}
                            onDropdownWillShow={this.dropdown_1_willShow.bind(this)}
                            onDropdownWillHide={this.dropdown_1_willHide.bind(this)}
                        >
                            <View style={styles.viewcell}>
                                <Text style={styles.textstyle}>
                                    {this.state.gameClassStr}
                                </Text>
                                <Image
                                    style={styles.dropdown_image}
                                    source={gameClassIcon}
                                />
                            </View>
                        </ModalDropdown>
                        {/*组别类型*/}
                        <ModalDropdown
                            style={styles.cell}
                            textStyle={styles.textstyle}
                            dropdownStyle={styles.dropdownstyle}
                            options={this.state.groupList}
                            renderRow={this.dropdown_renderRow.bind(this)}
                            onSelect={(idx, value) => this.dropdown_2_onSelect(idx, value)}
                            onDropdownWillShow={this.dropdown_2_willShow.bind(this)}
                            onDropdownWillHide={this.dropdown_2_willHide.bind(this)}
                        >
                            <View style={styles.viewcell}>
                                <Text style={styles.textstyle}>
                                    {this.state.groupStr}
                                </Text>
                                <Image
                                    style={styles.dropdown_image}
                                    source={groupIcon}
                                />
                            </View>
                        </ModalDropdown>

                        {/*清空*/}
                        <View style={{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:'#66CDAA',borderLeftWidth:1,borderLeftColor:'#fff'}}>
                            <TouchableOpacity
                                onPress={()=>{
                                    this.setState({gameClassId:-1,groupId:-1,gameClassStr:'赛制',groupStr:'组别'})
                                }}
                            >
                                <Ionicons name='md-refresh' size={20} color="#fff"/>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {<ScrollView>
                        {//冠亚军决赛
                            ListView6==null?null:
                                <View><View style={{height:30,width:width,backgroundColor:'#eee',alignItems:'center',justifyContent:'center'}}>
                                    <Text style={{color:'#444',fontSize:14}}>冠亚军决赛</Text></View>{ListView6}</View>}
                        {//半决赛
                            ListView5==null?null:
                                <View><View style={{height:30,width:width,backgroundColor:'#eee',alignItems:'center',justifyContent:'center'}}>
                                    <Text style={{color:'#444',fontSize:14}}>半决赛</Text></View>{ListView5}</View>}
                        {//8进4
                            ListView4==null?null:
                                <View><View style={{height:30,width:width,backgroundColor:'#eee',alignItems:'center',justifyContent:'center'}}>
                                    <Text style={{color:'#444',fontSize:14}}>8进4</Text></View>{ListView4}</View>}
                        {//16进8
                            ListView3==null?null:
                                <View><View style={{height:30,width:width,backgroundColor:'#eee',alignItems:'center',justifyContent:'center'}}>
                                    <Text style={{color:'#444',fontSize:14}}>16进8</Text></View>{ListView3}</View>}
                        {//32进16
                            ListView2==null?null:
                                <View><View style={{height:30,width:width,backgroundColor:'#eee',alignItems:'center',justifyContent:'center'}}>
                                    <Text style={{color:'#444',fontSize:14}}>32进16</Text></View>{ListView2}</View>}
                        {//小组赛
                            ListView1==null?null:
                                <View><View style={{height:30,width:width,backgroundColor:'#eee',alignItems:'center',justifyContent:'center'}}>
                                    <Text style={{color:'#444',fontSize:14}}>小组赛</Text></View>{ListView1}</View>}
                    </ScrollView>}

                    {/*loading模态框*/}
                    <Modal animationType={"fade"} transparent={true} visible={this.state.showProgress}>
                        <TouchableOpacity style={[styles.modalContainer,styles.modalBackgroundStyle,{alignItems:'center'}]}
                                          onPress={()=>{
                                              //TODO:cancel this behaviour
                                              this.setState({showProgress:false})

                                          }}>
                            <View style={{width:width*2/3,height:80,backgroundColor:'transparent',position:'relative',
                                justifyContent:'center',alignItems:'center',borderRadius:6}}>
                                <ActivityIndicator
                                    animating={true}
                                    style={{marginTop:10,height: 40,position:'absolute',transform: [{scale: 1.6}]}}
                                    size="large"
                                />
                                <View style={{flexDirection:'row',justifyContent:'center',marginTop:45}}>
                                    <Text style={{color:'#666',fontSize:13}}>
                                        加载中...
                                    </Text>

                                </View>
                            </View>
                        </TouchableOpacity>
                    </Modal>
            </View>
        )
    }

    dropdown_renderRow(rowData, rowID, highlighted){
        return (
            <TouchableOpacity >
                <View style={[styles.dropdown_row]}>
                    <Text style={[styles.dropdown_row_text, highlighted && {color: '#fff'}]}>
                        {rowData}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    }

    dropdown_1_onSelect(idx, value) {
        this.setState({
            gameClassStr:value,
            gameClassId:idx
        });
    }

    dropdown_2_onSelect(idx, value) {
        this.setState({
            groupStr:value,
            groupId:idx
        });
    }

    dropdown_1_willShow() {
        this.setState({
            showGameClassDropDown:true,
        });
    }

    dropdown_2_willShow() {
        this.setState({
            showGroupDropDown:true,
        });
    }

    dropdown_1_willHide() {
        this.setState({
            showGameClassDropDown:false,
        });
    }

    dropdown_2_willHide() {
        this.setState({
            showGroupDropDown:false,
        });
    }

    componentWillMount()
    {
        //获取所有比赛列表
        // {'id':33,'teamA':'陈海云','teamB':'李学庆','scoreA':0,'scoreB':10,'startTime':'2018-12-10 08:00','endTime':'2018-12-11 10:00',state:0,
        //     'teamAimg':'https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83er7qoZtfnhNSGgsCAyiaaa6XE1D8RAJgTQouhudfRISF9ysc4ywfJK8NetUpScMUrsJCO8X0JYcobw/0',
        //     'teamBimg':'https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83erqf66rr6j1HnoZhVfeIjBgaBTj4QoxjR2LicHTVB2ObPpia0EP6wrOllcMGktWBFWhlt0bsnH4txww/132',
        //     'gameClass':1,'groupId':1
        this.fetchGamesList();

        this.freshListener=DeviceEventEmitter.addListener('fresh', (data)=>{
            if(data)
                this.fetchGamesList()
        });
    }

    componentWillUnmount(){
        if(this.freshListener)
            this.freshListener.remove();
    }

    fetchGamesList(){
        this.props.dispatch(fetchGamesList(this.props.projectId)).then((json)=>{
            if(json.re==1)
            {
                this.setState({games:json.data,allgames:json.data});

                var games = this.state.games;
                var list1=[];//小组赛
                var list2=[];//32进16
                var list3=[];//16进8
                var list4=[];//8进4
                var list5=[];//半决赛
                var list6=[];//冠亚军决赛

                for(i=0;i<games.length;i++){
                    switch (games[i].gameClass){
                        case '1':list1.push(games[i]);break;
                        case '2':list2.push(games[i]);break;
                        case '3':list3.push(games[i]);break;
                        case '4':list4.push(games[i]);break;
                        case '5':list5.push(games[i]);break;
                        case '6':list6.push(games[i]);break;
                    }
                }

                this.setState({list1:list1,list2:list2,list3:list3,list4:list4,list5:list5,list6:list6,showProgress:false})
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
    viewCell: {
        height: 50,
        flexDirection: 'column',
        alignItems: 'flex-start',
    },
    flexContainer: {
        flexDirection: 'row',
        width:width,
        height:35,
        borderColor:'#fff',
        borderTopWidth:1,
        borderBottomWidth:1,
    },
    cell: {
        width:dropdownWidth,
        alignItems:'center',
        flexDirection:'row',
        height:35,
        borderColor:'#fff',
        borderWidth:1,

    },
    viewcell: {
        width:dropdownWidth-1,
        backgroundColor:'#66CDAA',
        alignItems:'center',
        height:35,
        justifyContent:'center',
        flexDirection:'row',
    },
    textstyle: {
        fontSize: 13,
        textAlign: 'center',
        color:'#ffff',
        justifyContent:'center',
    },
    dropdownstyle: {
        height: 150,
        width:dropdownWidth,
        borderColor: '#fff',
        borderWidth: 1,
    },
    dropdown_row: {
        flexDirection: 'row',
        height: 50,
        alignItems: 'center',
        backgroundColor:'#66CDAA',
    },
    dropdown_row_text: {
        fontSize: 13,
        color: '#fff',
        textAlignVertical: 'center',
        justifyContent:'center',
        marginLeft: 5,
    },
    dropdown_image: {
        width: 20,
        height: 20,
    },
    popoverContent: {
        width: 100,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    popoverText:{
        color:'#444',
    },
    defaultStyle1:{
        height:70,
        paddingTop:30,
        flexDirection:'row',
        justifyContent:'center',
        backgroundColor:'#66CDAA'
    }
});


module.exports = connect(state=>({
        accessToken:state.user.accessToken,
        personInfo:state.user.personInfo,
    })
)(CompetitionGamesList);



