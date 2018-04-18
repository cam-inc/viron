import ObjectAssign from 'object-assign';

export default function() {

  //サイト進入時の最初の時間を格納
  const time = new Date();
  this.month = time.getMonth();
  this.date  = time.getDate();
  this.hour  = time.getHours();
  this.min   = time.getMinutes();
  this.second= time.getSeconds();

  //1000micro秒毎(1秒毎）にthis要素を更新
  setInterval(() => {

    　//時間を一秒毎に更新し直す
      const time = new Date();
      this.month = time.getMonth();
      this.date  = time.getDate();
      this.hour  = time.getHours();
      this.min   = time.getMinutes();
      this.second= time.getSeconds();

      //時針のを回す
      var hour = document.getElementsByClassName("hour");
        hour[0].style.transform = "rotate("+(this.hour*30+this.min*0.5)+"deg)";

      //分針を回す
      var minute = document.getElementsByClassName("minute");
        minute[0].style.transform = "rotate("+(this.min*6)+"deg)";

      //秒針を回す
      //var second = document.getElementsByClassName("second");
        //second[0].style.transform = "rotate("+(this.second*6)+"deg)";

      //背景画像を参照
      //一秒毎に確認しちゃうのでまた確認し直す
      var back_image = document.getElementsByClassName("Clock");

      if(Number(this.hour) > 6 && Number(this.hour) < 18){
        back_image[0].style.backgroundImage = 'url("./img/wallpaper_AM.png")';
      }else{
        back_image[0].style.backgroundImage = 'url("./img/wallpaper_PM.png")';
      }

      //最後に情報をアップデート
      this.update();
    },1000

  );

}
