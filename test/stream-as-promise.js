/**
 * [exports description]
 * @param  {[type]} stream [description]
 * @return {Promise}        [description]
 */
module.exports = stream => {
  return new Promise((resolve, reject) => {
    stream.on('end', () => {
      resolve()
    })

    stream.on('error', err => {
      reject(err)
    })

    const originalException = process.listeners('uncaughtException').pop()
    process.removeListener('uncaughtException', originalException)

    process.on('uncaughtException', err => {
      reject(err)
      process.listeners('uncaughtException').push(originalException)
    })

    stream.resume()
  })
}
