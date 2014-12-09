<?php
  $url = "localhost";
  $user = "root";
  $pass = "0904nori";
  $db = "DBTEST";

  //$time = 201406260700;
  //$date = "B20140626";
  $time = $_POST['time'];//あっちからとってきた変数
  $date = $_POST['tableName'];


  // MySQLへ接続する
  $link = mysql_connect($url,$user,$pass) or die("MySQLへの接続に失敗しました。");

  // データベースを選択する
  $sdb = mysql_select_db($db,$link) or die("データベースの選択に失敗しました。");

  // クエリを送信する
  $sql = "select * from ".("B".$date)." where TIME = ".("" . $time);
  //$sql = "select * from B20140626 where time = 201406260700";
  $result = mysql_query($sql, $link) or die("クエリの送信に失敗しました。<br />SQL:".$sql);

  //結果セットの行数を取得する
  $rows = mysql_num_rows($result);

  $arrayData =array();
    while($row = mysql_fetch_array($result)){
      $arrayData[''.$row['MMSI']] = array(
          'mmsi' => $row['MMSI'],
          'lat' => $row['LATITUDE'],
          'lng' => $row['LONGITUDE'],
          'dir' => $row['TRUEHEAD'],
          'speed'=> $row['SPEED']
        );
    }

  //結果保持用メモリを開放する
  mysql_free_result($result);

  $sql = "select * from SHIPNAME";

  $result = mysql_query($sql, $link) or die("クエリの送信に失敗しました。<br />SQL:".$sql);

  while($row = mysql_fetch_array($result)){
    foreach($arrayData as $mmsi => $array){
      if($mmsi == ''.$row['MMSI']){
        $arrayData[$mmsi] += array('name' => $row['NAME']);
        $arrayData[$mmsi] += array('type' => $row['TYPE']);
      }
    }
  }

  // MySQLへの接続を閉じる
  mysql_close($link) or die("MySQL切断に失敗しました。");

  print json_encode($arrayData);//出力結果がそのままあちらで使われます。デバックなどで別の場所で文字列等を出力するとうまくいかなくなるので注意。
?>