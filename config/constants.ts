const constants = {
  APP_NAME: 'Pets Vet Connect',
  PER_PAGE: 20,
  ORDER_BY_COLUMN: 'id',
  ORDER_BY_VALUE: 'desc',
  FCM_KEY: 'AAAA3uKMsNU:APA91bGvprdQs7tknmSGbdJ3a9mpsFfv2l63hV5kczmpHUcifdCbtMj4Apd_nsyxSu9Gn0qU2GdER5k_66GWh9lS78MJjG8dJSfvECxBpKwZm2UY6o1_FIfv_n9LLUcPqbDKPNDA3hPl',
  IMAGE_NOT_FOUND: 'not-found.png',
  USER_NOT_FOUND: 'not-found-user.png',
  SETTINGS: {
    VIDEO_THUMBNAIL: false,
    VIDEO_DURATION: false,
  },
  ADMIN_PER_PAGE: 1000,
  IMAGE_RESIZE: {
    MEDIUM: 500,
    SMALL: 100,
  },
  UPLOAD_CHANNEL: 's3',
  S3_URL: 'https://serve-easy.s3.ap-south-1.amazonaws.com/',
  AUTH_TOKEN_EXPIRY: '1days',
  DEFAULT_CURRENCY: "USD",
  SEEDER_CONSTANTS : {
    ADMIN_EMAIL: 'admin@pet-vet-connect.com',
  },
  DASHBOARD_COMPARE_FROM_FILTERS: {
    TODAY: 10,
    THIS_WEEK: 20,
    THIS_MONTH: 30,
    THIS_YEAR: 40
  },
  DASHBOARD_COMPARE_TO_FILTERS: {
    YESTERDAY: 10,
    LAST_WEEK: 20,
    LAST_MONTH: 30,
    LAST_YEAR: 40,
    SAME_DAY_LAST_WEEK: 50,
    SAME_DAY_LAST_MONTH: 60,
    SAME_DAY_LAST_YEAR: 70
  },
  CURRENCY: 'usd',
  SERVICE_CHARGES: 0.05,
  RADIUS_DISTANCE: 5 //in kilometer
}

export default constants
