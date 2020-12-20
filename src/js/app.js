App = {
  loading: false,
  contracts: {},

  load: async () => {
    await App.loadWeb3()
    await App.loadAccount()
    await App.loadContract()
    await App.render()
  },

  // https://medium.com/metamask/https-medium-com-metamask-breaking-change-injecting-web3-7722797916a8
  loadWeb3: async () => {
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider
      web3 = new Web3(web3.currentProvider)
    } else {
      window.alert("Please connect to Metamask.")
    }
    // Modern dapp browsers...
    if (window.ethereum) {
      window.web3 = new Web3(ethereum)
      try {
        // Request account access if needed
        await ethereum.enable()
        // Acccounts now exposed
        web3.eth.sendTransaction({/* ... */})
      } catch (error) {
        // User denied account access...
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      App.web3Provider = web3.currentProvider
      window.web3 = new Web3(web3.currentProvider)
      // Acccounts always exposed
      web3.eth.sendTransaction({/* ... */})
    }
    // Non-dapp browsers...
    else {
      console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  },

  loadAccount: async () => {
    // Set the current blockchain account
    App.account = web3.eth.accounts[0]
  },

  loadContract: async () => {
    // Create a JavaScript version of the smart contract
    const orderList = await $.getJSON('Taxi.json')
    App.contracts.Taxi = TruffleContract(orderList)
    App.contracts.Taxi.setProvider(App.web3Provider)

    // Hydrate the smart contract with values from the blockchain
    App.orderList = await App.contracts.Taxi.deployed()
  },

  render: async () => {
    // Prevent double render
    if (App.loading) {
      return
    }

    // Update app loading state
    App.setLoading(true)

    // Render Account
    $('#account').html(App.account)

    // Render Orders
    await App.renderOrders()

    // Update loading state
    App.setLoading(false)
  },
/*
  renderOrders: async () => {
    // Load the total order count from the blockchain
    const orderCount = await App.orderList.orderCount()
    const $orderTemplate = $('.orderTemplate')

    // Render out each order with a new order template
    for (var i = 1; i <= orderCount; i++) {
      // Fetch the order data from the blockchain
      const order = await App.orderList.orders(i)
      const orderId = order[0].toNumber()
      const orderXDep = order[1]
      const orderCompleted = order[8]

      // Create the html for the order
      const $newOrderTemplate = $orderTemplate.clone()
      $newOrderTemplate.find('.content').html(orderXDep)
      $newOrderTemplate.find('input')
                      .prop('name', orderId)
                      .prop('checked', orderCompleted)
                      .on('click', App.toggleCompleted)

      // Put the order in the correct list
      if (orderCompleted) {
        $('#completedOrderList').append($newOrderTemplate)
      } else {
        $('#orderList').append($newOrderTemplate)
      }

      // Show the order
      $newOrderTemplate.show()
    }
  },

  createOrder: async () => {
    App.setLoading(true)
    const content = $('#newOrder').val()
    await App.orderList.createOrder(content)
    window.location.reload()
  },

  toggleCompleted: async (e) => {
    App.setLoading(true)
    const orderId = e.target.name
    await App.orderList.toggleCompleted(orderId)
    window.location.reload()
  },
*/
  setLoading: (boolean) => {
    App.loading = boolean
    const loader = $('#loader')
    const content = $('#content')
    if (boolean) {
      loader.show()
      content.hide()
    } else {
      loader.hide()
      content.show()
    }
  }
}

$(() => {
  $(window).load(() => {
    App.load()
  })
})
