# Simple Blockchain

## Installation

1. Ensure that you're on the most recent stable version of node.js (`node v18.4.0`)
1. `cd` into root path
1. `npm i`
1. `npm run start`

## Approach

I'd never built a blockchain previously, so I found a [reference](https://www.section.io/engineering-education/building-a-simple-cryptocurrency-blockchain/) online, and used it as both an aid in my understanding and as a rough scaffold to begin the project. I usually work in Typescript, so I installed that after a while of working with pure JS and watching my error checking functions expand in scope. I then went down the list of requirements, making sure all functionalities were created and checked upon.

After building out the first level of the task (a 2-user blockchain), I began to move code from the main file to individual files for components and utils. I hadn't worked with es6+ classes for a long time, so I brushed up a bit on how they work in conjunction with TS and tidied up. After several hours, it likely would've been a good idea to switch to writing unit tests, but I wanted to push further to level 2, a n-user blockchain.

During the level 2 task, I refactored the prior work to account for `n` accounts in state, and took account of the necessary places to retrofit. Upon doing so, I again went through the requirements listed.

Upon finishing level 2, I spun my gears for a long time trying to setup Webpack to ensure a single `.js` file output, where I ran into multiple dependency issues (ex: `crypto`, `uuid` packages) and was gradually getting away from the point of the exercise. I removed all Webpack-related work and polished up the work done to finish for the time being.

## Flaws / If I had more time

1. no unit tests - This is the biggest issue. I worked on this for ^8hrs (includingWebpack work), so I called it after that, but the lack of unit tests could likely show other unknown flaws. If I had more time, here's the most important parts I'd test:

- as a user, I can:
  1. initialize a blockchain
  1. add a block, which does the following:
     - references the previous hash
     - creates a new hash
     - adds a new block to the chain
     - updates state
  1. get the current balance of my account
  1. get a block at a specified address
  1. only add a certain number transactions to a block based on the blockSize
  1. create a new account by sending value to an account ID

1. the `Block`/`Blockchain` classes and their TS integration could likely be tightened up much further.
1. stronger typing for UUIDs, currently it's just a `string` type.
1. compiling is ugly and could be a lot tighter (i.e. Webpack)

Currently, this task is in a private repo; if you'd like to see the git history for further context/clarity, please feel free to reach out, thank you.
