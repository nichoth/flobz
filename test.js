import path from 'path';
const __dirname = path.dirname(new URL(import.meta.url).pathname);
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
// var through = require('through2')
var fs = require('fs')


fs.readdir(__dirname + '/public/_posts/blog', (err, files) => {
    if (err) return console.log('errrr', err)
    console.log('files', files)
})


// process.stdin
//     .pipe(through((chunk, _, cb) => {
//         var lines = chunk.toString().split('\n')
//         console.log('line', line)

//         console.log('a chunk', chunk.toString())
//         cb(null, chunk)
//     }))
//     .pipe(process.stdout)



// process.stdin.on('data', d => {
//     console.log('data in here', d.toString())
// })
