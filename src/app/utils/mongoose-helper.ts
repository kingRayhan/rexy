import * as mongoose from 'mongoose';

// export function toMongooseObjectId(id: string) {
//   return new mongoose.Types.ObjectId(id);
// }

export function isValidMongooseId(id: string) {
  return id.match(/^[0-9a-fA-F]{24}$/);
}
