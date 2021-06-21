const userNum = 30;
const userIds = [...Array(userNum).keys()].map((i) => ++i);

export const list = userIds.map((userId) => {
  return {
    name: `name_${userId}`,
    nickName: `nickname_${userId}`,
  };
});
