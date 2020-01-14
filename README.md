## 简介
上一篇文章中, 我们通过短短的不到80行代码, 实现了vue-router的核心实现, 尽管功能很low. 但也足于说明vue-router的核心原理. 
- [核心版vue-router, 仅仅只需80行代码](https://juejin.im/post/5e1c7f496fb9a02ffc375b33)

今天我们来继续vue全家桶之一的vuex核心原理和源码的解析, 我们也用不到80行的代码来实现一个简版的vuex.

## vuex使用
vuex的使用, 我们就不做过多的介绍了. 通过vue插件安装的方式. 和vue-router差不多.

## vuex中核心的几个概念.
- state: 单一状态树, 用一个对象保存全部的应用层状态. 
- mutations: 更改store的唯一方法. 是通过commit方法来提交mutation.
- actions: action提交的是mutation. 包含具体的业务逻辑.
- commit: 用于commit一个mutation
- dispatch: 用于派发一个action
- getters: state派生的一个state, 可以用于二次加工聚合.

如果对几个还不熟悉的同学, 强烈建议认真看一遍vuex的文档.
- [vuex文档](https://vuex.vuejs.org/zh/guide/state.html)

## 核心版vuex的实现.
下面的代码, 就要实现上面提到的。代码中包含详细的注释. 如有不清楚的, 麻烦对照vuex的使用一起看.

lib/x-vuex.js
``` javascript
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

```

## 其他
- 从上面的代码中可以看到, vuex是强依赖于Vue, 来做数据响应式. 也就是说vuex只能和vue一起用.
- 熟悉redux的同学, 应该知道, redux是函数式, 它不依赖任何的框架, 既可以用在react中, 也可以用在vue中.
