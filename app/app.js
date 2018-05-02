var express = require("express");
var bodyParser = require('body-parser')
var http= require('http');
var app = express();
var server = http.createServer(app);
var router = express.Router();
var mysql = require('mysql');
// var request = require('request');
var bodyParser = require('body-parser');
var options = {
  inflate: true,
  limit: '100kb',
  type: 'application/octet-stream'
};
app.use(bodyParser.raw(options));
var FileReader = require('filereader')

var ipfsAPI = require('ipfs-api');
var ipfs = ipfsAPI('/ip4/127.0.0.1/tcp/5001')
var Bufferr = require('buffer/').Buffer

var io = require('socket.io')(server);



//  Blockchain enviroment setup



var Web3 = require('web3');
var contract = require('truffle-contract');

var college_artifacts=require('../build/contracts/College.json');
var CollegeAuth = contract(college_artifacts);
var ethUtil = require('ethereumjs-util');

if (typeof web3 !== 'undefined') {
  web3 = new Web3(web3.currentProvider);
} else {
  // set the provider you want from Web3.providers
  web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
}

CollegeAuth.setProvider(web3.currentProvider);

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "lolwa",
  database: "Proj"
});



 con.connect(function(err) {
  if (err) throw err;
  console.log("Connected to mysql")
});
var urlencodedParser = bodyParser.urlencoded({ extended: false})
app.use(bodyParser.urlencoded({ extended: true })); 




// app.use(express.logger());

app.use(express.static(__dirname ));
// app.use('/assets', express.static('stuff'));
app.get('/', function(req,res){
	res.sendFile('index.html');
    // res.render('index.html')
});
app.get('/verify', function(req,res){
	res.sendFile('verify.html');
    // res.render('index.html')
});
app.get('/upload', function(req,res){
	res.sendFile('upload.html');
    // res.render('index.html')
});
app.get('/addstudent', function(req,res){
	res.sendFile('add_student.html');
	// res.render('index.html')
});

app.get('/alldoc', function(req,res){
	res.sendFile('alldoc.html');
    // res.render('index.html')
});

app.get("/login", function(req, res){
    res.sendFile('login.html');
});


app.get("/passchange", function(req, res){
    res.sendFile('passchange.html');

});
// app.get('/transaction', function(req,res){
// 	res.sendFile(__dirname + '/transaction.html')
//     // res.render('index.html')
//     CollegeAuth.myEvent({}, { fromBlock: 0, toBlock: 'latest' }).get((error, eventResult) => {
//   if (error)
//     console.log('Error in myEvent event handler: ' + error);
//   else
//     console.log('myEvent: ' + JSON.stringify(eventResult.args));
// });
// });
app.post('/verify',function(req,res){
res.sendFile(__dirname + '/show.html')
	var token_id = req.body['token-id'];
	var query1 = "select name,timestamp from token where token='"+token_id+"'";
	console.log(query1);
	con.query(query1, function (err, result, fields) {
    if (err) throw err;
    var r=result[0];
    	var hash_list=[];
 	console.log(r['timestamp']);
 	if(r['timestamp']>0){
	CollegeAuth.deployed().then(function(i){
		i.returnDocs.call(r['name']).then(function(p){
				for(var i=0;i<p.length;i++){
					hash_list.push(web3.toAscii(p[i]));
					console.log(web3.toAscii(p[i]));
					// html+='<a href="https://ipfs.io/ipfs/'+web3.toAscii(p[i])+'">'+web3.toAscii(p[i])+"</a>";
			
				}
	});
		// hash_list.push('hello');
		var try1="hello";
		 console.log(hash_list.length);
		io.on('connection',function(socket){
			socket.emit('hashid',hash_list);
			hash_list=[];

			// var token;
			// var gen_token=createRandom();
			// 	console.log(gen_token);
		});
	});
   }
   else {
   	hash_list=[];
   	hash_list.push("token expired");
   io.on('connection',function(socket){
			socket.emit('hashid',hash_list);
			hash_list=[];

			// var token;
			// var gen_token=createRandom();
			// 	console.log(gen_token);
		});
   }
});

});


app.post('/alldoc',function(req,res){
	res.sendFile(__dirname + '/alldoc.html')
		 console.log(req.body['student-id']+" "+req.body['currentProvider']);

	 var query1="SELECT password  FROM student where name='"+req.body['student-id']+"';";
   var cur_pass="";
   var flag=0;
   var html="";
  	con.query(query1, function (err, result, fields) {
    if (err) throw err;
    var r = result[0];
 	cur_pass = r["password"];
 		if(cur_pass==req.body['current-password']){
 	flag=1;

 	console.log("password match");

 	var hash_list=[];
 	
	CollegeAuth.deployed().then(function(i){
		i.returnDocs.call(req.body['student-id']).then(function(p){
				for(var i=0;i<p.length;i++){
					hash_list.push(web3.toAscii(p[i]));
					console.log(web3.toAscii(p[i]));
					// html+='<a href="https://ipfs.io/ipfs/'+web3.toAscii(p[i])+'">'+web3.toAscii(p[i])+"</a>";
			
				}
	});
		// hash_list.push('hello');
		var try1="hello";
		 console.log(hash_list.length);
		io.on('connection',function(socket){
			socket.emit('news',hash_list);
			hash_list=[];

			var token;
			// var gen_token=createRandom();
			// 	console.log(gen_token);
		});
		io.on('connection',function(socket){
		
		socket.on('token',function(data){
				console.log(data);

				var gen_token=createRandom();
				console.log(gen_token);

				var pass_update_query = "INSERT INTO token values ('"+gen_token+"',3600,'"+req.body['student-id']+"')";
 		  	console.log(pass_update_query);
    	con.query(pass_update_query,function(err,result){
    		if(err)throw err;
    		console.log(result.affectedRows+" records updated");
    	});




				socket.emit('token-back',gen_token);
			});
			});
	});
	// console.log(hash_list.length);
		// res.body = "<html> <head>Here</head><body><div>";

	// var e1=document.getElementByID('hash');
	
	// res.body+="</div></body></html>";
	// console.log(res.body);
	// console.log(html);

   }
   
});

});

app.post('/addstudent',function(req,res){
	// console.log(req.body['student-id']+" "+req.body['name']);
   CollegeAuth.deployed().then(function(i){
		i.addStudent(req.body['student-id'],req.body['name'],web3.eth.accounts[1],{from:web3.eth.accounts[0],gas:440000}).then(function(f){
			console.log("Student Added");
			// console.log(f);
		});
	});
   // res.sendFile("index.html");

});

app.post('/upload',function(req,res){
	console.log("here requ");
	console.log(req.body);
	var s_id = req.body['student-id'];
	var hash_id= req.body['url'];
	console.log(s_id+" "+hash_id);
	// saveProductToBlockchain(s_id,hash_id);
	console.log(web3.eth.accounts[0]+"byte32 ");
	console.log(web3.fromAscii(hash_id));
	// CollegeAuth.deployed().then(function(i){
	// 	i.addStudent(s_id,"bagwan",web3.eth.accounts[1],{from:web3.eth.accounts[0],gas:440000}).then(function(f){
	// 		console.log("Student Added");
	// 		// console.log(f);
	// 	});
		CollegeAuth.deployed().then(function(i){
		i.addDocument(s_id,web3.fromAscii(hash_id),web3.eth.accounts[1],{from:web3.eth.accounts[0],gas:440000}).then(function(f){
			console.log("Document Added");
		});

		
	});
	// 	CollegeAuth.deployed().then(function(i){
	// 	i.returnDocs.call(s_id).then(function(p){
	// 		p2=p;
		
	// 		console.log(Object.values(p));
	// 		console.log(typeof p);
	// 		console.log(p[1]);
	// 		console.log(p.length);
	// 		console.log(web3.toAscii(p[0]));

	// 		// console.log(web3.utils.toAscii(p[2]));
	// 			for(var i=0;i<p.length;i++)
	// 				console.log(web3.toAscii(p[i]));
	// 	// 	console.log(p);
	// 	// 	console.log(p.length);
	// 	 });
	// });
	// });



	


});
app.post("/login",function(req,res){
	res.redirect('/alldoc');
	
});
app.post("/",  function(req, res){
     // res.send('You sent the name "' + req.body + '".');
    // console.log(req.body['student-id']+" "+req.body['current-password']+" "+req.body["new-password"]);
    var query1="SELECT password  FROM student where name='"+req.body['student-id']+"';";
   var cur_pass="";
  con.query(query1, function (err, result, fields) {
    if (err) throw err;
    // console.log(result);
    // console.log();
    // var pass_json = JSON.parse(JSON.stringify(result));
    var r = result[0];
 cur_pass = r["password"];
   
    console.log(result[0])
    console.log(cur_pass);
      console.log(cur_pass+"@ "+req.body['current-password']);

     if(cur_pass==req.body['current-password']){
   	console.log("here");
    	var pass_update_query = "UPDATE student set password='"+req.body['new-password']+"';";
    	con.query(pass_update_query,function(err,result){
    		if(err)throw err;
    		console.log(result.affectedRows+" records updated");
    	});
    }
    // console.log(pass_json);
    // console.log(pass_json['password']);
    // console.log(r["password"]);
  });
  
   
  // con.end();

   res.sendFile('login.html', { root: __dirname });


});


server.listen(8000, function() {
  console.log('Example app listening on port 8000!');
});

// function shit

function createRandom() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 10; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}
