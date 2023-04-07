
const randomName = (prefix, randomLength) => { 
    let nameArr = [
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 0],
        ["a", "b", "c", "d", "e", "f", "g", "h", "i", "g", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"]
    ]
    let name = prefix;
    for (var i = 0; i < randomLength; i++) {
        let index = Math.floor(Math.random() * 2);
        let zm = nameArr[index][Math.floor(Math.random() * nameArr[index].length)];
        if (index === 1) {
            if (Math.floor(Math.random() * 2) === 1) {
                zm = zm.toUpperCase();
            }
        }
        name += zm;
    }
    return name;
}
const range = len => {
  const arr = []
  for (let i = 0; i < len; i++) {
    arr.push(i)
  }
  return arr
}

const newPerson = () => {
  const statusChance = Math.random()
  return {
    firstName: randomName("",7),
    lastName: randomName("",7),
    age: Math.floor(Math.random() * 30),
    visits: Math.floor(Math.random() * 100),
    progress: Math.floor(Math.random() * 100),
    status:
      statusChance > 0.66
        ? 'relationship'
        : statusChance > 0.33
        ? 'complicated'
        : 'single',
  }
}

export default function makeData(...lens) {
  const makeDataLevel = (depth = 0) => {
    const len = lens[depth]
    return range(len).map(d => {
      return {
        ...newPerson(),
        subRows: lens[depth + 1] ? makeDataLevel(depth + 1) : undefined,
      }
    })
  }

  return makeDataLevel()
}