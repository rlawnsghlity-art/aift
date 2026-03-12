const express = require('express');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Neon DB 연결 설정 (Render의 환경변수 사용)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Neon 접속 시 SSL 설정이 필요합니다.
  }
});

app.get('/', async (req, res) => {
  try {
    // test 테이블에서 name 컬럼 하나를 조회하는 쿼리
    const client = await pool.connect();
    const result = await client.query('SELECT name FROM test LIMIT 1');
    
    if (result.rows.length > 0) {
      const name = result.rows[0].name;
      res.send(`<h1>HELLO ${name}</h1>`);
    } else {
      res.send('<h1>데이터가 없습니다.</h1>');
    }
    
    client.release();
  } catch (err) {
    console.error(err);
    res.status(500).send('DB 연결 오류 발생');
  }
});

app.listen(port, () => {
  console.log(`서버가 포트 ${port}에서 실행 중입니다.`);
});
