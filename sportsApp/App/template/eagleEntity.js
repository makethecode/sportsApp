//添加车辆人员import Proxy from "../utils/Proxy";let eagleEntity={    AddEntity:()=>{        Proxy.postes({            url: 'http://yingyan.baidu.com/api/v3/entity/add',            headers: {                'Content-Type': 'multipart/form-data',            },            body: {                ak:"mzyj6b1FMeo9iYELIooCHtkGWKs7pyCa".toString(),                service_id:209801,                entity_name:'car1',                entity_desc:'ForTest'            }        }).then((json)=>{            console.log("AddEntityMessage",json.message)        }).catch((e)=>{        })    },}module.exports=eagleEntity;