import queryMenus from '@/services/menu';

export default {
  namespace: 'menu',

  state: {
    menus: [],
  },

  effects: {
    *fetchMenu(_, { call, put }) {
      // console.log("请求菜单。。。");
      const response = yield call(queryMenus);
      // console.log("fetchMenu获取的响应数据是： ", response);
      yield put({
        type: 'setupMenus',
        payload: response,
      });
    },
  },

  reducers: {
    setupMenus(state, action) {
      return {
        ...state,
        menus: action.payload,
      };
    },
  },
};
