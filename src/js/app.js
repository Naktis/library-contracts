App = {
  web3Provider: null,
  contracts: {},

  init: async function() {
    // Load books.
    $.getJSON('../books.json', function(data) {
      var booksRow = $('#booksRow');
      var bookTemplate = $('#bookTemplate');

      for (i = 0; i < data.length; i ++) {
        bookTemplate.find('.panel-title').text(data[i].name);
        bookTemplate.find('img').attr('src', data[i].picture);
        bookTemplate.find('.book-author').text(data[i].author);
        bookTemplate.find('.book-rating').text(data[i].rating);
        bookTemplate.find('.btn-borrow').attr('data-id', data[i].id);

        booksRow.append(bookTemplate.html());
      }
    });

    return await App.initWeb3();
  },

  initWeb3: async function() {
    // Modern dapp browsers...
    if (window.ethereum) {
      App.web3Provider = window.ethereum;
      try {
        // Request account access
        await window.ethereum.enable();
      } catch (error) {
        // User denied account access...
        console.error("User denied account access")
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      App.web3Provider = window.web3.currentProvider;
    }
    // If no injected web3 instance is detected, fall back to Ganache
    else {
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    }
    web3 = new Web3(App.web3Provider);

    return App.initContract();
  },

  initContract: function() {
    $.getJSON('Library.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with @truffle/contract
      var LibraryArtifact = data;
      App.contracts.Library = TruffleContract(LibraryArtifact);
    
      // Set the provider for our contract
      App.contracts.Library.setProvider(App.web3Provider);
    
      // Use our contract to retrieve and mark the borrowed books
      return App.markBorrowed();
    });

    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '.btn-borrow', App.handleBorrow);
  },

  markBorrowed: async function() {
    var libraryInstance;

    App.contracts.Library.deployed().then(async function(instance) {
      libraryInstance = instance;
      return await libraryInstance.bookCount();
    }).then(async function(borrowers) {
      for (i = 0; i < borrowers; i++) {
        borrower = await libraryInstance.books(i);
        if (borrower !== '0x0000000000000000000000000000000000000000') {
          $('.panel-book').eq(i).find('button').text('Success').attr('disabled', true);
        }
      }
    }).catch(function(err) {
      console.log(err.message);
    });
  },

  handleBorrow: function(event) {
    event.preventDefault();

    var bookId = parseInt($(event.target).data('id'));

    var libraryInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[1];

      App.contracts.Library.deployed().then(function(instance) {
        libraryInstance = instance;

        // Execute borrow as a transaction by sending account
        return libraryInstance.borrowBook(bookId, {from: account});
      }).then(function(result) {
        return App.markBorrowed();
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
