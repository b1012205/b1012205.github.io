
$(function(){
	$('#dialog').dialog({
		autoOpen: false,
		width: 400,
		modal: true,
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
					deleteMarkerAll();
					location.href = "log.html?"+encodeURIComponent(valueYear)+"&"+encodeURIComponent(valueMonth)+"&"+encodeURIComponent(valueDay)+"&"+encodeURIComponent(valueHour)+"&"+encodeURIComponent(valueMinute);
					//changeTime(valueYear,valueMonth,valueDay,valueHour,valueMinute);
				}
			},
			{
				text: "Cancel",
				click: function() {
					$( this ).dialog( 'close' );
				}
			}
		]
	});

	// ボタン押したら
	$( '#timeChange').click(function() {
		console.log("aa");
		$( '#dialog').dialog( 'open' );
		//event.preventDefault();	
	});	
});