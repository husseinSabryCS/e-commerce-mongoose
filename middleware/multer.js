const multer = require('multer');
const multerStorage = multer.memoryStorage();
const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');
const asyncHandler = require('express-async-handler');

// دالة تصفية الملفات
exports.multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  
    
  } else {
    cb(new Error('only images allowed'), false); // استخدم Error بدلاً من ApiError
  }
};

// إعداد multer
const upload = multer({ storage: multerStorage, fileFilter: exports.multerFilter });

// تحميل صورة الفئة (يمكن استخدام نفس المنطق للمنتج)
exports.uploadCategoryImage = upload.single('image'); // تغيير 'image' إلى الاسم الفعلي للحقل في النموذج

// تغيير حجم الصورة باستخدام sharp
exports.resizeImage = asyncHandler(async (req, res, next) => {
  if (!req.file) return next();

  const filename = `product-${uuidv4()}-${Date.now()}.jpeg`;
  console.log(filename);
  
  await sharp(req.file.buffer)
    .resize(300, 300)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`uploads/${filename}`); 

  // حفظ اسم الصورة في req.body ليتم استخدامها في قاعدة البيانات
  req.body.photos = [`uploads/${filename}`];
  
  next();
});

// دالة إضافة المنتج

