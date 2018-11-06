
let TrailFilter={
//对试课筛选
    filter:(list,courseTypeId,typeId)=>{
        var filterList = [];
        if(courseTypeId==-1 && typeId==-1)
            for(var i=0;i<list.length;i++)filterList.push(list[i])
        //对课程类型进行筛选
        if(courseTypeId!=-1 && typeId==-1)
            for(var i=0;i<list.length;i++)if(list[i].courseTypeIdx==courseTypeId)filterList.push(list[i])
        //对学员类型进行筛选
        if(courseTypeId==-1 && typeId!=-1)
            for(var i=0;i<list.length;i++)if(list[i].type==typeId)filterList.push(list[i])
        //对课程与学员类型进行筛选
        if(courseTypeId!=-1 && typeId!=-1)
            for(var i=0;i<list.length;i++)if(list[i].courseTypeIdx==courseTypeId && list[i].type==typeId)filterList.push(list[i])

        return filterList;
    }
}
module.exports=TrailFilter;