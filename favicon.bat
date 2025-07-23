magick favicon.png -resize 256x256 -colors 256 -define 'icon:auto-resize=256,128,96,64,48,32,16' public/favicon.ico

magick favicon.png -resize 16x16 -colors 256 public/extension.favicon.png
magick favicon.png -resize 48x48 -colors 256 public/extension.management.png
magick favicon.png -resize 96x96 -colors 256 -background none -gravity center -extent 128x128 public/extension.logo.png
