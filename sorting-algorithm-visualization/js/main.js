"strict"

class Base{

    entryNum = null;
    entryBox = [];
    
    clearEntryBox(){
        this.entryBox = [];
    }

    generateElements(){
        this.clearEntryBox()
        for(let i=this.entryNum ; i>0 ; i--){
            this.entryBox.push(i);
        }
    }

    getBoxStatus(){
        console.log(this.entryBox);
    }

    getRandom(min=0, max=999999){
        let random = Math.floor(Math.random()*(max-min+1))+min;
        return random %this.entryNum;
    }

    boxShuffle(){
        let temp;
        let randomOne;
        for(let i=0 ; i<this.entryNum ; i++){
            randomOne = this.getRandom();
            temp = this.entryBox[i];
            this.entryBox[i] = this.entryBox[randomOne];
            this.entryBox[randomOne] = temp;
        }
    }
};


class Visualization extends Base{

    constructor(){
        super();
        this.blockBox = [];
        this.milliSecPerFrame = null;
        this.stage = document.getElementById("stage");
        
    }
    

    clearStage(){
        const stage = document.getElementById('stage');
        while(stage.firstChild){
            stage.removeChild(stage.firstChild);
        }
    }

    clearBlockBox(){
        this.blockBox = [];
    }

    generateBlocks(){
        // console.log(this);
        this.clearBlockBox();
        this.clearStage();
        // console.log(this.entryNum);
        const heightWeight = 100 /this.entryNum;

        for(let i=0 ; i<this.entryNum ; i++){
            const li = document.createElement('LI');
            li.setAttribute("value" , this.entryBox[i]);
            li.style.height = (this.entryBox[i] * heightWeight)+'%';
            this.blockBox.push(li);
        }
        // console.log(this.blockBox);
    }

    getBlockBoxStatus(){
        console.log(this.blockBox[0].value)
    }

    fillStageWithBlocks(){
        for(let i=0 ; i<this.entryNum ; i++){
            this.stage.appendChild(this.blockBox[i]);
        }
    }

    compareColoring(entry1, entry2){
        entry1.style.backgroundColor = '#ff0000';
        entry2.style.backgroundColor = '#ff0000';
    }

    checkCompareColoring(entry1, entry2){
        entry1.style.backgroundColor = '#ee68e3';
        entry2.style.backgroundColor = '#ee68e3';
    }

    doneCompareColoring(entry1, entry2){
        entry1.style.backgroundColor = '#00ffff';
        entry2.style.backgroundColor = '#00ffff';
    }

    settledBlock(entry){
        entry.style.backgroundColor = '#31e95a'
    }

    

}

class SortingBase extends Visualization{

    constructor(){
        super();
    }

    resetDashBoard(){
        const algoSelector = document.getElementById('algo');
        const options = document.querySelectorAll('#algo option');
        const countInput = document.getElementById('count');
        const mspfInput = document.getElementById('mspf');
        algoSelector.disabled = false;
        for(let i=0 ; i<options.length ; i++){
            options[i].selected = options[i].defaultSelected;
        }
        countInput.value = '';
        mspfInput.value = '';
    }

    static async sleep(ms){
        return new Promise( r => setTimeout(r, ms));
    }

    static async endingPose(one, sleep){
        for(let i=0 ; i<one.entryNum ; i++){
            one.settledBlock(one.blockBox[i]);
            one.fillStageWithBlocks();
            await sleep(30);
        }
        one.resetDashBoard();
    }
}
