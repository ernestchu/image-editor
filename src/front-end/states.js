const { createSlice, configureStore } = require('@reduxjs/toolkit')
const { ipcMain } = require('electron')

const imageSlice = createSlice({
  name: 'image',
  initialState: {
    imageURL: null,
    isOpened: false,
    scale: 1
  },
  reducers: {
    updateImageState: (state, action) => {
      state.imageURL = action.payload.imageURL
      state.isOpened = action.payload.isOpened
      state.scale = 1
    },
    updateImageScale: (state, action) => {
      state.scale = action.payload
    }
  }
})

const { updateImageState, updateImageScale } = imageSlice.actions
const store = configureStore({
  reducer: imageSlice.reducer
})

// store.subscribe(() => console.log('Image updated'))

ipcMain.handle('update-image-state', (_, imageURL, isOpened) => {
  store.dispatch(updateImageState({
    imageURL: imageURL,
    isOpened: isOpened
  }))
})
ipcMain.handle('update-image-scale', (_, scale) => {
  store.dispatch(updateImageScale(scale))
})

ipcMain.handle('get-image-state', () => {
  return store.getState()
})

module.exports = store
// module.exports = {
//   updateImageState: updateImageState,
//   store: store
// }

