import { extname } from 'path';
import { WriteResponse } from './shared/response';
import * as fs from 'fs';

export const editFileName = (req, file, callback) => {
  // Customize the filename as per your requirement
  const randomName = Array(32)
    .fill(null)
    .map(() => Math.round(Math.random() * 16).toString(16))
    .join('');
  const extension = extname(file.originalname);
  callback(null, `${randomName}${extension}`);
};

export const PaginationQuery = (field): any => {
  var filters = {};
  field.map((i) => {
    if (i.value != null && i.value != undefined) {
      switch (i.operator) {
        case 'IN':
          const lvalue = i.value.split(' ');

          filters[i.key] = lvalue;
          break;
        case 'LIKE':
          i.value = i.value != null ? `%${i.value}%` : '';
          filters[i.key] = i.value;
          break;
        default:
          filters[i.key] = i.value;
          break;
      }
    }
  });
  return filters;
};

export const ChecktFileExtension = (type, filename) => {
  let passportImage_extensions = {
    jpg: 1,
    jpeg: 1,
    png: 1,
    gif: 1,
    bmp: 1,
    tif: 1,
    tiff: 1,
    svg: 1,
    heic: 1,
    heif: 1,
    pdf: 1,
  };
  let userImage_extensions = {
    jpg: 1,
    jpeg: 1,
    png: 1,
    gif: 1,
    bmp: 1,
    tif: 1,
    tiff: 1,
    svg: 1,
    heic: 1,
    heif: 1,
    pdf: 1,
  };
  let extension;
  if (type == 'passportImage') {
    extension = passportImage_extensions;
  }
  if (type == 'userImage') {
    extension = userImage_extensions;
  }
  let passportimageName = filename.split('.');
  if (!extension[passportimageName?.[1]?.toLowerCase()]) {
    return true;
  } else {
    return false;
  }
};

export const checkFileSize = (size: number) => {
  return size > 5000000;
};
export function validateAudioFile(file: Express.Multer.File): boolean {
  if (!file) {
    return false; // No file provided
  }

  const allowedExtensions = ['jpg',
  'jpeg',
  'png',
  'gif',
  'bmp',
  'tif',
  'tiff',
  'svg',
  'mp4',
  'mov',
  'wmv',
  'avi',
  'avchd',
  'flv',
  'f4v',
  'swf',
  'mkv',
  'webm',
  'mpeg-2','heic','heif','pdf'];
  const fileExtension = file.originalname.split('.').pop()?.toLowerCase();

  if (!allowedExtensions.includes(fileExtension)) {
    return false; // Invalid file extension
  }

  return true;
}

export function validateImageFile(file: Express.Multer.File): boolean {
  if (!file) {
    return false; // No file provided
  }

  const allowedExtensions = [
    'jpg',
    'jpeg',
    'png',
    'gif',
    'bmp',
    'tif',
    'tiff',
    'svg',
    'mp4',
    'mov',
    'wmv',
    'avi',
    'avchd',
    'flv',
    'f4v',
    'swf',
    'mkv',
    'webm',
    'mpeg-2',
    'heic',
    'heif',
    'pdf',
  ];
  const fileExtension = file.originalname.split('.').pop()?.toLowerCase();

  if (!allowedExtensions.includes(fileExtension)) {
    return false; // Invalid file extension
  }

  return true;
}

export const deletefile = (path) => {
  let filepath = './upload/' + `${path}`;
  fs.unlink(filepath, (err) => {
    if (err) {
      console.log(err.message);
      return;
    }
    console.log('image deleted successfully');
  });
};

// export const IsVideoFile = (filePath: string): boolean => {
//   // List of common video file extensions
//   const videoExtensions = [
//     '.mp4',
//     '.avi',
//     '.mkv',
//     '.mov',
//     '.wmv',
//     '.flv',
//     '.webm',
//     '.m4v',
//     '.3gp',
//     '.mpeg',
//     '.mpg',
//     '.ts',
//     '.m2ts',
//     '.mxf',
//     '.ogv',
//     '.vob',
//     '.rm',
//     '.rmvb',
//     '.asf',
//     '.divx',
//   ];

//   // Extract the file extension from the filePath
//   const fileExtension = filePath
//     .toLowerCase()
//     .substring(filePath.lastIndexOf('.'));

//   // Check if the file extension matches any video extension
//   return videoExtensions.includes(fileExtension);
// };
