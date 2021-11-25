# Image Editor
An image editor built with Electron and C++ back-end addon.

<img width="1592" alt="screenshot" src="https://user-images.githubusercontent.com/51432514/140779445-df15e4f7-b017-4bb0-984a-679333f20d46.png">

### Usage
For the moment, all of the functionalities can only be found in the menu bar. For example, File > Open, with the shortcut of ⌘ O or Ctrl O.

### Roadmap

- [x] Support `.pcx`, `.bmp` image format decoding.
- [x] RGB and HSI decomposition.
- [x] Resizing. Nearest, Bilinear, (Bicubic).
- [ ] Cropping.
- [x] Rotation.
- [x] Drawing. Rectangle, Triangle, Free Drawing.
- [x] Composition. Premultiplied alpha.
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

### Note
- Header, palette has to be shown
- Rotation:
  - the entire rotated image must be shown 
  - forward and backward
- Different level of greyscale, 1, 2, 4, 8 bit
