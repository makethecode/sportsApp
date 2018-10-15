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
    Modal,
    ActivityIndicator,
} from 'react-native';
import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import { SearchBar } from 'react-native-elements'
import {Toolbar,OPTION_SHOW,OPTION_NEVER} from 'react-native-toolbar-wrapper';
import {
    getAccessToken
}from '../../action/UserActions'
import {
    fetchCourses,
    fetchCoursesByCreatorId,
    onCoursesOfCoachUpdate,
    onCoursesUpdate,
    disableCoursesOfCoachOnFresh, enableCoursesOfCoachOnFresh,
    getGroupMember, createCourseGroup, saveOrUpdateBadmintonCourseClassRecords, updateIsHasPhotoStatus,
    establishEveryDayClass,fetchAllCourses,
} from '../../action/CourseActions';

var {height, width} = Dimensions.get('window');

class MyCourseRecord extends Component {

    goBack(){
        const { navigator } = this.props;
        if(navigator) {
            navigator.pop();
        }
    }

    constructor(props) {
        super(props);
        this.state={
            isRefreshing: false,
            fadeAnim: new Animated.Value(1),

            courses:null,
            allcourses:null,
            showProgress:false,
        };
    }

    render()
    {

        var courseList = [];
        var {courses}=this.state;

        if(courses&&courses.length>0)
        {

            courses.map((rowData,i)=>{

                var avatar = require('../../../img/portrait.jpg');
                if(rowData.creatorId==3)avatar = require('../../../img/coach3.jpg');
                if(rowData.creatorId==154)avatar = require('../../../img/coach74.jpg');

                if(rowData.detail==null)rowData.detail='暂无简介'

                courseList.push(
                    <View style={{ flexDirection: 'column', borderBottomWidth: 1, borderColor: '#ddd', marginTop: 4 ,backgroundColor:'#fff'}}>
                        <View style={{ flex: 1, flexDirection: 'column', alignItems: 'flex-start',marginBotton:5}}>
                            <View style={{ padding: 6, paddingHorizontal: 10 ,flexDirection:'row',}}>
                                <View style={{padding:4,flex:1,alignItems:'center',flexDirection:'row'}}>
                                    <Text style={{ color: '#222', fontSize: 19 }}>
                                        {rowData.courseName}
                                    </Text>
                                </View>

                                {
                                    rowData.status==1?
                                        <View style={{padding: 4, marginLeft: 10, flexDirection: 'row', alignItems: 'center',backgroundColor:'#fc3c3f',borderRadius: 6}}>
                                            <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 13, paddingTop: -2}}>
                                                已完成
                                            </Text>
                                        </View>:
                                        <View style={{padding: 4, marginLeft: 10, flexDirection: 'row', alignItems: 'center',backgroundColor:'#80ccba',borderRadius: 6}}>
                                            <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 13, paddingTop: -2}}>
                                                已发布
                                            </Text>
                                        </View>
                                }
                            </View>

                            <View style={{ padding:6, paddingHorizontal: 12,flexDirection:'column'}}>
                                <Text style={{ color: '#666', fontSize: 13}}>
                                    {rowData.detail}
                                </Text>
                            </View>

                            <View style={{ padding: 6, paddingHorizontal:6,flexDirection:'row',marginTop:3}}>
                                <View style={{flex:1,justifyContent:'center',alignItems: 'center'}}>
                                    <Image resizeMode="stretch" style={{height:40,width:40,borderRadius:20}} source={avatar}/>
                                </View>
                                <View style={{flex:4,flexDirection:'column',alignItems:'flex-start',justifyContent:'center'}}>
                                    <Text style={{ color: '#222', fontSize: 17,marginBottom:5}}>{rowData.creatorName}</Text>
                                    <Text style={{ color: '#666', fontSize: 13}}>{rowData.coachLevel}</Text>
                                </View>
                                <View style={{flex:1,flexDirection:'column'}}>
                                    <Text style={{ color: '#222', fontSize: 16,marginBottom:5}}>课时</Text>
                                    <Text style={{ color: '#555', fontSize: 16}}>{rowData.classCount}次</Text>
                                </View>
                            </View>

                            <View style={{ paddingTop: 12, paddingBottom: 4, paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center',marginBottom:5}}>
                                {/*俱乐部*/}
                                <View style={{backgroundColor: '#efb66a', borderRadius: 6, padding: 4, paddingHorizontal: 6 }}>
                                    <Text style={{ color: '#fff', fontSize: 13 }}>
                                        {rowData.clubName}
                                    </Text>
                                </View>
                                {/*场地*/}
                                <View style={{backgroundColor: '#fc3c3f', borderRadius: 6, padding: 4, paddingHorizontal: 6,marginLeft: 10 }}>
                                    <Text style={{ color: '#fff', fontSize: 13 }}>
                                        {rowData.unitName}
                                    </Text>
                                </View>
                                {/*价格*/}
                                <View style={{padding: 4, paddingHorizontal: 6,flex:1,alignItems:'flex-end'}}>
                                    <Text style={{ color: '#f00', fontSize: 20}}>
                                        ￥{rowData.cost}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>
                )
            })

        }

        return (
            <View style={styles.container}>
                <Toolbar width={width}  title="我的课程" navigator={this.props.navigator}
                         actions={[]}
                         onPress={(i)=>{
                             this.goBack()
                         }}>

                    <SearchBar
                        lightTheme
                        onChangeText={
                            //模糊查询
                            (text)=>{
                                this.searchByText(text)
                            }
                        }
                        placeholder='课程名\场馆\俱乐部' />
                    <View style={{width:width,height:40,backgroundColor:'#eee',padding:10,alignItems:'flex-start',justifyContent:'center',textAlign:'left'}}>
                        <Text style={{color:'#888',fontSize:13}}>课程名单</Text>
                    </View>

                    <ScrollView style={{ flex: 1, width: width, backgroundColor: '#fff' }}>

                        <Animated.View style={{flex: 1, padding: 4,paddingTop:10,opacity: this.state.fadeAnim,backgroundColor:'#fff' }}>
                            {courseList}
                        </Animated.View>

                    </ScrollView>

                    {/*loading模态框*/}
                    <Modal animationType={"fade"} transparent={true} visible={this.state.showProgress}>
                        <TouchableOpacity style={[styles.modalContainer,styles.modalBackgroundStyle,{alignItems:'center'}]}
                                          onPress={()=>{
                                              //TODO:cancel this behaviour

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
                </Toolbar>
            </View>
        )

    }

    searchByText(text){

        //前端实现模糊查询

        if(text==null || text=='')
        {
            var courses = this.state.allcourses;
            this.setState({courses:courses})
        }
        else {
            var courses = this.state.allcourses;
            var courseList = [];

            if (courses && courses.length > 0) {
                courses.map((course, i) => {
                    if (course.courseName) {
                        if (course.courseName.indexOf(text) != -1)
                            courseList.push(course)
                    }
                })
            }

            this.setState({courses: courseList})
        }
    }

    componentDidMount()
    {
        InteractionManager.runAfterInteractions(() => {
            this.setState({showProgress:true});
            this.props.dispatch(fetchCoursesByCreatorId(this.props.creatorId)).then((json)=>{
                if(json.re==1)
                {
                    var courses = json.data;
                    this.setState({courses:courses,allcourses:courses,showProgress:false});
                }
                else {
                    if(json.re=-100){
                        this.props.dispatch(getAccessToken(false))
                    }

                }
            })
        });
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

});


module.exports = connect(state=>({
        accessToken:state.user.accessToken,
        personInfo:state.user.personInfo,
        creatorId:state.user.personInfo.personId,
    })
)(MyCourseRecord);


