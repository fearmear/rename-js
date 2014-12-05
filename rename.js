var walk = require('walk')
var fs = require('fs')
var _path = require('path')

var from = process.argv[2]
var to = process.argv[3]

if(from === undefined || to === undefined){
  console.log('[ERROR] arguments missed. see [https://github.com/peichao01/rename-js] for more infomation.')
  return
}

var regFrom = new RegExp(from)


console.log('files need match RegExp: ' + regFrom)

var walker = walk.walk(process.cwd(), {})

walker.on('node', function(root, fileStats, next){
  var filename = _path.join(root, fileStats.name)
  if(filename.match(regFrom)){
    //filename = _path.join(process.cwd(), filename)
    var toName = filename.replace(regFrom, to)
    console.log('renaming ['+filename+'] to ['+toName+'].')
    fs.rename(filename, toName, function(err){
      if(err) throw err
      next()
    })
  }
  else{
    next()
  }
})
walker.on('end', function(){
  console.log('rename done.')
})
