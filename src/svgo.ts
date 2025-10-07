import { exec } from 'child_process';
import util from 'util';
const execPromise = util.promisify(exec);

export const convertOne = async (pdfPath, svgPath, svgoPath, validPage) => {
  try {
    await execPromise(`pdf2svg ${pdfPath} ${svgPath} ${validPage}`);
    // await execPromise(`svgo ${svgPath} -o ${svgoPath}`);
    return true;
  } catch (e) {
    throw new Error(e);
  }
};
