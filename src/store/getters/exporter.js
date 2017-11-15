import forOwn from 'mout/object/forOwn';

export default (name, funcs) => {
  const ret = {};
  forOwn(funcs, (func, id) => {
    ret[`${name}.${id}`] = (context, ...args) => {
      return func(context.state, ...args);
    };
  });
  return ret;
};
