//バーの出し入れ
$(function(){
	var duration = 300;
	var $bar = $('#smartbar');
	var $barButton = $bar.find('#barbutton')
	    .on('click',function(){
	    	$bar.toggleClass('open');
	    	if($bar.hasClass('open')){
	    		$bar.stop(true).animate({
	    			top: '0%'
	    		}, duration);
	    		$barButton.html("↑");
	    	}else{
	    		$bar.stop(true).animate({
	    			top: '-10%'
	    		},duration);
	    		$barButton.html("↓");
	    	}
	    });
});

