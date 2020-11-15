'strict'

class SelectionSort extends SortingBase{
    constructor(){
        super();
    }
    
    splitTime = 1000;

    setSplitTime(mspf){
        if(mspf <3){
            this.splitTime = 1;
            return;
        }
        this.splitTime = mspf /3;
    }

    static async run(one, sleep, endingPose){
        let temp;
        let tempIndex;
        let isAllSorted;
        one.setSplitTime(one.milliSecPerFrame)

        for(let i=0 ; i<one.entryNum-1 ; i++){
            // isAllSorted = one.entryNum -1;
            
            temp = one.blockBox[i];
            tempIndex = i;

            for(let j=i+1 ; j<one.entryNum; j++){

                one.compareColoring(temp , one.blockBox[j]);
                one.fillStageWithBlocks();
                await sleep(one.splitTime);

                one.checkCompareColoring(temp , one.blockBox[j]);
                one.fillStageWithBlocks();
                await sleep(one.splitTime);
    
                one.doneCompareColoring(temp , one.blockBox[j]);
                one.fillStageWithBlocks();
                await sleep(one.splitTime);
    
                if(temp.value > one.blockBox[j].value){
                    temp = one.blockBox[j];
                    tempIndex = j;

                    // isAllSorted--;
                }
                
            }
            one.blockBox[tempIndex] = one.blockBox[i];
            one.blockBox[i] = temp;
            
            // console.log('isAllSorted : ' , isAllSorted)
            // if(isAllSorted === one.entryNum -1){break;}
        }

        endingPose(one, sleep)
        console.log('done')
    }

}