'strict'

class ShakerSort extends SortingBase{
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

        while(1){
            isAllSorted = true;

            for(let i=0 ; i<one.entryNum -1 ; i++){
                
                one.compareColoring(one.blockBox[i] , one.blockBox[i+1]);
                one.fillStageWithBlocks();
                await sleep(one.splitTime);

                if(one.blockBox[i].value > one.blockBox[i+1].value){
                    temp = one.blockBox[i];
                    one.blockBox[i] = one.blockBox[i+1];
                    one.blockBox[i+1] = temp;
                    isAllSorted = false;
                }
                
                one.checkCompareColoring(one.blockBox[i] , one.blockBox[i+1]);
                one.fillStageWithBlocks();
                await sleep(one.splitTime);

                one.doneCompareColoring(one.blockBox[i] , one.blockBox[i+1]);
                one.fillStageWithBlocks();
                await sleep(one.splitTime);

            }

            if(isAllSorted){break;}
            isAllSorted = true;

            for(let i=one.entryNum -1 ; i>0 ; i--){

                one.compareColoring(one.blockBox[i] , one.blockBox[i-1]);
                one.fillStageWithBlocks();
                await sleep(one.splitTime);

                if(one.blockBox[i].value < one.blockBox[i-1].value){
                    temp = one.blockBox[i];
                    one.blockBox[i] = one.blockBox[i-1];
                    one.blockBox[i-1] = temp;
                    isAllSorted = false;
                }

                one.checkCompareColoring(one.blockBox[i] , one.blockBox[i-1]);
                one.fillStageWithBlocks();
                await sleep(one.splitTime);

                one.doneCompareColoring(one.blockBox[i] , one.blockBox[i-1]);
                one.fillStageWithBlocks();
                await sleep(one.splitTime);
            }

            if(isAllSorted){break;}

        }

        endingPose(one, sleep)
        console.log('done')
    }

}