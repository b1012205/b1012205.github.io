/*
* googleMapIni.js
* グーグルマップの初期描画を行うファイルです。静的にマップのデザイン変更や装飾を行う際は、ここに処理を追加します。
*/

var map;
var zoom=14;
var hutou = [];
var hutouLatLng = new Array();
var hutouName = new Array();
var line2 = new Array();
var kouro = new Array();
var kouroLatLng = new Array();
var kouroName = new Array();

/*
* グーグルマップを生成する関数。
*
* @method initialize
*/
function initialize(){

  //--------------------------------------------マップ本体の定義----------------------------------------------------
  var opts = {
    zoom: 14,//値が大きくなると拡大する
    center: new google.maps.LatLng(41.792156, 140.689057),//この位置がマップの中心に来る
    mapTypeId: google.maps.MapTypeId.ROADMAP,//マップの種類を指定 (ROADMAP, SATELLITE, HYBRID or TERRAIN?)
    mapTypeControlOptions: { mapTypeIds: ['noText', google.maps.MapTypeId.ROADMAP] },
    disableDoubleClickZoom: true, //ダブルクリックするとズームするのがうざったいので無効にします
    panControl: false,
    zoomControl: true,
    mapTypeControl: false,
    scaleControl: false,
    streetViewControl: false,
    overviewMapControl: false,
	  minZoom: 11,
	  maxZoom: 15,
    zoomControlOptions: {
      position: google.maps.ControlPosition.LEFT_TOP//中央左にズームコントロールを配置
    }
  };
  map = new google.maps.Map(document.getElementById("map-canvas"),opts);

  //---------------------------------------マップ上に表示される文字をなくす----------------------------------------------------
  var styleOptions = [{
    featureType: 'all',     //対象物。All(すべて)を選択
    elementType: 'labels',    //要素。Labels(テキスト要素)を選択
    stylers: [{ visibility: 'off' }]  //適用するスタイラ。Visibility(表示状態)をOffに指定
  }];
  var styledMapOptions = { name: '文字なし' } //マップタイプの名前
  var lopanType = new google.maps.StyledMapType(styleOptions, styledMapOptions); //新しいマップタイプ作成
  map.mapTypes.set('noText', lopanType); //lopanTypeというスタイル付き地図を、noTextという名前で、地図に設定
  map.setMapTypeId('noText'); // noTextをマップ タイプ IDに登録

  //-----------------------------------------------防波堤を描く--------------------------------------------------------
  var bouha = new Array();
    
  bouha[0] = [
    new google.maps.LatLng(41.79466, 140.69975),
    new google.maps.LatLng(41.785837, 140.701518)
  ];
  bouha[1] = [
    new google.maps.LatLng(41.806651, 140.696529),
    new google.maps.LatLng(41.80527, 140.698702),
    new google.maps.LatLng(41.798048, 140.699549)
  ];
  bouha[2] = [
    new google.maps.LatLng(41.795102, 140.698629),
    new google.maps.LatLng(41.794588, 140.699568)
  ];
  for(i=0;i<3;i++){
    var line = new Array();
    line[i] = new google.maps.Polyline({
      path: bouha[i],
      strokeColor: '#E9E9D0',
      strokeOpacity: 1.0,
      strokeWeight: 3
    });
    line[i].setMap(map);
  }

  //-----------------------------------------------航路を描く--------------------------------------------------------
  
  var kouroLine = new Array();

  var lineSymbol = {
  path: 'M 0,-1 0,1',
  strokeOpacity: 1,
  scale: 2
};

  kouroLine[0] = [
    new google.maps.LatLng(41.797569, 140.705280),
    new google.maps.LatLng(41.798356, 140.695413),
	new google.maps.LatLng(41.795423, 140.695962),
	new google.maps.LatLng(41.794722, 140.704854),
	new google.maps.LatLng(41.797569, 140.705280)
  ];
  
  kouroLine[1] = [
    new google.maps.LatLng(41.788023605089,140.71197887061),
    new google.maps.LatLng(41.797569265414,140.70528054397),
	new google.maps.LatLng(41.794722631295,140.70485447552),
	new google.maps.LatLng(41.787490646934,140.71066250536),
    new google.maps.LatLng(41.788023605089,140.71197887061)
  ]
  
  kouroLine[2] = [
    new google.maps.LatLng(41.806961983246,140.70493017319),
    new google.maps.LatLng(41.810685064256,140.69997613282),
	new google.maps.LatLng(41.809208395572,140.6958843328),
	new google.maps.LatLng(41.806588322481,140.69676179434),
	new google.maps.LatLng(41.807512991605,140.69928405237),
	new google.maps.LatLng(41.805185954796,140.7033635661),
    new google.maps.LatLng(41.806961983246,140.70493017319)
  ]
  
  kouroName[0] = "第一航路";
  kouroLatLng[0] = new google.maps.LatLng(41.796931, 140.697676);
  kouroName[1] = "第二航路";
  kouroLatLng[1] = new google.maps.LatLng(41.793268, 140.706345);
  kouroName[2] = "第三航路";
  kouroLatLng[2] = new google.maps.LatLng(41.809129, 140.697110);
  
  for(i=0; i<kouroLine.length; i++){
    line2[i] = new google.maps.Polyline({
      path: kouroLine[i],
      strokeColor: '#555555',
      strokeOpacity: 0,
	  icons: [{
	    icon: lineSymbol,
        offset: '0',
        repeat: '10px'
	  }]
    });
    line2[i].setMap(map);
	kouro[i] = new showName(kouroName[i],kouroLatLng[i].lat(), kouroLatLng[i].lng(), map);
  }

//------------------------------------ふ頭の名前表示------------------------------------------------------------------------------

hutouName[0]="港町ふ頭";
hutouLatLng[0]=new google.maps.LatLng(41.800109,140.712868);
hutouName[1]="北埠頭";
hutouLatLng[1]= new google.maps.LatLng( 41.794671972458964,140.7190701940308);
hutouName[2] ="西ふ頭";
hutouLatLng[2]=new google.maps.LatLng(41.774804, 140.710379);
hutouName[3] ="豊川ふ頭";
hutouLatLng[3]=new google.maps.LatLng(41.769298, 140.718705);
hutouName[4] ="海岸町船だまり";
hutouLatLng[4]=new google.maps.LatLng(41.778868, 140.721988);
hutouName[5] ="中央ふ頭";
hutouLatLng[5]=new google.maps.LatLng(41.782820, 140.721473);
hutouName[6] ="万代ふ頭";
hutouLatLng[6]=new google.maps.LatLng(41.787508, 140.723318);

for (var i=0; i<hutouName.length; i++){
  hutou[i]=new showName(hutouName[i],hutouLatLng[i].lat(), hutouLatLng[i].lng(), map);
}

  google.maps.event.addListener(map, 'zoom_changed', function() {
    zoom = map.getZoom();
	settingName();
   });

}

//------------------------------------埠頭の名前と航路の表示と非表示---------------------------------------

function settingName(){
  
  if(zoom>=14){
    for (var i=0; i<hutou.length; i++){
	  hutou[i].show();
	}
	for (var i=0; i<kouro.length; i++){
	  kouro[i].show();
	}
  }else if(zoom<14){
    for (var i=0; i<hutou.length; i++){
	  hutou[i].hide();
    }
	for (var i=0; i<kouro.length; i++){
	  kouro[i].hide();
	}
  }
}

//------------------------------------船舶マーカーに付着する船名マーカーの定義---------------------------------------

/*
*
*
*
*
*/
function shipNameMarker(map, lat, lng, name, mmsi) {
  this.lat = lat;
  this.lng = lng;
  this.shipName = name;
  this.mmsi = mmsi;
  this.setMap(map);
}

//google.maps.OverlayViewを継承
shipNameMarker.prototype = new google.maps.OverlayView();

shipNameMarker.prototype.draw = function() {
  if (!this.div) {
    // 出力したい要素生成
    this.div = document.createElement( "div" );
    this.div.style.position = "absolute";
    this.div.style.fontSize = "100%";
    this.div.style.color = "#000";
    this.div.innerHTML = this.shipName;
    // 要素を追加する子を取得
    var panes = this.getPanes();
    // 要素追加
    panes.overlayLayer.appendChild( this.div );
  }
  // 緯度、軽度の情報を、Pixel（google.maps.Point）に変換
  var point = this.getProjection().fromLatLngToDivPixel( new google.maps.LatLng( this.lat, this.lng ) );

  // 取得したPixel情報の座標に、要素の位置を設定
  this.div.style.left = point.x + 8 + 'px';
  this.div.style.top = point.y + 8 + 'px';
}

//------------------------------------埠頭などの地名の描画---------------------------------------

function showName(name, lat, lng, map) {
  this.lat = lat;
  this.lng = lng;
  this.name = name;
  this.setMap(map);
}

//google.maps.OverlayViewを継承
showName.prototype = new google.maps.OverlayView();

showName.prototype.draw = function() {
  if (!this.div) {
    // 出力したい要素生成
    this.div = document.createElement( "div" );
    this.div.style.position = "absolute";
    this.div.style.fontSize = "100%";
    this.div.style.color = "#000";
    this.div.innerHTML = this.name;
    // 要素を追加する子を取得
    var panes = this.getPanes();
    // 要素追加
    panes.overlayLayer.appendChild( this.div );
  }
  // 緯度、軽度の情報を、Pixel（google.maps.Point）に変換
  var point = this.getProjection().fromLatLngToDivPixel( new google.maps.LatLng( this.lat, this.lng ) );

  // 取得したPixel情報の座標に、要素の位置を設定
  this.div.style.left = point.x + 'px';
  this.div.style.top = point.y + 'px';
}

/* 削除処理の実装 プログラムで実行しているところはない*/
showName.prototype.remove = function() {
  if (this.div) {
    this.div.parentNode.removeChild(this.div);
    this.div = null;
  }
}

/* 非表示処理の実装 */
showName.prototype.hide = function() {
  if (this.div) {
    this.div.style.visibility = "hidden";
  }
}

/* 表示処理の実装 */
showName.prototype.show = function() {
  if (this.div) {
    this.div.style.visibility = "visible";
  }
}

//----------------------------------------------------いかりまーく------------------------------------------------
function IkariMarker(map, lat, lng) {
  this.lat = lat;
  this.lng = lng;
  this.setMap(map);
}

//google.maps.OverlayViewを継承
IkariMarker.prototype = new google.maps.OverlayView();

IkariMarker.prototype.draw = function() {
  if (!this.div) {
    // 出力したい要素生成
    this.div = document.createElement( "div" );
    this.div.style.position = "absolute";
    this.div.style.fontSize = "100%";
    this.div.style.color = "#000";

    this.div.innerHTML = '<img src="icon/ikari.png">';
    // 要素を追加する子を取得
    var panes = this.getPanes();
    // 要素追加
    panes.overlayLayer.appendChild( this.div );
  }
  // 緯度、軽度の情報を、Pixel（google.maps.Point）に変換
  var point = this.getProjection().fromLatLngToDivPixel( new google.maps.LatLng( this.lat, this.lng ) );

  // 取得したPixel情報の座標に、要素の位置を設定
  this.div.style.left = point.x -1 + 'px';
  this.div.style.top = point.y -20 + 'px';
}

/* 非表示処理の実装 */
IkariMarker.prototype.hide = function() {
  if (this.div) {
    this.div.style.visibility = "hidden";
  }
}

/* 表示処理の実装 */
IkariMarker.prototype.show = function() {
  if (this.div) {
    this.div.style.visibility = "visible";
  }
}