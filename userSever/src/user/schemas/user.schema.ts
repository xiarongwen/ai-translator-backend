import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type UserDocument = User & Document;

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
  MODERATOR = 'moderator',
}

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  @Prop({
    type: {
      data: Buffer,
      contentType: String,
      required: false,
    },
  })
  avatar?: {
    data: Buffer;
    contentType: string;
  };
  @Prop({ required: true })
  username: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, select: false })
  password: string;

  @Prop({ required: false })
  firstName?: string;

  @Prop({ required: false })
  lastName?: string;

  @Prop({ type: [String], default: [] })
  languages: string[];

  @Prop({ type: String, enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @Prop({ default: false })
  isVerified: boolean;

  @Prop({ required: false })
  verificationToken?: string;

  @Prop({ required: false })
  resetPasswordToken?: string;

  @Prop({ type: Date, required: false })
  resetPasswordExpires?: Date;

  @Prop({ min: 0, max: 150, required: false })
  age: number;

  @Prop({ enum: Gender, default: Gender.OTHER, required: false })
  gender: Gender;

  @Prop({ match: /^[0-9]{11}$/, unique: true, sparse: true, required: false })
  phoneNumber: string;

  @Prop({ default: false })
  isProfileComplete: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
