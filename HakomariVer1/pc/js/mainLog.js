/*
* mainLog.js
*
* log.htmlで呼びだされるmain.js。少しだけ変更がされています。
*/

var minute = 24, hour = 7, day = 26, month = 6, year = 2014;//ここを変更するときは下の2変数も変更してください
var time = 201406260724;//時間。この時間におけるデータを取り出し表示する
var date = "20140626";//日付。参照するデータベースの名前
var ship = [];//船舶情報を格納する連想配列(キーはmmsi)
var marker = [];//マップ上に表示されているマーカーを格納する連想配列(キーはmmsi)
var currentShip = "235103359";//着目船舶のmmsi
var nameMarker =[];
var ikariMarker = [];
var timer = null;
var displaySpeed = 1;
var searchCheck = 0;//フィルタ機能がかかっているかどうか
var shipType = ["Passenger","Cargo","Tanker","Fishing","Pleasure Craft","Tug","High speed craft","Search and Rescue Vessel","Other","rader"];
var fill = ["#0000cc","#ff6600","#00ff33","#cc33cc","#3399cc","#ff3399","#ff0","#ff0000","#666","#aaa"];
var str = ["#000066","#ff3300","#009933","#990099","#006699","#ff3333","#ABAB00","#cc0000","#333","#fff"];
var selectstr = ["#000033","#cc3300","#006633","#330033","#003399","#660000","#cc9900","#660000","#000","#000"];
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
function createMarker(posi, map, mmsi, dir, type) {
  //マーカーの
  var marker;
  var count = 0;
  var attfill = "#fff";
  var attstr = "#fff";
  for(var i = 0; i<shipType.length;i++){
  	if(type==shipType[9]){
  	  marker = new google.maps.Marker({
        position: posi,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
		  strokeColor: "#fff",
		  strokeWeight: 1,
		  fillColor: "#aaa",
		  fillOpacity:1,
		  scale:7,
		  rotation:dir
        },
        map: map//これを書かないとマップ上にマーカーがマップ上に現れない
      });
      attfill = fill[i];
      attstr = selectstr[i];
  	  count++;
  	  break;
  	}
    if(type == shipType[i]){
  	  marker = new google.maps.Marker({
        position: posi,
        icon: {
          path: google.maps.SymbolPath.FORWARD_OPEN_ARROW,
		  strokeColor: str[i],
		  strokeWeight: 1,
		  fillColor: fill[i],
		  fillOpacity:1,
		  scale:3,
		  rotation:dir
        },
        map: map//これを書かないとマップ上にマーカーがマップ上に現れない
      });
      attfill = fill[i];
      attstr = selectstr[i];
      count++;
	  continue;
    }
  }
  if(count==0){
  	var marker = new google.maps.Marker({
  	  position: posi,
	  icon: {
	    path: google.maps.SymbolPath.FORWARD_OPEN_ARROW,
		strokeColor: str[8],
		strokeWeight: 1,
		fillColor: fill[8],
		fillOpacity:1,
		scale:3,
		rotation:dir
	  },
	  map: map//これを書かないとマップ上にマーカーがマップ上に現れない
    });
    attfill = fill[8];
    attstr = selectstr[8];
  }
  if(type=="rader"){
  	//クリックされた時の処理を実装する
    google.maps.event.addListener(marker, "click", function() {
      marker.setIcon({//色と大きさをちょっと変える
          path: google.maps.SymbolPath.CIRCLE,
		  strokeColor: "#fff",
		  strokeWeight: 1,
		  fillColor: "#aaa",
		  fillOpacity:1,
		  scale:7,
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
  }else{
  	//クリックされた時の処理を実装する
    google.maps.event.addListener(marker, "click", function() {
      marker.setIcon({//色と大きさをちょっと変える
        path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
        strokeColor: attstr,
	    strokeWeight: 2,
	    fillColor: attfill,
	    fillOpacity:1,
	    scale:4,
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
  }
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
  if(typeof ikariMarker[cKey] === "undefined"){
  }else{
  	ikariMarker[cKey].getPanes().overlayLayer.removeChild( ikariMarker[cKey].div );
    delete ikariMarker[cKey];
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
	  	if(searchCheck==0){
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
	  	}else{
	  	  var f = document.filter.kind;
	  	  for(var i=0;i<8;i++){
			if(f[i].checked && arr[key]["type"] == shipType[i]){
			  ship[key] = {//keyを連想配列の添え字としてもつ要素が既に存在してれば、そこに格納し、そうでなければ新しく要素を作りそこに格納します
				  "lat":arr[key]["lat"],
				  "lng":arr[key]["lng"],
				  "mmsi":arr[key]["mmsi"],
				  "dir":Number(arr[key]["dir"]),
				  "speed":arr[key]["speed"],
				  "name":arr[key]["name"],
				  "type":arr[key]["type"],
				  "dFlag":0//リセット
				};
				break;
			  }
		    }
	  	}
	  }
    }
  });
}

function getRaderInfo(){
  $.ajax({
	url: "backend/dbAccessHattori.php",//呼び出すファイル
    type: "POST",
	data: { time : time,
			tableName : date},//ここで指定した２つの値を呼び出すファイル側で使うことができる
	dataType: "JSON",// サーバーなどの環境によってこのオプションが必要なときがある
	success: function(arr) {//向こう側の出力結果がarrに格納されている
	//parseAr = JSON.parse(arr);//jqueryのバージョンが低い場合はこれを使う
	  for(var key in arr){
	  	if(searchCheck==0){
	  	  ship[key] = {//keyを連想配列の添え字としてもつ要素が既に存在してれば、そこに格納し、そうでなければ新しく要素を作りそこに格納
	        "lat":arr[key]["lat"],//緯度
	        "lng":arr[key]["lng"],//経度
	        "mmsi":arr[key]["mmsi"],//識別番号
	        "dir":Number(arr[key]["dir"]),//針路
		    "speed":arr[key]["speed"],//速度
		    "name":"",//船名
		    "type":"rader",//船の種類
		    "dFlag":0//非参照回数。10貯まるとこの船の情報とマーカーが削除される。ここで回数をリセットしている。
		  };
	  	}else{
	  	  var f = document.filter.kind;
	  	  for(var i=0;i<8;i++){
			if(f[i].checked && arr[key]["type"] == shipType[i]){
			  ship[key] = {//keyを連想配列の添え字としてもつ要素が既に存在してれば、そこに格納し、そうでなければ新しく要素を作りそこに格納します
				  "lat":arr[key]["lat"],
				  "lng":arr[key]["lng"],
				  "mmsi":arr[key]["mmsi"],
				  "dir":Number(arr[key]["dir"]),
				  "speed":arr[key]["speed"],
				  "name":"",
				  "type":"rader",
				  "dFlag":0//リセット
				};
			  break;
			}
		  }
	  	}
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
  var attfill="#fff";
  var attstr = "#fff";
  for(var key in ship){
	var count = 0;
	var latlng = new google.maps.LatLng(ship[key]["lat"],ship[key]["lng"]);
	if(marker[key]==null){//マーカーが作成されてなかったなら
	  marker[key] = createMarker(latlng, map, ship[key]["mmsi"], ship[key]["dir"], ship[key]["type"]);//新しく作る
	  nameMarker[key] = new shipNameMarker(map, ship[key]["lat"],ship[key]["lng"],ship[key]["name"],ship[key]["mmsi"]);
	  if(ship[key]["type"]!="rader"){
	  	if(ship[key]["speed"]<1) ikariMarker[key] = new IkariMarker(map, ship[key]["lat"],ship[key]["lng"]);
	  }
	}else{
	  var to = document.filter.tospeed;
	  var from = document.filter.fromspeed;
      marker[key].setPosition(latlng);
      moveShipName(nameMarker[key],latlng);
      if(ikariMarker[key]!=null){
        moveIkari(ikariMarker[key],latlng);
      }
      if(searchCheck == 1 && to.value != "" && from.value != ""){
	    if(ship[key]["speed"] <= to.value && ship[key]["speed"] >= from.value){
		  marker[key].setIcon({
			path: google.maps.SymbolPath.FORWARD_OPEN_ARROW,
			strokeColor: str[7],
			strokeWeight: 1,
			fillColor: fill[7],
			fillOpacity:1,
			scale:3,
			rotation:ship[key]["dir"]
		  });
		  attfill=fill[7];
		  attstr=selectstr[7];
		}else{
		  marker[key].setIcon({
			path: google.maps.SymbolPath.FORWARD_OPEN_ARROW,
			strokeColor: str[8],
			strokeWeight: 1,
			fillColor: fill[8],
			fillOpacity:1,
			scale:3,
			rotation:ship[key]["dir"]
		  });
		  attfill=fill[8];
		  attstr=selectstr[8];
		}
	  }else{
        for(var i = 0; i<shipType.length;i++){
          if(ship[key]["type"]==shipType[9]){
  	        marker[key].setIcon({
                path: google.maps.SymbolPath.CIRCLE,
		        strokeColor: "#fff",
		        strokeWeight: 1,
		        fillColor: "#aaa",
		        fillOpacity:1,
		        scale:7,
		        rotation:ship[key]["dir"]
            });
            attfill = fill[i];
            attstr = selectstr[i];
  	        count++;
  	        break;
  	      }
		  if(ship[key]["type"] == shipType[i]){
			marker[key].setIcon({
			  path: google.maps.SymbolPath.FORWARD_OPEN_ARROW,
			  strokeColor: str[i],
			  strokeWeight: 1,
			  fillColor: fill[i],
			  fillOpacity:1,
			  scale:3,
			  rotation:ship[key]["dir"]
			});
			attfill=fill[i];
			attstr=selectstr[i];
			count++;
			continue;
		  }
		  if(count == 0){
			marker[key].setIcon({
			path: google.maps.SymbolPath.FORWARD_OPEN_ARROW,
			strokeColor: str[8],
			strokeWeight:1,
			fillColor: fill[8],
			fillOpacity:1,
			scale:3,
			rotation:ship[key]["dir"]
		  });
		  attfill=fill[8];
		  attstr=selectstr[8];
		}
      }
	}
	if(key == currentShip){
	  if(ship[key]["type"]=="rader"){
	    marker[key].setIcon({
          path: google.maps.SymbolPath.CIRCLE,
		  strokeColor: "#fff",
		  strokeWeight: 1,
		  fillColor: "#aaa",
		  fillOpacity:1,
		  scale:7,
		  rotation:dir
	    });
	    updateShipInfo(currentShip);
	  }else{
        marker[key].setIcon({
		  path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
		  strokeColor: attstr,
		  strokeWeight: 2,
		  fillColor: attfill,
		  fillOpacity:1,
		  scale:4,
		  rotation:ship[key]["dir"]
	    });
	    updateShipInfo(currentShip);

	  }
	}
  }
  	if(ship[key]["speed"]<1){
  	  if(ship[key]["type"]!="rader"){
  	    if(ikariMarker[key]!=null){
  	      ikariMarker[key].show();
  	    }else{
  	  	  ikariMarker[key]=new IkariMarker(map, ship[key]["lat"],ship[key]["lng"]);
  	    }
  	  }
     }else{
      if(ikariMarker[key]!=null){
  	    ikariMarker[key].hide();
  	  }
    }
  if(ship[key]["type"]=="rader"){
  	if(ship[key]["type"]>=1){
  	  deleteMarker(key);
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

function moveIkari(ikaMarker, latlng){
	ikaMarker.lat = latlng.lat();
	ikaMarker.lng = latlng.lng();
	ikaMarker.draw();
}

function updateShipInfo(crntShip){
 	var marumeLat = Math.floor(ship[crntShip]["lat"]*Math.pow(10,6))/Math.pow(10,6);//小数点第6位（？）以下を四捨五入します
    var marumeLng = Math.floor(ship[crntShip]["lng"]*Math.pow(10,6))/Math.pow(10,6);
    console.log("aa");
    if(existImage("photo/"+ship[crntShip]["mmsi"]+".jpg")){
		document.getElementById("shipimg").src = "photo/"+ship[crntShip]["mmsi"]+".jpg";
	}else{
		document.getElementById("shipimg").src = "photo/UnKnown.jpg";
	}
	document.getElementById("mmsi").innerHTML="識別番号: "+ship[crntShip]["mmsi"];//着目船舶の情報を載せます
	document.getElementById("lat").innerHTML="緯度: "+marumeLat;
	document.getElementById("lng").innerHTML="経度: "+marumeLng;
	document.getElementById("dir").innerHTML="針路: "+ship[crntShip]["dir"];
	document.getElementById("velocity").innerHTML="速度: "+ship[crntShip]["speed"]+" kt";
	document.getElementById("name").innerHTML="船名: "+ship[crntShip]["name"];
	document.getElementById("type").innerHTML="種類: "+ship[crntShip]["type"];
}

//画像有無を確認する関数
function existImage(ImageURL){
    var img = new Image();
    img.src = ImageURL;
    console.log(ImageURL);
    return img.height > 0;
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
  if((month==4 || month==6 || month==9 || month==11) && day==31){
      time = time - 310000 + 1000000;
      day = 1;
      month ++;
   }else if(day <= 0){
    time = time + 310000 - 1000000;
    month--;
   }
   if((month == 1 || month ==3 || month == 5 || month == 7 || month == 8 || month == 10 || month == 12 ) && day==32){
    time = time - 320000 + 1000000;
    console.log(time);
       day = 1;
       month ++;
   if(month==2){
     day = 28;
     time += 280000;
   }
   if(month==7){
     day = 31;
     time += 310000;
   }
   }
   if(month == 2 && day == 29){
    time = time - 290000 + 1000000;
       day = 1;
       month ++;
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
			newDate = "0" + newMonth+ "" + newDay;
		}
	}else{
		if(newDay<10){
			newDate = newMonth + "0" + newDay;
		}else{
			newDate = newMonth+ "" + newDay;
		}
	}
	time = Number(newYear*100000000) + Number(newMonth*1000000) + Number(newDay*10000) + Number(newHour*100) + Number(newMinute);
	date = ("" + newYear) + newDate;
	year = Number(newYear);
	month = Number(newMonth);
	day = Number(newDay);
	hour = Number(newHour);
	minute = Number(newMinute);
	console.log(""+ time);
    console.log(""+ date);
	move();
	document.getElementById("logtime").innerHTML=year + "年"+ month +"月"+ day +"日"+ hour +"時"+ minute +"分"+"<br>";
	setTimeout("move()", 2000);
}

function updateSpeed(){
  $(function(){
  	val = $('#slider').slider('value');
  	displaySpeed = 1;
  	for(var i = 0;i < val;i++){
  	  displaySpeed *= 2;
  	}
  });
}

//--------------------------------------------フィルター関係--------------------------------------------------------

function search(){
	var fromSpeed = eval(document.search.from-speed.value);
	var toSpeed = eval(document.serch.to-speed.value);
}

function SearchCheck(){
	if(searchCheck == 0){
		searchCheck = 1;
	}
}

//--------------------------------------メイン処理-----------------------------------------------------------
/*
* いろいろまとめた関数
*
* @method move
*/
function move(){//いろいろまとめた関数
  getInfo();
  getRaderInfo();
  //getInfoFromJSON();
  update(FLAG);
}

function startLoop(){
  updateSpeed();
  timeShift(1);
  timer = setTimeout("startLoop()", 1000/displaySpeed);
}

function stopLoop(){
  clearTimeout(timer);
}

function resetMarker(){
  getInfo();
  update(NO_FLAG);
  setTimeout("move()",1000);
}

changeTime(logYear,logMonth,logDay,logHour,logMinute);

move();
move();
setTimeout("move()", 3000);