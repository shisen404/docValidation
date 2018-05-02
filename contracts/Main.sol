pragma solidity ^0.4.13;

contract Main {

 uint public productIndex;
 mapping (address => mapping(uint => Product)) stores;
 mapping (uint => address) productIdInStore;
 

 struct Product {
  uint id; //id of the product
  string name; //name of the product
  uint startPrice;// price of the product
  string imageLink; //link of the product
  string owner; //owenr of the product
 
  
 }

 struct Buy {
  address buyer;
  uint productId;
}

 function Main() public {
  productIndex = 0;
 }


 function addProductToStore(string _name,uint _startPrice,string _imageLink, string _owner) public {
  productIndex += 1;
  Product memory product = Product(productIndex, _name,_startPrice,_imageLink,_owner);
  stores[msg.sender][productIndex] = product;
  productIdInStore[productIndex] = msg.sender;
}



function getProduct(uint _productId) view public returns (uint, string, uint,string,string) {
  Product memory product = stores[productIdInStore[_productId]][_productId];
  return (product.id, product.name, product.startPrice,product.imageLink,product.owner);
}

function buy(uint _productId) public  {
  Product storage product = stores[productIdInStore[_productId]][_productId];
  msg.sender.transfer(product.startPrice);
}
}