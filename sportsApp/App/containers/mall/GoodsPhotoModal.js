
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
import Ionicons from 'react-native-vector-icons/Ionicons';

var ImagePicker = require('react-native-image-picker');
var {height, width} = Dimensions.get('window');

class GoodsPhotoModal extends Component{

    close(){
        if(this.props.onClose!==undefined&&this.props.onClose!==null)
        {
            this.props.onClose();
        }
    }

    uploadGoodsImg(currentPhotoUrl,oldPhotoUrl,choosePhotoIdx){
        if(this.props.uploadGoodsImg!==undefined&&this.props.uploadGoodsImg!==null)
        {
            this.props.uploadGoodsImg(currentPhotoUrl,oldPhotoUrl,choosePhotoIdx);
        }
    }

    componentWillReceiveProps(nextProps)
    {
        this.setState(nextProps)
    }

    showImagePicker(){

        var options = {
            storageOptions: {
                skipBackup: true,
                path: 'images'
            },
            title:'请选择',
            takePhotoButtonTitle:'拍照',
            chooseFromLibraryButtonTitle:'图库',
            cancelButtonTitle:'取消',

        };

        ImagePicker.showImagePicker(options, (response) => {

            if (response.didCancel) {
                console.log('User cancelled image picker');
            }
            else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            }
            else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            }
            else {
                let source = { uri: response.uri };

                switch (this.props.choosePhotoIdx){
                    case 1:this.setState({goodsPhoto1Url:source.uri});break;
                    case 2:this.setState({goodsPhoto2Url:source.uri});break;
                    case 3:this.setState({goodsPhoto3Url:source.uri});break;
                    case 4:this.setState({goodsPhoto4Url:source.uri});break;
                    case 5:this.setState({goodsPhoto5Url:source.uri});break;
                }
            }
        });
    }

    constructor(props)
    {
        super(props);
        this.state={
        //this.props.val:http://192.168.1.103:8080/badmintonhotnull/3/1.jpeg
        goodsPhoto1Url:this.props.goodsPhoto1Url,
        goodsPhoto2Url:this.props.goodsPhoto2Url,
        goodsPhoto3Url:this.props.goodsPhoto3Url,
        goodsPhoto4Url:this.props.goodsPhoto4Url,
        goodsPhoto5Url:this.props.goodsPhoto5Url,
        choosePhotoIdx:this.props.choosePhotoIdx,
        }
    }

    render(){

        var currentPhotoUrl ='';
        switch (this.state.choosePhotoIdx){
            case 1:currentPhotoUrl = this.state.goodsPhoto1Url;break;
            case 2:currentPhotoUrl = this.state.goodsPhoto2Url;break;
            case 3:currentPhotoUrl = this.state.goodsPhoto3Url;break;
            case 4:currentPhotoUrl = this.state.goodsPhoto4Url;break;
            case 5:currentPhotoUrl = this.state.goodsPhoto5Url;break;
        }

        var oldPhotoUrl = '';
        switch (this.state.choosePhotoIdx){
            case 1:oldPhotoUrl = this.props.goodsPhoto1Url;break;
            case 2:oldPhotoUrl = this.props.goodsPhoto2Url;break;
            case 3:oldPhotoUrl = this.props.goodsPhoto3Url;break;
            case 4:oldPhotoUrl = this.props.goodsPhoto4Url;break;
            case 5:oldPhotoUrl = this.props.goodsPhoto5Url;break;
        }

        return (

            <View>
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

                    <View style={{flex: 1,padding:2,justifyContent:'center',alignItems:'center'}}>
                        <Text>更改商品照片</Text>
                    </View>

                    <View style={{flex: 4, backgroundColor: '#fff',padding: 5,justifyContent:'center',alignItems:'center'}}>
                        {
                            currentPhotoUrl!==undefined&&currentPhotoUrl!==null&&currentPhotoUrl!=''?
                                <TouchableOpacity style={{height:height*0.4,width:height*0.4,borderColor:'#ddd',borderWidth:1,borderRadius:10,justifyContent:'center',alignItems:'center'}}
                                                  onPress={()=>{
                                                      this.showImagePicker()
                                                  }}>
                                    <Image resizeMode="stretch" style={{height:height*0.3,width:height*0.3,}} source={{uri:currentPhotoUrl}}/>
                                </TouchableOpacity> :
                                <TouchableOpacity style={{height:height*0.4,width:height*0.4,borderColor:'#ddd',borderWidth:1,borderRadius:10,justifyContent:'center',alignItems:'center'}}
                                                  onPress={()=>{
                                                      this.showImagePicker()
                                                  }}>
                                    <Ionicons name='md-images' size={100} color="#aaa"/>
                                </TouchableOpacity>
                        }
                    </View>

                    <View style={{flex:1,padding:2,margin:4,flexDirection:'row',justifyContent:'center',alignItems:'flex-end'}}>
                        <TouchableOpacity style={{flex:1,padding:2,margin:5,flexDirection:'row',justifyContent:'center',alignItems:'center',
                            backgroundColor:'#fff',borderRadius:6,borderWidth:1,borderColor:'#66CDAA'}}
                                          onPress={()=>{ this.close(); }}>
                            <Text style={{color:'#66CDAA',padding:5}}>取消</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={{flex:1,padding:2,margin:5,flexDirection:'row',justifyContent:'center',alignItems:'center',
                            backgroundColor:'#66CDAA',borderRadius:6}}
                                          onPress={()=>{
                                              this.uploadGoodsImg(currentPhotoUrl,oldPhotoUrl,this.state.choosePhotoIdx)
                                          }}>
                            <Text style={{color:'#fff',padding:5}}>确定</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

        );
    }
}


var styles = StyleSheet.create({

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


module.exports = GoodsPhotoModal;


