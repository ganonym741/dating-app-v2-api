import * as fs from 'fs';
import { extname, join } from 'path';

export const uploadFile = async (file: any, dir: string): Promise<string> => {
  if (file == null) return '';

  const uploadPath = join(process.cwd(), 'uploads', dir);
  const { buffer } = file;
  const filename = `${dir}-${Date.now()}${extname(file.originalname)}`;

  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }

  fs.writeFileSync(`${uploadPath}/${filename}`, buffer);

  return `/uploads/${dir}/${filename}`;
}
