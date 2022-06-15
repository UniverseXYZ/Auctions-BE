//TODO: separate errors, functions etc

import mongoose from "mongoose";

export const DATA_LAYER_SERVICE = "DATA LAYER SERVICE";

export const ETHEREUM_ADDRESS = {
  VALID: /^0x[a-fA-F0-9]{40}$/,
  INVALID_MESSAGE: "Invalid Ethereum address",
};

export const isValidId = (id: string) => mongoose.Types.ObjectId.isValid(id);

export const castToId = (id: string) => new mongoose.Types.ObjectId(id);
