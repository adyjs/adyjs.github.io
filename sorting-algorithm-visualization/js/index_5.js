
/*Adyjs refactoring 2017/06/07*/

function Sort_obj(){
	this.square_arr_num = this.count_err_validate();
	this.square_arr =  [];
	this.shuffled_arr =  [];
	this.len = null;
	this.li = null;
}

/*在控制板加上 event listener */
document.getElementById("algo").addEventListener("change" , validate_select_item , false);
document.getElementById("prepare").addEventListener("click" , prepare_click , false);
document.getElementById("go").addEventListener("click" , go_click , false);
document.getElementById("reset").addEventListener("click" , reset_func , false);


/*偵測 user 所選擇的演算法，進而觸發其他 function*/
function validate_select_item(e){
	switch(document.getElementById("algo").value){
		case "bubble_sort":{
			/*將 input box | button 設定 disable = true || false*/
			dashboard_func_disable(false , false , false , true , false);
			/*以預設的輸入順序來顯示相對應的顏色*/
			dashboard_func_setting( "done_value" , "unset_value" , "unset_button" , null , "done_button" );
			/*清空 input box */
			document.getElementById("count").value = "";
			/*依照依照各演算法的執行情況來顯示建議的排序數量*/
			document.getElementById("count").placeholder = "20~50 之間，有較好使用體驗";
			break;
		}
		case "selection_sort":{
			dashboard_func_disable(false , false , false , true , false);
			dashboard_func_setting( "done_value" , "unset_value" , "unset_button" , null , "done_button" );
			document.getElementById("count").value = "";
			document.getElementById("count").placeholder = "50~100 之間，有較好使用體驗";
			break;
		}
		case "exchange_sort":{
			dashboard_func_disable(false , false , false , true , false);
			dashboard_func_setting( "done_value" , "unset_value" , "unset_button" , null , "done_button" );
			document.getElementById("count").value = "";
			document.getElementById("count").placeholder = "20~60 之間，有較好使用體驗";
			break;
		}
		default:{
			dashboard_func_disable(false , true , true , true , false);
			dashboard_func_setting( "unset_value" , null , null , null , "done_button" );
			document.getElementById("count").value = "";
			document.getElementById("count").placeholder = "";
			break;
		}
	}
}

/*輸入欲顯示的排序數量後，按下產生圖像按鈕，來產生亂數排列的圖像*/
function prepare_click(e){
	e.preventDefault();
	token = null;
	var sort_algorithm = document.getElementById("algo").value;
	switch(sort_algorithm){
		case "bubble_sort":{
			token = new Bubble();
			token.generate_shuffle_square();
			break;
		}
		case "selection_sort":{
			token = new Selection();
			token.generate_shuffle_square();
			break;
		}
		case "exchange_sort":{
			token = new Exchange();
			token.generate_shuffle_square();
			break;
		}
	}
}

/*開始排序*/
function go_click(e){
	e.preventDefault();
	token.sorting();
	dashboard_func_disable(true , true , true , true , false);
}

/*重設按鈕*/
function reset_func(){
	location.reload();
}

/*決定 input box | button disable or not*/
function dashboard_func_disable( boolean_1 , boolean_2 , boolean_3 , boolean_4 , boolean_5){
	document.getElementById("algo").disabled = boolean_1;
	document.getElementById("count").disabled = boolean_2;
	document.getElementById("prepare").disabled = boolean_3;
	document.getElementById("go").disabled = boolean_4;
	document.getElementById("reset").disabled = boolean_5;
}
/*決定 input box | button 在各狀態的顯示顏色*/
function dashboard_func_setting( algo_className , count_className , prepare_className , go_className , reset_className ){
	document.getElementById("algo").className = algo_className;
	document.getElementById("count").className = count_className;
	document.getElementById("prepare").className = prepare_className;
	document.getElementById("go").className = go_className;
	document.getElementById("reset").className = reset_className;
}

/*將圖像載入 stage 中*/
function insert_stage(ele){
	document.getElementById('stage').insertAdjacentHTML("beforeend" , ele);
}
