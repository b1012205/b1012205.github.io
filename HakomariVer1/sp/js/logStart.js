$(function(){
	var time = new Date();
	var year = time.getFullYear();//2014?
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

$(function(){
	$('#dialog').dialog({
		autoOpen: false,
		width: 400,
		modal:true,
		buttons: [
			{
				text: "Ok",
				click: function() {
					var valueYear = $('select[id="year"]').val();
					var valueMonth = $('select[id="month"]').val();
					var valueDay = $('select[id="day"]').val();
					var valueHour = $('select[id="hour"]').val();
					var valueMinute = $('select[id="minute"]').val();
					$( this ).dialog( 'close' );
					$("#overlay").fadeOut();
					deleteMarkerAll();
					location.href = "log.html?"+encodeURIComponent(valueYear)+"&"+encodeURIComponent(valueMonth)+"&"+encodeURIComponent(valueDay)+"&"+encodeURIComponent(valueHour)+"&"+encodeURIComponent(valueMinute);
					//changeTime(valueYear,valueMonth,valueDay,valueHour,valueMinute);
				}	
			},
			{
				text: "Cancel",
				click: function() {
					$( this ).dialog( 'close' );
					$("#overlay").fadeOut();	
				}
			}
		]
	});

	// ボタン押したら
	$( '#button2').click(function() {
		$( '#dialog').dialog( 'open' );
		//event.preventDefault();
		$("#overlay").fadeIn();	
	});	
});