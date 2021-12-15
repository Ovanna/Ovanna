const multer = require("multer");

exports.uploadFile = (image) => {
  // init multer diskstorage
  // Menentukan destination file upload
  // Menentukan nama file (rename agar tidak ada file yang sama / ganda)

  const fileName = "";
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      // cb(null, "uploads")
      cb(null, "./uploads");
    }, //Lokasi penyimpanan file
    filename: function (req, file, cb) {
      cb(null, Date.now() + "-" + file.originalname.replace(/\s/g, ""));
    },
  });

  // function untuk filter file berdasarkan type
  const fileFilter = function (req, file, cb) {
    if (file.fieldname === image) {
      if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
        req.fileValidationError = {
          message: "Only image files are allowed!",
        };
        return cb(new Error("Only image files are allowed!"), false);
      }
    }

    // if(file.fieldname === audioFile){
    //     if(!file.originalname.match(/\.(mp3)$/)){
    //         req.fileValidationError = {
    //             message: "Only video files are allowed!"
    //         };
    //         return cb(new Error("Only video files are allowed!"), false);
    //     }
    // }
    cb(null, true);
  };

  const sizeInMB = 1000;
  const maxSize = sizeInMB * 1000 * 1000; //Maximum file size in MB

  // eksekusi upload multer dan menentukan disk storage, validation dan maxfile size
  const upload = multer({
    storage,
    fileFilter,
    limits: {
      fileSize: maxSize,
    },
  }).fields([
    {
      name: image,
      maxCount: 4,
    },
    // {
    //     name: audioFile,
    //     maxCount: 1
    // }
  ]); //untuk menentukan jumlah file

  return (req, res, next) => {
    upload(req, res, function (err) {
      // Pesan error jika validasi gagal
      if (req.fileValidationError) {
        return res.status(400).send(req.fileValidationError);
      }

      // Jika file upload tidak ada
      // if(!req.files && !err){
      //     return res.status(400).send({
      //         message: "Please select files to upload"
      //     })
      // }

      if (err) {
        // Jika size melebihi batas
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).send({
            message: "Max file sized 100MB",
          });
        }
        return res.status(400).send(err);
      }

      // Jika oke dan aman lanjut ke controller
      // Akses file yang di upload melalui req.files
      return next();
    });
  };
};
