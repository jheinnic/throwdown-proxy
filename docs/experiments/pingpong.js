const { chan, put, close, take, sleep, CLOSED } = require('medium')

const player = async (name, table) => {
  while (true) {

    const ball = await take(table)
    if (ball === CLOSED) break

    ball.hits++
    console.log(`${name} ${ball.hits}`)
    if ((ball.hits%100) === 0) {
       await sleep(100)
    // } else {
    //    await sleep(1);
    }
    put(table, ball)
  }
}

const start = async () => {

  const table = chan()

  player('ping', table)
  player('pong', table)
  player('pang', table)

  put(table, { hits: 0 })
  await sleep(5000)

  close(table)
}

start()
