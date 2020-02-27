

class Bubble extends Sort_obj{
	constructor(){
		super();
		this.outer_origin_index = 1;
		this.inner_origin_index = 0;
		this.outer_index = 1;
		this.inner_index = 0;
		this.self = this;
	}

	count_err_validate(){
		var count = document.getElementById("count");
		var err = document.getElementById("err");
		if( count.value < 3 || count.value > 50 ){
			dashboard_func_disable(false , false , false , true , false);
			count.style.border = "red solid 1px";
			err.display = "inline-block";
			err.innerHTML = "為了較好的使用體驗，上下限界為 3 ~ 50 之間";
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
		var weighted = 0;
		for(var i=1 ; i<this.square_arr_num ; i++){
			var ele = "<li value=\""+(i)+"\" style=\"height:"+(i+(weighted++))+"%\"></li>";
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

		if( this.li[this.inner_index].value > this.li[this.inner_index+1].value ){
			temp = this.shuffled_arr[this.inner_index+1];
			this.shuffled_arr[this.inner_index+1] = this.shuffled_arr[this.inner_index];
			this.shuffled_arr[this.inner_index] = temp;
		}
		this.inner_index++;
		setTimeout( function(){ _self.animate_func() } , 10);
	}

	animate_func(){
		document.getElementById("stage").innerHTML = "";
		for(var k=0 ; k<this.shuffled_arr.length ; k++){
			insert_stage( this.shuffled_arr[k] );
			if( k > (this.len - this.outer_index) ){
				document.getElementById("stage").children[k].className = "sorted";
				if((this.len - this.outer_index) <= 1){
					document.getElementById("stage").children[this.len - this.outer_index].className = "sorted";
					document.getElementById("stage").children[0].className = "sorted";
				}
			}
			
		}
		if( this.inner_index < (this.len-this.outer_index) ){
			this.sorting();
		}
		else{
			this.outer_index++;
			if( this.outer_index < this.len ){
				this.inner_index = this.inner_origin_index;
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
}
