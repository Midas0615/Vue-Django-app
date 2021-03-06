import Vue from 'vue'
import Vuex from 'vuex'

import mutations from '@/store/mutations';
import actions from '@/store/actions';


Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    authUser: null,
    accessToken: localStorage.getItem('user-token') || '',
    refreshToken: localStorage.getItem('user-refresh-token') || '',
    authStatus: 'wait',
    userEvent: '',
    objectsCount: [
      { transactions: null },
      { accounts: null },
      { journal: null },
      { currencies: null },
      { categories: null },
      { subcategories: null },
      { places: null },
    ],
    transactions: [],
    transaction: null,
    accounts: [],
    account: null,
    journal: [],
    currencies: [],
    categories: [],
    subcategories: [],
    places: [],
  },
  getters: {
    authUser: state => state.authUser,
    isAuthenticated: state => !!state.accessToken,
    authStatus: state => state.authStatus,
    userEvent: state => state.userEvent,
    objectsCount: state => state.objectsCount,
    transactions: state => state.transactions,
    transaction: state => state.transaction,
    accounts: state => state.accounts,
    account: state => state.account,
    journal: state => state.journal,
    currencies: state => state.currencies,
    categories: state => state.categories,
    subcategories: state => state.subcategories,
    places: state => state.places,
  },
  mutations: Object.assign(mutations),
  actions: Object.assign(actions),
});