export default () => ({
  mongodb: {
    uri: process.env.MONGODB_URI,
  },
  port: process.env.PORT,
  app_env: process.env.APP_ENV,
  session_secret: process.env.SESSION_SECRET,
  network_chain_id: process.env.NETWORK_CHAIN_ID,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  bucketName: process.env.AWS_BUCKET_NAME,
  s3BaseUrl: process.env.AWS_S3_BASE_URL,
});
