import { registerAs } from '@nestjs/config';

/**
 * File path to the configuration file.
 */
export default registerAs('file', () => ({
  /**
   * Driver to use for the configuration file.
   * Available drivers: 's3', 'local'
   */
  driver: process.env.FILE_DRIVER,

  /**
   * AWS S3 Access Key.
   */
  accessKeyId: process.env.ACCESS_KEY_ID,

  /**
   * AWS S3 Secret Key.
   */
  secretAccessKey: process.env.SECRET_ACCESS_KEY,

  /**
   * AWS S3 Default Bucket name.
   */
  awsDefaultS3Bucket: process.env.AWS_DEFAULT_S3_BUCKET,

  /**
   * AWS S3 Default url.
   */
  awsDefaultS3Url: process.env.AWS_DEFAULT_S3_URL,

  /**
   * S3 Region.
   */
  awsS3Region: process.env.AWS_S3_REGION,

  /**
   * Maximum file size in bytes.
   */
  maxFileSize: 5242880, // 5mb
}));
