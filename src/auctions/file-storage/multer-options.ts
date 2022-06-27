import { diskStorage } from "multer";
import * as path from "path";
import * as crypto from "crypto";
import { MulterOptions } from "@nestjs/platform-express/multer/interfaces/multer-options.interface";
import { Exceptions } from "../../errors/exceptions";
import { VALID_MIME_TYPES } from "src/utils/constants";

export const auctionLandingImagesMulterOptions = () => {
  return multerOptionsFactory(3, VALID_MIME_TYPES);
};

export const rewardTierImagesMulterOptions = () => {
  return multerOptionsFactory(3, VALID_MIME_TYPES);
};

const multerOptionsFactory: (
  sizeInMb: number,
  validMimeTypes: string[]
) => MulterOptions = (sizeInMb, validMimeTypes) => {
  return {
    limits: {
      fileSize: 1024 * 1024 * sizeInMb,
    },
    storage: diskStorage({
      destination: "uploads",
      filename: async (req, file, cb) => {
        try {
          const extension = path.extname(file.originalname);
          const hash = await generateRandomHash();
          cb(null, `${hash}${extension}`);
        } catch (error) {
          cb(error, "");
        }
      },
    }),
    fileFilter: (
      req: any,
      file: Express.Multer.File,
      callback: (error: Error | null, acceptFile: boolean) => void
    ) => {
      const isValid = isMimeTypeValid(file.mimetype, validMimeTypes);
      if (isValid) {
        callback(null, true);
      } else {
        callback(Exceptions.invalidFileType(validMimeTypes), false);
      }
    },
  };
};

const generateRandomHash = async (length = 24) => {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(length, (err, buf) => {
      if (err) {
        reject(err);
      } else {
        resolve(buf.toString("hex"));
      }
    });
  });
};

const isMimeTypeValid = (mimeType: string, validMimeTypes: string[]) => {
  return validMimeTypes.includes(mimeType);
};
