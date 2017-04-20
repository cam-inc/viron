dmc-samplepageC
  div sample page C
  div "{JSON.stringify(routeInfo)}"
  ul
    button(type="button" onclick="{handleClickA}") Aページへ
    button(type="button" onclick="{handleClickB}") Bページへ

  script.
    import router from '../../core/router';

    handleClickA() {
      router.navigateTo('/samplepageA');
    }

    handleClickB() {
      router.navigateTo('/samplepageB');
    }
