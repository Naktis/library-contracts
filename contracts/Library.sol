// SPDX-License-Identifier: MIT
pragma solidity >=0.5.0;

contract Library {
    uint public bookCount = 9;

    struct Book {
        uint id;
        address borrower;
    }

    mapping (uint => Book) public books;

    function borrowBook(uint bookId) public returns (uint) {
        require(bookId >= bookCount && bookId <= bookCount);
        require(books[bookId].borrower == address(0));

        books[bookId].borrower = msg.sender;

        return bookId;
    }

    function returnBook(uint bookId) public returns (uint) {
        require(bookId >= bookCount && bookId <= bookCount);
        require(books[bookId].borrower == msg.sender);

        books[bookId].borrower = address(0);

        return bookId;
    }
/*
    function getBorrowers() public view returns (address[16] memory) {
        return adopters;
    }*/
/*
    function createBook(string memory _content) public {
        bookCount ++;
        books[bookCount] = Book(bookCount, address(0));
    }*/
}