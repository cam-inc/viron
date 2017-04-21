dmc-samplepageA
  div sample page A(通常)
  div "{JSON.stringify(routeInfo)}"
  ul
    button(type="button" onclick="{handleClickB}") Bページへ
    button(type="button" onclick="{handleClickC}") Cページへ

  script.
    import router from '../../core/router';

    handleClickB() {
      router.navigateTo('/samplepageB');
    }

    handleClickC() {
      router.navigateTo('/samplepageC/apple/grape');
    }
