import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'

const XAWS = AWSXRay.captureAWS(AWS)

const s3BucketName = process.env.ATTACHMENT_S3_BUCKET;
const expiration = process.env.SIGNED_URL_EXPIRATION;

export class AttachmentUtils {
    constructor (
        private readonly s3 = new XAWS.S3({ signatureVersion: 'v4' }),
        private readonly bucketName = s3BucketName
    ) {}

    getAttachmentUrl = (todoId: string) => {
        return `https://${this.bucketName}.s3.amazonaws.com/${todoId}`;
    }

    getUploadUrl = (todoId: string): string => {
        console.log("todoId", todoId)
        const uploadUrl = this.s3.getSignedUrl('putObject', {
            Bucket: this.bucketName,
            Key: todoId,
            Expires: Number(expiration)
        })

        return uploadUrl as string;
    }
}