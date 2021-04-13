import path from 'path';
const __dirname = path.dirname(new URL(import.meta.url).pathname);
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
// var through = require('through2')
var fs = require('fs')
var marked = require('marked')
var matter = require('gray-matter')



fs.readdir(__dirname + '/public/_posts/blog', (err, files) => {
    if (err) return console.log('errrr', err)
    fs.readFile(__dirname + '/public/_posts/blog/' + files[0], 'utf8', (err, file) => {
        if (err) return console.log('errrrr', err)


        console.log('matter', matter(file))
        console.log('content', matter(file).content)


        // console.log('marked', marked(file))
    })

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
