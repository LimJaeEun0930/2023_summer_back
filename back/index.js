const express = require("express");
const cors = require("cors");
// const dotenv = require("dotenv");
// const cookieParser = require("cookie-parser");
// const {login,logout,accessToken,refreshToken } = require("./controller/login");
const app = express();
const mysql = require("mysql2");
// app.use(cookieParser());

const port = 8080;
//const router = require("./controller/index");
//app.use(router);
var connection = mysql.createConnection({
    host     : '127.0.0.1',
    user     : 'root',
    password : '',
    database : 'member_info'
  });
  
  

//   const bodyParser = require('body-parser');
//   app.use(bodyParser.urlencoded({ extended: false }));
  
      connection.connect();

app.use(express.json()); //클라이언트가 json 형식으로 데이터를 보냈을 때 처리할 수 있게 설정하는 코드
app.use(cors());
// app.use(cors({
// 	origin: 'http://localhost:3000/register',
// 	methods: ['GET','POST'],
// 	credentials: true,
// })); //브라우저의 CORS 이슈를 막기 위해 사용하는 코드
// app.use(cookieParser);

 app.use(express.urlencoded({ extended: false }));
// dotenv.config();

  app.post('/register', function(req, response) {
    const {ID, PW, AGE, EMAIL, INTRODUCTION} = req.body;
    console.log(ID, PW, AGE, EMAIL, INTRODUCTION);

    if (ID && PW) {
        connection.query('SELECT * FROM registered_member_info WHERE ID = ? AND PW = ? AND EMAIL = ?', [ID, PW, EMAIL],
         function(error, results, fields) {
            if (error){
                console.log(error);
                response.send('에러가 발생했습니다.'); // 에러 발생 시 응답을 보내고 종료
            } else {
                if (results.length <= 0) {
                    connection.query('INSERT INTO registered_member_info (ID, PW, AGE, EMAIL, INTRODUCTION) VALUES(?,?,?,?,?)',
                    [ID, PW, AGE, EMAIL, INTRODUCTION],
                    function (error, data) {                     if (error){
                            console.log(error);
                            response.send('에러가 발생했습니다.'); // 에러 발생 시 응답을 보내고 종료
                        } else {
                            console.log(data);
                            response.send('success'); // 회원가입 성공 시 리액트 메인 페이지로 리다이렉트
							console.log('hmm');
                        }
                    });
                } else {
                    response.send('이미 존재하는 아이디'); // 이미 존재하는 아이디인 경우 응답을 보내고 종료
                }
            }
        });
    } else {
        response.send('필수 정보를 입력해주세요(ID,PW)'); // 필수 정보 누락 시 응답을 보내고 종료
    }
});

app.post("/login",async(req,res)=>{ //실제 로그인코드는 구현실패. post요청이 잘 들어오는지 확인용.
    const {ID,PW} = req.body;
    console.log(ID,PW);
    res.send("login enter");
})
// app.post("/login",login);
// app.post("/logout",logout);
// app.get("/accessToken",accessToken);
// app.get("/refreshToken",refreshToken);
// app.post("/login", async(req,res)=>{
// 	const {ID,PW} = req.body;
// 	console.log(ID,PW);
// 	res.send("login enter");
// })

//세팅한 app을 실행시킨다.
app.listen(port,()=> {
    console.log("SERVER START");
})