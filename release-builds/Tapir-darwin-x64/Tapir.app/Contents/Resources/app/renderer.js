/**
 * @fileoverview 画像の圧縮
 */

'use strict'

const fs = require('fs')
const path = require('path')
const sharp = require('sharp')
const ProgressBar = require('progressbar.js')

/** プログレスバー */
let progressbar

/**
 * プログレスバーの設定
 */
function setProgress () {
    progressbar = new ProgressBar.Circle('#progress', {
        color: '#e4cfd7',
        strokeWidth: 5,
        trailWidth: 1,
        easing: 'easeInOut',
        duration: 50,
        text: {
            autoStyleContainer: false
        },
        from: {
            color: '#297082',
            width: 5
        },
        to: {
            color: '#e4cfd7',
            width: 5
        },
        step (state, circle) {
            circle.path.setAttribute('stroke', '#297082')
            circle.path.setAttribute('stroke-width', state.width)
            const value = Math.round(circle.value() * 100)
            if (value === 0) {
                circle.setText('')
            } else {
                circle.setText(`${value}%`)
            }
        }
    });
}

const data = {
    phase: 0,
    progress: 0,
    isDrop: false,
    completeMessage: 'Complete!!',
}

const methods = {
    // resize (files) {
    //     for (file of files) {
    //         // ファイルタイプ・チェック
    //         if (!file.type.startsWith('image/')) {
    //             continue
    //         }
    //         // リサイズ情報
    //         let dir = path.dirname(file.path)
    //         let extension = path.extname(file.path)
    //         let filename = path.basename(file.path, extension)
    //         let savePath = dir + '/resize-' + filename + extension

    //         const width = parseInt(this.width)
    //         const height = parseInt(this.height)
    //         let size = {
    //             width: (width > 0) ? width : null,
    //             height: (height > 0) ? height : null,
    //             fit: (width > 0 && height > 0) ? sharp.fit.fill : null
    //         }

    //         // リサイズ
    //         sharp(file.path)
    //             .resize(size)
    //             .toBuffer()
    //             .then(data => {
    //                 fs.writeFileSync(savePath, data, 'binary')
    //             })
    //     }
    // },
    minify (files) {
        let executedCount = 0
        let len = (() => {
            let tmp = 0
            for (let file of files) {
                if (!file.type.startsWith('image/')) {
                    continue
                }
                tmp++
            }
            return tmp
        })()

        const PAR = 100
        const RATE = Math.floor(PAR / len)

        if (len === 0) {
            this.completeMessage = `Sorry...The target image can not be found.`
            this.phase = 2
            setTimeout(() => {
                this.phase = 0
            }, 1200)
            return false
        } else {
            this.completeMessage = 'Complete!!'
        }

        // 処理開始
        this.phase = 1

        setTimeout(() => {
            setProgress()
            for (let file of files) {
                // ファイルタイプ・チェック
                if (!file.type.startsWith('image/')) {
                    continue
                }

                let dir = path.dirname(file.path)
                let extension = path.extname(file.path)
                let filename = path.basename(file.path, extension)
                let savePath = dir + '/min/' + filename + extension
    
                // ディレクトリが無ければ作る
                if (!fs.existsSync(dir + '/min/')) {
                    fs.mkdirSync(dir + '/min/')
                }
    
                sharp(file.path)
                .toBuffer()
                .then(data => {
                    fs.writeFileSync(savePath, data, 'binary')
                    executedCount += 1
                    if (len === executedCount) {
                        this.progress = 100
                        progressbar.animate(1.0)
                        setTimeout(() => {
                            this.phase = 2
                            this.progress = 0
                            this.isDrop = false
                            setTimeout(() => {
                                this.phase = 0
                            }, 1200)
                        }, 200)
                    } else {
                        this.progress += RATE
                        progressbar.animate(this.progress / PAR)
                    }
                })
            }
        }, 600)
    },
    onDrop (e) {
        const files = e.dataTransfer.files
        this.minify(files)
    }
}

/**
 * 実行
 */
const app = new Vue({
    el: '#app',
    data,
    methods
})
