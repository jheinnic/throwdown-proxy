import t from 'transducers-js'
import { chan, put, take, sleep, go, repeat } from 'medium'

/*
const numbers = chan()
const oddNumbers = chan(null, t.filter(n => n % 2))

go(async () => {
  while (true) {
    console.log('an odd number: ', await take(oddNumbers))
  }
})

go(async () => {
  while (true) {
    let n = await numbers // awaiting a channel is an implied "take"
    await put(oddNumbers, n)
  }
})
*/

const numbers = chan()
const oddNumbers = chan()
const stats = chan()

go(async () => {
  while (true) {
    let randomNum = Math.floor(Math.random() * 100)
    await put(numbers, randomNum)
    await sleep(1000)
  }
})

go(async () => {
  while (true) {
    console.log('an odd number: ', await oddNumbers)
  }
})

go(async () => {
  while (true) {
    console.log('Stats: ', await stats)
  }
})

go(async () => {
  repeat(async ({ total, odds }) => {
    put(stats, `${odds / total * 100}% odd numbers`)
    
    const n = await numbers
    if (n % 2) {
      put(oddNumbers, n)
      return { total: total + 1, odds: odds + 1 }
    } else {
      return { total: total + 1, odds }
    }
    
  }, { total: 0, odds: 0 })
})

/*
go(async () => {
  repeatTake(numbers, async (n, { total, odds }) => {
    put(stats, `${odds / total * 100}% odd numbers`)
    
    if (n % 2) {
      put(oddNumbers, n)
      return { total: total + 1, odds: odds + 1 }
    } else {
      return { total: total + 1, odds }
    }
    
  }, { total: 0, odds: 0 })
})
*/

