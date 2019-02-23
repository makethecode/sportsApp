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
    DeviceEventEmitter
} from 'react-native';
import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import _ from 'lodash';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CommIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Toolbar,OPTION_SHOW,OPTION_NEVER} from 'react-native-toolbar-wrapper';
import {
    getAccessToken,
} from '../../action/UserActions';
import { SearchBar } from 'react-native-elements';
import ModalDropdown from 'react-native-modal-dropdown';
import TrailStudentInformation from './TrailStudentInformation'
import TrailFilter from '../../utils/TrailFilter'
import {fetchAllTrialClassMember} from '../../action/CourseActions'

var { height, width } = Dimensions.get('window');

const dropdownWidth = width/2-20;

class TrailStudentList extends Component {

    goBack(){
        const { navigator } = this.props;
        if(navigator) {
            navigator.pop();
        }
    }

    navigate2TrailStudentInformation(student){
        const { navigator } = this.props;
        if (navigator) {
            navigator.push({
                name: 'TrailStudentInformation',
                component: TrailStudentInformation,
                params: {
                    student:student,
                }
            })
        }
    }

    constructor(props) {
        super(props);
        this.state={

            courseTypeId:-1,
            typeId:-1,
            type:'学员类型',
            courseType:'课程类型',

            courseTypeList:['奥体球馆','全民健身中心'],
            typeList:['试课学员','转正学员','流失学员'],
            showTypeDropdown:false,
            showCourseTypeDropdown:false,

            students:[
                // {id:null,avatar:null,perNum:null,mobilePhone:null,type:0,courseType:null,
                // courseTypeIdx:0,joinTime:null,sex:null,birthday:null}
                ],
        };
    }

    render()
    {

        let typeIcon = this.state.showTypeDropdown ? require('../../../img/test_up.png') : require('../../../img/test_down.png');
        let courseTypeIcon = this.state.showCourseTypeDropdown ? require('../../../img/test_up.png') : require('../../../img/test_down.png');

        var studentList = [];
        var students=TrailFilter.filter(this.state.students,parseInt(this.state.courseTypeId),parseInt(this.state.typeId));

        if(students&&students.length>0)
        {
            students.map((student,i)=>{

                // {'id':1,personId:2,
                //     'avatar':'https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83eomLddoUqCUnzajsMFr0ibDxXksGFH1HIeg6ksyWr4fLFxianqOpLVVyE6ia0XUFODVXJQL432uBNqVg/132',
                //     'perNum':'陈海云',
                //     'mobilePhone':'13305607453',
                //     'type':0,
                //     'courseType':'山体课程',
                //     'courseTypeIdx':0,
                //     'joinTime':'2018-10-10','sexStr':'女',birthday:'1996-10-29'},

                var type='';
                switch(student.type){
                    case 0:type='试课学员';break;
                    case 1:type='转正学员';break;
                    case 2:type='流失学员';break;
                }

                studentList.push(
                    <TouchableOpacity key={i} style={{flexDirection:'column',marginTop:4}}
                                      onPress={()=>{
                                          this.navigate2TrailStudentInformation(student)
                                      }}>

                        <View style={{ padding: 6,flexDirection:'row',marginTop:3}}>
                            <View style={{flex:1,justifyContent:'center',alignItems: 'center'}}>
                                {
                                    student.avatar!=""?
                                        <Image resizeMode="stretch" style={{height: 40, width: 40, borderRadius: 20}}
                                               source={{uri: student.avatar}}/>:
                                        <Image resizeMode="stretch" style={{height: 40, width: 40, borderRadius: 20}}
                                               source={require('../../../img/portrait.jpg')}/>
                                }
                            </View>
                            <View style={{flex:3,flexDirection:'column',alignItems:'flex-start',justifyContent:'center'}}>
                                <Text style={{ color: '#222', fontSize: 14,marginBottom:5}}>{student.perNum}</Text>
                                <Text style={{ color: '#666', fontSize: 13}}>{student.mobilePhone}</Text>
                            </View>

                            <View style={{flex:1,justifyContent:'center',alignItems: 'center',borderRadius:5,borderWidth:1,borderColor:'#fc3c3f',margin:5,marginHorizontal:8}}>
                                <Text style={{color:'#fc3c3f',justifyContent:'center',alignItems: 'center',fontSize:13}}>{type}</Text>
                            </View>
                        </View>

                        <View style={{flex:3,padding:10,flexDirection:'row'}}>
                            <View style={{flex:1,flexDirection:'row',marginBottom:3}}>
                                <View style={{flex:1,justifyContent:'flex-start',alignItems: 'center',backgroundColor:'#fff',borderRadius:5,padding:5}}>
                                    <Text style={{color:'#66CDAA'}}>类型</Text>
                                </View>
                                <View style={{flex:2,padding:5,marginLeft:5}}>
                                    <Text style={{color:'#5c5c5c',justifyContent:'flex-start',alignItems: 'center'}}>{student.courseType}</Text>
                                </View>
                            </View>

                            <View style={{flex:1,flexDirection:'row',marginBottom:3}}>
                                <View style={{flex:1,justifyContent:'flex-start',alignItems: 'center',backgroundColor:'#ffffff',borderRadius:5,padding:5}}>
                                    <Text style={{color:'#66CDAA'}}>时间</Text>
                                </View>
                                <View style={{flex:2,padding:5,marginLeft:5}}>
                                    <Text style={{color:'#5c5c5c',justifyContent:'flex-start',alignItems: 'center'}}>{student.joinTime}</Text>
                                </View>
                            </View>
                        </View>

                        <View style={{height:0.7,width:width,backgroundColor:'#c2c2c2'}}></View>

                    </TouchableOpacity>
                )
            })

        }

        return (
            <View style={styles.container}>
                <Toolbar width={width}  title="试课学员" navigator={this.props.navigator}
                         actions={[]}
                         onPress={(i)=>{
                             this.goBack()
                         }}>

                    <View style={styles.flexContainer}>
                        {/*课程类型*/}
                        <ModalDropdown
                            style={styles.cell}
                            textStyle={styles.textstyle}
                            dropdownStyle={styles.dropdownstyle}
                            options={this.state.courseTypeList}
                            renderRow={this.dropdown_renderRow.bind(this)}
                            onSelect={(idx, value) => this.dropdown_1_onSelect(idx, value)}
                            onDropdownWillShow={this.dropdown_1_willShow.bind(this)}
                            onDropdownWillHide={this.dropdown_1_willHide.bind(this)}
                        >
                            <View style={styles.viewcell}>
                                <Text style={styles.textstyle}>
                                    {this.state.courseType}
                                </Text>
                                <Image
                                    style={styles.dropdown_image}
                                    source={courseTypeIcon}
                                />
                            </View>
                        </ModalDropdown>
                        {/*学员类型*/}
                        <ModalDropdown
                            style={styles.cell}
                            textStyle={styles.textstyle}
                            dropdownStyle={styles.dropdownstyle}
                            options={this.state.typeList}
                            renderRow={this.dropdown_renderRow.bind(this)}
                            onSelect={(idx, value) => this.dropdown_2_onSelect(idx, value)}
                            onDropdownWillShow={this.dropdown_2_willShow.bind(this)}
                            onDropdownWillHide={this.dropdown_2_willHide.bind(this)}
                        >
                            <View style={styles.viewcell}>
                                <Text style={styles.textstyle}>
                                    {this.state.type}
                                </Text>
                                <Image
                                    style={styles.dropdown_image}
                                    source={typeIcon}
                                />
                            </View>
                        </ModalDropdown>

                        {/*清空*/}
                        <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                            <TouchableOpacity
                                onPress={()=>{
                                    this.setState({typeId:-1,courseTypeId:-1,type:'学员类型',courseType:'课程类型'})
                                }}
                            >
                                <Ionicons name='md-refresh' size={20} color="#5c5c5c"/>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={{height:0.7,width:width,backgroundColor:'#c2c2c2'}}></View>

                    <View style={{width:width,height:height-180}}>
                    <ScrollView>
                            {studentList}
                    </ScrollView>
                    </View>

                </Toolbar>
            </View>
        )
    }

    dropdown_renderRow(rowData, rowID, highlighted){
        return (
            <TouchableOpacity >
                <View style={[styles.dropdown_row]}>
                    <Text style={[styles.dropdown_row_text, highlighted && {color: 'mediumaquamarine'}]}>
                        {rowData}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    }

    dropdown_1_onSelect(idx, value) {
        this.setState({
            courseType:value,
            courseTypeId:idx
        });
    }

    dropdown_2_onSelect(idx, value) {
        this.setState({
            type:value,
            typeId:idx
        });
    }

    dropdown_1_willShow() {
        this.setState({
            showCourseTypeDropDown:true,
        });
    }

    dropdown_2_willShow() {
        this.setState({
            showTypeDropDown:true,
        });
    }

    dropdown_1_willHide() {
        this.setState({
            showCourseTypeDropDown:false,
        });
    }

    dropdown_2_willHide() {
        this.setState({
            showTypeDropDown:false,
        });
    }

    componentWillMount()
    {
        this.fetchAllTrialClassMember();

        this.Listener=DeviceEventEmitter.addListener('on_trial_class_member_type_confirm', (data)=>{
            if(data)
                this.fetchAllTrialClassMember();
        });
    }

    componentWillUnmount(){
        if(this.Listener)
            this.Listener.remove();
    }

    fetchAllTrialClassMember(){
        this.props.dispatch(fetchAllTrialClassMember()).then((json)=>{
            if(json.re==1)
            {
                this.setState({students:json.data})
            }
            else{
                if(ison.re=-100) {
                    this.props.dispatch(getAccessToken(false))
                }
            }
        })
    }


}

const styles = StyleSheet.create({
    container: {
        flexDirection:'column'
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
        width:width,
        height:35,
    },
    cell: {
        width:dropdownWidth,
        alignItems:'center',
        flexDirection:'row',
        height:35,
        borderRightColor:'#cdcdcd',
        borderRightWidth:0.7,

    },
    viewcell: {
        width:dropdownWidth-0.7,
        backgroundColor:'#ffffff',
        alignItems:'center',
        height:35,
        justifyContent:'center',
        flexDirection:'row',
    },
    textstyle: {
        fontSize: 13,
        textAlign: 'center',
        color:'#646464',
        justifyContent:'center',
    },
    dropdownstyle: {
        height: 150,
        width:dropdownWidth,
        borderColor: '#cdcdcd',
        borderWidth: 0.7,
    },
    dropdown_row: {
        flexDirection: 'row',
        height: 50,
        alignItems: 'center',
    },
    dropdown_row_text: {
        fontSize: 13,
        color: '#646464',
        textAlignVertical: 'center',
        justifyContent:'center',
        marginLeft: 5,
    },
    dropdown_image: {
        width: 20,
        height: 20,
    },
});


module.exports = connect(state=>({
        accessToken:state.user.accessToken,
        personInfo:state.user.personInfo,
        coaches:state.coach.coaches,
    })
)(TrailStudentList);



