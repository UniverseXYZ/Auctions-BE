//TODO: separate errors, functions etc

import mongoose from "mongoose";

export const isValidId = (id: string) => mongoose.Types.ObjectId.isValid(id);

export const castToId = (id: string) => new mongoose.Types.ObjectId(id);
