import React,{Component} from 'react';
import {
    Dimensions,
    ListView,
    ScrollView,
    Image,
    View,
    StyleSheet,
    Text,
    TextInput,
    Platform,
    TouchableOpacity,
    RefreshControl,
    Animated,
    Easing,
    Modal,
    DeviceEventEmitter,
    Alert,
    KeyboardAvoidingView,
} from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import TextInputWrapper from 'react-native-text-input-wrapper';
import VenueInspect from '../../components/venue/VenueInspect';
import {Toolbar,OPTION_SHOW,OPTION_NEVER} from 'react-native-toolbar-wrapper';
import PopupDialog,{ScaleAnimation,DefaultAnimation,SlideAnimation} from 'react-native-popup-dialog';
import ActionSheet from 'react-native-actionsheet';
import InputScrollView from 'react-native-input-scroll-view'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import {getAccessToken,} from '../../action/UserActions';
import Config from '../../../config';
import Proxy from '../../utils/Proxy';

const slideAnimation = new SlideAnimation({ slideFrom: 'bottom' });
const scaleAnimation = new ScaleAnimation();
const defaultAnimation = new DefaultAnimation({ animationDuration: 150 });

var {height, width} = Dimensions.get('window');
var ImagePicker = require('react-native-image-picker');


class AddProduct extends Component{

    goBack(){
        const { navigator } = this.props;
        if(navigator) {
            navigator.pop();
        }
    }

    showImagePicker1(){

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
                let uri = { uri: response.uri };
                let path = { uri: response.path };
                this.setState({product:Object.assign(this.state.product,{imgUrl1:uri})});
                console.log('portrait.uri = ', response.uri);
            }
        });
    }

    showImagePicker2(){

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
                let uri = { uri: response.uri };
                let path = { uri: response.path };
                this.setState({product:Object.assign(this.state.product,{imgUrl2:uri})});
                console.log('portrait.uri = ', response.uri);
            }
        });
    }

    showImagePicker3(){

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
                let uri = { uri: response.uri };
                let path = { uri: response.path };
                this.setState({product:Object.assign(this.state.product,{imgUrl3:uri})});
                console.log('portrait.uri = ', response.uri);
            }
        });
    }

    showImagePicker4(){

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
                let uri = { uri: response.uri };
                let path = { uri: response.path };
                this.setState({product:Object.assign(this.state.product,{imgUrl4:uri})});
                console.log('portrait.uri = ', response.uri);
            }
        });
    }

    showImagePicker5(){

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
                let uri = { uri: response.uri };
                let path = { uri: response.path };
                this.setState({product:Object.assign(this.state.product,{imgUrl5:uri})});
                console.log('portrait.uri = ', response.uri);
            }
        });
    }

    //选商品类型
    _handlePress(index) {

        if(index!==0){
            var sortStr = this.state.sortButtons[index];
            var sortId = index;
            var sort = '';

            switch (sortId){
                //sortButtons:['取消','球拍','配件','运动鞋','衣服','会员卡','保健品'],
                case 1:sort='racket';break;
                case 2:sort='fittings';break;
                case 3:sort='shoes';break;
                case 4:sort='clothes';break;
                case 5:sort='VIP';break;
                case 6:sort='healthproducts';break;
            }

            this.setState({product:Object.assign(this.state.product,{sortStr:sortStr,sortId:sortId,sort:sort})});
        }
    }

    show(actionSheet) {
        this[actionSheet].show();
    }

    constructor(props) {
        super(props);
        this.state={
            product:{sortId:1,sortStr:'球拍',sort:'racket',name:'',brief:'',salePrice:0,
                inventoryNumber:0,discount:0,
                imgUrl1:null,imgUrl2:null,imgUrl3:null,imgUrl4:null,imgUrl5:null
            },
            sortButtons:['取消','球拍','配件','球鞋','衣服','会员卡','保健品'],

            typeList:[],
            jsonList:[],

        }
        this.showScaleAnimationDialog = this.showScaleAnimationDialog.bind(this);
    }

    showScaleAnimationDialog() {
        this.scaleAnimationDialog.show();
    }

    renderRow(rowData, sectionId, rowId) {

        return (
            <View style={{height:40,flexDirection:'row',justifyContent:'center',alignItems: 'center',backgroundColor:'#fff',marginBottom:1,padding:5}}>
                <View style={{flex:1}}>
                    <TextInput
                        placeholderTextColor='#888'
                        style={{fontSize:14,color:'#222',justifyContent:'flex-start',padding:0}}
                        placeholder='属性(例:颜色)'
                        value={this.state.typeList[rowId]}
                        multiline={true}
                        underlineColorAndroid={'transparent'}
                        onChangeText={
                            (value)=>{
                                var typeList = this.state.typeList;
                                typeList[rowId] = value;
                                this.setState({typeList:typeList})
                            }}
                    />
                </View>
                <View style={{flex:3}}>
                    <TextInput
                        placeholderTextColor='#888'
                        style={{fontSize:14,color:'#222',justifyContent:'flex-end',textAlign:'right',flex:3,padding:0}}
                        placeholder='类别(用,隔开,例:红色,白色)'
                        value={this.state.jsonList[rowId]}
                        multiline={true}
                        underlineColorAndroid={'transparent'}
                        onChangeText={
                            (value)=>{
                                var jsonList = this.state.jsonList;
                                jsonList[rowId] = value;
                                this.setState({jsonList:jsonList})
                            }}
                    />
                </View>
                <TouchableOpacity style={{marginLeft:8}}
                                  onPress={()=>{
                                      var typeList = this.state.typeList;
                                      var jsonList = this.state.jsonList;
                                      typeList.splice(rowId,1);
                                      jsonList.splice(rowId,1);
                                      this.setState({typeList:typeList,jsonList:jsonList})
                                  }}><Ionicons name='md-close' size={20} color="#aaa"/></TouchableOpacity>
            </View>
        )
    }

    exchangeToJson(jsonStr){

        var jsonList = jsonStr.split(',')
        var jsonStr = '';

        for(var i=0;i<jsonList.length;i++){
            var json = jsonList[i];
            if(this.isNumber(json)){
                if (i == 0) jsonStr = '[' + json;
                else jsonStr += ',' + json ;
                if (i == jsonList.length - 1) jsonStr += ']';
            }else {
                if (i == 0) jsonStr = '["' + json + '"';
                else jsonStr += ',"' + json + '"';
                if (i == jsonList.length - 1) jsonStr += ']';
            }
        }

        return jsonStr;
    }

    isNumber(val) {
        var regPos = /^\d+(\.\d+)?$/; //非负浮点数
        var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
        if(regPos.test(val) || regNeg.test(val)) {
            return true;
        } else {
            return false;
        }
    }

    render() {

        // sortId:null,sortStr:null,name:null,brief:null,size:null,costPrice:null,salePrice:null,
        //     salesVolume:null,inventoryNumber:null,attachId:null,discount:null,imgUrl:null

        const CANCEL_INDEX = 0;
        const DESTRUCTIVE_INDEX = 1;

        const sortButtons=['取消','球拍','配件','球鞋','衣服','会员卡','保健品'];

        var typeListView=null;
        var typeList = this.state.typeList;

        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        if (typeList !== undefined && typeList !== null && typeList.length > 0) {
            typeListView = (
                <ListView
                    automaticallyAdjustContentInsets={false}
                    dataSource={ds.cloneWithRows(typeList)}
                    renderRow={this.renderRow.bind(this)}
                />
            );
        }

        return (
            <View style={{flex:1,backgroundColor:'#eee'}}>
                <Toolbar width={width} title="上传商品" actions={[]} navigator={this.props.navigator}>
                    <KeyboardAwareScrollView style={{height:height-180,width:width}}>
                        <View style={{flex:5,backgroundColor:'#eee'}}>

                            <View style={{height:30,width:width,justifyContent:'center',textAlign:'left',paddingHorizontal:5}}>
                                <Text style={{color:'#666',fontSize:13}}>商品基本信息</Text>
                            </View>

                            {/*商品名称*/}
                            <View style={{height:40,flexDirection:'row',justifyContent:'flex-end',alignItems: 'center',backgroundColor:'#fff',marginBottom:1,padding:5}}>
                                <View style={{flex:1}}>
                                    <Text style={{color:'#343434'}}>商品名称</Text>
                                </View>
                                <View style={{flex:3,flexDirection:'row',justifyContent:'flex-end',alignItems: 'center',backgroundColor:'#fff',
                                    borderRadius:10}}>
                                    <TextInput
                                        placeholderTextColor='#888'
                                        style={{fontSize:14,color:'#222',justifyContent:'flex-end',textAlign:'right',height:40,flex:3,padding:0}}
                                        placeholder="不为空(12字以内)"
                                        value={this.state.product.name}
                                        underlineColorAndroid={'transparent'}
                                        onChangeText={
                                            (value)=>{
                                                this.setState({product:Object.assign(this.state.product,{name:value})})
                                            }}
                                    />
                                </View>
                            </View>

                            {/*商品类型*/}
                            <View style={{height:40,flexDirection:'row',justifyContent:'center',alignItems: 'center',backgroundColor:'#fff',marginBottom:1,padding:5}}>
                                <View style={{flex:1}}>
                                    <Text style={{color:'#343434'}}>商品类型</Text>
                                </View>
                                <TouchableOpacity style={{flex:3,flexDirection:'row',justifyContent:'center',alignItems: 'center',backgroundColor:'#fff',
                                    borderRadius:10}}
                                                  onPress={()=>{ this.show('actionSheet'); }}>
                                    {
                                        this.state.product.sortStr==null?
                                            <View style={{flex:1,paddingRight:8,justifyContent:'flex-end',alignItems: 'center',flexDirection:'row'}}>
                                                <Text style={{color:'#888',fontSize:14}}>请选择商品类型 ></Text>
                                            </View> :
                                            <View style={{flex:1,marginLeft:20,justifyContent:'flex-end',alignItems: 'center',flexDirection:'row'}}>
                                                <Text style={{color:'#444',fontSize:14}}>{this.state.product.sortStr}</Text>
                                            </View>

                                    }
                                    <ActionSheet
                                        ref={(p) => {
                                            this.actionSheet =p;
                                        }}
                                        title="请选择商品类型"
                                        options={sortButtons}
                                        cancelButtonIndex={CANCEL_INDEX}
                                        destructiveButtonIndex={DESTRUCTIVE_INDEX}
                                        onPress={
                                            (data)=>{ this._handlePress(data); }
                                        }
                                    />
                                </TouchableOpacity>
                            </View>

                            {/*商品简介*/}
                            <View style={{height:80,flexDirection:'row',justifyContent:'center',alignItems: 'center',backgroundColor:'#fff',marginBottom:1,padding:5}}>
                                <View style={{flex:1}}>
                                    <Text style={{color:'#343434'}}>商品简介</Text>
                                </View>
                                <View style={{flex:3,flexDirection:'row',justifyContent:'flex-start',alignItems: 'center',backgroundColor:'#fff',
                                    borderRadius:10}}>
                                    <TextInput
                                        placeholderTextColor='#888'
                                        style={{fontSize:14,color:'#222',justifyContent:'flex-end',textAlign:'right',height:80,flex:3,padding:0}}
                                        placeholder="简单描述一下商品"
                                        value={this.state.product.brief}
                                        underlineColorAndroid={'transparent'}
                                        multiline={true}
                                        onChangeText={
                                            (value)=>{
                                                this.setState({product:Object.assign(this.state.product,{brief:value})})
                                            }}
                                    />
                                </View>
                            </View>

                            <View style={{height:30,width:width,justifyContent:'center',textAlign:'left',paddingHorizontal:5}}>
                                <Text style={{color:'#666',fontSize:13}}>商品售卖信息</Text>
                            </View>


                            {/*售价*/}
                            <View style={{height:40,flexDirection:'row',justifyContent:'center',alignItems: 'center',backgroundColor:'#fff',marginBottom:1,padding:5}}>
                                <View style={{flex:1}}>
                                    <Text style={{color:'#343434'}}>售价</Text>
                                </View>
                                <View style={{flex:3,flexDirection:'row',justifyContent:'flex-start',alignItems: 'center',backgroundColor:'#fff',
                                    borderRadius:10}}>
                                    <TextInput
                                        placeholderTextColor='#888'
                                        style={{fontSize:14,color:'#222',justifyContent:'flex-end',textAlign:'right',height:40,flex:3,padding:0}}
                                        placeholder="不为空(精确到角,例:100,40.5)"
                                        value={this.state.product.salePrice}
                                        underlineColorAndroid={'transparent'}
                                        onChangeText={
                                            (value)=>{
                                                this.setState({product:Object.assign(this.state.product,{salePrice:value})})
                                            }}
                                        keyboardType='numeric'
                                    />
                                </View>
                            </View>

                            {/*库存量*/}
                            <View style={{height:40,flexDirection:'row',justifyContent:'center',alignItems: 'center',backgroundColor:'#fff',marginBottom:1,padding:5}}>
                                <View style={{flex:1}}>
                                    <Text style={{color:'#343434'}}>库存量</Text>
                                </View>
                                <View style={{flex:3,flexDirection:'row',justifyContent:'flex-start',alignItems: 'center',backgroundColor:'#fff',
                                    borderRadius:10}}>
                                    <TextInput
                                        placeholderTextColor='#888'
                                        style={{fontSize:14,color:'#222',justifyContent:'flex-end',textAlign:'right',height:40,flex:3,padding:0}}
                                        placeholder="不为空"
                                        value={this.state.product.inventoryNumber}
                                        underlineColorAndroid={'transparent'}
                                        onChangeText={
                                            (value)=>{
                                                this.setState({product:Object.assign(this.state.product,{inventoryNumber:parseInt(value)})})
                                            }}
                                        keyboardType='numeric'
                                    />
                                </View>
                            </View>

                            {/*折扣*/}
                            <View style={{height:40,flexDirection:'row',justifyContent:'center',alignItems: 'center',backgroundColor:'#fff',marginBottom:1,padding:5}}>
                                <View style={{flex:1}}>
                                    <Text style={{color:'#343434'}}>折扣</Text>
                                </View>
                                <View style={{flex:3,flexDirection:'row',justifyContent:'flex-start',alignItems: 'center',backgroundColor:'#fff',
                                    borderRadius:10}}>
                                    <TextInput
                                        placeholderTextColor='#888'
                                        style={{fontSize:14,color:'#222',justifyContent:'flex-end',textAlign:'right',height:40,flex:3,padding:0}}
                                        placeholder="不为空(例:7折为0.7,无折扣默认填1)"
                                        value={this.state.product.discount}
                                        underlineColorAndroid={'transparent'}
                                        onChangeText={
                                            (value)=>{
                                                this.setState({product:Object.assign(this.state.product,{discount:value})})
                                            }}
                                        keyboardType='numeric'
                                    />
                                </View>
                            </View>

                            <View style={{height:30,width:width,justifyContent:'center',alignItems:'center',textAlign:'left',paddingHorizontal:5,flexDirection:'row'}}>
                                <Text style={{color:'#666',fontSize:13}}>商品规格</Text>
                                <TouchableOpacity style={{flex:1,alignItems:'flex-end',justifyContent:'center'}}
                                                  onPress={()=>{

                                                      var flag = 1;

                                                      var typeList = this.state.typeList;
                                                      var jsonList = this.state.jsonList;

                                                      for (var i = 0; i < typeList.length; i++) {
                                                          if (typeList[i] == null || typeList[i] == ''){flag = 0}
                                                      }
                                                      for (var i = 0; i < jsonList.length; i++) {
                                                          if (jsonList[i] == null || jsonList[i] == ''){flag = 0}
                                                      }

                                                      if(flag==1) {
                                                          typeList.push('');
                                                          jsonList.push('');
                                                          this.setState({typeList: typeList, jsonList: jsonList})
                                                      }
                                                      if(flag==0){Alert.alert('失败','请填写完整商品规格信息')}

                                                  }}>
                                    <Ionicons name='md-add' size={20} color="#888"/>
                                </TouchableOpacity>
                            </View>

                            {typeListView}

                            {/*商品图片*/}
                            <View style={{flex:2,flexDirection:'column'}}>
                                <View style={{height:30,width:width,justifyContent:'center',textAlign:'left',paddingHorizontal:5}}>
                                    <Text style={{color:'#666',fontSize:13}}>商品图片</Text>
                                </View>

                                <View style={{flex:1,flexDirection:'row',justifyContent:'center',alignItems: 'center',backgroundColor:'#fff',marginBottom:1,padding:5}}>
                                    <View style={{flex:1,flexDirection:'row'}}>
                                        <Text style={{color:'#343434'}}>略缩图</Text>
                                    </View>
                                    <View style={{flex:3,flexDirection:'row',justifyContent:'flex-end',alignItems: 'center',backgroundColor:'#fff',
                                        borderRadius:10}}>
                                        {
                                            this.state.product.imgUrl1 !== null?
                                                <TouchableOpacity style={{flexDirection:'row',padding:2,paddingHorizontal:3,borderWidth:1,borderColor:'#eee'}}
                                                                  onPress={()=>{
                                                                      this.showImagePicker1()
                                                                  }}>
                                                    <Image
                                                        resizeMode="stretch"
                                                        style={{width:width*0.22,height:width*0.22,}}
                                                        source={{uri:this.state.product.imgUrl1.uri}}
                                                    />
                                                </TouchableOpacity>
                                                :
                                                <TouchableOpacity style={{flexDirection:'row',padding:2,paddingHorizontal:3,borderWidth:1,borderColor:'#eee'}}
                                                                  onPress={()=>{
                                                                      this.showImagePicker1()
                                                                  }}>
                                                    <View style={{alignItems:'center',width:width*0.22,height:width*0.22}}>
                                                    <Ionicons name='md-images' size={80} color="#aaa"/>
                                                    </View>
                                                </TouchableOpacity>
                                        }
                                    </View>
                                </View>

                                <View style={{flex:1,flexDirection:'row',justifyContent:'center',alignItems: 'center',backgroundColor:'#fff',marginBottom:1,padding:5}}>
                                    <View style={{flex:1,flexDirection:'row'}}>
                                        <Text style={{color:'#343434'}}>详情图</Text>
                                    </View>
                                    <View style={{flex:3,flexDirection:'row',justifyContent:'flex-end',alignItems: 'center',backgroundColor:'#fff',
                                        borderRadius:10}}>
                                        {
                                            this.state.product.imgUrl2 !== null?
                                                <TouchableOpacity style={{flexDirection:'row',padding:2,paddingHorizontal:3,borderWidth:1,borderColor:'#eee'}}
                                                                  onPress={()=>{
                                                                      this.showImagePicker2()
                                                                  }}>
                                                    <Image
                                                        resizeMode="stretch"
                                                        style={{width:width*0.22,height:width*0.22,}}
                                                        source={{uri:this.state.product.imgUrl2.uri}}
                                                    />
                                                </TouchableOpacity>
                                                :
                                                <TouchableOpacity style={{flexDirection:'row',padding:2,paddingHorizontal:3,borderWidth:1,borderColor:'#eee'}}
                                                                  onPress={()=>{
                                                                      this.showImagePicker2()
                                                                  }}>
                                                    <View style={{alignItems:'center',width:width*0.22,height:width*0.22}}>
                                                        <Ionicons name='md-images' size={80} color="#aaa"/>
                                                    </View>
                                                </TouchableOpacity>
                                        }

                                        {
                                            this.state.product.imgUrl3 !== null?
                                                <TouchableOpacity style={{flexDirection:'row',padding:2,paddingHorizontal:3,borderWidth:1,borderColor:'#eee'}}
                                                                  onPress={()=>{
                                                                      this.showImagePicker3()
                                                                  }}>
                                                    <Image
                                                        resizeMode="stretch"
                                                        style={{width:width*0.22,height:width*0.22,}}
                                                        source={{uri:this.state.product.imgUrl3.uri}}
                                                    />
                                                </TouchableOpacity>
                                                :
                                                <TouchableOpacity style={{flexDirection:'row',padding:2,paddingHorizontal:3,borderWidth:1,borderColor:'#eee'}}
                                                                  onPress={()=>{
                                                                      this.showImagePicker3()
                                                                  }}>
                                                    <View style={{alignItems:'center',width:width*0.22,height:width*0.22}}>
                                                        <Ionicons name='md-images' size={80} color="#aaa"/>
                                                    </View>
                                                </TouchableOpacity>
                                        }
                                        {
                                            this.state.product.imgUrl4 !== null?
                                                <TouchableOpacity style={{flexDirection:'row',padding:2,paddingHorizontal:3,borderWidth:1,borderColor:'#eee'}}
                                                                  onPress={()=>{
                                                                      this.showImagePicker4()
                                                                  }}>
                                                    <Image
                                                        resizeMode="stretch"
                                                        style={{width:width*0.22,height:width*0.22,}}
                                                        source={{uri:this.state.product.imgUrl4.uri}}
                                                    />
                                                </TouchableOpacity>
                                                :
                                                <TouchableOpacity style={{flexDirection:'row',padding:2,paddingHorizontal:3,borderWidth:1,borderColor:'#eee'}}
                                                                  onPress={()=>{
                                                                      this.showImagePicker4()
                                                                  }}>
                                                    <View style={{alignItems:'center',width:width*0.22,height:width*0.22}}>
                                                        <Ionicons name='md-images' size={80} color="#aaa"/>
                                                    </View>
                                                </TouchableOpacity>
                                        }
                                    </View>
                                </View>

                                <View style={{flex:1,flexDirection:'row',justifyContent:'center',alignItems: 'center',backgroundColor:'#fff',marginBottom:1,padding:5}}>
                                    <View style={{flex:1,flexDirection:'row'}}>
                                        <Text style={{color:'#343434'}}>长图</Text>
                                    </View>
                                    <View style={{flex:3,flexDirection:'row',justifyContent:'flex-end',alignItems: 'center',backgroundColor:'#fff',
                                        borderRadius:10}}>
                                        {
                                            this.state.product.imgUrl5 !== null?
                                                <TouchableOpacity style={{flexDirection:'row',padding:2,paddingHorizontal:3,borderWidth:1,borderColor:'#eee'}}
                                                                  onPress={()=>{
                                                                      this.showImagePicker5()
                                                                  }}>
                                                    <Image
                                                        resizeMode="stretch"
                                                        style={{width:width*0.22,height:width*0.22,}}
                                                        source={{uri:this.state.product.imgUrl5.uri}}
                                                    />
                                                </TouchableOpacity>
                                                :
                                                <TouchableOpacity style={{flexDirection:'row',padding:2,paddingHorizontal:3,borderWidth:1,borderColor:'#eee'}}
                                                                  onPress={()=>{
                                                                      this.showImagePicker5()
                                                                  }}>
                                                    <View style={{alignItems:'center',width:width*0.22,height:width*0.22}}>
                                                        <Ionicons name='md-images' size={80} color="#aaa"/>
                                                    </View>
                                                </TouchableOpacity>
                                        }
                                    </View>
                                </View>

                            </View>

                            <View style={{backgroundColor:'#fff',padding:10}}>
                                <Text style={{color:'#aaa',fontSize:11}}>
                                    温馨提示：您发布的内容应合法、真实、健康、共创文明的网络环境
                                </Text>
                            </View>
                        </View>
                        <View style={{flexDirection:'row',height:50,justifyContent:'center',alignItems:'center',width:width,backgroundColor:'#fff',marginBottom:20}}>
                            <TouchableOpacity style={{width:width*1/3,backgroundColor:'#fc6254',padding:10,flexDirection:'row',
                                justifyContent:'center'}}
                                              onPress={()=>{

                                                  var flag = 1;//是否可以将数据输入到数据库

                                                  {/*对输入信息的测试*/}
                                                  //姓名不为空
                                                  var name = this.state.product.name;
                                                  if(name==null || name ==''){flag=2;}

                                                  //类型不会错
                                                  var type = this.state.product.sort;

                                                  //简介不为空
                                                  var brief = this.state.product.brief;
                                                  if(brief==null || brief == ''){flag=3;}

                                                  //售价为非负数字且不为空
                                                  var salePrice = this.state.product.salePrice;
                                                  if(salePrice==null || salePrice == ''){flag=4}
                                                  if(!this.isNumber(salePrice)){flag=4}
                                                  if(this.isNumber(salePrice) && salePrice<0){flag=4}

                                                  //库存为非负数字且不为空（且为整数）
                                                  var inventoryNumber = this.state.product.inventoryNumber;
                                                  if(inventoryNumber==null || inventoryNumber == ''){flag=5}
                                                  if(!this.isNumber(inventoryNumber)){flag=5}
                                                  if(this.isNumber(inventoryNumber) && inventoryNumber<0){flag=5}

                                                  //折扣为非负数字且不为空
                                                  var discount = this.state.product.discount;
                                                  if(discount==null || discount == ''){flag=6}
                                                  if(!this.isNumber(discount)){flag=6}
                                                  if(this.isNumber(discount) && discount<0){flag=6}

                                                  //属性和类别不为空
                                                      var typeList = this.state.typeList;
                                                      var jsonList = this.state.jsonList;
                                                      for (var i = 0; i < typeList.length; i++) {
                                                          if (typeList[i] == null || typeList[i] == ''){flag = 7}
                                                      }
                                                  for (var i = 0; i < jsonList.length; i++) {
                                                      if (jsonList[i] == null || jsonList[i] == ''){flag = 7}
                                                  }

                                                  //各类型图片至少上传一张图片
                                                  var imgList = [];
                                                  var imgUrl1 = this.state.product.imgUrl1;
                                                  var imgUrl2 = this.state.product.imgUrl2;
                                                  var imgUrl3 = this.state.product.imgUrl3;
                                                  var imgUrl4 = this.state.product.imgUrl4;
                                                  var imgUrl5 = this.state.product.imgUrl5;

                                                  //略缩图不为空
                                                  if(imgUrl1==null || imgUrl1==null)flag=8;
                                                  //详情图不为空
                                                  if(imgUrl2!=null && imgUrl2!='')imgList.push(imgUrl2)
                                                  if(imgUrl3!=null && imgUrl3!='')imgList.push(imgUrl3)
                                                  if(imgUrl4!=null && imgUrl4!='')imgList.push(imgUrl4)
                                                  if(imgList.length==0)flag=8;
                                                  //长图不为空
                                                  if(imgUrl5==null || imgUrl5==null)flag=8;

                                                  if(flag==1) {

                                                      //flag=1表示填入数据完全正确

                                                      // alert(this.state.standards)
                                                      //上传商品信息
                                                      Proxy.postes({
                                                          url: Config.server + '/func/allow/addGoodInformation',
                                                          headers: {
                                                              'Content-Type': 'application/json',
                                                          },
                                                          body: {
                                                              product: this.state.product,
                                                              jsonList:this.state.jsonList,
                                                              typeList:this.state.typeList,
                                                          }
                                                      }).then((json) => {

                                                          if(json.re==1){
                                                          var goodsnum = json.data;
                                                          var formData = new FormData();
                                                          var file = [];

                                                          if (this.state.product.imgUrl1 != null) {
                                                              file.push({
                                                                  uri: this.state.product.imgUrl1.uri,
                                                                  type: 'multipart/form-data',
                                                                  name: '1.jpg'
                                                              })
                                                          }

                                                          if (this.state.product.imgUrl2 != null) {
                                                              file.push({
                                                                  uri: this.state.product.imgUrl2.uri,
                                                                  type: 'multipart/form-data',
                                                                  name: '2.jpg'
                                                              })
                                                          }

                                                          if (this.state.product.imgUrl3 != null) {
                                                              file.push({
                                                                  uri: this.state.product.imgUrl3.uri,
                                                                  type: 'multipart/form-data',
                                                                  name: '3.jpg'
                                                              })
                                                          }

                                                          if (this.state.product.imgUrl4 != null) {
                                                              file.push({
                                                                  uri: this.state.product.imgUrl4.uri,
                                                                  type: 'multipart/form-data',
                                                                  name: '4.jpg'
                                                              })
                                                          }

                                                              if (this.state.product.imgUrl5 != null) {
                                                                  file.push({
                                                                      uri: this.state.product.imgUrl5.uri,
                                                                      type: 'multipart/form-data',
                                                                      name: '5.jpg'
                                                                  })
                                                              }

                                                          // file = {uri: this.state.product.imgUrl1.uri, type: 'multipart/form-data', name: 'img.jpg'};
                                                          for (var i = 0; i < file.length; i++) {
                                                              formData.append('photo', file[i])
                                                          }

                                                              //上传商品图片
                                                              Proxy.post({
                                                                  url: Config.server + '/func/allow/uploadGoodsPic?goodsnum=' + goodsnum.toString(),
                                                                  headers: {
                                                                      'Content-Type': 'multipart/form-data',
                                                                  },
                                                                  body: formData,
                                                              }).then((json) => {
                                                                  var data = json.data;
                                                                  if (data == 'success') {
                                                                      DeviceEventEmitter.emit('goodlist_fresh',1)
                                                                      Alert.alert('成功', '上传商品成功!')
                                                                      this.goBack();
                                                                  }
                                                                  resolve(json)
                                                              }).catch((err) => {
                                                                  //reject(err)
                                                              })
                                                      }else{
                                                              Alert.alert('失败','信息填写错误，请按规定重新填写！');
                                                              this.goBack()
                                                          }
                                                      }).catch((err) => {
                                                          alert(err);
                                                      });
                                                  }else{
                                                      switch (flag){
                                                          case 2:Alert.alert('失败','请输入商品姓名！');break;
                                                          case 3:Alert.alert('失败','请输入商品简介！');break;
                                                          case 4:Alert.alert('失败','请输入正确的售价！');break;
                                                          case 5:Alert.alert('失败','请输入正确的库存量！');break;
                                                          case 6:Alert.alert('失败','请输入正确的折扣！');break;
                                                          case 7:Alert.alert('失败','请输入完整商品规格信息！');break;
                                                          case 8:Alert.alert('失败','请至少上传一张图片！');break;
                                                      }
                                                  }
                                              }}>
                                <Text style={{color:'#fff',fontSize:15}}>上传商品</Text>
                            </TouchableOpacity>

                        </View>
                    </KeyboardAwareScrollView>
                </Toolbar>
            </View>
        );
    }

    isNumber(val) {
        var regPos = /^\d+(\.\d+)?$/; //非负浮点数
        var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
        if(regPos.test(val) || regNeg.test(val)) {
            return true;
        } else {
            return false;
        }
    }

    componentDidMount()
    {
        this.venueListener=DeviceEventEmitter.addListener('on_venue_confirm', (data)=>{
            if(data)
                this.setState({venue:data})
        });
    }

    componentWillUnmount()
    {
        if(this.venueListener)
            this.venueListener.remove();
    }

}

var styles = StyleSheet.create({
    dialogContentView: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },

    backgroundVideo: {
        alignItems:'center',
        width:width*0.22,
        height:width*0.22
    },

});


module.exports = connect(state=>({
        accessToken:state.user.accessToken,
        personInfo:state.user.personInfo,
    })
)(AddProduct);


