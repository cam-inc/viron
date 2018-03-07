import contains from 'mout/array/contains';

export default function() {
  const split = this.opts.val.split('.');
  // Return if it dosn't have extension.
  if (split.length < 2) {
    return;
  }
  const suffix = split[split.length - 1];
  if (contains(['mp4', 'ogv', 'webm'], suffix)) {
    this.videoType = suffix;
  }
}
