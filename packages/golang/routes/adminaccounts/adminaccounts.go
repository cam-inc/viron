package adminaccounts

import (
	"fmt"
	"net/http"

	"github.com/cam-inc/viron/packages/golang/errors"
	"github.com/cam-inc/viron/packages/golang/helpers"

	"github.com/cam-inc/viron/packages/golang/constant"
	"github.com/cam-inc/viron/packages/golang/domains"

	externalRef0 "github.com/cam-inc/viron/packages/golang/routes/components"
)

type (
	adminaccountsImpl struct{}
)

/*
// 一覧取得(idを指定するので結果は必ず1件)
export const listById = async (
  id: string
): Promise<ListWithPager<AdminUserView>> => {
  const repository = repositoryContainer.getAdminUserRepository();
  const result = await repository.findWithPager({ id });
  const adminRoles = await Promise.all(
    result.list.map((adminUser) => listRoles(adminUser.id))
  );
  return {
    ...result,
    list: result.list.map((adminUser) =>
      formatAdminUser(adminUser, adminRoles.shift())
    ),
  };
};
*/
func (a *adminaccountsImpl) ListVironAdminAccounts(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	ctxUser := ctx.Value(constant.CTX_KEY_ADMINUSER)
	if ctxUser == nil {
		helpers.SendError(w, http.StatusInternalServerError, errors.AdminUserNotfound)
		return
	}
	user, exists := ctxUser.(*domains.AdminUser)
	if !exists {
		helpers.SendError(w, http.StatusInternalServerError, errors.AdminUserNotfound)
		return
	}
	//pager := domains.ListAccountByID(ctx, fmt.Sprintf("%d", user.ID))
	pager, err := domains.ListAdminUser(r.Context(), &domains.AdminUserConditions{ID: user.ID})
	if err != nil {
		helpers.SendError(w, http.StatusInternalServerError, err)
		return
	}
	helpers.Send(w, http.StatusOK, pager)
	//vironPager := adminusers.PagerToVironAdminUserListWithPager(pager.Page, pager.MaxPage, pager.List)
	//helpers.Send(w, http.StatusOK, vironPager)
	//w.WriteHeader(http.StatusOK)
	//fmt.Fprint(w, `{"maxPage":1,"currentPage":1,"list":[{"_id":"6106642a3f2a4f001ef73f4e","authType":"email","email":"sugiyama_yoshinori@cyberagent.co.jp","password":"3a7aa73a60cc81c55efb0da3450c07b9669f780fb32975222712b8976e4100c39f758d6cb709420d1ba8318e6dc9e16c57cbd7e76145c5e6853f19de7319eef485722b936bc8310a79d96a3c6466937c2c637df1b8c0478fabc33a4ebe21b74318a0852bf632d4fd69cf07fdc5993c73bcb463b551747d9bad7b4f0de1a83fff76aeb58d25a38225e283cb48526dcd51f91d459e508227e757636b7f3cef8fe7f41fdd4f1ed602f47eb1f5f43606fc52da31079d2f25cd9bdc229e83e428e3586089e50e8505d76a0e03ab497e004c8c9ae848d8627cdf905e27147d0e951a0782a790811beaa856b671fa7c941b16e948b41f0fe8206149dffc21a54f11bd7ac44d269ef5a651ddf79618a587f02f41fe6af6159cc4b212e3762a272fbadb814c92990661c50e9328e5cd97eabb50187099f465003f7e54accf23e1f2f80638e7582567d4f67fbafccfc335b11dae3bca35916eb5376a96273edeab5ad72c537e862747a315bdbebb24b3a0eb8f282e001f3a41a3ea60d1984892199e8abf4b59f162a69a6ae4529c432d243dbadf2f57fb188f4e1729b29be1d1ec1f1f30e8b049bc806c7449444bcf18f70857a69943df45714d5752e1d8d72e4eaecf4224e2bf6cd01b901c041982bbc074e1f0b47e0ee442f2bec0d92a5e7a3bb93f35430e16b605d312823591a1bc7ce42070f0cf5d384c0372d9003ff48413a6cf1bdc","salt":"lQIFX82A3yEiHx+xEyo6z9dvutIG533NG7f+v4PwItdLQTpCth+ribanYZ8yt9HEgGOiM1KoD2solOTgkZ5sA0lNZ7Y13M8HP+K7BsuFpw305M2//g7WyLsWNwAYIotOHjy4e8z4dv5X24jth7TFKskLaI9zAy2O87iNeNx87W4=","createdAt":1627808810,"updatedAt":1627808810,"id":"6106642a3f2a4f001ef73f4e","roleIds":["super"]}]}`)
}

/*
// 管理アカウント設定更新
export const updateVironAdminAccount = async (
  context: RouteContext
): Promise<void> => {
  if (context.user?.userId !== context.params.path.id) {
    throw forbidden();
  }

  await domainsAdminAccount.updateOneById(
    context.params.path.id,
    context.requestBody
  );
  context.res.status(204).end();
};
*/
func (a *adminaccountsImpl) UpdateVironAdminAccount(w http.ResponseWriter, r *http.Request, id externalRef0.VironIdPathParam) {
	ctx := r.Context()
	ctxUser := ctx.Value(constant.CTX_KEY_ADMINUSER)
	if ctxUser == nil {
		helpers.SendError(w, http.StatusInternalServerError, errors.AdminUserNotfound)
		return
	}
	user, exists := ctxUser.(*domains.AdminUser)
	if !exists {
		helpers.SendError(w, http.StatusInternalServerError, errors.AdminUserNotfound)
		return
	}

	if string(id) != fmt.Sprintf("%d", user.ID) {
		helpers.SendError(w, http.StatusForbidden, errors.Forbidden)
		return
	}

	payload := &VironAdminAccountUpdatePayload{}
	if err := helpers.BodyDecode(r, payload); err != nil {
		helpers.SendError(w, http.StatusInternalServerError, err)
		return
	}

	if err := domains.UpdateAccountByID(ctx, string(id), &domains.AdminAccount{Password: &payload.Password}); err != nil {
		helpers.SendError(w, http.StatusInternalServerError, err)
		return
	}
}

/*

// IDで1件更新
export const updateOneById = async (
  id: string,
  payload: AdminAccountUpdatePayload
): Promise<void> => {
  const repository = repositoryContainer.getAdminUserRepository();
  const user = await findOneById(id);
  if (!user) {
    throw adminUserNotFound();
  }

  if (user.authType === AUTH_TYPE.EMAIL) {
    await repository.updateOneById(id, genPasswordHash(payload.password));
  } else {
    throw forbidden();
  }
};

*/

func New() ServerInterface {
	return &adminaccountsImpl{}
}
