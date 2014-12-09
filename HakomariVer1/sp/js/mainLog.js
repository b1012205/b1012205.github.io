/*
* mainLog.js
* 
* log.htmlで呼びだされるmain.js。少しだけ変更がされています。
*/

var minute = 24, hour = 7, day = 26, month = 6, year = 2014;//ここを変更するときは下の2変数も変更してください
var time = 201406260724;//時間。この時間におけるデータを取り出し表示する
var date = "B20140626";//日付。参照するデータベースの名前
var ship = [];//船舶情報を格納する連想配列(キーはmmsi)
var marker = [];//マップ上に表示されているマーカーを格納する連想配列(キーはmmsi)
var currentShip = "235103359";//着目船舶のmmsi
var nameMarker =[];
var timer = null;
const NO_FLAG = 0, FLAG = 1;//NO_FLAGの時はマーカー消去のためのカウントを減らさない

//-------------------------------------------------マーカー作成・消去--------------------------------------------------------

/*
* マーカーを生成しそれがクリックされた時の処理を埋め込む関数
*
* @method createMarker
*
* @param {google.maps.LatLng} posi (マーカーの座標)
* @param {google.maps.Map} map (作成したマーカーを配置するべきマップ)
* @param {String} mmsi (どの船のマーカーかを識別するための文字列)
* @param {Number} dir (船の針路。矢印アイコンの向きを指定する際に用いる)
*
* @return {google.maps.Marker} marker (新たに生成されたマーカー)
*/
function createMarker(posi, map, mmsi, dir) {
  //マーカーの生成
  var marker = new google.maps.Marker({
  	position: posi,
	icon: {
	  path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,//デフォルトで入ってる矢印を使ってる。アイコンの形を変えたい場合ここを変える。
	  strokeColor: "#00AB00",//濃い緑色のふち
      fillColor: "#0F0",//全体の色は薄い緑
	  fillOpacity:1,//謎
	  scale:3,//大きさ。値が大きいほどアイコンも大きくなる
	  rotation:dir//向きをここで設定する
	},
	map: map//これを書かないとマップ上にマーカーがマップ上に現れない
  });
  //クリックされた時の処理を実装する
  google.maps.event.addListener(marker, "click", function() {
    marker.setIcon({//色と大きさをちょっと変える
      path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
	  strokeColor: "#ABAB00",
	  fillColor: "#FF0",//黄色
	  fillOpacity:1,
	  scale:4,//ちょい大きくする
	  rotation:dir
	});
	openAside();
	if(currentShip==mmsi){
	  currentShip=0;
	  closeAside();
	}else{
	  currentShip = mmsi;//着目船舶をクリックされた船に変える
	}
	update(NO_FLAG);//すべてのマーカーを再配置する
  });
  return marker;
}

/*
* 指定したマーカーを消す関数
*
* @method deleteMarker
* 
* @param {String} cKey(消したいマーカーのキー値)
*/
function deleteMarker(cKey){
  delete ship[cKey];
  if(marker[cKey]){
    marker[cKey].setMap(null);
    delete marker[cKey];  	
  }
  if(typeof nameMarker[cKey] === "undefined"){
  }else{
  	nameMarker[cKey].getPanes().overlayLayer.removeChild( nameMarker[cKey].div );
    delete nameMarker[cKey];
  }
}

/*
* マップ上のすべてのマーカーを消す関数
*
* @method deleteMarkerAll
*/
function deleteMarkerAll(){
  for(var key in ship){
  	deleteMarker(key);
  }
}

//--------------------------------------------------データ取得-----------------------------------------------------------

/*
* phpファイルを呼び出し、送られてきたデータを配列に格納する関数
*
* @method getInfo
*/
function getInfo(){
  $.ajax({
	url: "backend/dbAccess.php",//呼び出すファイル
    type: "POST",
	data: { time : time,
			tableName : date},//ここで指定した２つの値を呼び出すファイル側で使うことができる
	dataType: "JSON",// サーバーなどの環境によってこのオプションが必要なときがある
	success: function(arr) {//向こう側の出力結果がarrに格納されている
	//parseAr = JSON.parse(arr);//jqueryのバージョンが低い場合はこれを使う
	  for(var key in arr){
	    ship[key] = {//keyを連想配列の添え字としてもつ要素が既に存在してれば、そこに格納し、そうでなければ新しく要素を作りそこに格納
	      "lat":arr[key]["lat"],//緯度
	      "lng":arr[key]["lng"],//経度
	      "mmsi":arr[key]["mmsi"],//識別番号
	      "dir":Number(arr[key]["dir"]),//針路
		  "speed":arr[key]["speed"],//速度
		  "name":arr[key]["name"],//船名
		  "type":arr[key]["type"],//船の種類
		  "dFlag":0//非参照回数。10貯まるとこの船の情報とマーカーが削除される。ここで回数をリセットしている。
		};
	  }
    }
  });
}

function getInfoFromJSON(){
  $.ajax({
    type: 'GET',
    url: 'js/shipdata.json',
    dataType: 'json',
    success: function(json){
      for(var key in json){
	    ship[key] = {//keyを連想配列の添え字としてもつ要素が既に存在してれば、そこに格納し、そうでなければ新しく要素を作りそこに格納
          "lat":json[key].latitude,//緯度
	      "lng":json[key].longitude,//経度
	      "mmsi":json[key].mmsi,//識別番号
	      "dir":Number(json[key].truehead),
	      "dFlag":0//非参照回数。10貯まるとこの船の情報とマーカーが削除される。ここで回数をリセットしている。
        };
      }
    }
  });
}

//--------------------------------------------マップ更新------------------------------------------------------------------

/*
* マーカーをマップ上に配置する関数
* 
* @method update
*
* @param {Number} flag (一定時間参照されなくなったマーカーを消すためのカウントを減らすか減らないかを決定するもの。FLAGだと減らし、NO_FLAGだと減らさない)
*/
function update(flag){
  for(var key in ship){
	var latlng = new google.maps.LatLng(ship[key]["lat"],ship[key]["lng"]);
	if(marker[key]==null){//マーカーが作成されてなかったなら
	  marker[key] = createMarker(latlng, map, ship[key]["mmsi"], ship[key]["dir"]);//新しく作る
	  nameMarker[key] = new shipNameMarker(map, ship[key]["lat"],ship[key]["lng"],ship[key]["name"],ship[key]["mmsi"]);
	  if(ship[key]["speed"]<1){//ほぼ停止している船舶は色を変更する
		marker[key].setIcon({
		  path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
		  strokeColor: "#AB0000",
		  fillColor: "#F00",
		  fillOpacity:1,
		  scale:3,
		  rotation:ship[key]["dir"]
	    });
	  }
	}else{
	  if(key==currentShip){//着目船舶だったなら
		marker[key].setPosition(latlng);
		moveShipName(nameMarker[key],latlng);
		marker[key].setIcon({
		  path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
		  strokeColor: "#ABAB00",
		  fillColor: "#FF0",
		  fillOpacity:1,
		  scale:4,
		  rotation:ship[key]["dir"]
		});
		updateShipInfo(currentShip);
	  }else{
		marker[key].setPosition(latlng);
		moveShipName(nameMarker[key],latlng);
		marker[key].setIcon({
	      path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
	      strokeColor: "#00AB00",
		  fillColor: "#0F0",
		  fillOpacity:1,
		  scale:3,
		  rotation:ship[key]["dir"]
	    });
	    if(ship[key]["speed"]<1){
	      marker[key].setPosition(latlng);
		  moveShipName(nameMarker[key],latlng);
		  marker[key].setIcon({
		  path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
		  strokeColor: "#AB0000",
		  fillColor: "#F00",
		  fillOpacity:1,
		  scale:3,
		  rotation:ship[key]["dir"]
	    });
	  }
    }
  }
  if(flag==FLAG){
  	ship[key]["dFlag"]++;
  }
  if(ship[key]["dFlag"]>10){//十以上溜まったらその船はもうどこか遠くへ行ってしまったとみなして、マーカーと情報を消す
     deleteMarker(key);
	}
  }
}

/*
* 船名マーカーの位置を変更する関数
*
* @method moveShipName
* 
* @param {shipNameMarker} nameMarker (位置を変更するマーカー)
* @param {google.maps.LatLng} latlng (変更したい位置)
*/
function moveShipName(nameMarker, latlng){
	nameMarker.lat = latlng.lat();
	nameMarker.lng = latlng.lng();
	nameMarker.draw();
}

function updateShipInfo(crntShip){
  	var marumeLat = Math.floor(ship[crntShip]["lat"]*Math.pow(10,6))/Math.pow(10,6);//小数点第6位（？）以下を四捨五入します
    var marumeLng = Math.floor(ship[crntShip]["lng"]*Math.pow(10,6))/Math.pow(10,6);
	document.getElementById("mmsi").innerHTML="識別番号: "+ship[crntShip]["mmsi"];//着目船舶の情報を載せます
	document.getElementById("lat").innerHTML="緯度: "+marumeLat;
	document.getElementById("lng").innerHTML="経度: "+marumeLng;
	document.getElementById("dir").innerHTML="針路: "+ship[crntShip]["dir"];
	document.getElementById("velocity").innerHTML="速度: "+ship[crntShip]["speed"]+" kt";
	document.getElementById("name").innerHTML="船名: "+ship[crntShip]["name"];
	document.getElementById("type").innerHTML="種類: "+ship[crntShip]["type"];
}

//----------------------------------------時間変更-----------------------------------------------------

/*
* 時間をずらす関数。未完成。（次の月、前の月に行けるようにまだなっていない）
*
* @method timeShift
* @param {int} min (ずらす量、現時点では1か-1(1秒進むか戻るか)のみ有効)
*/
function timeShift(min){
  time += min;
  if(min >= -100 && min < 100){
    minute += min; 
  }else{
  	hour++;
  }
  if(minute>=60){
    time = time - minute + 100 + (minute - 60);
    minute = (minute - 60);
    hour++;
  }else if(minute<=-1){
    time = time + minute - 100 - (minute - 60);
    minute = 60 +(minute % 60);
    hour--;
  }
  if(hour>=24){
    time = time - 2400 + 10000;
    hour = 0;
    day++; 
  }else if(hour<=-1){
    time = time + 2400 - 10000;
    hour = 23;
    day--;
  }
  document.getElementById("logtime").innerHTML=year + "年"+ month +"月"+ day +"日"+ hour +"時"+ minute +"分"+"<br>";
  move();
}

/*
* 表示する時間を変更する関数(dateとtimeの値を変更する)
*
* @method changeTime
* 
* @param {Number} newYear (年)
* @param {Number} newMonth (月)
* @param {Number} newDay (日)
* @param {Number} newHour (時)
* @param {Number} newMinute (分)
*
*/
function changeTime(newYear,newMonth,newDay,newHour,newMinute){
	var newDate;
	if(newMonth<10){
		if(newDay<10){
			newDate = "0" + newMonth + "0" + newDay;
		}else{
			newDate = "0" + newMonth + newDay;
		}
	}else{
		if(newDay<10){
			newDate = newMonth + "0" + newDay;
		}else{
			newDate = newMonth + newDay;
		}
	}
	time = Number(newYear*100000000) + Number(newMonth*1000000) + Number(newDay*10000) + Number(newHour*100) + Number(newMinute);
	date = ("B" + newYear) + newDate;
	year = Number(newYear);
	month = Number(newMonth);
	day = Number(newDay);
	hour = Number(newHour);
	minute = Number(newMinute);
	console.log(newHour);
	console.log(newMinute);
	console.log(time);
	console.log(date);
	move();
	document.getElementById("logtime").innerHTML=year + "年"+ month +"月"+ day +"日"+ hour +"時"+ minute +"分"+"<br>";
	setTimeout("move()", 2000);
}

//--------------------------------------メイン処理-----------------------------------------------------------
/*
* いろいろまとめた関数
*
* @method move
*/
function move(){//いろいろまとめた関数
  getInfo();
  //getInfoFromJSON();
  update(FLAG);
}

function startLoop(){
  timeShift(1);
  timer = setTimeout("startLoop()", 1000);
}

function stopLoop(){
  clearTimeout(timer);
}

changeTime(logYear,logMonth,logDay,logHour,logMinute);

move();
move();
setTimeout("move()", 3000);