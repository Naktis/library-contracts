# Library DAPP

Decentralized application with Ethereum smart contracts for borrowing books from a library.

Used Solidity, Metamask plugin, Truffle, Web3.js frameworks.


## Installation and execution

1. Install [npm](https://www.npmjs.com/), [Ganache](https://www.trufflesuite.com/ganache) and [Metamask](https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en).

2. Create a new Ganache blockchain that runs on local 8545 port.

3. Download and unzip the latest release of this repository

4. Navigate to the directory of the release

5. Install dependencies using `npm install`

6. Launch the application by typing `npm run dev`

7. Use Metamask for transaction confirmation


## Logs

Compiled with [Remix](https://remix.ethereum.org/), deployed on Ropsten Testnet.

### All available calls on Remix

![calls](src/images/readme/functions.jpg)

### Borrowing a book

![borrow](src/images/readme/borrow.jpg)

Same transaction, but viewed on [Etherscan](https://ropsten.etherscan.io/).

![borrowether](src/images/readme/etherscan.jpg)

### Returning a book

![return](src/images/readme/return.jpg)

### Retrieving the book count and a single book

![books](src/images/readme/books.jpg)