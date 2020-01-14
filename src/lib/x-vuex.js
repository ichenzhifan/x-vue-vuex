let Vue;

class Store {
  constructor(options) {
    const {
      state,
      mutations,
      actions,
      getters
    } = options;
    this.$options = options;

    // 使用vue做数据响应.
    this.state = new Vue({
      data: state
    });

    this.mutations = mutations;
    this.actions = actions;

    this.handleGetters(getters);
  }

  /**
   * 执行的是mutations中定义的处理函数.
   * @param {String} type 方法名称 
   * @param  {...any} arg 参数.
   */
  commit = (type, ...arg) => {
    const fn = this.mutations[type];
    fn && fn(this.state, ...arg);
  }

  /**
   * 执行的是actions中定义的处理函数.
   * @param {String} type 方法名称 
   * @param  {...any} arg 参数.
   */
  dispatch = (type, ...arg) => {
    const fn = this.actions[type];

    const ctx = {
      state: this.state,
      commit: this.commit,
      dispatch: this.dispatch,
      getters: this.getters
    };
    fn && fn(ctx, ...arg);
  }

  /**
   * 分别执行options.getters中定义的方法, 并把结果映射到this.getters中. getters是只读的.
   * @param {Object} getters {add: state => {}}
   */
  handleGetters = (getters) => {
    this.getters = {};

    // 利用defineProperty实现只读属性.
    // 把this.$options.getters
    Object.keys(getters).forEach(fnName => {
      const fn = getters[fnName];
      Object.defineProperty(this.getters, fnName, {
        get: () => fn(this.state)
      });
    });
  }
}

/**
 * 实现install, 通过插件的方式集成.
 * @param {Object} _Vue Vue的构造函数.
 */
const install = _Vue => {
  Vue = _Vue;

  Vue.mixin({
    beforeCreate() {
      if (this.$options.store) {
        Vue.prototype.$store = this.$options.store;
      }
    }
  });
};

// 和vuex,保持相同的使用方式. 导出Store和install两个对象.
// - new Vuex.Store()
// - Vue.use(Vuex)
export default {
  Store,
  install
};
