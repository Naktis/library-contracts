// SPDX-License-Identifier: MIT
pragma solidity >=0.5.0;

contract Library {
    uint public bookCount = 8;

    struct Book {
        uint id;
        address borrower;
    }

    mapping (uint => Book) public books;
    
    event BookBorrowed(uint id, address borrower);
    event BookReturned(uint id, address borrower);

    function borrowBook(uint bookId) public {
        require(bookId >= 0 && bookId < bookCount);
        require(books[bookId].borrower == address(0));

        books[bookId].borrower = msg.sender;
        
        emit BookBorrowed(bookId, msg.sender);
    }

    function returnBook(uint bookId) public {
        require(bookId >= 0 && bookId < bookCount);
        require(books[bookId].borrower == msg.sender);

        books[bookId].borrower = address(0);
        
        emit BookReturned(bookId, msg.sender);
    }

    constructor() public {
        for (uint i = 0; i <= bookCount; i ++) {
            books[i].id = i;
            books[i].borrower = address(0);
        }
    }
}