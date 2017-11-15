import forOwn from 'mout/object/forOwn';

export default (name, funcs) => {
  const ret = {};
  forOwn(funcs, (func, id) => {
    ret[`${name}.${id}`] = func;
  });
  return ret;
};
