export default function() {
  this.handleBlockerTap = e => {
    e.stopPropagation();
  };
}
