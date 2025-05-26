'use strict'

import { readFileSync, readdirSync } from 'fs'
import * as path from 'path'

const readGame = (gamePath) => {
  const gameFile = path.join(gamePath, 'game.json');
  const gameData = readFileSync(gameFile, 'utf-8')
  return gameData
}

const serverLoop = () => {
  const gamesDirRoot = './games'
  const gameDirectories = readdirSync(gamesDirRoot)
    .map((d) => path.join(gamesDirRoot, d))

  gameDirectories.forEach((dir) => {
    const data = readGame(dir)
    console.log(data)
  })

  setTimeout(serverLoop, 1000)
}

serverLoop()