export default function() {
  this.isOpened = true;

  this.handleHeaderTap = () => {
    this.isOpened = !this.isOpened;
    this.update();
  };
}
