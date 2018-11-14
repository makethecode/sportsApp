/**
 * Created by youli on 25/03/2017.
 */

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


class GroupMemberModal extends Component{

    close(){
        if(this.props.onClose!==undefined&&this.props.onClose!==null)
        {
            this.props.onClose();
        }
    }

    setMemberList(choose){
        if(this.props.setMemberList!==undefined&&this.props.setMemberList!==null)
        {
            this.props.setMemberList(choose);
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
           searchInfo:null,
            member:this.props.member,
            searchList:this.props.searchList,
            isSearch:false,
        }
    }

    renderRow(rowData,sectionId,rowId){

        var row=(
            <View style={{flex:3,flexDirection:'row',backgroundColor:'#fff',marginBottom:5,padding:5,borderBottomWidth:1,
                borderColor:'#eee',borderRadius:8}}>
                {rowData.avatar == ""?
                    < View style={{flex:1,}}>
                        <Image resizeMode="stretch" style={{height:40,width:40,borderRadius:20}} source={require('../../../img/portrait.jpg')}/>
                    </View>
                    :
                < View style={{flex:1,}}>
                    <Image resizeMode="stretch" style={{height:40,width:40,borderRadius:20}} source={{uri:rowData.avatar}}/>
                    </View>
                }
                <View style={{flex:3,marginLeft:5}}>
                    <View style={{flexDirection:'row',marginLeft:10}}>
                        <Icon name={'user'} size={15} color="pink"/>
                        <Text style={{marginLeft:10,color:'#343434'}}>{rowData.perNum.substring(0,6)}</Text>
                    </View>
                    <View  style={{flexDirection:'row',marginLeft:10,marginTop:5}}>
                        <Icon name={'phone'} size={15} color="#87CEFF"/>
                        <Text style={{marginLeft:10,color:'#aaa'}}>{rowData.mobilePhone}</Text>
                    </View>
                </View>
                <TouchableOpacity style={{flex:1,justifyContent:'center',alignItems: 'center',margin:10,borderWidth:1,borderColor:'#66CDAA',borderRadius:5}}
                                  onPress={()=>{
                                      //加入
                                      this.setMemberList(rowData)
                                  }}>
                    <Text style={{color:'#66CDAA',fontSize:12,}}>添加</Text>
                </TouchableOpacity>

            </View>
        );

        return row;

    }

    render(){

        var searchListView = null;
        var searchList = this.props.searchList;

        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        if (searchList !== undefined && searchList !== null && searchList.length > 0) {
            searchListView = (
                <ListView
                    automaticallyAdjustContentInsets={false}
                    dataSource={ds.cloneWithRows(searchList)}
                    renderRow={this.renderRow.bind(this)}
                />
            );
        }

        return (
            <View>
                {this.state.isSearch == true ?
                    <View style={{
                        height: height * 0.6,
                        width: width * 0.8,
                        padding: 5,
                        margin: width * 0.1,
                        marginTop: 100,
                        borderColor: '#eee',
                        borderWidth: 1,
                        backgroundColor: '#fff'
                    }}>

                        <View style={{flex: 1}}>
                            {/*//搜索框*/}
                            <View style={{
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: '#eee',
                                padding: 3,
                                margin:10,
                                borderRadius: 10,
                                paddingHorizontal: 10
                            }}>
                                <TextInputWrapper
                                    style={{fontSize: 13, paddingLeft: 10}}
                                    textInputStyle={{fontSize: 13, color: '#666'}}
                                    onConfirm={() => {
                                        this.setState({isSearch: true})
                                        this.props.searchMember(this.state.searchInfo);
                                    }}
                                    search={true}
                                    onChangeText={(searchInfo) => {
                                        this.setState({searchInfo: searchInfo});
                                    }}
                                    value={this.state.searchInfo == null ? '' : this.state.searchInfo}
                                    placeholder='请输入用户名搜索'
                                    placeholderTextColor="#aaa"
                                    underlineColorAndroid="transparent"
                                />
                            </View>
                        </View>

                        <View style={{
                            flex: 5,
                            flexDirection: 'row',
                            backgroundColor: '#fff',
                            marginBottom: 5,
                            padding: 5,
                            borderBottomWidth: 1,
                            borderColor: '#eee',
                            borderRadius: 8
                        }}>
                            {searchListView}
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
                    :
                    <View style={{
                        height: height * 0.2,
                        width: width * 0.8,
                        padding: 5,
                        margin: width * 0.1,
                        marginTop: 200,
                        borderColor: '#eee',
                        borderWidth: 1,
                        backgroundColor: '#fff'
                    }}>

                        <View style={{flex: 1}}>
                            {/*//搜索框*/}
                            <View style={{
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: '#eee',
                                margin: 10,
                                padding: 3,
                                borderRadius: 10,
                                paddingHorizontal: 10
                            }}>
                                <TextInputWrapper
                                    style={{fontSize: 13, paddingLeft: 10}}
                                    textInputStyle={{fontSize: 13, color: '#666'}}
                                    onConfirm={() => {
                                        this.setState({isSearch: true})
                                        this.props.searchMember(this.state.searchInfo);
                                    }}
                                    search={true}
                                    onChangeText={(searchInfo) => {
                                        this.setState({searchInfo: searchInfo});
                                    }}
                                    value={this.state.searchInfo == null ? '' : this.state.searchInfo}
                                    placeholder='请输入用户名搜索'
                                    placeholderTextColor="#aaa"
                                    underlineColorAndroid="transparent"
                                />
                            </View>
                        </View>

                        <View style={{
                            flex: 1,
                            padding: 5,
                            margin: 5,
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                            <TouchableOpacity style={{
                                flex: 1,
                                padding: 3,
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
                }
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


module.exports = GroupMemberModal;

