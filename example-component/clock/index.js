import ObjectAssign from 'object-assign';

export default function() {

  const time = new Date();
  this.month = time.getMonth();
  this.date  = time.getDate();
  this.hour  = time.getHours();
  this.min   = time.getMinutes();
  this.second= time.getSeconds();

  setInterval(() => {
      const time = new Date();
      this.month = time.getMonth();
      this.date  = time.getDate();
      this.hour  = time.getHours();
      this.min   = time.getMinutes();
      this.second= time.getSeconds();

      var hour = document.getElementsByClassName("hour");
        hour[0].style.transform = "rotate("+(this.hour*30+this.min*0.5)+"deg)";

      var minute = document.getElementsByClassName("minute");
        minute[0].style.transform = "rotate("+(this.min*6)+"deg)";

      var second = document.getElementsByClassName("second");
        second[0].style.transform = "rotate("+(this.second*6)+"deg)";

      var back_image = document.getElementsByClassName("Clock");
      console.log(Number(this.hour));
      if(Number(this.hour) > 6 && Number(this.hour) < 18){
        back_image[0].style.backgroundImage = 'url("./img/wallpaper_AM.png")';
      }else{
        back_image[0].style.backgroundImage = 'url("./img/wallpaper_PM.png")';
      }
      this.update();
    },1000
  );

  this.getWatchDial   = './img/dial.png';
  this.getWatchHour   = './img/hour.png';
  this.getWatchMinute = './img/minute.png';
  this.getWatchSecond = './img/second.png';

}
