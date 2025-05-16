import mongoose, { Schema, model } from 'mongoose';
import { Password } from '../src/services/password';
// Define the interface for the User document
interface UserAttrs {
  email: string;
  password: string;
}

// Define the interface for the User model
interface UserModel extends mongoose.Model<UserDoc>{
    build(attrs: UserAttrs): UserDoc;
}

// Define the interface for the User document
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
}

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
}, {
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.password;
      delete ret.__v;

    }
  }
});

userSchema.pre('save', async function(done) {
    if (this.isModified('password')) {
        const hashed = await Password.toHash(this.get('password'));
        this.set('password', hashed);
    }
    done();
});

userSchema.statics.build = (attrs: UserAttrs) => {
    return new User(attrs);
  };

const User = model<UserDoc, UserModel>('User', userSchema);


export { User };
