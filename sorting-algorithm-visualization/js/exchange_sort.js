'strict'

class ExchangeSort extends SortingBase{
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

        for(let i=0 ; i<one.entryNum-1 ; i++){
            isAllSorted = one.entryNum -1;
            
            for(let j=i+1 ; j<one.entryNum; j++){
                one.compareColoring(one.blockBox[i] , one.blockBox[j]);
                one.fillStageWithBlocks();
                await sleep(one.splitTime);

                if(one.blockBox[i].value > one.blockBox[j].value){
                    temp = one.blockBox[i];
                    one.blockBox[i] = one.blockBox[j];
                    one.blockBox[j] = temp;
                    isAllSorted--;
                }

                one.checkCompareColoring(one.blockBox[i] , one.blockBox[j]);
                one.fillStageWithBlocks();
                await sleep(one.splitTime);
                
                one.doneCompareColoring(one.blockBox[i] , one.blockBox[j]);
                one.fillStageWithBlocks();
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