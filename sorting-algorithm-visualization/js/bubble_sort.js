'strict'

class BubbleSort extends SortingBase{
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
        let isAllSorted;
        one.setSplitTime(one.milliSecPerFrame)

        for(let i=0 ; i<one.entryNum ; i++){
            isAllSorted = one.entryNum -1;
            
            for(let j=0 ; j<one.entryNum -1; j++){
                one.compareColoring(one.blockBox[j] , one.blockBox[j+1]);
                one.fillStageWithBlocks();
                // await BubbleSort.sleep(one.milliSecPerFrame/3);
                await sleep(one.splitTime);
                if(one.blockBox[j].value > one.blockBox[j+1].value){
                    temp = one.blockBox[j];
                    one.blockBox[j] = one.blockBox[j+1];
                    one.blockBox[j+1] = temp;
                    isAllSorted--;
                }
                one.checkCompareColoring(one.blockBox[j] , one.blockBox[j+1]);
                one.fillStageWithBlocks();
                // await BubbleSort.sleep(one.milliSecPerFrame/3);
                await sleep(one.splitTime);
                one.doneCompareColoring(one.blockBox[j] , one.blockBox[j+1]);
                one.fillStageWithBlocks();
                // await BubbleSort.sleep(one.milliSecPerFrame/3);
                await sleep(one.splitTime);
            }
            // console.log(one.splitTime)
            // console.log('isAllSorted : ' , isAllSorted)

            if(isAllSorted === one.entryNum -1){break;}
        }

        endingPose(one, sleep)
        
        console.log('done')
    }

}