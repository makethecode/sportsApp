/**
 * Created by danding on 2018/8/17.
 */
let ProfitAssortFilter={
//对收益进行筛选
    filter:(list,clubId,venueId,typeId)=>{
        var filterList = [];

        if(clubId==-1 && venueId==-1 && typeId==-1)
            for(i=0;i<list.length;i++)filterList.push(list[i])
        //对俱乐部进行筛选
        if(clubId!=-1 && venueId==-1 && typeId==-1)
            for(i=0;i<list.length;i++)if(list[i].clubId==clubId)filterList.push(list[i])
        //对场馆进行筛选
        if(clubId==-1 && venueId!=-1 && typeId==-1)
            for(i=0;i<list.length;i++)if(list[i].venueId==venueId)filterList.push(list[i])
        //对种类进行筛选
        if(clubId==-1 && venueId==-1 && typeId!=-1)
            for(i=0;i<list.length;i++)if(list[i].type==typeId)filterList.push(list[i])
        //对俱乐部和场馆进行筛选
        if(clubId!=-1 && venueId!=-1 && typeId==-1)
            for(i=0;i<list.length;i++)if(list[i].clubId==clubId && list[i].venueId==venueId)filterList.push(list[i])
        //对俱乐部和种类筛选
        if(clubId!=-1 && venueId==-1 && typeId!=-1)
            for(i=0;i<list.length;i++)if(list[i].clubId==clubId && list[i].type==typeId)filterList.push(list[i])
        //对场馆和种类筛选
        if(clubId==-1 && venueId!=-1 && typeId!=-1)
            for(i=0;i<list.length;i++)if(list[i].venueId==venueId && list[i].type==typeId)filterList.push(list[i])
        //对俱乐部、场馆、种类筛选
        if(clubId!=-1 && venueId!=-1 && typeId!=-1)
            for(i=0;i<list.length;i++)if(list[i].venueId==venueId && list[i].type==typeId && list[i].clubId==clubId)filterList.push(list[i])

        return filterList;
    }
}
module.exports=ProfitAssortFilter;