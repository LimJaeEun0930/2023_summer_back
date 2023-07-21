const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const app = express();
const jwt = require("jsonwebtoken");

app.use(express.json()); //클라이언트가 json 형식으로 데이터를 보냈을 때 처리할 수 있게 설정하는 코드
app.use(cors({
	origin: 'http://localhost:3000/login',
	methods: ['GET','POST'],
	credentials: true,
})); //브라우저의 CORS 이슈를 막기 위해 사용하는 코드

app.use(cookieParser);

app.use(express.urlencoded({ extended: false }));
dotenv.config();

var connection = mysql.createConnection({
  host     : '127.0.0.1',
  user     : 'root',
  password : '',
  database : 'member_info'
});


    connection.connect();
    // connection.query('SELECT * FROM registered_member_info', function (error, results, fields) {
    //     if (error) {
    //     console.log(error);
    //     }
    //     console.log(results);
    // });
const login = app.post('/login', (req, res) => {
        const { ID, PW } = req.body;  
        // MySQL 쿼리문 작성
        const query = 'SELECT * FROM registered_member_info WHERE ID = ? AND PW = ?';
        connection.query(query, [ID, PW], (error, results) => {
        if (error){ console.log(error); }
        if (results.length === 1) {
            // ID와 PW가 일치하는 경우 데이터를 객체로 저장하고 출력
            const user = results[0];
            console.log(user);
    
            // 이후 원하는 처리를 진행 (예: 세션 생성, 로그인 처리 등)
            const accessToken = jwt.sign(
                {
                  id: user.ID,
                },
                process.env.ACCESS_SECRET, 
                {
                  expiresIn: "1m",
                  issuer: "lim",
                }
              );
              
              const refreshToken = jwt.sign(
                {
                  id: user.ID,
                },
                process.env.REFRESH_SECRET, 
                {
                  expiresIn: "24h",
                  issuer: "lim",
                }
              );
              

            res.cookie("accessToken",accessToken,{
                secure: false,
                httpOnly: true,
            })
            res.cookie("refreshToken",refreshToken,{
                secure: false,
                httpOnly: true,
            })
            res.status(200).json('Login successful');
        } else {
            res.status(403).json('WRONG ID or PW' );
        }
        });
    });
    

    module.exports = login;