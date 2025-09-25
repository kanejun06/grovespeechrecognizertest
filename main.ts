//% color=#00A9A5 icon="\uf130" block="Grove Speech"
//% groups='["Events","Values"]'
namespace GroveSpeech {
    export let lastId = -1
    export let lastName = ""

    const names = [
        "Turn on the light", "Turn off the light", "Play music", "Pause", "Next", "Previous",
        "Up", "Down", "Turn on the TV", "Turn off the TV", "Increase temperature", "Decrease temperature",
        "What's the time", "Open the door", "Close the door", "Left", "Right", "Stop", "Start", "Mode 1", "Mode 2", "Go"
    ]

    let started = false
    const handlers: ((id: number, name: string) => void)[] = []

    /**
     * 内部初期化 (UARTをP1=TX, P0=RX, 9600bpsに設定)
     */
    function init() {
        if (started) return
        started = true
        serial.redirect(SerialPin.P1, SerialPin.P0, BaudRate.BaudRate9600)
        control.inBackground(function () {
            while (true) {
                const buf = serial.readBuffer(1)
                const id = buf.getNumber(NumberFormat.UInt8LE, 0)
                if (id >= 1 && id <= 22) {
                    lastId = id
                    lastName = names[id - 1]
                    for (let h of handlers) h(id, lastName)
                }
                basic.pause(5)
            }
        })
    }

    /**
     * コマンドを認識したら実行する
     */
    //% block="on speech command recognized"
    //% draggableParameters
    //% group="Events"
    export function onCommand(handler: (id: number, name: string) => void) {
        init()
        handlers.push(handler)
    }

    /**
     * 最後に認識したコマンドID (1〜22, 無ければ-1)
     */
    //% block="last command id"
    //% group="Values"
    export function getLastId(): number {
        return lastId
    }

    /**
     * 最後に認識したコマンド名 (未認識なら空文字)
     */
    //% block="last command name"
    //% group="Values"
    export function getLastName(): string {
        return lastName
    }
}
