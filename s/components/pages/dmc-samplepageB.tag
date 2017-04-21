dmc-samplepageB
  div sample page B(他ページへの遷移を事前に確認)
  div "{JSON.stringify(routeInfo)}"
  ul
    button(type="button" onclick="{handleClickA}") Aページへ
    button(type="button" onclick="{handleClickC}") Cページへ

  script.
    import router from '../../core/router';

    this.on('mount', () => {
      router.block(() => {
        return '遷移しちゃうの？？ (´・ω・`)';
      });
    });

    handleClickA() {
      router.navigateTo('/samplepageA');
    }

    handleClickC() {
      router.navigateTo('/samplepageC/orange/peach');
    }
