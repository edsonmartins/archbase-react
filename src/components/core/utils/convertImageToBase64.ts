export function convertImageToBase64(imgUrl:string, callback?: (dataUrl: string) => any) {
  const image = new Image()
  image.crossOrigin = 'anonymous'
  image.onload = () => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    canvas.height = image.naturalHeight
    canvas.width = image.naturalWidth
    ctx!.drawImage(image, 0, 0)
    const dataUrl = canvas.toDataURL()
    callback!(dataUrl)
  }
  image.src = imgUrl
}
