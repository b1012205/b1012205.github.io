<?php
  $url = "localhost";
  $user = "root";
  $pass = "kashika11";
  $db = "raderDB";

  //$time = 201410291400;
  //$date = "20141029";
  $time = $_POST['time'];//あっちからとってきた変数
  $date = $_POST['tableName'];


  // MySQLへ接続する
  $link = mysql_connect($url,$user,$pass) or die("MySQLへの接続に失敗しました。");

  // データベースを選択する
  $sdb = mysql_select_db($db,$link) or die("データベースの選択に失敗しました。");

  // クエリを送信する
  $sql = "select * from ".("r".$date)." where Time = ".("" . $time);
  //$sql = "select * from B20140626 where time = 201406260700";

  $array_data =array();
 
  if($result = mysql_query($sql, $link)){

  //結果セットの行数を取得する
  $rows = mysql_num_rows($result);

    while($row = mysql_fetch_array($result)){
      $array_data[''.$row['NUMBER']] = array(
          'mmsi' => $row['NUMBER'],
          'lat' => $row['LATITUDE'],
          'lng' => $row['LONGITUDE'],
          'speed' => $row['SPEED'],
          'dir'=> $row['COURSE']
        );
    }

  //結果保持用メモリを開放する
  mysql_free_result($result);
  }

  // MySQLへの接続を閉じる
  mysql_close($link) or die("MySQL切断に失敗しました。");


  print json_encode($array_data);//出力結果がそのままあちらで使われます。デバックなどで別の場所で文字列等を出力するとうまくいかなくなるので注意。
?>