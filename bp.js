var fs = require('fs'),
    spawn = require("child_process").spawn,
    exec = require("child_process").exec,
    args = process.argv,
    action = args[2],
    useGrunt = args[3];

if (useGrunt) {
  if (useGrunt == "true" || useGrunt === true || useGrunt == "yes" || useGrunt == "y") {
    useGrunt = true;
  }
  else {
    useGrunt = false;
  }
}

function displayUsage() {
  console.log("Usage: node bp.js action [useGrunt]\n");
  console.log("Params:");
  console.log("\taction - String (install, build, watch, addAlias, update, start, help) - See Actions:");
  console.log("\t[useGrunt] - Bool (true, false) - Are we going to be using grunt instead of compass? You can exclude this parameter if false.");
  console.log("Actions:");
  console.log("\tinstall (useGrunt) - Install bower+foundation+compass or if using grunt, install bower+grunt-cli+foundation");
  console.log("\tbuild (useGrunt) - Builds the boilerplate, install npm deps, bower components, and compiling app.scss");
  console.log("\twatch (useGrunt) - Will watch for changes in the public/scss directory and compile sass files into public/css");
  console.log("\taddAlias (useGrunt) - Will add these aliases to ~/.bashrc (bp-watch, bp-update, bpstart) which quickly runs this script with your settings.");
  console.log("\tupdate - Will update Foundation in your public folder");
  console.log("\tstart - Will start our express server (app.js)");
  console.log("\thelp - Display this usage... or just don't include an action.");
}
    
function spawnChild(command, params, cwd) {
  var opts = {};
  opts.stdio = 'inherit';
  if (cwd) {
    opts.cwd = cwd;
  }
  spawn(command, params, opts);
}
  
function install(usingGrunt) {
  // install grunt
  if (usingGrunt) {
    spawnChild("npm", ["install", "-g", "bower", "grunt-cli"]);
    spawnChild("gem", ["install", "foundation"]);
    spawnChild("rm", ["-f", "config.rb"], "public/");
  }
  else {
    spawnChild("npm", ["install", "-g", "bower"]);
    spawnChild("gem", ["install","foundation"]);
    spawnChild("gem", ["install", "compass"]);
    spawnChild("rm", ["-f", "Gruntfile.js"]);
  }
}

function build(usingGrunt) {
  if (!usingGrunt) {
    spawnChild("npm", ["uninstall","grunt", "node-sass", "grunt-sass", "grunt-contrib-watch", "--save-dev"]);
  }
  exec("npm install",
    function(err, stdout, stderr) {
      if (err) {
        console.log(err);
      }
      console.log(stderr);
      console.log(stdout);
      exec("bower install", { cwd: "public/"}, 
        function(err, stdout, stderr) {
          if (err) {
            console.log(err);
          }
          console.log(stdout);
          if (usingGrunt) {
            spawnChild("grunt", ["build"]);
          }
          else {
            spawnChild("compass", ["compile"], "public/");
          }
        }
      );
    }
  );
  // Check that boilerplate is good
  fs.open('controllers/', 'r', function(err, fd) {
    if (err) {
      console.log("dir controllers/ not present. Creating...");
      fs.mkdir('controllers/', function(err) {
        if (err) { console.log(err); }
      });
    }
    else {
      fs.close(fd);
    }
  });
  fs.open('models/', 'r', function(err, fd) {
    if (err) {
      fs.mkdir('models/', function(err) {
        if (err) { console.log(err); }
      });
    }
    else {
      fs.close(fd);
    }
  });
  fs.open('node_modules', 'r', function(err, fd) {
    if (err) {
      console.log("Running npm install from ./");
    }
    else {
      fs.close(fd);
    }
  });
  fs.open('public/bower_components', 'r', function(err, fd) {
    if (err) {
      console.log("Running bower install from ./public/");
    }
    else {
      fs.close(fd);
    }
  });
  fs.open('views/', 'r', function(err, fd) {
    if (err) {
      fs.mkdir('views/', 'r', function(err) {
        if (err) { console.log(err); }
      });
    }
    else {
      fs.close(fd);
    }
  });
  
}

function watch(usingGrunt) {
  if (usingGrunt) {
    // Do we have a gruntfile?
    fs.open("Gruntfile.js", 'r', function(err, fd) {
      if (err) {
        // We dont have a gruntfile, fall back to compass
        spawnChild("compass", ["watch"], "public/");
      }
      else { 
        // It does exist, so use grunt.
        fs.close(fd);
        spawnChild("grunt", ["watch"]);
      }
    });
  }
  else {
    spawnChild("compass", ["watch"], "public/");
  }
}

function addAlias(usingGrunt) {
  exec("echo \"alias bp-update='node bp.js update\'\" >> ~/.bashrc");
  exec("echo \"alias bp-start='node bp.js start\'\" >> ~/.bashrc");
  if (usingGrunt) {
    exec("echo \"alias bp-watch='node bp.js watch true\'\" >> ~/.bashrc",
      function (err, stdout, stderr) {
        if (err) {
          console.log(err);
        }
      }
    );
  }
  else {
    exec("echo \"alias bp-watch='node bp.js watch\'\" >> ~/.bashrc",
      function (err, stdout, stderr) {
        if (err) {
          console.log(err);
        }
      }
    );
  }
  console.log("You will need to restart the shell to get the commands");
}
    
switch (action) {
  case "install":
    useGrunt ? install(useGrunt) : install();
    break;
  case "build":
    useGrunt ? build(useGrunt) : build();
    break;
  case "watch":
    useGrunt ? watch(useGrunt) : watch();
    break;
  case "update":
    spawnChild("foundation", ["update"], "public/");
    break;
  case "start":
    spawnChild("node", ["app.js"]);
    break;
  case "addAlias":
    useGrunt ? addAlias(useGrunt) : addAlias();  
    break;
  case "help":
    displayUsage();
    break;
  default:
    displayUsage();
    break;
}