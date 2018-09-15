/**
 * Created by dingyiming on 2017/8/1.
 */
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
    InteractionManager
} from 'react-native';
import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import _ from 'lodash';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CommIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import proxy from '../../utils/Proxy'
import Config from '../../../config';
import {Toolbar,OPTION_SHOW,OPTION_NEVER,ACTION_ADD,ACTION_PERSON} from 'react-native-toolbar-wrapper'
import {
    fetchCoaches,
    onCoachUpdate,
} from '../../action/CoachActions';

import {
    getAccessToken,
} from '../../action/UserActions';

import CoachDetail from './CoachDetail'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

var {height, width} = Dimensions.get('window');

class TalkingFarm extends Component {

    goBack() {
        const {navigator} = this.props;
        if (navigator) {
            navigator.pop();
        }
    }

    constructor(props) {
        super(props);
        this.state = {
            usertextinput: null,
            talklist: null,
            time: null,
            courseId: this.props.courseId,
            personInfo: this.props.personInfo,
            _scrollView:null,

            color: {
                defaultColor: '#b2b2b2',
                backgroundTransparent: 'transparent',
                defaultBlue: '#0084ff',
                leftBubbleBackground: '#f0f0f0',
                white: '#fff',
                carrot: '#e67e22',
                emerald: '#2ecc71',
                peterRiver: '#3498db',
                wisteria: '#8e44ad',
                alizarin: '#e74c3c',
                turquoise: '#1abc9c',
                midnightBlue: '#2c3e50',
                optionTintColor: '#007AFF',
                timeTextColor: '#aaa',
            }
        };
    }

    addTalkingFarm() {
        var personinfo = this.state.personInfo;
        var courseId = this.state.courseId;
        var input = this.state.usertextinput;
        if (input === null) {
            alert("请输入内容");
            return;
        }

        proxy.postes({
            url: Config.server + '/func/node/addchat',
            headers: {
                'Content-Type': 'application/json',
            },
            body: {
                courseId: courseId,
                userId: personinfo.personId,
                content: input,
            }
        }).then((json) => {
            var data = json.data;
            if (data !== null && data !== undefined && data !== "") {
                //  alert(data);
                this.getTalkingFarm();
                this.setState({usertextinput: null});

            }
        }).catch((err) => {
            alert(err);
        });
    }

    getTalkingFarm() {


        var personinfo = this.state.personInfo;
        var courseId = this.state.courseId;
        var talklist = this.state.talklist;
        proxy.postes({
            url: Config.server + '/func/node/getchatlistbycourseid',
            headers: {
                'Content-Type': 'application/json',
            },
            body: {
                courseId: courseId,
                userId: personinfo.personId,
            }
        }).then((json) => {
            if (json.data !== null) {
                var data = json.data;
                if (talklist === null || talklist === []) {
                    this.setState({talklist: data});
                } else if (talklist !== null && data !== undefined && data !== "") {
                    if (talklist.length !== data.length) {
                        this.setState({talklist: data});
                    }
                }
                if (this.state._scrollView !== null && this.state._scrollView !== undefined) {
                    this.state._scrollView.scrollToEnd({animated: false});
                }
            }
            else {

            }

        }).catch((err) => {
            alert(err);
        });
    }

    componentWillMount() {
        this.getTalkingFarm();
    }

    componentDidMount() {
        //this.getTalkingFarm();

        if (this.state._scrollView !== null &&this.state._scrollView !== undefined) {
            //_scrollView.scrollTo({x: 0, y: 9000, animated: true});
            this.state._scrollView.scrollToEnd({animated: false});
        }
        this.timer = setInterval(
            () => {
                this.getTalkingFarm()
            },
            5000
        );

    }



    renderRow(rowData) {

        //{headimgurl=https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTJ2ib97d8V4abRjO6gG83gJjSftWauMb12boLI1AwqcgeZ9xvg5ic47AzbsOD9vrkMH5cKJhsXIFKUw/132,
        // pernum=154, time=Sep 14, 2018 1:43:44 PM, content=一样一样, username=邹鹏, timestamp=2018-09-14 13:43:44.0}

        if (rowData.pernum === this.state.personInfo.personId) {
            var row =

                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'flex-end',
                        alignItems:'center',
                    }}>
                        <View style={{
                            padding: 10,
                            borderRadius: 8,
                            backgroundColor:'#a2e563',
                            minHeight: 20,
                            marginRight:10,
                        }}>
                            <Text style={{fontSize: 15}}>
                                {rowData.content}
                            </Text>
                        </View>

                        {rowData.headimgurl === null ?
                            <View style={{width:40,padding: 10, marginRight: 10}}>
                                <Image
                                    style={{
                                        width: 40,
                                        height: 40,
                                        backgroundColor: 'transparent',
                                    }}
                                    resizeMode={'contain'}
                                    source={require('../../../img/portrait.jpg')}
                                >
                                </Image>
                            </View>
                            :
                            <View style={{width:40,padding:10,marginRight:10}}>
                                <Image
                                    style={{
                                        width: 40,
                                        height: 40,
                                        backgroundColor: 'transparent',
                                    }}
                                    resizeMode={'contain'}
                                    source={{uri: rowData.headimgurl}}
                                >
                                </Image>
                            </View>
                        }
                    </View>;
            return row;
        }

        var row =
            <View style={{
                flexDirection:'row',
                alignItems:'center',
            }}>
                {rowData.headimgurl === null ?
                    <View style={{width: 40, padding: 10,marginRight:10}}>
                        <Image
                            style={{
                                width: 40,
                                height: 40,
                                backgroundColor: 'transparent',
                            }}
                            resizeMode={'contain'}
                            source={require('../../../img/portrait.jpg')}
                        >
                        </Image>
                    </View>
                    :
                    <View style={{width: 40, padding: 10,marginRight:10}}>
                        <Image
                            style={{
                                width: 40,
                                height: 40,
                                backgroundColor: 'transparent',
                            }}
                            resizeMode={'contain'}
                            source={{uri: rowData.headimgurl}}
                        >
                        </Image>
                    </View>
                }

                <View style={{
                    padding: 10,
                    borderRadius: 8,
                    backgroundColor:'#fff',
                    minHeight: 20,
                    marginLeft:10,
                }}>
                    <Text style={{fontSize: 15}}>
                        {rowData.content}
                    </Text>
                </View>

            </View>;

        return row;
    }

    render() {
        var talklist = this.state.talklist;
        if (talklist !== null && talklist.length > 0) {
            var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

            var sortedCourses = talklist;

            talklist = (

                <ListView
                    ref={(scrollView) => {
                         this.state._scrollView = scrollView;
                    }}
                    automaticallyAdjustContentInsets={false}
                    dataSource={ds.cloneWithRows(sortedCourses)}
                    renderRow={this.renderRow.bind(this)}

                />


            );

        } else {
            this.getTalkingFarm();
        }

        return (
            <View style={styles.container}>
                <Toolbar width={width} title="讨论组" navigator={this.props.navigator} actions={[{icon:ACTION_PERSON,show:OPTION_SHOW}]}
                         onPress={(i)=>{
                             if(i==0){}
                         }}>
<KeyboardAwareScrollView style={{height:height-180,width:width}}>
                <View style={{height: height - 130,backgroundColor:'#f3f3f3'}}>
                    <ScrollView>
                        <View style={{height: height-190,paddingHorizontal:10,backgroundColor:'#f3f3f3'}}>
                            {talklist}
                        </View>
                    </ScrollView>
                    <View style={{
                        flexDirection: 'row', justifyContent: 'center',
                        alignItems: 'center', padding: 10,borderTopWidth:0.7,borderTopColor:'#666'
                    }}>
                        <TextInput style={styles.textinput}
                                   onSubmitEditing={() => this.addTalkingFarm()}
                                   value={this.state.usertextinput}
                                   onChangeText={(event) => this.setState({usertextinput: event})}
                                   underlineColorAndroid={'#666'}
                                   placeholder={'请输入...'}
                        >
                        </TextInput>
                        <TouchableOpacity style={{
                            flex: 1,
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginLeft: 10,
                            borderRadius: 5,
                            backgroundColor: '#23ac29'
                        }} onPress={() => {
                            this.addTalkingFarm()
                        }}>
                            <View style={{padding: 10}}>
                                <Text style={{color: '#fff', fontSize: 14}}>发送</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
</KeyboardAwareScrollView>
                </Toolbar>
            </View>
        )

    }

    componentWillUnmount() {
        this.timer && clearTimeout(this.timer);
    }

}

const styles = StyleSheet.create({

    container: {
        flex: 1,
    },
    textinput: {
        height: 30,
        flex: 6,
        fontSize:14,
    }

});


module.exports = connect(state => ({
        accessToken: state.user.accessToken,
        personInfo: state.user.personInfo,
        unionid: state.user.unionid,
        coaches: state.coach.coaches,
    })
)(TalkingFarm);

