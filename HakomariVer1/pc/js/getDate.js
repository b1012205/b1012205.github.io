/*
* getDate.js
*
* 遷移元画面から、日付と日時を取得するファイル。
*/

var logYear;
var logMonth;
var logDay;
var logHour;
var logMinute;
var data = location.href.split("?")[1];
logYear = Number(data.split("&")[0]);
logMonth = Number(data.split("&")[1]);
logDay = Number(data.split("&")[2]);
logHour = Number(data.split("&")[3]);
logMinute = Number(data.split("&")[4]);