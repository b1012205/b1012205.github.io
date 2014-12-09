$(function(){
	$('#camera-dialog').dialog({
		autoOpen: false,
		width: 400,
		modal: false,
		buttons: [
				{
				text: "Cancel",
				click: function() {
					$( this ).dialog( 'close' );
				}
			}
		]
	});

	// ボタン押したら
  
	$( '#camera-btn').click(function() {
		$( '#camera-dialog').dialog( 'open' );
		//event.preventDefault();	
	});	
});

$(function(){
  $('#camera-dialog').dialog({
                             autoOpen: false,
                             width: 400,
                             modal: false,
                             buttons: [
                                       {
                                       text: "Cancel",
                                       click: function() {
                                       $( this ).dialog( 'close' );
                                       }
                                       }
                                       ]
                             });
  
  });
