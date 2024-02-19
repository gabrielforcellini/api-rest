import { User } from './User';

export interface Funko {
  _id: string,
  title: string,
  description: string,
  price: Number,
  imageUrl: string,
  sale: Boolean,
  user: User
}