'use strict'

import { existsSync, readFileSync, readdirSync, unlinkSync, writeFileSync } from 'fs'
import * as path from 'path'

const newServer = () => {
  const rootPath = './games'

  const readMove = (movePath) => {
    const moveData = readFileSync(movePath, 'utf-8')
    const moveJSON = JSON.parse(moveData)
    return moveJSON
  }

  const readGame = (gamePath) => {
    const gameData = readFileSync(gamePath, 'utf-8')
    const gameJSON = JSON.parse(gameData)
    return gameJSON
  }

  const applyMove = (gamePath, movePath) => {
    const gameData = readGame(gamePath)
    const moveData = readMove(movePath)

    gameData.moves.push(moveData)
    console.log(`Applied move: ${moveData.player} -> ${moveData.position}`)
    return gameData
  }

  const persistMove = (gamePath, movePath) => {
    const newGameState = applyMove(gamePath, movePath)
    const JSONstate = JSON.stringify(newGameState, null, 2)
    writeFileSync(gamePath, JSONstate)
    unlinkSync(movePath)
  }

  const applyPendingMoves = (gamePath) => {
    const gameFilePath = path.join(gamePath, 'game.json')
    const pendingDir = path.join(gamePath, 'pending_moves')

    const movesPending = existsSync(pendingDir)
    const pendingFiles = readdirSync(pendingDir)
      .map((filePath) => path.join(pendingDir, filePath))

    if (pendingFiles.length < 1) {
      console.log(`${gamePath}: No moves pending`)
    } else {
      pendingFiles.forEach((moveFilePath) => {
        console.log(gameFilePath)
        console.log(moveFilePath)
        persistMove(gameFilePath, moveFilePath)
      })
    }
  }

  const serverLoop = () => {
    const gameDirectories = readdirSync(rootPath)
      .map((d) => path.join(rootPath, d))

    gameDirectories.forEach((dir) => {
      applyPendingMoves(dir)
    })

    setTimeout(serverLoop, 1000)
  }

  return {
    serverLoop
  }
}


const srv = newServer()

srv.serverLoop()