export function RandomArr(arr:string[], length:number) {
    const RandomArray = []
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * arr.length)
        RandomArray.push(arr[randomIndex])
    }
    return RandomArray
}