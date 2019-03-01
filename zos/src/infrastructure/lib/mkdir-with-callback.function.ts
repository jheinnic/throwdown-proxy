import * as fs from "fs";
import ErrnoException = NodeJS.ErrnoException;

// const DIR_ACCESS = fs.constants.R_OK | fs.constants.W_OK | fs.constants.X_OK;
const DIR_MODE = 0o700;

export function mkdirWithCallback(dirPath: string): Promise<string>
{
   // console.log(`About to mkdir for ${dirPath}`);
   return new Promise<string>((resolve, reject) => {
      fs.stat(dirPath, (err, stat) => {
         if (!!err) {
            if (err.code === 'ENOENT') {
               fs.mkdir(dirPath, 0o700, (err: ErrnoException) => {
                  if (!err) {
                     console.log(`Successfully created ${dirPath}`);
                     resolve(dirPath);
                  } else {
                     console.error(`Failed to create ${dirPath}: ${err}`);
                     reject(err);
                  }
               });
            } else {
               console.error(`Could not stat ${dirPath}: ${err}`);
               reject(err);
            }
         } else if (stat.uid !== process.getuid()) {
            const err = new Error(`${dirPath} is owned by ${stat.uid}, not ${process.getuid()}`);
            console.error(err);
            reject(err);
         } else if (!stat.isDirectory()) {
            const err = new Error(`${dirPath} is not a directory`);
            console.error(err);
            reject(err);
         } else if (stat.mode !== DIR_MODE) {
            fs.chmod(dirPath, DIR_MODE, (err: ErrnoException) => {
               if (!!err) {
                  console.error(`Could not set permission bits on ${dirPath} from ${stat.mode.toString(
                     8)} to ${DIR_MODE}`);
                  reject(err);
               } else {
                  console.warn(
                     `Updated permission bits on ${dirPath} from ${stat.mode.toString(8)} to ${DIR_MODE}`);
                  resolve(dirPath);
               }
            });
         } else {
            console.log(`${dirPath} is owned by this process, is a directory, and has mode ${DIR_MODE}`);
            resolve(dirPath);
         }
      });
   });
}