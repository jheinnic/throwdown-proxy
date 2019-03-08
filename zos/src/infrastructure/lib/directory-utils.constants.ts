import * as fs from "fs";
import * as path from "path";
import {promisify} from "util";
import ErrnoException = NodeJS.ErrnoException;
import { illegalArgs } from '@thi.ng/errors';

const PRIVATE_MODE = 0o700;

const pStat = promisify(fs.stat);
const pMkdir = promisify(fs.mkdir);
const pAccess = promisify(fs.access);

function ensurePrivateDir(dirPath: string): Promise<string>
{
   return new Promise<string>((resolve, reject) => {
      fs.stat(dirPath, (err, stat) => {
         if (!!err) {
            if (err.code === 'ENOENT') {
               fs.mkdir(dirPath, 0o700, (err: ErrnoException) => {
                  if (!err) {
                     console.debug(`Created private directory ${dirPath}`);
                     resolve(dirPath);
                  } else {
                     const err2 = new Error(`Failed to create ${dirPath}: ${err}`);
                     reject(err2);
                  }
               });
            } else {
               const err2 = new Error(`Could not stat ${dirPath}: ${err}`);
               reject(err2);
            }
         } else if (stat.uid !== process.getuid()) {
            const err = new Error(`${dirPath} is owned by ${stat.uid}, not ${process.getuid()}`);
            reject(err);
         } else if (!stat.isDirectory()) {
            const err = new Error(`${dirPath} is not a directory`);
            reject(err);
         } else if (stat.mode !== PRIVATE_MODE) {
            fs.chmod(dirPath, PRIVATE_MODE, (err: ErrnoException) => {
               if (!!err) {
                  const err2 = new Error(
                     `Could not set permission bits on ${dirPath} from ${stat.mode.toString(
                        8)} to ${PRIVATE_MODE}`
                  );
                  reject(err2);
               } else {
                  console.debug(
                     `Updated permission bits on ${dirPath} from ${stat.mode.toString(
                        8)} to ${PRIVATE_MODE}`);
                  resolve(dirPath);
               }
            });
         } else {
            console.debug(
               `${dirPath} is owned by this process, is a directory, and has mode ${PRIVATE_MODE}`);
            resolve(dirPath);
         }
      });
   });
}

function ensureWritableDir(dirPath: string): Promise<string>
{
   return new Promise<string>((resolve, reject) => {
      fs.stat(dirPath, (err, stat) => {
         if (!!err) {
            if (err.code === 'ENOENT') {
               fs.mkdir(dirPath, 0o700, (err: ErrnoException) => {
                  if (! err) {
                     console.debug(`Created writable directory ${dirPath}`);
                     resolve(dirPath);
                  } else {
                     const err2 = new Error(`Failed to create ${dirPath}: ${err}`);
                     reject(err2);
                  }
               });
            } else {
               const err2 = new Error(`Could not stat ${dirPath}: ${err}`);
               reject(err2);
            }
         } else if (!stat.isDirectory()) {
            const err = new Error(`${dirPath} is not a directory`);
            reject(err);
         } else {
            fs.access(dirPath, fs.constants.W_OK, (err2) => {
               if (err2) {
                  const err3 = new Error(`${dirPath} is a directory, but not writable`);
                  reject(err3);
               } else {
                  console.debug(`${dirPath} is a directory writable by this process.`);
                  resolve(dirPath);
               }
            });
         }
      });
   });
}

async function checkSubtreeArgs(subtreePath: string, subtreeRoot: string) {
   if (path.isAbsolute(subtreePath)) {
      throw illegalArgs(`${subtreePath} must be relative to ${subtreeRoot}`);
   }

   let stat;
   try {
      stat = await pStat(subtreeRoot);
   } catch (err) {
      throw new Error(`Could not verify ${subtreeRoot} is a directory: ${err}`);
   }
   if (!stat.isDirectory()) {
      throw new Error(`${subtreeRoot} is not a directory`);
   }

   const dirOrder: string[] = [];

   let remainingPath = subtreePath;
   while (remainingPath !== '.') {
      const nextDir = path.basename(subtreePath);
      remainingPath = path.dirname(remainingPath);
      dirOrder.push(nextDir);
   }

   return dirOrder;
}

async function ensurePrivateSubtree(subtreeRoot: string, subtreePath: string) {
   const dirOrder: string[] = await checkSubtreeArgs(subtreePath, subtreeRoot);

   let remainingPath = subtreeRoot;
   while(dirOrder.length > 0) {
      remainingPath = path.join(
         remainingPath, dirOrder.pop()!
      );

      try {
         await ensurePrivateDir(remainingPath);
      } catch (err) {
         throw new Error(`Could not ensure entire path starting from ${remainingPath}`);
      }
   }

   return remainingPath;
}

async function ensureWritableSubtree(subtreeRoot: string, subtreePath: string) {
   const dirOrder: string[] = await checkSubtreeArgs(subtreePath, subtreeRoot);

   let remainingPath = subtreeRoot;
   while(dirOrder.length > 0) {
      remainingPath = path.join(
         remainingPath, dirOrder.pop()!
      );

      try {
         await ensureWritableDir(remainingPath);
      } catch (err) {
         throw new Error(`Could not ensure entire path starting from ${remainingPath}`);
      }
   }

   return remainingPath;
}

export const directoryUtils = {
   ensurePrivateDir,
   ensureWritableDir,
   ensurePrivateSubtree,
   ensureWritableSubtree
};