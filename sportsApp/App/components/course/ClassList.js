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
import AddClass from './AddClass'
import {fetchClassList} from '../../action/CourseActions'

var WeChat=require('react-native-wechat');
var {height, width} = Dimensions.get('window');

const slideAnimation = new SlideAnimation({ slideFrom: 'bottom' });
const scaleAnimation = new ScaleAnimation();
const defaultAnimation = new DefaultAnimation({ animationDuration: 150 });

class ClassList extends Component {

    goBack() {
        const {navigator} = this.props;
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
    }

    navigate2AddClass(){
        const { navigator } = this.props;
        if(navigator) {
            navigator.push({
                name: 'AddClass',
                component: AddClass,
                params: {
                }
            })
        }
    }

    renderAllAvatars(avatars){
        var allAvatars = [];
        if(avatars==null)return null;
        for(var i=0;i<avatars.length;i++) {
            var model = avatars[i]
            var item = this.getImageViewItem(model)
            allAvatars.push(item);
        }
        return allAvatars;
    }

    getImageViewItem(model){

        return (
            <View style={{flex:1,padding:1}}>
            <Image resizeMode="stretch" style={{height:25,width:25,borderRadius:13}} source={{uri:model}}/>
            </View>
        );
    }

    renderRow(rowData,sectionId,rowId){

        // {id:2,name:'每日小课2',status:0,coach:'小吴,邹鹏,小云',time:'2018-11-11 12:00-14:00',number:2,
        //     avatarList:[
        //     'https://wx.qlogo.cn/mmopen/vi_32/mcibngvIYnyBNHlHApT3dNEGI3nmVr0WQMR3iaBRchBT9NERA6GIibdksicmNrJkL3no8iaTlXOHsF4c2wiccx545Wfg/132',
        //     'https://wx.qlogo.cn/mmopen/vi_32/fcIwyLtxyzsD9xeS6lrD4ia6NtgHrc0uNXC8xpBUxEmzwgo8aiayFWeWdjxiagcJ75FJDAozg5fFKvFaQYwVLQgUA/0',]},

        var avatars = rowData.avatarList;

        var avatarList = (
            <ScrollView
                automaticallyAdjustContentInsets={false}
                bounces ={false}
                showsHorizontalScrollIndicator  ={true}
                ref={(scrollView) => { this._scrollView = scrollView; }}
                horizontal={true}
            >
                {this.renderAllAvatars(avatars)}
            </ScrollView>
        );

        var row=(
            <View style={{flex:1,backgroundColor:'#fff',marginTop:5,marginBottom:5,}}>
                <View style={{flex:1,flexDirection:'row',padding:5,borderBottomWidth:1,borderColor:'#ddd',backgroundColor:'transparent',}}>
                    <View style={{flex:3,justifyContent:'center',alignItems: 'flex-start',padding:5,paddingHorizontal:10}}>
                        <Text style={{fontSize:16,color:'#666'}}>{rowData.name}</Text>
                    </View>

                     <View style={{flex:2,marginRight:3,justifyContent:'center',alignItems:'flex-end'}}>
                         {
                             rowData.status==0?
                                 //已结束0
                                 <View style={{flexDirection:'row'}}>
                                     <View style={{backgroundColor:'#fc6254',borderRadius:5,padding:5}}><Text style={{color:'#fff'}}>已结束</Text></View>
                                 </View>
                                 :
                                 //正在报名1
                                 <View style={{flexDirection:'row'}}>
                                     <View style={{backgroundColor:'#66CDAA',borderRadius:5,padding:5}}><Text style={{color:'#fff'}}>进行中</Text></View>
                                 </View>
                         }
                     </View>

                </View>
                <View style={{flex:3,padding:10}}>
                    <View style={{flex:3,flexDirection:'row',marginBottom:3}}>
                        <View style={{flex:1,justifyContent:'flex-start',alignItems: 'center',backgroundColor:'#fff',borderRadius:5,padding:5}}>
                            <Text style={{color:'#66CDAA'}}>教练</Text>
                        </View>
                        <View style={{flex:7,padding:5,marginLeft:5}}>
                            <Text style={{color:'#5c5c5c',justifyContent:'flex-start',alignItems: 'center'}}>{rowData.coach}</Text>
                        </View>
                    </View>

                    <View style={{flex:3,flexDirection:'row',marginBottom:3}}>
                        <View style={{flex:1,justifyContent:'flex-start',alignItems: 'center',backgroundColor:'#fff',borderRadius:5,padding:5}}>
                            <Text style={{color:'#66CDAA'}}>时间</Text>
                        </View>
                        <View style={{flex:7,padding:5,marginLeft:5}}>
                            <Text style={{color:'#5c5c5c',justifyContent:'flex-start',alignItems: 'center'}}>{rowData.time}</Text>
                        </View>
                    </View>

                </View>
                <View style={{flex:1,flexDirection:'column',padding:10,borderTopWidth:1,borderColor:'#ddd'}}>

                    <View style={{flexDirection:'row',flex:2.5,alignItems:'flex-start'}}>
                    <View style={{flex:2,justifyContent:'flex-start',alignItems: 'center',marginLeft:3,flexDirection:'row',marginBottom:3}}>

                        <View style={{backgroundColor:'#ffffff',borderRadius:5,padding:5}}><Text style={{color:'#fca482'}}>签到列表</Text></View>
                        <Text style={{color:'#5c5c5c',marginLeft:5}}>{rowData.number}人</Text>
                    </View>

                        <View style={{flex:4,backgroundColor:'#fff',justifyContent:'flex-start',marginBottom:3}}>
                            <TouchableOpacity
                                onPress={()=>{

                                }}>
                        {avatarList}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
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

            classList:[],
        }
    }

    render() {

        var classList = this.state.classList;
        var classListView = null;

            var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
            if (classList !== undefined && classList !== null && classList.length > 0) {
                classListView = (
                    <ListView
                        automaticallyAdjustContentInsets={false}
                        dataSource={ds.cloneWithRows(classList)}
                        renderRow={this.renderRow.bind(this)}
                    />
                );
            }

        return (
            <View style={{flex:1}}>
                <Toolbar width={width} title="课堂列表" navigator={this.props.navigator}
                         actions={[{icon:ACTION_ADD,show:OPTION_SHOW}]}
                         onPress={(i)=>{
                             if(i==0){
                                 this.navigate2AddClass();
                             }
                         }}>
                    {/*内容区*/}
                    <View style={styles.flexContainer}>
                    <View style={{flex:1,backgroundColor:'#eee'}}>
                            <ScrollView>
                                {classListView}
                                {
                                    classListView==null?
                                        null:
                                        <View style={{justifyContent:'center',alignItems: 'center',backgroundColor:'#eee',padding:10}}>
                                            <Text style={{color:'#343434',fontSize:13,alignItems: 'center',justifyContent:'center'}}>已经全部加载完毕</Text>
                                        </View>
                                }
                            </ScrollView>
                    </View>
                    </View>
                </Toolbar>
            </View>
        );
    }

    componentWillUnmount(){
    }

    componentDidMount(){
        this.props.dispatch(fetchClassList(this.props.course.courseId)).then((json)=> {
            this.setState({classList:json.data})
        }).catch((e)=>{
        });
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
)(ClassList);



