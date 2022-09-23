// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

// Has been deployed to address: 0x554050a44e2c00518C1A6f10aF3A9502B528E353

contract BuyMeACoffee {
    error ValueCanNotBeZero();

    // Event to emit when a Memo is created.
    event NewMemo(address indexed from, uint256 timestamp, string name, string message);

    // Memo struct/
    struct Memo {
        address from;
        uint256 timestamp;
        string name;
        string message;
    }

    // List of all memos received from friends
    Memo[] memos;

    // Address of contract deployer
    address payable owner;

    //Deploy logic
    constructor() {
        owner = payable(msg.sender);
    }

    function setNewOwner(address payable _newOwner) public {
        require(owner == payable(msg.sender), "You are not the owner");
        owner = _newOwner;
    }

    /**
     * @dev buy a coffee for contract owner
     * @param _name name of the coffee buyer
     * @param _message a nice message from the coffee buyer
     */
    function buyCoffee(string calldata _name, string calldata _message) public payable {
        if (msg.value == 0) revert ValueCanNotBeZero();
        // Add the memo to storage
        memos.push(Memo(msg.sender, block.timestamp, _name, _message));

        // Emit  a log event when new memo is created
        emit NewMemo(msg.sender, block.timestamp, _name, _message);
    }

    /**
     * @dev send the entire balance stored in this contract to the owner
     */
    function withdrawTips() public {
        require(owner.send(address(this).balance));
    }

    /**
     * @dev retrive all the memos received and stored on the blockchain
     */
    function getMemos() public view returns (Memo[] memory) {
        return memos;
    }
}
