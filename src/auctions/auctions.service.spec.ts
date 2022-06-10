import { Test, TestingModule } from "@nestjs/testing";
import { mockAuction } from "../../test/mocks/auction";
import { IDataLayerMock } from "../../test/mocks/IDataLayer";
import { IDataLayer } from "../data-layer/IDataLayer";
import { DATA_LAYER_SERVICE } from "../utils";
import { AuctionsService } from "./auctions.service";

describe("Auctions Service", () => {
  let auctionsService: AuctionsService;

  let dataLayerService: IDataLayer;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuctionsService,
        {
          provide: DATA_LAYER_SERVICE,
          useValue: new IDataLayerMock(),
        },
      ],
    }).compile();

    auctionsService = module.get<AuctionsService>(AuctionsService);

    dataLayerService = module.get<IDataLayer>(DATA_LAYER_SERVICE);
  });

  it("AuctionsService should be defined", () => {
    expect(auctionsService).toBeDefined();
  });

  it("should return the id of the created auction", async () => {
    jest
      .spyOn(dataLayerService, "createAuction")
      .mockReturnValue({ _id: "62a1a8cccac2e4fb2054db88" });
    const response = await auctionsService.createAuction(mockAuction);
    expect(response).toEqual({ id: "62a1a8cccac2e4fb2054db88" });
  });
});
