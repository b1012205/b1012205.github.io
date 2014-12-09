/*
* aside.js
*
* 画面左下の開閉式船舶情報表示欄に関する処理群が記述されています。
*/


$(function(){
	var duration = 300;

	var $aside = $('aside');
	var $asideButton = $aside.find('#hune')
	    .on('click',function(){
	    	$aside.toggleClass('open');
	    	if($aside.hasClass('open')){
	    		$aside.stop(true).animate({
	    			left: '0px'
	    		}, duration);
	    		$asideButton.html("<");
	    		//$asideButton.find('img')
	    		//    .attr('src', 'image/button/close.png');
	    	}else{
	    		$aside.stop(true).animate({
	    			left: '-200px'
	    		},duration);
	    		$asideButton.html(">");
	    		//$asideButton.find('img')
	    		//    .attr('src', 'image/button/open.png');
	    	}
	    });
});

function openAside(){
  $(function(){
  	var $aside = $('aside');
  	var $asideButton = $aside.find('#hune');
  	if(!$aside.hasClass('open')){
  	  $aside.toggleClass('open');
  	  $aside.stop(true).animate({ left: '0px' }, 300);
	  $asideButton.html("<");
	  //$asideButton.find('img').attr('src', 'image/button/open.png');
  	}
  });
}

function closeAside(){
  $(function(){
  	var $aside = $('aside');
  	var $asideButton = $aside.find('#hune');
  	if($aside.hasClass('open')){
      $aside.toggleClass('open');
  	  $aside.stop(true).animate({ left: '-200px' },300);
	  $asideButton.html(">");
	  //$asideButton.find('img').attr('src', 'image/button/open.png');
    }
  });
}