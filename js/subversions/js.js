$(function(){


	//Settings
	max_plus = 400;
	min_plus = 20;
	max_plus_difference = 300;
	min_plus_difference = 30;
	
	max_minus = 400;
	min_minus = 40;
	max_minus_difference = 300;
	min_minus_difference = 30;
	
	max_mul = 8;
	min_mul = 2;
	max_mul_difference = 4;
	min_mul_difference = 1;
	
	max_div = 5;
	min_div = 2;
	max_div_difference = 1;
	min_div_difference = 0;
	
	exercises = 15;
	exercises_types = "*";
	def_val = "?";
	replacer = "What?!";
	edit = false;
	val = "";
	mod = true;
	
	function Rand(min,max) {
		if( max < min ) return 0;
		new_min = min - 1;
		return Math.floor( (max-new_min)*Math.random() ) + min
	}//EOF
	
	function Max(x,y) {
		
		if( x > y ) return x;
		return y;
		
	}//EOF
	
	function Min(x,y) {
		
		if( x < y ) return x;
		return y;
		
	}//EOF
	
	answers = new Array();
	
	for( i = 1; i <= exercises; i++ ) {
	
		sign = exercises_types.charAt( Math.floor(Math.random()*exercises_types.length) );
		switch (sign) {
		
			case "+":
				num1 = Rand(min_plus,max_plus);
				dif = max_plus - num1;
				if( dif > max_plus_difference ) num2 = Rand(num1+min_plus_difference,num1+max_plus_difference);
				else num2 = Rand(num1+0,num1+dif);
				answers[i] = num1+num2;
				ex = num1+" + "+num2;
				break;
			case "-":
				num1 = Rand(min_minus,max_minus);
				dif = max_minus - num1;
				if( dif > max_minus_difference ) num2 = Rand(num1+min_minus_difference,num1+max_minus_difference);
				else num2 = Rand(num1+0,num1+dif);
				answers[i] = num2-num1;
				ex = num2 + " - "+num1;
				break;
			case "*":
				num1 = Rand(min_mul,max_mul);
				//num2 = Rand(min_mul,max_mul);
				n1 = Max(Min(num1+min_mul_difference,max_mul),Min(num1+max_mul_difference,max_mul));
				n2 = Min(Max(min_mul,num1-max_mul_difference),Max(num1-min_mul_difference,min_mul));
				//alert(n1+","+n2);
				num2 = Rand(n2,n1);
				/*if(num1+max_mul_difference > max_mul) {
					num2 = Rand(num1+min_mul_difference,num1+max_mul_difference);
					while(num2 <= min_mul || num2 >= max_mul) num2 = Rand(num1+min_mul_difference,num1+max_mul_difference);
				}
				else {
					num2 = Rand(num1-min_mul_difference,num-max_mul_difference);
					while(num2 <= min_mul || num2 >= max_mul) num2 = Rand(num1-min_mul_difference,num1-max_mul_difference);
				}*/
				/*
				dif = max_mul - num1;
				if( dif > max_mul_difference ) num2 = Rand(num1+min_mul_difference,num1+max_mul_difference);
				//else num2 = Rand(num1+0,num1+dif);
				else num2 = Rand(num1-min_mul_difference,num1-min_mul_difference);
				*/
				answers[i] = num1*num2;
				ex = num2 + " * "+num1;
				break;
			case "/":
				num1 = Rand(min_div,max_div);
				dif = max_div - num1;
				if( dif > max_div_difference ) num2 = Rand(num1+min_div_difference,num1+max_div_difference);
				else num2 = Rand(num1+0,num1+dif);
				mul = num1*num2;
				answers[i] = num2;
				ex = mul +" / "+ num1;
				break;
		} //End sign switch
		
		$("#exercises").
		append("<div class=\"exercise\" id=\"ex-"+i+"\">"+ex+" = <span class=\"answer\" id=\"ans-"+i+"\">?</span></div>");
		
		//break;
	
	} //End loop
	
	$("#admin").click(function(e){
		if( $(e.target).is("#answers") ) {
				for( j=1; j<=exercises; j++ ) {
				if( answers[j] == "0" ) $("#ans-"+j).html("0");
				else $("#ans-"+j).html(answers[j]);
			}
			
			$(this).html("Clicked!");
		}
		
	});
	
	//Answer
	
	function SaveVal(obj){
		new_val = $("input.vb").val();
		if( new_val != replacer && new_val != def_val ) {
			obj.html( new_val );
			edit = false;
		} else {
			obj.html(def_val);
			edit = false;
		}
	}//EOM
	
	function SetClick(obj){
		
		if( !edit && mod) {
			edit = true;
			val = obj.html();
			if( val == def_val ) val2 = replacer;
			else val2 = val;
			obj.html("<form class=\"af\"><input type=\"text\" class=\"vb\" value=\""+val2+"\" name=\"ans_val\"/></form>");
			$(".vb").focus();
			SelectEx(obj);

		}
		
		$(".vb").blur(function(){
			SaveVal($(this).parents(".answer"));
			$(".exercise").removeClass("selected");
		});
		
		$(".vb").keydown(function(e){
			
			if( !mod ) return;
			
			if (e.keyCode == 27) {
				e.preventDefault();
				$(this).parents(".answer").html(val);
				edit = false;
				$(".exercise").removeClass("selected");
			} //Esc
			else if(e.keyCode == 13){
				e.preventDefault();
				SaveVal($(this).parents(".answer"));
				$(".exercise").removeClass("selected");
			} //Enter
			else if(e.keyCode == 9 || e.keyCode == 40 ){
				e.preventDefault();
				id = $(this).parents(".exercise").attr("id");
				num = id.split("-");
				new_num = num[1]*1;
				new_num++;
				if( new_num == exercises+1 ) new_num = 1;
				SaveVal($(this).parents(".answer"));
				$(this).parents(".exercise").next().children(".answer");
				SetClick($("#ans-"+new_num));
				SelectEx($("#ans-"+new_num));
			} //Down
			else if(e.keyCode == 38 ){
				e.preventDefault();
				id = $(this).parents(".exercise").attr("id");
				num = id.split("-");
				new_num = num[1]*1;
				new_num--;
				if( new_num == 0 ) new_num = exercises;
				SaveVal($(this).parents(".answer"));
				$(this).parents(".exercise").next().children(".answer");
				SetClick($("#ans-"+new_num));
				SelectEx($("#ans-"+new_num));
			} //Up

		});//Keys
		
	}//EOM
	
	function SelectEx(obj) {
		$(".exercise").removeClass("selected correct wrong");
		obj.parents(".exercise").addClass("selected");
	}
	
	$("*").keydown(function(e){
		if (e.keyCode == 32 && !edit && mod) {
			e.preventDefault();
			SetClick($("#ans-1"));
			SelectEx($("#ans-1"));
		} //Start
	});//EOE
	
	$(".answer").click(function(e){ SetClick($(this)); });//EOE
	
	$("#ok").click(function(){
		
		if( $(this).hasClass("check") ) {
		
			mistakes = 0;
			empty = 0;
			for( i=1; i<=exercises; i++ ) {
				$("#ans-"+i).parents(".exercise").removeClass("wrong correct");
				if( $("#ans-"+i).html() != answers[i] ) mistakes++;
				if( $("#ans-"+i).html() == def_val || $("#ans-"+i).html() == replacer ) empty++;
			}
			
			if( empty > 0 ) {
				$("#ok").html("שכחת לענות על "+empty+" תרגילים. תעני עליהם ותלחצי שוב לבדוק!");
				$("#ok").removeClass("check note result");
				$("#ok").addClass("note");
			}
			
			else if( mistakes > 0 ) {
				$("#ok").html("יש לך טעויות. נסי לתקן אותם ולחצי כאן כדי לבדוק");
				$("#ok").removeClass("check note result");
				$("#ok").addClass("note");
			}
			else {
				$(this).html("כל הכבוד, הכל נכון!");
				$.sound.play("sounds/Applause.WAV");
				$("#ok").removeClass("check note result");
				$("#ok").addClass("result");
				$(".exercise").addClass("correct");
				mod = false;
			}
			
		}//Check
		
		else if( $(this).hasClass("note") ) {
			
			mistakes = 0;
			empty = 0;
			for( i=1; i<=exercises; i++ ) {
				$("#ans-"+i).parents(".exercise").removeClass("wrong correct");
				if( $("#ans-"+i).html() != answers[i] ) mistakes++;
				if( $("#ans-"+i).html() == def_val || $("#ans-"+i).html() == replacer ) empty++;
			}
			
			if( empty > 0 ) {
				$("#ok").html("עדיין לא ענית על "+empty+" תרגילים");
				//$("#ok").Shake(2);
				$("#ok").animate({ backgroundColor:'#ffa71c' },"slow",function(){
					$("#ok").animate({ backgroundColor:'#FEF58A'},"slow");
				});
				return;
			}
			
			for( i=1; i<=exercises; i++ ) {
				$("#ans-"+i).parents(".exercise").removeClass("wrong correct");
				if( $("#ans-"+i).html() == answers[i] ) {
					$("#ans-"+i).parents(".exercise").addClass("correct");
				} else {
					$("#ans-"+i).parents(".exercise").addClass("wrong");
				}
			}
			if( mistakes == 0 ) { 
				$(this).html("מעולה! קיבלת 100!!"); 
				$.sound.play("sounds/Applause.WAV"); 
			}
			else {
				$(this).html("עשית "+mistakes+" טעויות מתוך "+exercises+" תרגילים");
				$.sound.play("sounds/babycry.wav");	
			}
			$(this).removeClass("check note result");
			$(this).addClass("result");
			$("#ok").animate({ backgroundColor:'#B7FE7D'},"slow");
			mod = false;
			
		}//Note
		
	});//EOE

}); //END