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
import Ionicons from 'react-native-vector-icons/Ionicons'
import {fetchGroupResult} from '../../../action/CompetitionActions';

var {height, width,scale} = Dimensions.get('window');

class GroupResultPage extends Component{

    goBack(){
        const { navigator } = this.props;
        if(navigator) {
            navigator.pop();
        }
    }

    fetchGroupResult(projectId,gameClass){

        this.props.dispatch(fetchGroupResult(projectId,gameClass)).then((json)=>{
            if(json.re==1)
            {
                this.setState({list: json.data});

                var list = json.data;

                var listA=[];
                var listB=[];
                var listC=[];
                var listD=[];
                var listE=[];
                var listF=[];
                var listG=[];
                var listH=[];

                if(list!=null) {
                    for (i = 0; i < list.length; i++) {
                        switch (list[i].groupId) {
                            case 0:
                                listA.push(list[i]);
                                break;
                            case 1:
                                listB.push(list[i]);
                                break;
                            case 2:
                                listC.push(list[i]);
                                break;
                            case 3:
                                listD.push(list[i]);
                                break;
                            case 4:
                                listE.push(list[i]);
                                break;
                            case 5:
                                listF.push(list[i]);
                                break;
                            case 6:
                                listG.push(list[i]);
                                break;
                            case 7:
                                listH.push(list[i]);
                                break;
                        }
                    }
                }

                this.setState({list:list,listA:listA,listB:listB,listC:listC,listD:listD,listE:listE,listF:listF,listG:listG,listH:listH})
            }
            else {
                if(json.re=-100){
                    this.props.dispatch(getAccessToken(false))
                }
            }
        })
    }

    constructor(props) {
        super(props);
        this.state={

            projectId:this.props.projectId,
            gameClass:this.props.gameClass,

            listA:[],
            listB:[],
            listC:[],
            listD:[],
            listE:[],
            listF:[],
            listG:[],
            listH:[],

            list:[],
        };
    }

    renderHeader(list){
        //渲染表头
        var headItems = [];
        if(list==null)return null;
        var blankItem =
            (
                <View style={{flex:2,padding:3,borderWidth:1,borderColor:'#ddd',justifyContent:'center',alignItems:'center'}}>
                </View>
            )
        headItems.push(blankItem);
        for(var i=0;i<list.length;i++) {
            var item =
                (
                    <View style={{flex:1,padding:3,borderWidth:1,borderColor:'#ddd',justifyContent:'center',alignItems:'center'}}>
                        <Text style={{color:'#666',fontSize:13}}>{i+1}</Text>
                    </View>
                )
            headItems.push(item);
        }

        var winItem =
            (
                <View style={{flex:1,padding:3,borderWidth:1,borderColor:'#ddd',justifyContent:'center',alignItems:'center'}}>
                    <Text style={{color:'#666',fontSize:13}}>胜次</Text>
                </View>
            )
        var fallItem =
            (
                <View style={{flex:1,padding:3,borderWidth:1,borderColor:'#ddd',justifyContent:'center',alignItems:'center'}}>
                    <Text style={{color:'#666',fontSize:13}}>负次</Text>
                </View>
            )
        var rankItem =
            (
                <View style={{flex:1,padding:3,borderWidth:1,borderColor:'#ddd',justifyContent:'center',alignItems:'center'}}>
                    <Text style={{color:'#666',fontSize:13}}>排名</Text>
                </View>
            )

        headItems.push(winItem)
        headItems.push(fallItem)
        headItems.push(rankItem)

        return headItems;
    }

    renderRecord(rowData){
        //渲染表行
        //{idx:'1',team:'单打1',record:['','2-1','3-0','3-0'],win:3,fall:0,rank:1},

        var record = rowData.record;

        var recordItems = [];
        if(rowData==null)return null;
        var teamItem =
            (
                <View style={{flex:2,padding:3,borderWidth:1,borderColor:'#ddd',justifyContent:'center',alignItems:'center'}}>
                    <Text style={{color:'#666',fontSize:13}}>{rowData.idx}</Text>
                    <Text style={{color:'#666',fontSize:13}}>{rowData.team}</Text>
                </View>
            )
        recordItems.push(teamItem);

        for(var i=0;i<record.length;i++) {
            var item =
                (
                    <View style={{flex:1,padding:3,borderWidth:1,borderColor:'#ddd',justifyContent:'center',alignItems:'center'}}>
                        <Text style={{color:'#666',fontSize:13}}>{record[i]}</Text>
                    </View>
                )
            recordItems.push(item);
        }

        var winItem =
            (
                <View style={{flex:1,padding:3,borderWidth:1,borderColor:'#ddd',justifyContent:'center',alignItems:'center'}}>
                    <Text style={{color:'#666',fontSize:13}}>{rowData.win}</Text>
                </View>
            )
        var fallItem =
            (
                <View style={{flex:1,padding:3,borderWidth:1,borderColor:'#ddd',justifyContent:'center',alignItems:'center'}}>
                    <Text style={{color:'#666',fontSize:13}}>{rowData.fall}</Text>
                </View>
            )
        var rankItem =
            (
                <View style={{flex:1,padding:3,borderWidth:1,borderColor:'#ddd',justifyContent:'center',alignItems:'center'}}>
                    <Text style={{color:'#666',fontSize:13}}>{rowData.rank}</Text>
                </View>
            )

        recordItems.push(winItem)
        recordItems.push(fallItem)
        recordItems.push(rankItem)

        return recordItems;
    }

    renderRow(rowData,sectionId,rowId){

        var row=(
            <View style={{flexDirection:'row',height:40,width:width}}>
                {this.renderRecord(rowData)}
            </View>
        );

        return row;
    }

    render(){

        //A组对阵表
        var listAView = null;
        var headerA = null;
        var listA = this.state.listA;

        var dsA = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        if (listA !== undefined && listA !== null && listA.length > 0) {
            headerA = (
                <View>
                    <View style={{width:width,height:30,backgroundColor:'#fff',padding:10,alignItems:'center',justifyContent:'center',textAlign:'left'}}>
                        <Text style={{color:'#666',fontSize:13}}>A组对阵成绩</Text>
                    </View>
                <View style={{flexDirection:'row',height:30,width:width}}>
                    {this.renderHeader(listA)}
                </View>
                </View>
            );
            listAView = (
                <ListView
                    automaticallyAdjustContentInsets={false}
                    dataSource={dsA.cloneWithRows(listA)}
                    renderRow={this.renderRow.bind(this)}
                />
            );
        }

        //B组对阵表
        var listBView = null;
        var headerB = null;
        var listB = this.state.listB;

        var dsB = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        if (listB !== undefined && listB !== null && listB.length > 0) {
            headerB = (
                <View>
                    <View style={{width:width,height:30,backgroundColor:'#fff',padding:10,alignItems:'center',justifyContent:'center',textAlign:'left'}}>
                        <Text style={{color:'#666',fontSize:13}}>B组对阵成绩</Text>
                    </View>
                    <View style={{flexDirection:'row',height:30,width:width}}>
                        {this.renderHeader(listB)}
                    </View>
                </View>
            );
            listBView = (
                <ListView
                    automaticallyAdjustContentInsets={false}
                    dataSource={dsB.cloneWithRows(listB)}
                    renderRow={this.renderRow.bind(this)}
                />
            );
        }

        //C组对阵表
        var listCView = null;
        var listC = this.state.listC;
        var headerC = null;

        var dsC = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        if (listC !== undefined && listC !== null && listC.length > 0) {
            headerC=(
                <View>
                    <View style={{width:width,height:30,backgroundColor:'#fff',padding:10,alignItems:'center',justifyContent:'center',textAlign:'left'}}>
                        <Text style={{color:'#666',fontSize:13}}>C组对阵成绩</Text>
                    </View>
                    <View style={{flexDirection:'row',height:30,width:width}}>
                        {this.renderHeader(listC)}
                    </View>
                </View>
            );
            listCView = (
                <ListView
                    automaticallyAdjustContentInsets={false}
                    dataSource={dsC.cloneWithRows(listC)}
                    renderRow={this.renderRow.bind(this)}
                />
            );
        }

        //D组对阵表
        var listDView = null;
        var listD = this.state.listD;
        var headerD = null;

        var dsD = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        if (listD !== undefined && listD !== null && listD.length > 0) {
            headerD = (
                <View>
                    <View style={{width:width,height:30,backgroundColor:'#fff',padding:10,alignItems:'center',justifyContent:'center',textAlign:'left'}}>
                        <Text style={{color:'#666',fontSize:13}}>D组对阵成绩</Text>
                    </View>
                    <View style={{flexDirection:'row',height:30,width:width}}>
                        {this.renderHeader(listD)}
                    </View>
                </View>
            );
            listDView = (
                <ListView
                    automaticallyAdjustContentInsets={false}
                    dataSource={dsD.cloneWithRows(listD)}
                    renderRow={this.renderRow.bind(this)}
                />
            );
        }

        //E组对阵表
        var listEView = null;
        var listE = this.state.listE;
        var headerE = null;

        var dsE = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        if (listE !== undefined && listE !== null && listE.length > 0) {
            headerE = (
                <View>
                    <View style={{width:width,height:30,backgroundColor:'#fff',padding:10,alignItems:'center',justifyContent:'center',textAlign:'left'}}>
                        <Text style={{color:'#666',fontSize:13}}>E组对阵成绩</Text>
                    </View>
                    <View style={{flexDirection:'row',height:30,width:width}}>
                        {this.renderHeader(listE)}
                    </View>
                </View>
            );
            listEView = (
                <ListView
                    automaticallyAdjustContentInsets={false}
                    dataSource={dsE.cloneWithRows(listE)}
                    renderRow={this.renderRow.bind(this)}
                />
            );
        }

        //F组对阵表
        var listFView = null;
        var listF = this.state.listF;
        var headerF = null;

        var dsF = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        if (listF !== undefined && listF !== null && listF.length > 0) {
            headerF = (
                <View>
                    <View style={{width:width,height:30,backgroundColor:'#fff',padding:10,alignItems:'center',justifyContent:'center',textAlign:'left'}}>
                        <Text style={{color:'#666',fontSize:13}}>F组对阵成绩</Text>
                    </View>
                    <View style={{flexDirection:'row',height:30,width:width}}>
                        {this.renderHeader(listF)}
                    </View>
                </View>
            );
            listFView = (
                <ListView
                    automaticallyAdjustContentInsets={false}
                    dataSource={dsF.cloneWithRows(listF)}
                    renderRow={this.renderRow.bind(this)}
                />
            );
        }

        //G组对阵表
        var listGView = null;
        var listG = this.state.listG;
        var headerG = null;

        var dsG = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        if (listG !== undefined && listG !== null && listG.length > 0) {
            headerG = (
                <View>
                    <View style={{width:width,height:30,backgroundColor:'#fff',padding:10,alignItems:'center',justifyContent:'center',textAlign:'left'}}>
                        <Text style={{color:'#666',fontSize:13}}>G组对阵成绩</Text>
                    </View>
                    <View style={{flexDirection:'row',height:30,width:width}}>
                        {this.renderHeader(listG)}
                    </View>
                </View>
            );
            listGView = (
                <ListView
                    automaticallyAdjustContentInsets={false}
                    dataSource={dsG.cloneWithRows(listG)}
                    renderRow={this.renderRow.bind(this)}
                />
            );
        }

        //H组对阵表
        var listHView = null;
        var listH = this.state.listH;
        var headerH = null;

        var dsH = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        if (listH !== undefined && listH !== null && listH.length > 0) {
            headerH = (
                <View>
                    <View style={{width:width,height:30,backgroundColor:'#fff',padding:10,alignItems:'center',justifyContent:'center',textAlign:'left'}}>
                        <Text style={{color:'#666',fontSize:13}}>H组对阵成绩</Text>
                    </View>
                    <View style={{flexDirection:'row',height:30,width:width}}>
                        {this.renderHeader(listH)}
                    </View>
                </View>
            );
            listHView = (
                <ListView
                    automaticallyAdjustContentInsets={false}
                    dataSource={dsH.cloneWithRows(listH)}
                    renderRow={this.renderRow.bind(this)}
                />
            );
        }

        return (
            <ScrollView style={styles.container}>

                {/*A组*/}
                <View>
                {headerA}
                {listAView}
                </View>

                {/*B组*/}
                <View>
                    {headerB}
                    {listBView}
                </View>

                {/*C组*/}
                <View>
                    {headerC}
                    {listCView}
                </View>

                {/*D组*/}
                <View>
                    {headerD}
                    {listDView}
                </View>

                {/*E组*/}
                <View>
                    {headerE}
                    {listEView}
                </View>

                {/*F组*/}
                <View>
                    {headerF}
                    {listFView}
                </View>

                {/*G组*/}
                <View>
                    {headerG}
                    {listGView}
                </View>

                {/*H组*/}
                <View>
                    {headerH}
                    {listHView}
                </View>

            </ScrollView>
        );
    }

    componentWillMount(){
        this.fetchGroupResult(this.props.projectId,this.props.gameClass);
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
    },
    cardItemTimeRemainTxt:{
        fontSize:13,
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



export default connect(mapStateToProps)(GroupResultPage);



