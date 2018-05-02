// Import the page's CSS. Webpack will know what to do with it.
import "../stylesheets/app.css";

// Import libraries we need.
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'
import ecommerce_store_artifacts from '../../build/contracts/Main.json'

var EcommerceStore = contract(ecommerce_store_artifacts);

const ipfsAPI = require('ipfs-api');
const ethUtil = require('ethereumjs-util');
var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "lolwa"
});

// const FileReader = require('fs');
// const ipfs = ipfsAPI({host: '127.0.0.1', port: '5001', protocol: 'http'});
// var reader;
const ipfs = ipfsAPI('/ip4/127.0.0.1/tcp/5001')
const Bufferr = require('buffer/').Buffer
var hash1="";
var account1="";

window.App = {
 start: function() {
  var self = this;
  EcommerceStore.setProvider(web3.currentProvider);
  renderStore();

  $("#product-image").change(function(event) {
    const file = event.target.files[0]
    console.log(file);
    var reader = new window.FileReader();
    reader.onload = function(e){
    	console.log(e.target.result);
    	let imageId;
    	var mybuf = Bufferr.from(e.target.result);
    	// // saveImageOnIpfs(e.target).then(function(id) {
    	// // 	imageId=id; q
    	// // 	console.log(imageId);
    	// })

    	ipfs.files.add(mybuf, function (err, result) {
  if (err) {
    console.log(err)
  } else {
    console.log(result[0].hash)
    hash1 = result[0].hash;
  }
})
    	// reader.result = e.target.result;
    }
    reader.readAsArrayBuffer(file);
    // console.log(reader);
    console.log(reader.result);
     });

// var uploader = new IPFSUploader(new IPFS());
// var file_input = document.getElementById("product-imagelink");
// var hash = await uploader.uploadBlob(e.target.files[0]);
// console.log("here");
// console.log( hash);

// var img_tag = document.querySelector( "#output" );
// uploader.loadImage(img_tag, hash);

  $("#student-password").submit(function(event) {
  	console.log("here");
  	
   const req = $("#student-password").serialize();
   let params = JSON.parse('{"' + req.replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}');
   let decodedParams = {}
   Object.keys(params).forEach(function(v) {
    decodedParams[v] = decodeURIComponent(decodeURI(params[v]));
   });
   console.log(params["student-id"]+" "+params["current-password"]+" "+params["new-password"]);
   var query1="SELECT password FROM student where name='"+params["student-id"]+"';";
   con.connect(function(err) {
  if (err) throw err;
  con.query(query1, function (err, result, fields) {
    if (err) throw err;
    console.log(result);
  });

});

  



   // alert(reader);
   // saveProduct(hash1, decodedParams);
   // saveProductToBlockchain(params);
   // event.preventDefault();
});

  // $("#product-buy").submit(function(event){
  // 	console.log("lolwa");
  // 	console.log(account1);
  // })
}
};

  




function renderStore() {
 EcommerceStore.deployed().then(function(i) {
  i.getProduct.call(1).then(function(p) {
   $("#product-list").append(buildProduct(p));
  });
  i.getProduct.call(2).then(function(p) {
   $("#product-list").append(buildProduct(p));
  });
  i.getProduct.call(3).then(function(p) {
   $("#product-list").append(buildProduct(p));
  });
 });
}

function buildProduct(product) {
 let node = $("<div/>");
 node.addClass("col-sm-3 text-center col-margin-bottom-1");
 node.append("<img src='https://ipfs.io/ipfs/" + product[3] + "' width='150px' />");
 node.append("<div>" + product[1]+ "</div>");
 node.append("<div>" + product[2]+ "</div>");
 // node.append("<div> Ether" + product[3]+ "</div>");
 node.append("<div>Image Link " + product[3] + "</div>");
node.append("Account No <br>"+product[4]+"</div>");
// account1=product[4];
 // /node.append(" <button type='submit' class='btn btn-primary' >Buy</button>")
 return node;
}




function saveProduct(reader, decodedParams) {
	console.log("break 1:");
	console.log(decodedParams["product-description"]);
  let imageId, descId;
  // saveImageOnIpfs(reader).then(function(id) {
    imageId = hash1;
 
    saveTextBlobOnIpfs(decodedParams["product-description"]).then(function(id) {
      descId = id;
       saveProductToBlockchain(decodedParams, imageId, descId);
    })
 
}

function saveProductToBlockchain(params) {
  console.log(params);
  console.log(hash1);
console.log("222");
console.log(web3.eth.accounts[0]);
  EcommerceStore.deployed().then(function(i) {
    i.addProductToStore(params["product-name"],web3.toWei(params["product-price"], 'ether'), hash1,web3.eth.accounts[0],{from: web3.eth.accounts[0], gas: 440000}).then(function(f) {
   console.log(f);
   $("#msg").show();
   $("#msg").html("Your product was successfully added to your store!");
  })
 });
}

window.addEventListener('load', function() {
 // Checking if Web3 has been injected by the browser (Mist/MetaMask)
 if (typeof web3 !== 'undefined') {
  console.warn("Using web3 detected from external source. If you find that your accounts don't appear or you have 0 MetaCoin, ensure you've configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask")
  // Use Mist/MetaMask's provider
  window.web3 = new Web3(web3.currentProvider);
 } else {
  console.warn("No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
  // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
  window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
 }

 App.start();
});