import { Test, TestingModule } from "@nestjs/testing";
import { DataLayerService } from "./data-layer.service";
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from "../../test/DBhandler";
import { getModelToken, MongooseModule } from "@nestjs/mongoose";
import { Auctions, AuctionsSchema } from "../auctions/schemas/auction.schema";
import { mockAuction } from "../../test/mocks/auction";

describe("Data Layer Service", () => {
  let service: DataLayerService;
  let auctionsModel = null;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        MongooseModule.forFeature([
          {
            name: Auctions.name,
            schema: AuctionsSchema,
          },
        ]),
      ],
      providers: [DataLayerService],
    }).compile();

    service = module.get<DataLayerService>(DataLayerService);
    auctionsModel = await module.resolve(getModelToken(Auctions.name));
  });

  it("should create an instance of the DataLayerService", () => {
    expect(service).toBeDefined();
  });

  it("should call create with the correct auction", async () => {
    jest.spyOn(auctionsModel, "create");
    //@ts-ignore - just for the data layer test
    mockAuction.tokenDecimals = 18;
    await service.createAuction(mockAuction);
    expect(auctionsModel.create).toBeCalledWith(mockAuction);
  });

  afterAll(async () => {
    await closeInMongodConnection();
  });
});
