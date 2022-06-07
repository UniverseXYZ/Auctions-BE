import { IDataLayer } from "../../src/data-layer/IDataLayer";

export class IDataLayerMock implements IDataLayer {
  constructor() {}
  async createAuction(auction) {}
}
