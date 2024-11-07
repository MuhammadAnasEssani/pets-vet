import {column, computed} from '@ioc:Adonis/Lucid/Orm'
import CommonModel from 'App/Models/CommonModel'
import myHelpers from 'App/Helpers'

export default class Attachment extends CommonModel {

  static TYPE = {
    USER: 20,
    VET_LICENSE_DOCUMENT: 10,
    PET_MEDICAL_RECORDS: 30
  }

  static TYPE_TEXT = {
    [Attachment.TYPE.USER]: 'user',
  }

  static MIME_TYPES = {
    IMAGE: 'image',
    VIDEO: 'video',
    DOCUMENT: 'doc',
    PDF: 'pdf',
    RECORDING: 'voice',
    EXCEL: 'xls',
  }

  @column({isPrimary: true})
  public id: number

  @column()
  public path: string

  @column()
  public instanceType: number

  @column()
  public instanceId: number

  @column()
  public mimeType: string

  @column()
  public duration: string

  @column()
  public thumbnail: string

  @computed()
  public get mediaUrl() {
    if (this.mimeType === 'url') {
      return this.path
    }
    return myHelpers.imageWithBaseURLOrNotFound(this.path)
  }

  @computed()
  public get smallImage() {
    if (this.mimeType === 'image')
      return myHelpers.getImageVersion(this.path, 'small')
  }

  @computed()
  public get mediumImage() {
    if (this.mimeType === 'image')
      return myHelpers.getImageVersion(this.path, 'medium')
  }

  @computed()
  public get thumbnailUrl() {
    if (this.mimeType === 'video')
      return myHelpers.imageWithBaseURLOrNotFound(this.thumbnail)
  }
}
