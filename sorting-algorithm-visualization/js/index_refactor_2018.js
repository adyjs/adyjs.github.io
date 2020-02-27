var sortObj = function(){
	this.algoType = 'none',
	this.calcNum = 0,
	this.eleArr = [],
	this.mspf = 0,
	this.sortingCounter = 0,
	this.innerCompareCounter = 0,
	this.sortedIndex = 0
}

sortObj.prototype.initial = function(){
	this.eleArr = [];
	var num = this.calcNum;
	var weighted = 0;
	if(num < 20){
		for(var i=0 ; i<num ; i++){
			var li = document.createElement('LI');
			li.setAttribute("value" , i);
			li.style.height = (i*5)+'%';
			//li.style.height = (i+i)+'%';
			this.eleArr.push(li);
		}	
	}
	else if(num >= 20 && num <30){
		for(var i=0 ; i<num ; i++){
			var li = document.createElement('LI');
			li.setAttribute("value" , i);
			li.style.height = (i*3)+'%';
			this.eleArr.push(li);
		}	
	}
	else if(num >= 30 && num <40){
		for(var i=0 ; i<num ; i++){
			var li = document.createElement('LI');
			li.setAttribute("value" , i);
			li.style.height = (i*2)+'%';
			this.eleArr.push(li);
		}	
	}
	else{
		for(var i=0 ; i<num ; i++){
			var li = document.createElement('LI');
			li.setAttribute("value" , i);
			li.style.height = (i)+'%';
			this.eleArr.push(li);
		}	
	}
	
}

sortObj.prototype.shuffle = function(){
	if(this.calcNum === 0){
		return;
	}
	for(var i=0 ; i<this.calcNum ; i++){
		var random = Math.floor(Math.random() * this.calcNum);
		var temp = this.eleArr[i];
		this.eleArr[i] = this.eleArr[random];
		this.eleArr[random] = temp;
	}
}

sortObj.prototype.initialRender = function(){
	var stage = document.getElementById('stage');
	stage.innerHTML = "";
	var ele = this.eleArr;
	var len = ele.length;
	for(var i=0 ; i<len ; i++){
		stage.appendChild(ele[i]);
	}
}


document.getElementById('algo').addEventListener('change' , algoSelect , false);
document.getElementById('reset').addEventListener('click' , resetFunction , false);
dashboard_func_disable(false , true , true , true , true , false);
dashboard_func_setting("unset_value" , null , null , null , null , "done_button");

/*Reset 按鈕*/
function resetFunction(){
	location.reload();
}

/*決定 input box || button disable or not*/
function dashboard_func_disable( boolean_1 , boolean_2 , boolean_3 , boolean_4 , boolean_5 , boolean_6){
	document.getElementById("algo").disabled = boolean_1;
	document.getElementById("count").disabled = boolean_2;
	document.getElementById("mspf").disabled = boolean_3;
	document.getElementById("prepare").disabled = boolean_4;
	document.getElementById("go").disabled = boolean_5;
	document.getElementById("reset").disabled = boolean_6;
}
/*決定 input box || button 在各狀態的顯示顏色*/
function dashboard_func_setting( algo_className , count_className , mspf_className , prepare_className , go_className , reset_className ){
	document.getElementById("algo").className = algo_className;
	document.getElementById("count").className = count_className;
	document.getElementById("mspf").className = mspf_className;
	document.getElementById("prepare").className = prepare_className;
	document.getElementById("go").className = go_className;
	document.getElementById("reset").className = reset_className;
}




function input_verify(algo , count , mspf , err){
	var countValue = parseInt(count.value);
	var mspfValue = parseInt(mspf.value);

	if( Number.isInteger( parseInt(count.value) ) && Number.isInteger( parseInt(mspf.value) ) ){

		if( countValue < 10 || countValue > 100){
			count.style.border = "red solid 1px";
			err.display = "inline-block";
			err.innerHTML = "元素數量建議 : 10 ~ 100";
			return false;
		}
		if( mspfValue < 10 || mspfValue > 1000){
			mspf.style.border = "red solid 1px";
			err.display = "inline-block";
			err.innerHTML = "mspf 建議 : 10 ~ 1000";
			return false;
		}

		return true;
	}
	else{
		err.display = "inline-block";
		err.innerHTML = "數量與時間請輸入正整數";
	}

}

// dashboard_func_disable(false , true , true , true , true , false);
// dashboard_func_setting("unset_value" , null , null , null , null , "done_button");

function operation_initial(){
	dashboard_func_disable(true , false , false , false , true , false);
	dashboard_func_setting( "done_value" , "unset_value" , "unset_value" , "done_button" , null , "done_button" );	
	document.getElementById("mspf").value = "";
	document.getElementById("mspf").placeholder = "時間範圍 10 ~ 1000";
	document.getElementById("count").value = "";
	document.getElementById("count").placeholder = "數量範圍 10 ~ 100";
}

function post_operation(){
	dashboard_func_disable(false , true , true , true , true , false);
	//dashboard_func_setting( "unset_value" , "unset_value" , "unset_value" , "unset_button" , null , "done_button" );	
	dashboard_func_setting("unset_value" , null , null , null , null , "done_button");
	document.getElementById("count").value = "";
	document.getElementById("count").innerHTML = "";
	document.getElementById("mspf").value = "";
	document.getElementById("mspf").innerHTML = "";
	document.getElementById("algo").selectedIndex = 0;
}

function algoSelect(e){

	switch(document.getElementById("algo").value){

		/*BUBBLE SORT*/
		case "bubble_sort":{
			document.getElementById("prepare").addEventListener("click" , prepareClick , false);
			document.getElementById("go").addEventListener("click" , goSortingClick , false);
			operation_initial();
			var bubbleSort = new sortObj();
			var self = bubbleSort;

			function prepareClick(){
				var algo = document.getElementById("algo");
				var count = document.getElementById("count");
				var mspf = document.getElementById("mspf");
				var err = document.getElementById("err");

				if( input_verify(algo , count , mspf , err) ){
					dashboard_func_disable(true , true , true , false , false , false);
					dashboard_func_setting( "done_value" , "done_value" , "done_value" , "done_button" , "done_button" , "done_button" );
					count.style.border = "#86f67c solid 1px";
					mspf.style.border = "#86f67c solid 1px";
					err.innerHTML = "";
					err.display = "none";
					self.algoType = algo;
					self.calcNum = parseInt(document.getElementById('count').value , 10);
					self.sortedIndex = parseInt(document.getElementById('count').value , 10)-1;
					self.mspf = parseInt(document.getElementById('mspf').value , 10) ;
					self.initial();
					self.shuffle();
					self.initialRender();
				}
			}

			function goSortingClick(){
				dashboard_func_disable(true , true , true , true , true , false);
				dashboard_func_setting( null , null , null , null , null , "done_button");

				function swap(){
					var temp = self.eleArr[self.innerCompareCounter];
					self.eleArr[self.innerCompareCounter] = self.eleArr[self.innerCompareCounter+1];
					self.eleArr[self.innerCompareCounter+1] = temp;
				}

				function transientRender(){
					var stage = document.getElementById("stage");
					stage.innerHTML = "";
					var ele = self.eleArr;
					var len = ele.length;
					for(var i=0 ; i<len ; i++){
						stage.appendChild(ele[i]);
					}
				}

				function compare(){
					if(self.innerCompareCounter < (self.calcNum-1)){
						if( self.eleArr[self.innerCompareCounter].value > self.eleArr[self.innerCompareCounter+1].value){
							swap();
				 		}
						transientRender();
						self.innerCompareCounter++;
						compare();
					}
				}

				setTimeout(function(){
					if(self.sortingCounter < self.calcNum - 1){
						compare();
						self.eleArr[self.sortedIndex].classList.add("sorted");
						self.sortedIndex--;
						self.innerCompareCounter = 0;
						self.sortingCounter++;
						goSortingClick();
					}
					else{
						post_operation();
					}
				} , self.mspf)
			}
			break;
		}


		/*SELECTION SORT*/
		case "selection_sort":{
			document.getElementById("prepare").addEventListener("click" , prepareClick , false);
			document.getElementById("go").addEventListener("click" , goSortingClick , false);
			operation_initial();
			var selectionSort = new sortObj();
			var self = selectionSort;

			function prepareClick(){
				var algo = document.getElementById("algo");
				var count = document.getElementById("count");
				var mspf = document.getElementById("mspf");
				var err = document.getElementById("err");
				if( input_verify(algo , count , mspf , err) ){
					dashboard_func_disable(true , true , true , false , false , false);
					dashboard_func_setting( "done_value" , "done_value" , "done_value" , "done_button" , "done_button" , "done_button" );
					count.style.border = "#86f67c solid 1px";
					mspf.style.border = "#86f67c solid 1px";
					err.innerHTML = "";
					err.display = "none";
					self.algoType = algo;
					self.calcNum = parseInt(document.getElementById('count').value , 10);
					self.sortedIndex = parseInt(document.getElementById('count').value , 10)-1;
					self.mspf = parseInt(document.getElementById('mspf').value , 10) ;
					self.initial();
					self.shuffle();
					self.initialRender();
				}
			}

			function goSortingClick(){
				dashboard_func_disable(true , true , true , true , true , false);
				dashboard_func_setting( null , null , null , null , null , "done_button");

				function swap(){
					self.carrier = self.eleArr[self.innerCompareCounter]
					self.carrierIndex = self.innerCompareCounter;
				}

				function transientRender(){
					var stage = document.getElementById("stage");
					stage.innerHTML = "";
					var ele = self.eleArr;
					var len = ele.length;
					for(var i=0 ; i<len ; i++){
						stage.appendChild(ele[i]);
					}
				}

				function compare(){
					if(self.innerCompareCounter < self.calcNum){
						if( self.carrier.value > self.eleArr[self.innerCompareCounter].value){
							swap();
				 		}
						if(self.innerCompareCounter != self.calcNum-1){
							self.innerCompareCounter++;
							compare();
						}
						else{
							var temp = self.eleArr[self.sortingCounter];
							self.eleArr[self.sortingCounter] = self.carrier;
							self.eleArr[self.carrierIndex] = temp;
							transientRender();
						}
					}
				}

				setTimeout(function(){
					if(self.sortingCounter < self.calcNum){
						self.innerCompareCounter = self.sortingCounter;
						self.carrier = self.eleArr[self.sortingCounter];
						self.carrierIndex = self.sortingCounter;
						compare();
						self.eleArr[self.sortingCounter].classList.add("sorted");
						self.sortingCounter++;
						goSortingClick();
					}
					else{
						post_operation();
					}
				} , self.mspf)
			}
			break;
		}

		/*EXCHANGE SORT*/
		case "exchange_sort":{
			document.getElementById("prepare").addEventListener("click" , prepareClick , false);
			document.getElementById("go").addEventListener("click" , goSortingClick , false);
			operation_initial();
			var exchangeSort = new sortObj();
			var self = exchangeSort;

			function prepareClick(){
				var algo = document.getElementById("algo");
				var count = document.getElementById("count");
				var mspf = document.getElementById("mspf");
				var err = document.getElementById("err");
				if( input_verify(algo , count , mspf , err) ){
					dashboard_func_disable(true , true , true , false , false , false);
					dashboard_func_setting( "done_value" , "done_value" , "done_value" , "done_button" , "done_button" , "done_button" );
					count.style.border = "#86f67c solid 1px";
					mspf.style.border = "#86f67c solid 1px";
					err.innerHTML = "";
					err.display = "none";
					self.algoType = algo;
					self.calcNum = parseInt(document.getElementById('count').value , 10);
					self.sortedIndex = parseInt(document.getElementById('count').value , 10)-1;
					self.mspf = parseInt(document.getElementById('mspf').value , 10) ;
					self.initial();
					self.shuffle();
					self.initialRender();
				}
			}

			function goSortingClick(){
				dashboard_func_disable(true , true , true , true , true , false);
				dashboard_func_setting( null , null , null , null , null , "done_button");

				function swap(){
					self.carrier = self.eleArr[self.innerCompareCounter]
					self.carrierIndex = self.innerCompareCounter;
				}

				function transientRender(){
					var stage = document.getElementById("stage");
					stage.innerHTML = "";
					var ele = self.eleArr;
					var len = ele.length;
					for(var i=0 ; i<len ; i++){
						stage.appendChild(ele[i]);
					}
				}

				function compare(){
					if(self.innerCompareCounter < self.calcNum){
						if(self.eleArr[self.sortingCounter].value > self.eleArr[self.innerCompareCounter].value){
							self.temp = self.eleArr[self.sortingCounter];
							self.eleArr[self.sortingCounter] = self.eleArr[self.innerCompareCounter];
							self.eleArr[self.innerCompareCounter] = self.temp;
						}
						transientRender();
						self.innerCompareCounter++;
						compare();
					}
				}

				setTimeout(function(){
					if(self.sortingCounter < self.calcNum){
						self.innerCompareCounter = self.sortingCounter;
						compare();
						self.eleArr[self.sortingCounter].classList.add("sorted");
						self.sortingCounter++;
						goSortingClick();
					}
					else{
						post_operation();
					}
				} , self.mspf)

			}
			break;
		}

		default:{
			document.getElementById("count").value = "";
			document.getElementById("count").placeholder = "";
			break;
		}
	}
}


