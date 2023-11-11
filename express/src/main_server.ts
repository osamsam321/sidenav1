const express = require('express');
const fs = require('fs');
const fsp = require('fs').promises
const path = require('path');
const multer = require('multer');
const crypto = require("crypto");
const helmet = require('helmet');
const mammoth = require('mammoth');
const sanitizeHtml = require('sanitize-html');
const port = 4201;
const host_url = 'http://localhost:' + port + "/";
var mime = require('mime');
// var main_path_folder_path = '../app_content/main_page_upload'
var main_path_folder_path = path.resolve('../main_page_upload');
//src/assets/pages/main_page_upload

var file_name = "";

// const multerFilter = (req, file, cb) => {
//   if (mime.getExtension(file) == "pdf" || ) {
//     cb(null, true);
//   } else {
//     cb(new Error("Not a PDF File!!"), false);
//   }
// };

var value = 5;
const storage = multer.diskStorage({

  destination: function (req:any, file:any, cb:CallableFunction) {
    console.log("the main path folder: " + main_path_folder_path);
    clearDirectory(main_path_folder_path);
    cb(null, main_path_folder_path) // your destination path
  },
  filename: function (req:Request, file:any, cb:CallableFunction) {
    var ext = mime.getExtension(file.mimetype);

    console.log("ext value: " + ext);
    cb(null, "main_page" +  "." +  ext);
  }

});

const app = express();



const upload = multer({ storage: storage });
const cors = require('cors');
const { throwError } = require('rxjs');
app.use(cors({
    origin: 'http://localhost:4200'
}));

// app.get("/main_page/get_uploaded_file", (req:Request,res:any) => {
//   let main_page_dir = '../main_page_upload/';
//   let file_name = '';
//   fs.readdirSync(main_page_dir).map((fileName: any) => {
//     console.log(fileName);
//     let file_path = path.join(main_page_dir, fileName);
//     console.log("file_path");
//     res.end(JSON.stringify(host_url + file_path));
//   });
// });
// // post new file PDF file to main upload folder
// app.post('/main/new_main_file_pdf/', (req:any, res:any, next:any) => {
//   //clearDirectory(main_path_folder_path);
//   next(); // Pass control to the next middleware function
// }, upload.single('file'), (req:any, res:any) => {
//   // handle the uploaded file
//   res.send({ status: 'OK' });
// });




// post new DOCX file which will be converted to html with 
// mammoth and uploaded to main upload folder

// app.post('/main/new_main_file_docx_to_html/', upload.single('file'), (req:any, res:any, next:any) => {
//   const { path: filePath, originalname } = req.file;

//   mammoth.convertToHtml({ path: filePath})
//     .then((result: { value: any; }) => {
//       clearDirectory( main_path_folder_path);
//       const html = result.value;
//       // important to sanitizeHtml file for security
//       let cleanHtml = sanitizeHtml(html);
//       const htmlFileName = "main_page.html";
//       const htmlFilePath = path.join(main_path_folder_path, htmlFileName);

//       fs.writeFileSync(htmlFilePath, cleanHtml);
//       res.send({status: 'OK'});
//     })
//     .catch((err: any)=> {
//       res.status(500).send(`An error occurred: ${err}`);
//     });
// });

// app.post('/main/new_main_file_html/', upload.single('file'), (req:any , res:any, next:any) => {
  
//   fs.readFile(req.file.path, 'utf8', (err:any, data:any) => {
//     if (err) {
//         console.error(err);
//         res.status(500).send('An error occurred while reading the file.');
//         return;
//     }

//     const htmlFileName = "main_page.html";
//     const htmlFilePath = path.join(main_path_folder_path, htmlFileName);
//     const sanitizedData = sanitizeHtml(data);
//     fs.writeFileSync(htmlFilePath, sanitizedData);
//     res.send({status:'OK'});

//     // Optionally, delete the file after reading and sanitizing
    
//   });
// });





// // send file to main
// app.get("/main/getUploadedFile/", async (req:any,res:any) => {
//   let dir = '../main_page_upload/';
//   let file_path = '';
//   fs.readdirSync(dir).map((fileName: any) => {
//     console.log(fileName);
//      file_path = path.join(dir, fileName);
//   });
  

 
//   console.log("after check file path: " + file_path);
//   const ab_file_path = path.resolve(file_path);
//   console.log("ab_file_path: " + ab_file_path);

//   fs.access(ab_file_path, fs.constants.F_OK, (err: any) => {
//     if (err) {
//       // File does not exist
//       console.log("file does not exist");
//       res.send('File does not exist.');
//     } else {
//       // File exists
//       console.log("file does exist");
//       console.log("file value" + ab_file_path);
//       res.set('Content-Type', );
//       var mimeType = mime.getType(ab_file_path);
  
//       res.setHeader('Content-Disposition', `attachment; filename="${ab_file_path.split('/').pop()}"`);
//       res.setHeader('Content-Type', mimeType);
//       res.sendFile(ab_file_path);
//     }
//   });

 

// });


// async function getFirstFilePath(dir) {
//   return fs.readdir(dir, { withFileTypes: true })
//   .then(files => {
//     const filePath = path.join(dir, files[0].name);
//     return filePath;
//   })
//   .catch(err => console.error(err));
// }
  




function clearDirectory(directory: any) {

const files = fs.readdirSync(directory);
for (const file of files) {
    fs.unlinkSync(path.join(directory, file));
}

console.log('Directory content was cleared successfully');

}
// 
 app.get('/api/get_docs_asset_file_tree', (req:any, res:any) => {
  // const rootDir = 'html-file'; // Replace with the actual root directory path


  // //const tree = buildFileTree(rootDir);
  // const tree = getFileObject(rootDir);
  // console.log(tree); // Log the tree structure to console
  // res.json(tree);
  let files = [];
  const rootFolder = 'docs_asset'; // Specify the root folder to search
  let rootObj = {name: path.basename(rootFolder), isDirectory:true, dir:rootFolder, breath: 0};
  files.push(rootObj);
  const visted_set = new Set();
  // changed to readDirectory instead of getFilesObj
  const fileObject = readDirectory(rootFolder)
    .then(result => {
      res.json(result);
    })
    .catch(error => {
      res.status(500).send(error.message);
    });
 

//   for(let file of fileObject)
//  {
//   console.log("path: " + file.dir + " name: " + file.name + " breath: " + file.breath);
//  }
  
});



async function readDirectory(dir: string, visited = new Set()) {
  const realPath = await fsp.realpath(dir);

  if (visited.has(realPath)) {
      return [];
  }

  visited.add(realPath);

  const entries = await fsp.readdir(dir, { withFileTypes: true });
  const results = await Promise.all(entries.map(async (entry: { name: string; isDirectory: () => any; isSymbolicLink: () => any; }) => {
      const fullPath = path.join(dir, entry.name);
      const isDirectory = entry.isDirectory();
      const isSymbolicLink = entry.isSymbolicLink();
      let page_url = '';
      let children = [];
      let file_ext = '';

      if (isSymbolicLink) {
          const realPath = await fsp.realpath(fullPath);
          if (!visited.has(realPath)) {
              const stat = await fsp.stat(realPath);
              if (stat.isDirectory()) {
                  children = await readDirectory(realPath, visited);
              }
          }
      } else if (isDirectory) {
          children = await readDirectory(fullPath, visited);
      }
        else if(!isDirectory)
        {
          file_ext = entry.name.substring(entry.name.lastIndexOf('.'), entry.name.length);
          page_url =  host_url + fullPath;
        }

      return {
          name: entry.name,
          isDirectory,
          file_ext,
          page_url,
          path: fullPath,
          children
      };
  }));

  return results;
}

function getFilesObj(files: { dir: any; }[], breath: number)
{
    console.log("first file: " + files[0]);
    const content_dir = files[files.length - 1].dir;
    console.log("content_dir: " + content_dir);
    const filesInDirectory = fs.readdirSync(content_dir);
    for (const file of filesInDirectory) {
      const absolute = path.join(content_dir, file);
      console.log("absolute val: " + absolute);
      if (fs.statSync(absolute).isDirectory()) {
        let url = host_url + path.join(content_dir, file)
        let dirObj = {name: path.basename(absolute), isDirectory: true, dir :absolute, 
          breath: breath + 1, url: url};
        console.log("dirObj name: " + dirObj.name);
        files.push( dirObj);
        getFilesObj(files, breath + 1);
        
       
      } else {
          let extension = absolute.split('.').pop();
          let url = host_url + path.join(content_dir, file) + "." + extension
          let fileObj = {name: path.basename(absolute), isDirectory: false, dir: absolute, 
            breath: breath + 1, extension: extension, url: url };
          console.log("content_dir name: " + content_dir.name);
          files.push(fileObj);
      }
    }
  }
    // read the directory in a tree like manner and return a list of the directory system


  
    //sort assending
// files.sort((a, b) => a.breath - b.breath);

 
//   return files;


app.get('/files',upload.single('file'),  (req: any, res: { json: (arg0: any) => void; status: (arg0: number) => { (): any; new(): any; send: { (arg0: string): void; new(): any; }; }; }) => {

  const rootFolder = 'html-file'; // Specify the root folder to search

  const visited = new Set();
  visited.add(rootFolder);

  //const fileObject = getFileObject(rootFolder);
  // if (fileObject) {
  //   res.json(fileObject);
  // } else {
  //   res.status(500).send('Error retrieving file structure.');
  // }
});




     
    // }
    //   catch (error) {
    //   }

    app.use('/main_page_upload', express.static('main_page_upload'));
    app.use('/docs_asset', express.static('docs_asset'));


app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'", "http://localhost:4200"],
    scriptSrc: ["'self'", "'unsafe-eval'"],
    workerSrc: ["'self'", "http://localhost:4200", "'blob:'"],
    styleSrc: ["'self'", "'unsafe-inline'"],
    imgSrc: ["'self'", "data:", "http://localhost:4200"],
    connectSrc: ["'self'", "http://localhost:4200", "http://localhost:4201"],
    frameSrc: ["'self'", "http://localhost:4201"],
  },
}));


  app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
