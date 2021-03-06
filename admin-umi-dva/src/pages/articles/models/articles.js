import * as articlesService from '../services/articles';
import { routerRedux } from 'dva/router';

export default {
  namespace: 'articles',
  state: {
    list: [],
    total: null,
    page: null,
  },
  reducers: {
    save(state, { payload: { data: list, total, page } }) {
      return { ...state, list, total, page };
    },
  },
  effects: {
    // 获取用户数据
    *fetch({ payload: { page = 1 } }, { call, put }){
      const { data } = yield call(articlesService.fetch, { page });
      yield put({
        type: 'save',
        payload: {
          data: data.data,
          total: 50,
          page: parseInt(page, 10),
        },
      });
    },
    *remove({ payload: id }, { call, put, select }) {
      yield call(articlesService.remove, id);
      const page = yield select(state => state.articles.page);
      yield put({ type: 'fetch', payload: { page } });
    },
    *patch({ payload: { id, values } }, { call, put, select }) {
      yield call(articlesService.patch, id, values);
      yield put(routerRedux.push('/articles'));
    },
    *create({ payload: values }, { call, put, select }) {
      yield call(articlesService.create, values);
      yield put(routerRedux.push('/articles'));
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/articles') {
          dispatch({ type: 'fetch', payload: query });
        }
      });
    },
  },
};
