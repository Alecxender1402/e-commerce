import multer from 'multer';

const storage = multer.memoryStorage();

const uploadfile = multer({ storage }).array("files",10);

export default uploadfile;