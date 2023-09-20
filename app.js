const express = require("express");
const dotenv = require("dotenv"); 
const path = require("path"); //정적파일 관리
const nunjucks = require("nunjucks");

const indexRouter = require("./routes"); //router보낸거 받기

dotenv.config();
const app = express(); //express 함수 app에 담기

app.set('port', process.env.PORT || 8080); //.env안에 포트번호 가져옴 오류있을시 8080열어줘

app.set('view engine', 'html');//넌적스에서 읽을 값 어떤 확장자 쓸것인가?? 우린 html
nunjucks.configure('views', {
    express: app,
    watch:true //html 변경 바로 읽어드림
});//nunjucks 초기화 세팅 / views폴더에 있는값 읽어올거야

// 기본 정적폴더 세팅
app.use('/', express.static(path.join(__dirname, 'public'))); //public폴더 조인해서 쓰기
app.use(express.json());//json 정리 
app.use(express.urlencoded({extended:false})); 

//middleware로 indexRouter 실행시키키
app.use('/', indexRouter);

app.use((req,res,next)=>{ //에러처리
    const error = new Error(`${req.method} ${req.url} 라우터 없습니다`); 
    error.status = 404;
    next(error);
});
app.use((err,req,res,next)=>{ //500번 에러
    res.locals.message = err.message;
    res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});


//기본 서버 만들기
app.get("/",(req,res)=>{ //받아오기
    res.send("hello express"); 
});
app.listen(app.get("port"), ()=>{
    console.log(app.get('port')+"에서 응답을 기다리는 중...");
});
