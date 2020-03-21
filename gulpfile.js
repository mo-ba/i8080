const gulp = require("gulp");
const run = require('gulp-run');
const {watch} = require('gulp');

function pegjs(cb) {
    console.log('run')
    run('npm run build:parser').exec('', ()=>{
        cb()
        console.log('done')
    });

}
function defaultTask() {
    watch('peg.src/*.pegjs', pegjs);
}

exports.default = defaultTask
