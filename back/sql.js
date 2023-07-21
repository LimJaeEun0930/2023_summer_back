var mysql = require('mysql2'); 
var connection = mysql.createConnection({
  host     : '127.0.0.1',
  user     : 'root',
  password : '',
  database : 'member_info'
});

//ID,PW,AGE,EMAIL,INTRODUCTION

connection.connect();

connection.query('SELECT * FROM registered_member_info', function (error, results, fields) {
  if (error) {
    console.log(error);
  }
  console.log(results);
});
app.post('/register', function(req, response) {
    const {ID,PW,AGE,EMAIL,INTRODUCTION} = req.body;
    console.log(ID,PW,AGE,EMAIL,INTRODUCTION);
    if (ID && PW ) {
        connection.query('SELECT * FROM registered_member_info WHERE ID = ? AND PW = ? AND EMAIL = ?', [ID, PW, EMAIL],
         function(error, results, fields) {
            if (error) throw error;
            if (results.length <= 0) {
                connection.query('INSERT INTO registered_member_info (ID,PW,AGE,EMAIL,INTRODUCTION) VALUES(?,?,?,?,?)', 
                [ID,PW,AGE,EMAIL,INTRODUCTION],
                function (error, data) {
                    if (error)
                    console.log(error);
                    else
                    console.log(data);
                });
                  response.send('<script type="text/javascript">alert("회원가입을 환영합니다!"); document.location.href="/";</script>');    
            }
            //  else if(password!=password2){                
            //     response.send('<script type="text/javascript">alert("입력된 비밀번호가 서로 다릅니다."); document.location.href="/register";</script>');    
            // }
            else {
                response.send('<script type="text/javascript">alert("이미 존재하는 아이디 입니다."); document.location.href="/register";</script>');    
            }            
            response.end();
        }
        );
    } else {
        response.send('<script type="text/javascript">alert("필수 정보를 입력하세요(ID,PW)"); document.location.href="/register";</script>');    
        response.end();
    }
});

connection.end();