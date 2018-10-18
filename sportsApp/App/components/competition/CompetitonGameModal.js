
import React,{Component} from 'react';

import  {
    StyleSheet,
    Image,
    Text,
    View,
    ListView,
    Alert,
    TouchableOpacity,
    Dimensions
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import TextInputWrapper from 'react-native-text-input-wrapper';
var {height, width} = Dimensions.get('window');


class CompetitonGameModal extends Component{

    close(){
        if(this.props.onClose!==undefined&&this.props.onClose!==null)
        {
            this.props.onClose();
        }
    }

    componentWillReceiveProps(nextProps)
    {
        this.setState(nextProps)
    }

    constructor(props)
    {
        super(props);
        this.state={
            gameList:this.props.gameList
        }
    }

    renderRow(rowData,sectionId,rowId){

        //'gameList':[{'personA':'陈海云、邓养吾','personB':'邹鹏、小吴','scoreA':1,'socreB':0,state:1},{'personA':'陈海云、邓养吾','personB':'邹鹏、小吴','scoreA':0,'socreB':0,state:0}]}

        var row=(
            <View style={{flex:3,flexDirection:'row',backgroundColor:'#fff',marginBottom:5,padding:5,borderBottomWidth:1,
                borderColor:'#eee',borderRadius:8}}>
                <View style={{flex:1,justifyContent:'center',alignItems:'center'}}><Text style={{fontSize:13,color:'#666'}}>{rowData.personA}</Text></View>
                {
                    rowData.state==1?
                        <View style={{flex:1,justifyContent:'center',alignItems:'center'}}><Text style={{fontSize:13,color:'#666'}}>{rowData.scoreA} - {rowData.scoreB}</Text></View>:
                        <View style={{flex:1,justifyContent:'center',alignItems:'center'}}><Text style={{fontSize:13,color:'#666'}}>未开始</Text></View>
                }
                <View style={{flex:1,justifyContent:'center',alignItems:'center'}}><Text style={{fontSize:13,color:'#666'}}>{rowData.personB}</Text></View>
            </View>
        );

        return row;
    }

    render(){

        var gameListView = null;
        var gameList = this.state.gameList;

        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        if (gameList !== undefined && gameList !== null && gameList.length > 0) {
            gameListView = (
                <ListView
                    automaticallyAdjustContentInsets={false}
                    dataSource={ds.cloneWithRows(gameList)}
                    renderRow={this.renderRow.bind(this)}
                />
            );
        }

        return (
            <View>
                    <View style={{
                        height: height * 0.4,
                        width: width * 0.8,
                        padding: 5,
                        margin: width * 0.1,
                        marginTop: 200,
                        borderColor: '#eee',
                        borderWidth: 1,
                        backgroundColor: '#fff'
                    }}>
                        <View style={{flex:2,justifyContent:'center',alignItems:'center',padding:5}}>
                            <Text style={{flex:3,fontSize:16}}>对阵成绩</Text>
                            <View style={{flex:2,flexDirection:'row',justifyContent:'center',alignItems:'center',textAlign:'center',padding:10}}>
                                <Text style={{flex:1,fontSize:13,textAlign:'center'}}>{this.props.teamA}</Text>
                                <View style={{flex:1}}/>
                                <Text style={{flex:1,fontSize:13,textAlign:'center'}}>{this.props.teamB}</Text>
                            </View>
                        </View>

                        <View style={{
                            flex: 3,
                            flexDirection: 'row',
                            backgroundColor: '#fff',
                            marginBottom: 5,
                            padding: 5,
                            borderBottomWidth: 1,
                            borderColor: '#eee',
                        }}>
                            {gameListView}
                        </View>
                        <View style={{
                            flex: 1,
                            padding: 2,
                            margin: 4,
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'flex-end'
                        }}>
                            <TouchableOpacity style={{
                                flex: 1,
                                padding: 2,
                                margin: 5,
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: '#66CDAA',
                                borderRadius: 6
                            }}
                                              onPress={() => {
                                                  this.close();
                                              }}>
                                <Text style={{color: '#fff', padding: 5}}>取消</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
            </View>
        );
    }
}


var styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        borderTopWidth:0,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.1)',
        shadowColor: '#ccc',
        shadowOffset: { width: 2, height: 2, },
        shadowOpacity: 0.5,
        shadowRadius: 3,
        borderTopColor:'#fff'
    },
    body:{
        padding:10
    },
    row:{
        flexDirection:'row',
        paddingTop:16,
        paddingBottom:16,
        borderBottomWidth:1,
        borderBottomColor:'#222'
    },
});


module.exports = CompetitonGameModal;

