// import { format, createLogger } from 'winston';
// import DailyRotateFile = require('winston-daily-rotate-file');

// export const logger = createLogger({
//   transports: [
//     new DailyRotateFile({
//       filename: 'logs/%DATE%.log',
//       datePattern: 'YYYY-MM-DD',
//       maxFiles: process.env.LOGGER_MAX_FILE, // số ngày lưu giữ file log( VD: 10d, qua ngày 11 file ngày 1 tự xoá)
//       format: format.combine(
//         format.timestamp({ format: 'MMM-DD-YYYY HH:mm:ss' }),
//         format.printf(
//           (info) => `${info.level}: ${[info.timestamp]}: ${info.message}`,
//         ),
//       ),
//     }),
//   ],
// });
