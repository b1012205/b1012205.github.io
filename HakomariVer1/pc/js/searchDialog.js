$(function() {
// 2ダイアログ機能を適用
  $('#search-dialog').dialog({
    autoOpen: false,
	modal: true,
    buttons: {
	  "検索": function(){
	    SearchCheck();
	    $(this).dialog('close');
	    deleteMarkerAll();
      resetMarker();
      }
    }
  });
  $('#filter-btn').click(function(e){
	$('#search-dialog').dialog('open');
  });
});