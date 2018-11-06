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


class CoursePayModal extends Component{

    close(){
        if(this.props.onClose!==undefined&&this.props.onClose!==null)
        {
            this.props.onClose();
        }
    }

    navi2CoursePay(isChild){
        if(this.props.navi2CoursePay!==undefined&&this.props.navi2CoursePay!==null)
        {
            this.props.navi2CoursePay(isChild);
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
           isChild:0,
        }
    }

    render(){

        return (
            <View>
                    <View style={{
                        height: height * 0.2,
                        width: width * 0.8,
                        padding: 5,
                        margin: width * 0.1,
                        marginTop: 250,
                        borderColor: '#eee',
                        borderWidth: 1,
                        backgroundColor: '#fff'
                    }}>

                            <TouchableOpacity style={{
                                flex: 1,
                                padding: 5,
                                margin: 10,
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: '#fca482',
                                borderRadius: 6
                            }}
                                              onPress={() => {
                                                  this.navi2CoursePay(0)
                                                  this.close();
                                              }}>
                                <Text style={{color: '#fff', padding: 5,fontSize:14}}>为自己报名</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={{
                                flex: 1,
                                padding: 5,
                                margin: 10,
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: '#fc6254',
                                borderRadius: 6
                            }}
                                              onPress={() => {
                                                  this.navi2CoursePay(1)
                                                  this.close();
                                              }}>
                                <Text style={{color: '#fff', padding: 5,fontSize:14}}>为孩子报名</Text>
                            </TouchableOpacity>
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


module.exports = CoursePayModal;

