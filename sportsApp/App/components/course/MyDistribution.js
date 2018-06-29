
import React, { Component } from 'react';
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

import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CommIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import TextInputWrapper from 'react-native-text-input-wrapper'
import CreateBadmintonCourse from './CreateBadmintonCourse';
import CreateCustomerPlan from './CreateCustomerPlan';
import CustomerCourseList from './CustomerCourseList';
import ModifyDistribution from './ModifyDistribution';
import {Toolbar,OPTION_SHOW,OPTION_NEVER,ACTION_ADD} from 'react-native-toolbar-wrapper'
import ScrollableTabView, { DefaultTabBar, ScrollableTabBar } from 'react-native-scrollable-tab-view';


var { height, width } = Dimensions.get('window');

import {
    fetchCourses,
    fetchCoursesByCreatorId,
    onCoursesOfCoachUpdate,
    onCoursesUpdate,
    disableCoursesOfCoachOnFresh, enableCoursesOfCoachOnFresh,
} from '../../action/CourseActions';

import {getAccessToken,} from '../../action/UserActions';

import BadmintonCourseSignUp from './BadmintonCourseSignUp';


class MyDistribution extends Component {

    //导航至定制（for 教练）
    navigate2BadmintonCourseForCoach() {
        const { navigator } = this.props;
        if (navigator) {
            navigator.push({
                name: 'CreateBadmintonCourse',
                component: CreateBadmintonCourse,
                params: {
                    setMyCourseList:this.setMyCourseList.bind(this)
                }
            })
        }
    }

    //导航至定制（for 用户）
    navigate2BadmintonCourseForUser() {
        const { navigator } = this.props;
        if (navigator) {
            navigator.push({
                name: 'CreateCustomerPlan',
                component: CreateCustomerPlan,
                params: {

                }
            })
        }
    }

    navigate2ModifyDistribution(course){
        const { navigator } = this.props;
        if (navigator) {
            navigator.push({
                name: 'ModifyDistribution',
                component: ModifyDistribution,
                params: {
                       course:course,
                       setDistribution:this.setDistribution.bind(this)

                }
            })
        }
    }

    //导航至定制列表（for 教练）
    navigate2CustomCourseList(){
        const { navigator } = this.props;
        if (navigator) {
            navigator.push({
                name:'CustomerCourseList',
                component:CustomerCourseList,
                params: {

                }
            })
        }
    }

    navigate2CourseSignUp(classInfo)
    {
        const { navigator } = this.props;
        if (navigator) {
            navigator.push({
                name: 'BadmintonCourseSignUp',
                component: BadmintonCourseSignUp,
                params: {
                    classInfo,
                    setMyCourseList:this.setMyCourseList.bind(this)
                }
            })
        }
    }

    navigate2CourseRecord()
    {
        const { navigator } = this.props;
        if (navigator) {
            navigator.push({
                name: 'BadmintonCourseRecord',
                component: BadmintonCourseRecord,
                params: {

                }
            })
        }
    }

    goBack() {
        const { navigator } = this.props;
        if (navigator) {
            navigator.pop();
        }
    }

    setDistribution()
    {
        this.props.dispatch(fetchCoursesByCreatorId(this.props.creatorId)).then((json)=>{
            if(json.re==1)
            {
                this.props.dispatch(onCoursesOfCoachUpdate(json.data))
            }else{
                if(json.re==-100){
                    this.props.dispatch(getAccessToken(false));
                }
            }
        })
    }

    renderRow(rowData, sectionId, rowId) {
        return (
            <TouchableOpacity style={{ flexDirection: 'column', borderBottomWidth: 1, borderColor: '#ddd', marginTop: 4 }}
                              onPress={()=>{
                                  this.navigate2CourseSignUp(rowData);

                              }}
            >
                <View style={{ flex: 1, flexDirection: 'column', alignItems: 'flex-start' }}>
                    <View style={{ padding: 4, paddingHorizontal: 12 ,flexDirection:'row',}}>

                        <View style={{padding:4,flex:1,alignItems:'center',flexDirection:'row'}}>
                            <Text style={{ color: '#222', fontWeight: 'bold', fontSize: 15 }}>
                                {rowData.courseName}
                            </Text>
                        </View>


                        <View style={{padding:4,marginLeft:10,flexDirection:'row',alignItems:'center'}}>
                            <CommIcon name="account-check" size={24} color="#0adc5e" style={{backgroundColor:'transparent',}}/>
                            <Text style={{ color: '#444', fontWeight: 'bold', fontSize: 13,paddingTop:-2 }}>
                                {rowData.creatorName}教练
                            </Text>
                        </View>
                    </View>

                    <View style={{ padding: 3, paddingHorizontal: 12 }}>
                        <Text style={{ color: '#444', fontSize: 13 }}>
                            {rowData.detail}
                        </Text>
                    </View>
                    <View style={{ padding: 3, paddingHorizontal: 12 }}>
                        <Text style={{ color: '#444', fontSize: 13 }}>
                            课程最大人数：{rowData.maxNumber}
                        </Text>
                    </View>

                    <View style={{ paddingTop: 12, paddingBottom: 4, paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ color: '#f00', fontSize: 12, width: 50 }}>
                            ￥{rowData.cost}
                        </Text>

                        <View style={{ backgroundColor: '#66CDAA', borderRadius: 6, padding: 4, paddingHorizontal: 6, marginLeft: 10 }}>
                            <Text style={{ color: '#fff', fontSize: 12 }}>
                                {rowData.classCount}课次
                            </Text>
                        </View>

                        <View style={{ backgroundColor: '#ff4730', borderRadius: 6, padding: 4, paddingHorizontal: 6, marginLeft: 10 }}>
                            <Text style={{ color: '#fff', fontSize: 12 }}>
                                {rowData.unitName}
                            </Text>
                        </View>


                    </View>
                </View>

                {/*<View style={{ width: 70, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                    <Icon name={'angle-right'} size={34} color="#444" style={{ backgroundColor: 'transparent', marginTop: -10 }} />
                </View>*/}

                <View style={{flex:1,flexDirection:'column',width:100,padding:10,borderTopWidth:1,borderColor:'#ddd'}}>
                    <TouchableOpacity style={{
                        flex: 1,
                        borderWidth: 1,
                        borderColor: '#66CDAA',
                        padding: 5,
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: 6,
                        marginLeft:30
                    }}


                                      onPress={() => {
                                          this.navigate2ModifyDistribution(rowData);
                                      }
                                      }>
                        <Text style={{color: '#66CDAA', fontSize: 12}}>编辑</Text>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>



        )



    }

    fetchCoursesByCreatorId(creatorId){
        this.state.doingFetch=true;
        this.state.isRefreshing=true;
        this.props.dispatch(fetchCoursesByCreatorId(creatorId)).then((json)=> {
            if(json.re==-100){
                this.props.dispatch(getAccessToken(false));
            }
            this.props.dispatch(disableCoursesOfCoachOnFresh());
            this.setState({doingFetch:false,isRefreshing:false})
        }).catch((e)=>{
            this.props.dispatch(disableCoursesOfCoachOnFresh());
            this.setState({doingFetch:false,isRefreshing:false});
            alert(e)
        });
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
        this.props.dispatch(enableCoursesOfCoachOnFresh());

    }






    constructor(props) {
        super(props);
        this.state = {
            doingFetch:false,
            isRefreshing:false,
            fadeAnim:new Animated.Value(1),
        };
    }

    showScaleAnimationDialog() {
        this.scaleAnimationDialog.show();
    }

    render() {
        var coursesOfCoachListView=null;
        var {coursesOfCoach,coursesOfCoachOnFresh}=this.props;
        //var competitionList=this.state.competitionList;
        if(coursesOfCoachOnFresh==true)
        {
            if(this.state.doingFetch==false)
                this.fetchCoursesByCreatorId(this.props.creatorId);
        }else{
            var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
            if (coursesOfCoach !== undefined && coursesOfCoach !== null && coursesOfCoach.length > 0)
            {
                coursesOfCoachListView = (
                    <ListView
                        automaticallyAdjustContentInsets={false}
                        dataSource={ds.cloneWithRows(coursesOfCoach)}
                        renderRow={this.renderRow.bind(this)}
                    />
                );
            }
        }



        return (
            <View style={styles.container}>
                <Toolbar width={width} title="我的发布" actions={[]} navigator={this.props.navigator}>

                    {<View style={{flex:5,backgroundColor:'#eee'}}>
                        <Animated.View style={{opacity: this.state.fadeAnim,height:height-150,paddingTop:5,paddingBottom:5,}}>
                            <ScrollView
                                refreshControl={
                                    <RefreshControl
                                        refreshing={this.state.isRefreshing}
                                        onRefresh={this._onRefresh.bind(this)}
                                        tintColor="#9c0c13"
                                        title="刷新..."
                                        titleColor="#9c0c13"
                                        colors={['#ff0000', '#00ff00', '#0000ff']}
                                        progressBackgroundColor="#ffff00"
                                    />
                                }
                            >
                                {coursesOfCoachListView}
                                {
                                    coursesOfCoachListView==null?
                                        null:
                                        <View style={{justifyContent:'center',alignItems: 'center',backgroundColor:'#eee',padding:10}}>
                                            <Text style={{color:'#343434',fontSize:13,alignItems: 'center',justifyContent:'center'}}>已经全部加载完毕</Text>
                                        </View>
                                }

                            </ScrollView>

                        </Animated.View>
                    </View>}



                </Toolbar>

            </View>
        )
    }

    componentDidMount()
    {

    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    popoverContent: {
        width: 100,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    popoverText: {
        color: '#ccc',
        fontSize: 14
    }
});

/*
const mapStateToProps = (state, ownProps) => {

    const props = {
        userType: state.user.usertype.perTypeCode,
        courses:state.course.courses,
        creatorId:this.props.creatorId
    }
    return props
}


export default connect(mapStateToProps)(MyDistribution);
*/

module.exports = connect(state=>({
        userType: state.user.usertype.perTypeCode,
       coursesOfCoach:state.course.coursesOfCoach,
       coursesOfCoachOnFresh:state.course.coursesOfCoachOnFresh,
        creatorId:state.user.personInfo.personId
    })
)(MyDistribution);