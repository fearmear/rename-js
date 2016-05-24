var walk = require('walk')
var fs = require('fs')
var _path = require('path')

var fileMode, renameProcessorScript

var from = process.argv[2]
var to = process.argv[3]
var cwd = process.argv[4] ? _path.resolve(process.argv[4]) : process.cwd();

if(from === undefined || to === undefined){
	console.log('[ERROR] arguments missed. see [https://github.com/peichao01/rename-js] for more infomation.')
	return
}

if(from == '-f'){
	fileMode = true
	renameProcessorScript = to
}
else{
	var regFrom = new RegExp(from)


	console.log('files need match RegExp: ' + regFrom)
}

if (process.argv[4]) {
	console.log('context directory was set to ', cwd);
}

var walker = walk.walk(cwd, {})

walker.on('node', function(root, fileStats, next){
	var filename = _path.relative(cwd, _path.join(root, fileStats.name))

	if(fileMode){
		var processor = require(_path.join(cwd,  renameProcessorScript))
		var toName = processor(filename)
		if(typeof toName == 'string' && filename !== toName){
			rename(filename, toName, next)
		}
		// 不处理此文件
		else{
			next()
		}
	}
	else{
		if(filename.match(regFrom)){
			var toName = filename.replace(regFrom, to)
			rename(filename, toName, next)
		}
		else{
			next()
		}
	}
})
walker.on('end', function(){
	console.log('rename done.')
})

function rename(filename, toName, next){
	console.log('renaming ['+filename+'] to ['+toName+'].')
	fs.rename(_path.join(cwd, filename), _path.join(cwd, toName), function(err){
		if(err) throw err
		next()
	})
}
