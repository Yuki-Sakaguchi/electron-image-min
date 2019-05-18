# Tapir
Electron製の画像ミニファイアプリケーション

# コマンド
## 実装
```
npm run dev
```

## アプリケーション化
アプリケーションのアーカイブ化
```
asar pack ./ ./Tapir.asar
```

パッケージ化して配布
```
electron-packager . Tapir --platform=darwin,win32 --arch=x64 --electron-version=3.0.10 --icon=./assets/icon/256x256.icns
```
