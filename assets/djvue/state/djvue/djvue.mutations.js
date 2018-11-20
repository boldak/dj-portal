export default {
  SET_MODE (state, mode) {
    state.app.mode = mode
  },

  SET_NAME (state, name) {
    state.app.name = name
  },

  SET_USER (state, user) {
    state.app.user = user
  },

  SET_OWNER (state, owner) {
    state.app.name = owner
  },
  
  SET_CONFIG (state, config) {
    state.app.config = config
  },

  SET_ID (state, id) {
    state.app.id = id
  },

  SET_NEED_SAVE (state, value) {
    state.app.needSave = value
  }

}
