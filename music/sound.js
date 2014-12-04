//グローバル変数
var playCount = 0;

function sound(){
	//初回([playCount=0])以外だったら音声ファイルを巻き戻す
	if(playCount > 0){
		document.getElementById("sound-file").currentTime = 0;
	}

	//[ID:sound-file]の音声ファイルを再生[play()]する
	document.getElementById("sound-file").play();

	//初回再生が終わった判定用に[playCount]の値を0から1に変更する
	playCount = 1;
}