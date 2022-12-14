
const { src, dest, parallel, series, watch } = require('gulp');
const gulp = require("gulp");

const sass = require('gulp-sass')(require('sass'));
const browserSync = require("browser-sync").create();
var deployCdn = require('gulp-deploy-azure-cdn');  
  
var convertEncoding = require('gulp-convert-encoding');

function deploy_web() {
    return src('public/web/**/*')
    .pipe(convertEncoding({ from: "windows1252", to: "utf8" }))
    .pipe(deployCdn({  
        containerName: '$web', // Container created in StorageAccount  
        serviceOptions: ['stacrmtswemktnewslrs', ''], // custom arguments to azure BlobService  
        folder: './', // path within container  
        deleteExistingBlobs: false, // true means recursively deleting anything under folder  
        zip: true,
        concurrentUploadThreads: 20, // number of concurrent uploads, choose best for your network condition  
        metadata: { 
            contentEncoding: 'utf-8', 
            cacheControl: 'public, max-age=1', // cache in browser  
            cacheControlHeader: 'public, max-age=1' // cache in azure CDN.  
        },  
        testRun: false // test run - means no blobs will be actually deleted or uploaded, see log messages for details  
    }));
}

function deploy_hr() {
    return src('public/hr/**/*')
    .pipe(convertEncoding({ from: "windows1252", to: "utf8" }))
    .pipe(deployCdn({  
        containerName: '$web', // Container created in StorageAccount  
        serviceOptions: ['stacrmtswemktpostullrs', ''], // custom arguments to azure BlobService  
        folder: './', // path within container  
        deleteExistingBlobs: false, // true means recursively deleting anything under folder  
        zip: true,
        concurrentUploadThreads: 20, // number of concurrent uploads, choose best for your network condition  
        metadata: { 
            contentEncoding: 'utf-8', 
            cacheControl: 'public, max-age=1', // cache in browser  
            cacheControlHeader: 'public, max-age=1' // cache in azure CDN.  
        },  
        testRun: false // test run - means no blobs will be actually deleted or uploaded, see log messages for details  
    }));
}

function deploy_cdn() {
    return src('public/_assets/**/*')
    .pipe(convertEncoding({ from: "windows1252", to: "utf8" }))
    .pipe(deployCdn({  
        containerName: '$web', // Container created in StorageAccount  
        serviceOptions: ['stacrmtswemktcdnlrs', ''], // custom arguments to azure BlobService  
        folder: './_assets', // path within container  
        deleteExistingBlobs: false, // true means recursively deleting anything under folder  
        zip: true,
        concurrentUploadThreads: 20, // number of concurrent uploads, choose best for your network condition  
        metadata: { 
            contentEncoding: 'utf-8', 
            cacheControl: 'public, max-age=1', // cache in browser  
            cacheControlHeader: 'public, max-age=1' // cache in azure CDN.  
        },  
        testRun: false // test run - means no blobs will be actually deleted or uploaded, see log messages for details  
    }));
}


function scripts(done) {
    gulp.src('src/_assets/js/**/*').pipe(gulp.dest('public/_assets/js'));
    done();
}

function style() {
    return (
        gulp
            .src('src/_assets/scss/styles.scss')
            // .pipe(sassGlob())
            .pipe(sass({outputStyle: 'expanded'}))
            .on("error", sass.logError)
            .pipe(gulp.dest('public/_assets/css'))
    );
}

function watch2(done) {
    return gulp.watch(
        "**/*", // watch everything...
        {
            ignored: [
                // ...except for things generated by the build process.
                "public/**/*",
            ]
        },
        // when something changes, rebuild + reload
        gulp.series(style, scripts)
    );
}

// function reload(done) {
//     browserSync.reload();
//     done();
// }


exports.deploy_web = deploy_web;
exports.deploy_hr = deploy_hr;
exports.deploy_cdn = deploy_cdn;
exports.style = style;
exports.scripts = scripts;
// exports.style = watch;
// exports.style = reload;

gulp.task(
    "default",
    gulp.series(watch2)
);
