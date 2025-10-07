import * as fsPromise from 'fs/promises';
import path from 'path';
import pdfCounter from 'pdf-page-counter';

const DIR = 'uploads';

const mkdir = async (filepath) => {
  try {
    await fsPromise.mkdir(path.join(DIR, filepath));
  } catch (e) {
    if (e.code === 'EEXIST') return; //не бросит ошибку, если уже есть директория
    throw new Error(e);
  }
};

export const readFile = async (filepath) => {
  try {
    const buffer = await fsPromise.readFile(path.join(DIR, filepath));
    return buffer;
  } catch (e) {
    if (e.code === 'ENOENT') {
      return null;
    }
    throw new Error();
  }
};

const writeFile = async (filepath: string, fileBuffer) => {
  try {
    await fsPromise.writeFile(path.join(DIR, filepath), fileBuffer);
  } catch (e) {
    console.log(e);
    throw new Error();
  }
};

const writeJson = async (filepath, data) => {
  try {
    const jsonString = JSON.stringify(data, null, 2);
    await fsPromise.writeFile(path.join(DIR, filepath), jsonString, 'utf-8');
  } catch (e) {
    throw new Error();
  }
};

export const init = async (
  fileHash: string,
  fileBuffer: ArrayBufferLike,
): Promise<number> => {
  try {
    await mkdir(fileHash);
    await mkdir(`${fileHash}/svg`);
    await mkdir(`${fileHash}/svgo`);
    await writeFile(`/${fileHash}/source.pdf`, fileBuffer);

    const pageCount = (await pdfCounter(fileBuffer))?.numpages as number;
    await writeJson(`/${fileHash}/pageCount.json`, pageCount);
    return pageCount;
  } catch (e) {
    throw new Error(e);
  }
};

export const workDirCheck = async () => {
  try {
    await fsPromise.readdir(path.join(DIR));
  } catch (e) {
    await fsPromise.mkdir(path.join(DIR));
  }
};

export const getValidPage = (start, pageCount) => {
  if (!Number(start) || Number(start) <= 0) return 0; //первая страница
  if (Number(start) >= pageCount) {
    return pageCount - 1; //последняя страница
  }

  return Number(start) - 1;
};

export const getPathsForConvert = (fileHash, pageNumber) => {
  const pdfPath = path.join(DIR, `/${fileHash}/source.pdf`);
  const svgPath = path.join(DIR, `/${fileHash}/svg/${pageNumber}.svg`);
  const svgoPath = path.join(DIR, `/${fileHash}/svgo/${pageNumber}.svg`);

  return {
    pdfPath,
    svgPath,
    svgoPath,
  };
};

const IMG_TYPES = {
  svg: 'image/svg+xml',
  png: 'image/png',
  webp: 'image/webp',
  jpeg: 'image/jpeg',
};

export const createDto = (base64: string, validPage: number) => ({
  imgs: [
    {
      base64,
      contentType: IMG_TYPES.svg,
      validPage,
    },
  ],
});
