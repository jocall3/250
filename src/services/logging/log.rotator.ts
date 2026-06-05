import * as fs from 'fs';
import * as path from 'path';
import * as zlib from 'zlib';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { logger } from './logger.core';

export class LogRotator {
  private logDir: string;
  private s3Client: S3Client;
  private bucketName: string;

  constructor(logDir = './logs', bucketName = 'app-logs-archive') {
    this.logDir = path.resolve(logDir);
    this.bucketName = bucketName;
    this.s3Client = new S3Client({ region: process.env.AWS_REGION || 'us-east-1' });

    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  public async rotateAndArchive(fileName: string): Promise<void> {
    const filePath = path.join(this.logDir, fileName);
    if (!fs.existsSync(filePath)) {
      logger.warn(`Log file not found for rotation: ${filePath}`);
      return;
    }

    const timestamp = new Date().toISOString().replace(/:/g, '-');
    const rotatedFileName = `${path.basename(fileName, '.log')}-${timestamp}.log.gz`;
    const rotatedFilePath = path.join(this.logDir, rotatedFileName);

    try {
      const fileContents = fs.createReadStream(filePath);
      const writeStream = fs.createWriteStream(rotatedFilePath);
      const zip = zlib.createGzip();

      await new Promise<void>((resolve, reject) => {
        fileContents
          .pipe(zip)
          .pipe(writeStream)
          .on('finish', () => resolve())
          .on('error', (err) => reject(err));
      });

      fs.writeFileSync(filePath, '');

      const fileBuffer = fs.readFileSync(rotatedFilePath);
      await this.s3Client.send(
        new PutObjectCommand({
          Bucket: this.bucketName,
          Key: `archives/${rotatedFileName}`,
          Body: fileBuffer,
          ContentType: 'application/gzip',
        })
      );

      logger.info(`Successfully rotated, compressed, and archived log file to S3: ${rotatedFileName}`);
      fs.unlinkSync(rotatedFilePath);
    } catch (error) {
      logger.error('Error during log rotation and archiving:', { error });
    }
  }
}