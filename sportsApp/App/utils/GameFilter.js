
let GameFilter={
//对比赛筛选
    filter:(list,gameClassId,groupId)=>{
        var filterList = [];
        if(gameClassId==-1 && groupId==-1)
            for(var i=0;i<list.length;i++)filterList.push(list[i])
        //对赛制进行筛选
        if(gameClassId!=-1 && groupId==-1)
            for(var i=0;i<list.length;i++)if((list[i].gameClass-1)==gameClassId)filterList.push(list[i])
        //对组别进行筛选
        if(gameClassId==-1 && groupId!=-1)
            for(var i=0;i<list.length;i++)if(list[i].groupId==groupId)filterList.push(list[i])
        //对赛制与组别进行筛选
        if(gameClassId!=-1 && groupId!=-1)
            for(var i=0;i<list.length;i++)if((list[i].gameClass-1)==gameClassId && list[i].groupId==groupId)filterList.push(list[i])

        return filterList;
    }
}
module.exports=GameFilter;