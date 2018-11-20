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
import GoodsPhotoModal from './GoodsPhotoModal'
import {uploadGoodsImage} from '../../action/UserActions'

const slideAnimation = new SlideAnimation({ slideFrom: 'bottom' });
const scaleAnimation = new ScaleAnimation();
const defaultAnimation = new DefaultAnimation({ animationDuration: 150 });

var {height, width} = Dimensions.get('window');
var ImagePicker = require('react-native-image-picker');


class EditProduct extends Component{

    goBack(){
        const { navigator } = this.props;
        if(navigator) {
            navigator.pop();
        }
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
                let uri = { uri: response.uri };
                let path = { uri: response.path };
                this.setState({product:Object.assign(this.state.product,{imgUrl:uri})});
                console.log('portrait.uri = ', response.uri);
            }
        });
    }

    //选商品类型
    _handlePress(index) {

        if(index!==0){
            var typeStr = this.state.typeButtons[index];
            var typeId = index;
            this.setState({product:Object.assign(this.state.product,{typeStr:typeStr})});
        }
    }

    show(actionSheet) {
        this[actionSheet].show();
    }

    constructor(props) {
        super(props);
        this.state={

            // product:{id:null,goodsnum:null,name:null,type:null,typeList:[],jsonList:[],reservenum:null,brief:null,
            //     discount:null,thumburl:null,price:null,realprice:null,creatorId:null,creatorName:null,creatorTel:null,creatorAvatar:null,
            // imgsurl:null,detailurl:null,typeStr:null},

            product:this.props.product,
            typeButtons:['取消','球拍','配件','球鞋','衣服','会员卡','保健品'],

            typeList:this.props.product.typeList,
            jsonList:this.props.product.jsonList,

            goodsPhoto1Url:'',
            goodsPhoto2Url:'',
            goodsPhoto3Url:'',
            goodsPhoto4Url:'',
            goodsPhoto5Url:'',
            choosePhotoIdx:0,

            modalVisible:false,

        }
    }

    renderRow(rowData, sectionId, rowId) {

        var json = this.state.jsonList[rowId];
        var jsonStr = this.exchangeFromJson(json)

        var type = this.state.typeList[rowId];//颜色

        return (
            <View style={{height:40,flexDirection:'row',justifyContent:'center',alignItems: 'center',backgroundColor:'#fff',marginBottom:1,padding:5}}>
                <View style={{flex:1}}>
                    <TextInput
                        placeholderTextColor='#888'
                        style={{fontSize:14,color:'#222',justifyContent:'flex-start',padding:0}}
                        placeholder='属性'
                        value={type}
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
                        placeholder='请用,隔开各个类型'
                        value={jsonStr}
                        multiline={true}
                        underlineColorAndroid={'transparent'}
                        onChangeText={
                            (value)=>{
                                var jsonList = this.state.jsonList;
                                jsonList[rowId] = this.exchangeToJson(value);
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

    exchangeFromJson(jsonList){
        var jsonStr = '';
        if(jsonList==null)return null;

        var str = jsonList.substring(1,jsonList.length-1);
        var strList = str.split(',');
        var model;
        for(var i=0;i<strList.length;i++) {
            model = strList[i];
            if(this.isNumber(model));
            else model = model.substring(1,model.length-1)

            if(i==0)jsonStr = model;
            else jsonStr+=','+model;
        }
        return jsonStr;
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

        const CANCEL_INDEX = 0;
        const DESTRUCTIVE_INDEX = 1;

        const typeButtons=['取消','球拍','配件','球鞋','衣服','会员卡','保健品'];

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
                <Toolbar width={width} title="修改商品" actions={[]} navigator={this.props.navigator}>
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
                                placeholder={this.props.product.name}
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
                                this.state.product.typeStr==null?
                                    <View style={{flex:1,paddingRight:8,justifyContent:'flex-end',alignItems: 'center',flexDirection:'row'}}>
                                        <Text style={{color:'#888',fontSize:14}}>请选择商品类型 ></Text>
                                    </View> :
                                    <View style={{flex:1,marginLeft:20,justifyContent:'flex-end',alignItems: 'center',flexDirection:'row'}}>
                                        <Text style={{color:'#444',fontSize:14}}>{this.state.product.typeStr}</Text>
                                    </View>

                            }
                            <ActionSheet
                                ref={(p) => {
                                    this.actionSheet =p;
                                }}
                                title="请选择商品类型"
                                options={typeButtons}
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
                        <View style={{flex:3,flexDirection:'row',justifyContent:'flex-start',alignItems: 'center',backgroundColor:'#fff'}}>
                            <TextInput
                                placeholderTextColor='#888'
                                style={{fontSize:14,color:'#222',justifyContent:'flex-end',textAlign:'right',flex:3,padding:0}}
                                placeholder={this.props.product.brief}
                                value={this.state.product.brief}
                                multiline={true}
                                underlineColorAndroid={'transparent'}
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

                    {/*原价*/}
                    <View style={{height:40,flexDirection:'row',justifyContent:'center',alignItems: 'center',backgroundColor:'#fff',marginBottom:1,padding:5}}>
                        <View style={{flex:1}}>
                            <Text style={{color:'#343434'}}>原价</Text>
                        </View>
                        <View style={{flex:3,flexDirection:'row',justifyContent:'flex-start',alignItems: 'center',backgroundColor:'#fff',
                            borderRadius:10}}>
                            <TextInput
                                placeholderTextColor='#888'
                                style={{fontSize:14,color:'#222',justifyContent:'flex-end',textAlign:'right',height:40,flex:3,padding:0}}
                                placeholder={(this.props.product.price/100).toString()}
                                value={this.state.product.price}
                                underlineColorAndroid={'transparent'}
                                onChangeText={
                                    (value)=>{
                                        this.setState({product:Object.assign(this.state.product,{price:value})})
                                    }}
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
                                placeholder={(this.props.product.discount/100).toString()}
                                value={this.state.product.discount}
                                underlineColorAndroid={'transparent'}
                                onChangeText={
                                    (value)=>{
                                        this.setState({product:Object.assign(this.state.product,{discount:value})})
                                    }}
                            />
                        </View>
                    </View>

                    {/*实际售价*/}
                    <View style={{height:40,flexDirection:'row',justifyContent:'center',alignItems: 'center',backgroundColor:'#fff',marginBottom:1,padding:5}}>
                        <View style={{flex:1}}>
                            <Text style={{color:'#343434'}}>实际售价</Text>
                        </View>
                        <View style={{flex:3,flexDirection:'row',justifyContent:'flex-start',alignItems: 'center',backgroundColor:'#fff',
                            borderRadius:10}}>
                            <TextInput
                                placeholderTextColor='#888'
                                style={{fontSize:14,color:'#222',justifyContent:'flex-end',textAlign:'right',height:40,flex:3,padding:0}}
                                placeholder={(this.props.product.realprice/100).toString()}
                                value={this.state.product.realprice}
                                underlineColorAndroid={'transparent'}
                                onChangeText={
                                    (value)=>{
                                        this.setState({product:Object.assign(this.state.product,{realprice:value})})
                                    }}
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
                                placeholder={this.props.product.reservenum.toString()}
                                value={this.state.product.reservenum}
                                underlineColorAndroid={'transparent'}
                                onChangeText={
                                    (value)=>{
                                        this.setState({product:Object.assign(this.state.product,{reservenum:value})})
                                    }}
                            />
                        </View>
                    </View>

                    <View style={{height:30,width:width,justifyContent:'center',alignItems:'center',textAlign:'left',paddingHorizontal:5,flexDirection:'row'}}>
                        <Text style={{color:'#666',fontSize:13}}>商品规格</Text>
                        <TouchableOpacity style={{flex:1,alignItems:'flex-end',justifyContent:'center'}}
                                          onPress={()=>{
                                              var typeList = this.state.typeList;
                                              var jsonList = this.state.jsonList;

                                              typeList.push('');
                                              jsonList.push('');

                                              this.setState({typeList:typeList,jsonList:jsonList})
                                          }}>
                            <Ionicons name='md-add' size={20} color="#888"/>
                        </TouchableOpacity>
                    </View>

                    {typeListView}

                    <View style={{height:30,width:width,justifyContent:'flex-start',alignItems:'center',textAlign:'left',paddingHorizontal:5,flexDirection:'row'}}>
                        <Text style={{color:'#666',fontSize:13}}>商品图片</Text>
                    </View>

                    <View style={{flex:1,flexDirection:'row',justifyContent:'center',alignItems: 'center',backgroundColor:'#fff',marginBottom:1,padding:5}}>
                        <View style={{flex:1,flexDirection:'row'}}>
                            <Text style={{color:'#343434'}}>略缩图</Text>
                        </View>
                        <View style={{flex:3,flexDirection:'row',justifyContent:'flex-end',alignItems: 'center',backgroundColor:'#fff',
                            borderRadius:10}}>
                            {
                                <TouchableOpacity style={{flexDirection:'row',padding:2,paddingHorizontal:3,borderWidth:1,borderColor:'#eee'}}
                                                  onPress={()=>{
                                                      //this.showGoodsPhoto1Dialog();
                                                      this.setState({choosePhotoIdx:1,modalVisible:true})
                                                  }}
                                >
                                    <View style={{alignItems:'center',width:width*0.22,height:width*0.22}}>
                                        {this.state.goodsPhoto1Url==null||this.state.goodsPhoto1Url==''||this.state.goodsPhoto1Url==undefined?

                                            <Ionicons name='md-images' size={80} color="#aaa"/>:
                                            <Image  resizeMode="stretch" style={{width:width*0.22,height:width*0.22,}}
                                                    source={{uri:this.state.goodsPhoto1Url}}
                                            />

                                        }
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

                            <TouchableOpacity style={{flexDirection:'row',padding:2,paddingHorizontal:3,borderColor:'#eee',borderWidth:1}}
                                              onPress={()=>{
                                                  //this.showGoodsPhoto2Dialog();
                                                  this.setState({choosePhotoIdx:2,modalVisible:true})
                                              }}
                            >
                                <View style={{flexDirection:'row',alignItems:'center'}}>
                                    {this.state.goodsPhoto2Url==null||this.state.goodsPhoto2Url==''||this.state.goodsPhoto2Url==undefined?

                                        <Ionicons name='md-images' size={80} color="#aaa"/>:
                                        <Image  resizeMode="stretch" style={{width:width*0.22,height:width*0.22}}
                                                source={{uri:this.state.goodsPhoto2Url}}
                                        />

                                    }
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity style={{flexDirection:'row',padding:2,paddingHorizontal:3,borderColor:'#eee',borderWidth:1}}
                                              onPress={()=>{
                                                  //this.showGoodsPhoto3Dialog();
                                                  this.setState({choosePhotoIdx:3,modalVisible:true})
                                              }}
                            >
                                <View style={{flexDirection:'row',alignItems:'center'}}>
                                    {this.state.goodsPhoto3Url==null||this.state.goodsPhoto3Url==''||this.state.goodsPhoto3Url==undefined?

                                        <Ionicons name='md-images' size={80} color="#aaa"/>:
                                        <Image  resizeMode="stretch" style={{width:width*0.22,height:width*0.22}}
                                                source={{uri:this.state.goodsPhoto3Url}}
                                        />
                                    }
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity style={{flexDirection:'row',padding:2,paddingHorizontal:3,borderColor:'#eee',borderWidth:1}}
                                              onPress={()=>{
                                                  //this.showGoodsPhoto4Dialog();
                                                  this.setState({choosePhotoIdx:4,modalVisible:true})
                                              }}
                            >
                                <View style={{flexDirection:'row',alignItems:'center'}}>
                                    {this.state.goodsPhoto4Url==null||this.state.goodsPhoto4Url==''||this.state.goodsPhoto4Url==undefined?

                                        <Ionicons name='md-images' size={80} color="#aaa"/>:
                                        <Image  resizeMode="stretch" style={{width:width*0.22,height:width*0.22}}
                                                source={{uri:this.state.goodsPhoto4Url}}
                                        />
                                    }
                                </View>
                            </TouchableOpacity>

                        </View>
                    </View>

                    <View style={{flex:1,flexDirection:'row',justifyContent:'center',alignItems: 'center',backgroundColor:'#fff',marginBottom:1,padding:5}}>
                        <View style={{flex:1,flexDirection:'row'}}>
                            <Text style={{color:'#343434'}}>长图</Text>
                        </View>
                        <View style={{flex:3,flexDirection:'row',justifyContent:'flex-end',alignItems: 'center',backgroundColor:'#fff',
                            borderRadius:10}}>
                            {
                                <TouchableOpacity style={{flexDirection:'row',padding:2,paddingHorizontal:3,borderColor:'#eee',borderWidth:1}}
                                                  onPress={()=>{
                                                      //this.showGoodsPhoto4Dialog();
                                                      this.setState({choosePhotoIdx:5,modalVisible:true})
                                                  }}
                                >
                                    <View style={{flexDirection:'row',alignItems:'center'}}>
                                        {this.state.goodsPhoto5Url==null||this.state.goodsPhoto5Url==''||this.state.goodsPhoto5Url==undefined?

                                            <Ionicons name='md-images' size={80} color="#aaa"/>:
                                            <Image  resizeMode="stretch" style={{width:width*0.22,height:width*0.22}}
                                                    source={{uri:this.state.goodsPhoto5Url}}
                                            />
                                        }
                                    </View>
                                </TouchableOpacity>
                            }
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
                                              //上传商品信息

                                              var reservenum = parseInt(this.state.product.reservenum);
                                              var discount = this.state.product.discount*100;
                                              var price = this.state.product.price*100;
                                              var realprice = this.state.product.realprice*100;

                                              this.setState({product:Object.assign(this.state.product,{reservenum:reservenum,discount:discount,price:price,realprice:realprice})})

                                              Proxy.postes({
                                                  url: Config.server + '/func/allow/editGoodInformation',
                                                  headers: {
                                                      'Content-Type': 'application/json',
                                                  },
                                                  body: {
                                                      product:this.state.product,
                                                      typeList:this.state.typeList,
                                                      jsonList:this.state.jsonList,
                                                  }
                                              }).then((json) => {
                                                  DeviceEventEmitter.emit('on_product_edit',1)
                                                  this.goBack()
                                              })
                                                  .catch((err) =>
                                              {
                                                  alert(err);
                                              });
                                          }}>
                            <Text style={{color:'#fff',fontSize:15}}>确认修改</Text>
                        </TouchableOpacity>

                    </View>
                </KeyboardAwareScrollView>

                    {/* Add UpdatePhoto Modal*/}
                    <Modal
                        animationType={"slide"}
                        transparent={true}
                        visible={this.state.modalVisible}
                        onRequestClose={() => {
                            console.log("Modal has been closed.");
                        }}
                    >
                        <GoodsPhotoModal
                            onClose={()=>{
                                this.setState({modalVisible:false});
                            }}
                            uploadGoodsImg={(currentPhotoUrl,oldPhotoUrl,choosePhotoIdx)=>{
                                this.uploadGoodsImg(currentPhotoUrl,oldPhotoUrl,choosePhotoIdx);
                            }}
                            goodsPhoto1Url={this.state.goodsPhoto1Url}
                            goodsPhoto2Url={this.state.goodsPhoto2Url}
                            goodsPhoto3Url={this.state.goodsPhoto3Url}
                            goodsPhoto4Url={this.state.goodsPhoto4Url}
                            goodsPhoto5Url={this.state.goodsPhoto5Url}
                            choosePhotoIdx={this.state.choosePhotoIdx}
                        />
                    </Modal>

                </Toolbar>
            </View>
        );
    }

    uploadGoodsImg(currentPhotoUrl,oldPhotoUrl,choosePhotoIdx){

        let params = {
            productId:this.props.product.id+'',
            currentPhotoUrl:currentPhotoUrl,
            oldPhotoUrl:oldPhotoUrl,
            choosePhotoIdx:choosePhotoIdx,
        }

        this.props.dispatch(uploadGoodsImage(params))
            .then((json)=>{
                if(json.re==1){
                    //不用改数据库,只需要上传图片

                    var path = json.data

                    var goodsPhoto1Url = this.state.goodsPhoto1Url;
                    var goodsPhoto2Url = this.state.goodsPhoto2Url;
                    var goodsPhoto3Url = this.state.goodsPhoto3Url;
                    var goodsPhoto4Url = this.state.goodsPhoto4Url;
                    var goodsPhoto5Url = this.state.goodsPhoto5Url;

                    switch (choosePhotoIdx){
                        case 1:goodsPhoto1Url = path;break;
                        case 2:goodsPhoto2Url = path;break;
                        case 3:goodsPhoto3Url = path;break;
                        case 4:goodsPhoto4Url = path;break;
                        case 5:goodsPhoto5Url = path;break;
                    }

                    var imgsurl = '';
                    var thumburl = '';
                    var detailurl = '';

                    if(goodsPhoto1Url!='')thumburl = goodsPhoto1Url;
                    if(goodsPhoto2Url!='')imgsurl += goodsPhoto2Url;
                    if(goodsPhoto3Url!='')imgsurl += ';'+goodsPhoto3Url;
                    if(goodsPhoto4Url!='')imgsurl += ';'+goodsPhoto4Url;
                    if(goodsPhoto5Url!='')detailurl = goodsPhoto5Url;

                    this.setState({product:Object.assign(this.state.product,{imgsurl:imgsurl,thumburl:thumburl,detailurl:detailurl}),goodsPhoto1Url:goodsPhoto1Url,goodsPhoto2Url:goodsPhoto2Url,goodsPhoto3Url:goodsPhoto3Url,goodsPhoto4Url:goodsPhoto4Url,goodsPhoto5Url:goodsPhoto5Url,modalVisible:false})

                }else{
                    if(json.re==-100){
                        this.props.dispatch(getAccessToken(false));
                    }
                }
            })

    }

    componentDidMount()
    {

        //显示double传值int
        var reservenum = this.props.product.reservenum.toString();
        var discount = (this.props.product.discount/100).toString();
        var price = (this.props.product.price/100).toString();
        var realprice = (this.props.product.realprice/100).toString();

        var goodsPhoto1Url = this.props.product.thumburl;
        var goodsPhoto2Url = '';
        var goodsPhoto3Url = '';
        var goodsPhoto4Url = '';
        var goodsPhoto5Url = this.props.product.detailurl;

        var imgsurl = this.props.product.imgsurl;
        var imgList = imgsurl.split(';');

        for(var i=0;i<imgList.length;i++){
            switch (i){
                case 0:goodsPhoto2Url = imgList[i];break;
                case 1:goodsPhoto3Url = imgList[i];break;
                case 2:goodsPhoto4Url = imgList[i];break;
            }
        }

        this.setState({product:Object.assign(this.state.product,{reservenum:reservenum,discount:discount,price:price,realprice:realprice}),
        goodsPhoto1Url:goodsPhoto1Url,goodsPhoto2Url:goodsPhoto2Url,goodsPhoto3Url:goodsPhoto3Url,goodsPhoto4Url:goodsPhoto4Url,goodsPhoto5Url:goodsPhoto5Url})
    }

    componentWillUnmount()
    {
    }

}

var styles = StyleSheet.create({

    backgroundVideo: {
        width:100,
        height:100,
    },

});


module.exports = connect(state=>({
        accessToken:state.user.accessToken,
        personInfo:state.user.personInfo,
    })
)(EditProduct);


