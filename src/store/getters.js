// https://vuex.vuejs.org/en/getters.html

// Vuex allows us to define "getters" in the store.
// You can think of them as computed properties for stores.
// Like computed properties, a getter's result is cached based on its dependencies,
// and will only re-evaluate when some of its dependencies have changed.

export default {
  /* Examples:
  doneTodos: state => state.todos.filter(todo => todo.done),
  // this.$store.getters.doneTodos // -> [{ id: 1, text: '...', done: true }]

  // Getters will also receive other getters as the 2nd argument:
  doneTodosCount: (state, getters) => getters.doneTodos.length,
  // this.$store.getters.doneTodosCount // -> 1

  // You can also pass arguments to getters by returning a function.
  // This is particularly useful when you want to query an array in the store:
  getTodoById: (state) => (id) => {
    return state.todos.find(todo => todo.id === id)
  }
  // this.$store.getters.getTodoById(2) // -> { id: 2, text: '...', done: false }
  */
};
