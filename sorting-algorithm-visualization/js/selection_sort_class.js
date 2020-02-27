

class Selection extends Sort_obj {
	constructor(){
		super();
		this.outer_origin_index = 0;
		this.outer_index = 0;
	}

	count_err_validate(){
		var count = document.getElementById("count");
		var err = document.getElementById("err");
		if( count.value < 3 || count.value > 100 ){
			dashboard_func_disable(false , false , false , true , false);
			count.style.border = "red solid 1px";
			err.display = "inline-block";
			err.innerHTML = "為了較好的使用體驗，上下限界為 3 ~ 100 之間";
		}
		else{
			dashboard_func_disable(true , true , false , false , false);
			dashboard_func_setting( "done_value" , "done_value" , "done_button" , "done_button" , "done_button" );
			count.style.border = "";
			err.innerHTML = "";
			err.display = "none";
			return parseInt(count.value)+1;
		}
	}

	generate_shuffle_square(){
		document.getElementById('stage').innerHTML = "";
		this.square_arr = [];
		this.shuffled_arr = [];

		for(var i=1 ; i<this.square_arr_num ; i++){
			var ele = "<li value=\""+(i)+"\" style=\"height:"+i+"%\"></li>";
			this.square_arr.push(ele);
		}

		this.shuffled_arr = shuffle(this.square_arr);
		function shuffle(a) {
		    var j, x, i;
		    for (var i = a.length; i; i--) {
		        j = Math.floor(Math.random() * i);
		        x = a[i - 1];
		        a[i - 1] = a[j];
		        a[j] = x;
		    }
		    return a;
		}

		for(var i=0 ; i<this.shuffled_arr.length ; i++){
			insert_stage(this.shuffled_arr[i]);
		}

		this.li = document.getElementById("stage").children;
		this.len = this.li.length;
	}

	sorting(){
		dashboard_func_setting( null , null , null , null , "done_button" );
		var temp = null;
		var _self = this;
		this.li = document.getElementById("stage").children;
		this.len = this.li.length;

		var min_value = this.li[ this.outer_index ].value;
		var min_li = null;
		var min_pos = this.outer_index;
		for(var j = this.outer_index+1 ; j<this.len ; j++){
			if( min_value > this.li[ j ].value ){
				min_value = this.li[j].value;
				min_pos = j;
			}
		}
		temp = this.shuffled_arr[ this.outer_index ];
		this.shuffled_arr[ this.outer_index ] = this.shuffled_arr[ min_pos ];
		this.shuffled_arr[ min_pos ] = temp;

		this.outer_index++;
		setTimeout( function(){ _self.animate_func() }, 90);
	}

	animate_func(){
		document.getElementById("stage").innerHTML = "";
		for(var k=0 ; k<this.shuffled_arr.length ; k++){
			insert_stage( this.shuffled_arr[k] );
			if( k <= this.outer_index){
				document.getElementById("stage").children[k].className = "sorted";
			}
		}
		
		if( this.outer_index < (this.len-1) ){
			this.sorting( this );
		}
		else{
			this.outer_index = this.outer_origin_index;
			this.inner_index = this.inner_origin_index;
			this.len = null;
			dashboard_func_disable(false , false , false, true , false);
			dashboard_func_setting( "done_value" , "done_value" , "unset_button" , null , "done_button");
		}
	}

}
