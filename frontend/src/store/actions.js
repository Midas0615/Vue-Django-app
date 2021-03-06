import {
  AUTH_REQUEST, AUTH_SUCCESS, AUTH_ERROR, AUTH_LOGOUT,
  SET_USER, CREATE_USER, UPDATE_USER, DELETE_USER, CHANGE_USER_PASSWORD,
  SET_OBJECTS_COUNT,
  SET_TRANSACTIONS, SET_TRANSACTION, CREATE_TRANSACTION, UPDATE_TRANSACTION, REMOVE_TRANSACTION,
  SET_ACCOUNTS, SET_ACCOUNT, CREATE_ACCOUNT, REMOVE_ACCOUNT,
  SET_JOURNAL,
  SET_CURRENCIES, ADD_CURRENCY, REMOVE_CURRENCY,
  SET_CATEGORIES, CREATE_CATEGORY, REMOVE_CATEGORY,
  SET_SUBCATEGORIES, CREATE_SUBCATEGORY, REMOVE_SUBCATEGORY,
  SET_PLACES, ADD_PLACE, REMOVE_PLACE,
} from './mutation-types.js'

import axiosInstance from '../axios.js'

const HTTP = axiosInstance;

const actions = {

  //Auth actions
  authRequest ({ commit }, data) {
    return new Promise((resolve, reject) => {
      commit(AUTH_REQUEST);
      HTTP.post('api/token/', data)
      .then((response) => {
        const token = response.data;
        localStorage.setItem('user-token', token.access);
        localStorage.setItem('user-refresh-token', token.refresh);
        axiosInstance.defaults.headers.common.Authorization = `Bearer ${token.access}`;
        commit(AUTH_SUCCESS, token);
        resolve(response);
      })
      .catch((err) => {
        commit(AUTH_ERROR);
        localStorage.removeItem('user-token');
        localStorage.removeItem('user-refresh-token');
        reject(err);
      });
    });
  },
  refreshAuthRequest({ commit }, data) {
    return new Promise((resolve, reject) => {
      commit(AUTH_REQUEST);
      HTTP.post('api/token/refresh/', data)
      .then((response) => {
        const token = response.data;
        localStorage.setItem('user-token', token.access);
        axiosInstance.defaults.headers.common.Authorization = `Bearer ${token.access}`;
        commit(AUTH_SUCCESS, token);
        resolve(response);
      })
      .catch((err) => {
        commit(AUTH_ERROR);
        localStorage.removeItem('user-token');
        localStorage.removeItem('user-refresh-token');
        reject(err);
      });
    });
  },
  authLogout ({ commit }) {
    return new Promise((resolve) => {
      commit(AUTH_LOGOUT);
      localStorage.removeItem('user-token');
      localStorage.removeItem('user-refresh-token');
      delete axiosInstance.defaults.headers.common.Authorization;
      resolve();
    })
  },
  //User actions
  async getUser({ commit }) {
    const response = await HTTP.get('users/');
    if (response.status === 200) {
      commit(SET_USER, response.data.results)
    }
  },
  createUser({ commit }, data) {
    return new Promise((resolve, reject) => {
      HTTP.post('users/create/', data)
        .then((response) => {
          commit(CREATE_USER);
          resolve(response)
        })
        .catch((error) => {
          reject(error);
        })
    })
  },
  async updateUser({ commit }, userData) {
    const response = await HTTP.put(`users/profile/${userData.id}/`, userData.data);
    if (response.status === 200) {
      commit(UPDATE_USER);
    }
  },
  async deleteUser({ commit }, userId) {
    const response = await HTTP.delete(`users/profile/${userId}/`);
    if (response.status === 204) {
      commit(DELETE_USER);
    }
  },
  async changePassword({ commit }, data) {
    const response = await HTTP.put('users/profile/change-password/', data);
    if (response.status === 204) {
      commit(CHANGE_USER_PASSWORD)
    }
  },
  //Transactions actions
  async getTransactions ({ commit }, params) {
    const response = await HTTP.get('transactions/', params);
    if (response.status === 200) {
      commit(SET_TRANSACTIONS, response.data.results);
      commit(SET_OBJECTS_COUNT, { propertyName: 'transactions', countNumber: response.data.count })
    }
  },
  async getTransaction({ commit }, transactionId) {
    const response = await HTTP.get(`transactions/${transactionId}/`)
    if (response.status === 200) {
      commit(SET_TRANSACTION, response.data)
    }
  },
  async createTransaction ({ commit }, transactionData) {
    const response = await HTTP.post('transactions/', transactionData);
    if (response.status === 201) {
      commit(CREATE_TRANSACTION, response.data)
    }
  },
  async updateTransaction ({ commit }, transactionData) {
    const response = await HTTP.put(`transactions/${transactionData.id}/`, transactionData.data);
    if (response.status === 200) {
      commit(UPDATE_TRANSACTION)
    }
  },
  async deleteTransaction ({ commit }, transactionId) {
    const response = await HTTP.delete(`transactions/${transactionId}/`);
    if (response.status === 204) {
      commit(REMOVE_TRANSACTION, transactionId)
    }
  },

  //Accounts actions
  async getAccounts ({ commit }, params) {
    const response = await HTTP.get('accounts/', params);
    if (response.status === 200) {
      commit(SET_ACCOUNTS, response.data.results || response.data);
      commit(SET_OBJECTS_COUNT, { propertyName: 'accounts', countNumber: response.data.count })
    }
  },
  async getAccount({ commit }, accountId) {
    const response = await HTTP.get(`accounts/${accountId}/`)
    if (response.status === 200) {
      commit(SET_ACCOUNT, response.data)
    }
  },
  async createAccount ({ commit }, accountData) {
    const response = await HTTP.post('accounts/', accountData);
    if (response.status === 201) {
      commit(CREATE_ACCOUNT, response.data)
    }
  },
  async updateAccount ({ dispatch }, accountData) {
    const response = await HTTP.put(`accounts/${accountData.id}/`, accountData.data);
    if (response.status === 200) {
      dispatch('getAccounts')
    }
  },
  async deleteAccount ({ commit }, accountId) {
    const response = await HTTP.delete(`accounts/${accountId}/`);
    if (response.status === 204) {
      commit(REMOVE_ACCOUNT, accountId)
    }
  },
  //Accounts Journal actions
  async getJournal ({ commit }, params) {
    const response = await HTTP.get('journal/', params);
    if (response.status == 200) {
      commit(SET_JOURNAL, response.data.results);
      commit(SET_OBJECTS_COUNT, { propertyName: 'journal', countNumber: response.data.count })
    }
  },
  //Currencies actions
  async getCurrencies ({ commit }, params) {
    const response = await HTTP.get('currencies/', params);
    if (response.status === 200) {
      commit(SET_CURRENCIES, response.data.results || response.data);
      commit(SET_OBJECTS_COUNT, { propertyName: 'currencies', countNumber: response.data.count })
    }
  },
  async addCurrency ({ commit }, currencyData) {
    const response = await HTTP.post('currencies/', currencyData);
    if (response.status === 201) {
      commit(ADD_CURRENCY, response.data)
    }
  },
  async updateCurrency ({ dispatch }, currencyData) {
    const response = await HTTP.put(`currencies/${currencyData.id}/`, currencyData.data);
    if (response.status === 200) {
      dispatch('getCurrencies')
    }
  },
  async deleteCurrency ({ commit }, currencyId) {
    const response = await HTTP.delete(`currencies/${currencyId}/`);
    if (response.status === 204) {
      commit(REMOVE_CURRENCY, currencyId)
    }
  },
  //Categories actions
  async getCategories ({ commit }, params) {
    const response = await HTTP.get('categories/', params);
    if (response.status === 200) {
      commit(SET_CATEGORIES, response.data.results || response.data);
      commit(SET_OBJECTS_COUNT, { propertyName: 'categories', countNumber: response.data.count })
    }
  },
  async createCategory ({ commit }, categoryData) {
    const response = await HTTP.post('categories/', categoryData);
    if (response.status === 201) {
      commit(CREATE_CATEGORY, response.data)
    }
  },
  async updateCategory ({ dispatch }, categoryData) {
    const response = await HTTP.put(`categories/${categoryData.id}/`, categoryData.data);
    if (response.status === 200) {
      dispatch('getCategories')
    }
  },
  async deleteCategory ({ commit }, categoryId) {
    const response = await HTTP.delete(`categories/${categoryId}/`);
    if (response.status === 204) {
      commit(REMOVE_CATEGORY, categoryId)
    }
  },
  //Subcategories actions
  async getSubcategories ({ commit }, params) {
    const response = await HTTP.get('subcategories/', params);
    if (response.status === 200) {
      commit(SET_SUBCATEGORIES, response.data.results || response.data);
      commit(SET_OBJECTS_COUNT, { propertyName: 'subcategories', countNumber: response.data.count })
    }
  },
  async createSubcategory ({ commit }, subcategoryData) {
    const response = await HTTP.post('subcategories/', subcategoryData);
    if (response.status === 201) {
      commit(CREATE_SUBCATEGORY, response.data)
    }
  },
  async updateSubcategory ({ dispatch }, subcategoryData) {
    const response = await HTTP.put(`subcategories/${subcategoryData.id}/`, subcategoryData.data);
    if (response.status === 200) {
      dispatch('getSubcategories')
    }
  },
  async deleteSubcategory({ commit }, subcategoryId) {
    const response = await HTTP.delete(`subcategories/${subcategoryId}/`);
    if (response.status === 204) {
      commit(REMOVE_SUBCATEGORY, subcategoryId)
    }
  },
  //Places actions
  getPlaces ({ commit }, params) {
    return new Promise((resolve, reject) => {
      HTTP.get('places/', params)
        .then((response) => {
          commit(SET_PLACES, response.data.results || response.data);
          commit(SET_OBJECTS_COUNT, { propertyName: 'places', countNumber: response.data.count })
          resolve(response);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  addPlace ({ commit }, placeData) {
    return new Promise((resolve, reject) => {
      HTTP.post('places/', placeData)
        .then((response) => {
          commit(ADD_PLACE, response.data);
          resolve(response);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  updatePlace ({ dispatch }, placeData) {
    return new Promise((resolve, reject) => {
      HTTP.put(`places/${placeData.id}/`, placeData.data)
        .then((response) => {
          dispatch('getPlaces');
          resolve(response);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  deletePlace ({ commit }, placeId) {
    return new Promise((resolve, reject) => {
      HTTP.delete(`places/${placeId}/`)
        .then((response) => {
          commit(REMOVE_PLACE, placeId);
          resolve(response);
        })
        .catch((err) => {
          reject(err)
        });
    });
  },
}

export default actions;
