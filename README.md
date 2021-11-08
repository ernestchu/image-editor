# Image Editor
An image editor built with Electron and C++ back-end addon.

### Usage
For the moment, all of the functionalities can only be found in the menu bar. For example, File > Open, with the shortcut of ⌘ O or Ctrl O.

### Roadmap

- [x] Support `.pcx`, `.bmp` image format decoding.
- [x] RGB and HSI decomposition.
- [ ] Resizing. Nearest, Bilinear, Bicubic.
- [ ] Cropping.
- [ ] Rotation.
- [ ] Drawing. Rectangle, Triangle, Free Drawing.
- [ ] Composition. Premultiplied alpha.
- [ ] 2D Elastic collision simulation.

### Development
Install the node modules
```
yarn
```
Compile C++ back-end addon
```
yarn compile-back-end

or

npm run compile-back-end
```
Start the application
```
yarn start

or

npm run start 
```
