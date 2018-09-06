/**
 * Created by danding on 2018/8/14.
 */

let AssortFilter={
//对课程进行筛选
    filter:(list,clubId,venueId,coachId)=>{
        var filterList = [];

        if(clubId==-1 && venueId==-1 && coachId==-1)
            for(i=0;i<list.length;i++)filterList.push(list[i])
        //对俱乐部进行筛选
        if(clubId!=-1 && venueId==-1 && coachId==-1)
            for(i=0;i<list.length;i++)if(list[i].courseClub==clubId)filterList.push(list[i])
        //对场馆进行筛选
        if(clubId==-1 && venueId!=-1 && coachId==-1)
            for(i=0;i<list.length;i++)if(list[i].unitId==venueId)filterList.push(list[i])
        //对教练进行筛选
        if(clubId==-1 && venueId==-1 && coachId!=-1)
            for(i=0;i<list.length;i++)if(list[i].creatorId==coachId)filterList.push(list[i])
        //对俱乐部和场馆进行筛选
        if(clubId!=-1 && venueId!=-1 && coachId==-1)
            for(i=0;i<list.length;i++)if(list[i].courseClub==clubId && list[i].unitId==venueId)filterList.push(list[i])
        //对俱乐部和教练筛选
        if(clubId!=-1 && venueId==-1 && coachId!=-1)
            for(i=0;i<list.length;i++)if(list[i].courseClub==clubId && list[i].creatorId==coachId)filterList.push(list[i])
        //对场馆和教练筛选
        if(clubId==-1 && venueId!=-1 && coachId!=-1)
            for(i=0;i<list.length;i++)if(list[i].unitId==venueId && list[i].creatorId==coachId)filterList.push(list[i])
        //对俱乐部、场馆、教练筛选
        if(clubId!=-1 && venueId!=-1 && coachId!=-1)
            for(i=0;i<list.length;i++)if(list[i].unitId==venueId && list[i].creatorId==coachId && list[i].courseClub==clubId)filterList.push(list[i])

        return filterList;
    }
}
module.exports=AssortFilter;