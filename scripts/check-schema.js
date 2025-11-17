const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./data.sqlite');

db.all("SELECT sql FROM sqlite_master WHERE type='table' AND name='user_library'", (err, rows) => {
  if (err) {
    console.error(err);
    db.close();
    process.exit(1);
  }
  console.log('Schema actual de user_library:');
  console.log(rows);
  
  db.all("PRAGMA table_info('user_library')", (err2, cols) => {
    console.log('\nColumnas:');
    console.log(cols);
    
    db.all("PRAGMA index_list('user_library')", (err3, indexes) => {
      console.log('\nÍndices:');
      console.log(indexes);
      db.close();
    });
  });
});
