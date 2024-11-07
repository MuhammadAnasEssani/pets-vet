class VideoProcessor {

    async getVideoDurations(sourceFile) {
        const {getVideoDurationInSeconds} = require('get-video-duration')
        let duration = await getVideoDurationInSeconds(sourceFile)
        return duration.toFixed(2)
    }

    async getVideoThumbnail(sourceFile, outputPath, milliseconds = 1000) {
        const extractFrames = require('ffmpeg-extract-frames')
        await extractFrames({
            input: sourceFile,
            output: `./public/${outputPath}`,
            offsets: [
                milliseconds
            ]
        })
        return outputPath
    }

    async checkType(mimeType: string) {
        if (mimeType !== 'video') {
            throw new Error(`Type:[${mimeType}]: Invalid MIME_TYPE given, video expected!`)
        }
    }
}

/*Create a singleton instance*/
export default new VideoProcessor()
