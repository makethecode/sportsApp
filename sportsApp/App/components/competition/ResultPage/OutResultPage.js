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
import {fetchGroupResult,fetchOutResult} from '../../../action/CompetitionActions';

var {height, width,scale} = Dimensions.get('window');

class OutResultPage extends Component{

    goBack(){
        const { navigator } = this.props;
        if(navigator) {
            navigator.pop();
        }
    }

    fetchOutResult(projectId,gameClass){

        this.props.dispatch(fetchOutResult(projectId,gameClass)).then((json)=>{
            if(json.re==1)
            {
                this.setState({list: json.data});

                var list = json.data;

                this.setState({list:list})
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

        //对阵表
        var listView = null;
        var header = null;
        var list = this.state.list;

        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        if (list !== undefined && list !== null && list.length > 0) {
            header = (
                <View>
                    <View style={{width:width,height:30,backgroundColor:'#fff',padding:10,alignItems:'center',justifyContent:'center',textAlign:'left'}}>
                        <Text style={{color:'#666',fontSize:13}}>对阵成绩</Text>
                    </View>
                <View style={{flexDirection:'row',height:30,width:width}}>
                    {this.renderHeader(list)}
                </View>
                </View>
            );
            listView = (
                <ListView
                    automaticallyAdjustContentInsets={false}
                    dataSource={ds.cloneWithRows(list)}
                    renderRow={this.renderRow.bind(this)}
                />
            );
        }

        return (
            <ScrollView style={styles.container}>

                <View>
                {header}
                {listView}
                </View>

            </ScrollView>
        );
    }

    componentWillMount(){
        this.fetchOutResult(this.props.projectId,this.props.gameClass);
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



export default connect(mapStateToProps)(OutResultPage);



