/*
* logData.js
*
* ログデータ表示画面中のボタンやフォームの処理に関するファイルです
*/

//-------------------------------日付変更欄---------------------------------------------------
$(function(){
var time = new Date();
var year = time.getFullYear();
for(var i = year; i >=2013; i--){
	$('#year').append('<option value"' + i + '">' + i + '</option>');
	
}
for(var i = 1; i <=12; i++){
	$('#month').append('<option value"' + i + '">' + i + '</option>');
	
}
for(var i = 1; i <=31; i++){
	$('#day').append('<option value"' + i + '">' + i + '</option>');
	
}
for(var i = 0; i <=23; i++){
	$('#hour').append('<option value"' + i + '">' + i + '</option>');
}
for(var i = 0; i <=59; i++){
	$('#minute').append('<option value"' + i + '">' + i + '</option>');
}
});

//---------------------------------現在へ戻るボタン----------------------------------------
$(function(){
  $('#return').click(function() {
  	deleteMarkerAll();
	location.href = 'index.html';
  });
});

//----------------------------------再生・少し戻る・少し進む・検索ボタン------------------------------------------------
$(function(){
  $buttons = $('#bar').find('.button1');
  $buttons.each(function(){
    $(this).on('click',function(){
      if($(this).attr("id")=="back-btn"){
      	if(!$(this).hasClass('unable-btn')){
      	  timeShift(-1);
      	}
      }else if($(this).attr("id")=="play-btn"){
      	$(this).toggleClass('play');
      	if($(this).hasClass('play')){
      	  $('#back-btn').addClass('unable-btn');
      	  $('#foward-btn').addClass('unable-btn');
      	  $(this).attr("src","button/stop.png");
      	  startLoop();
      	}
      	if(!$(this).hasClass('play')){
      	  $('#back-btn').removeClass('unable-btn');
      	  $('#foward-btn').removeClass('unable-btn');
      	  $(this).attr("src","button/restart.png");
      	  stopLoop();
      	}
      }else if($(this).attr("id")=="foward-btn"){
      	if(!$(this).hasClass('unable-btn')){
      	  timeShift(1);
      	}
      }else if($(this).attr("id")=="search-btn"){
      	
      }
    });
  });
});
