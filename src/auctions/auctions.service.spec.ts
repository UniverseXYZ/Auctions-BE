import { Test, TestingModule } from "@nestjs/testing";
import { mockAuction } from "../../test/mocks/auction";
import { IDataLayerMock } from "../../test/mocks/IDataLayer";
import { IDataLayer } from "../data-layer/IDataLayer";
import { DATA_LAYER_SERVICE } from "../utils";
import { AuctionsService } from "./auctions.service";

describe("Auctions Service", () => {
  let service: AuctionsService;
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

    service = module.get<AuctionsService>(AuctionsService);
    dataLayerService = module.get<IDataLayer>(DATA_LAYER_SERVICE);
  });

  it("AuctionsService should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should return the id of the created auction", async () => {
    jest
      .spyOn(dataLayerService, "createAuction")
      .mockReturnValue({ _id: "323232" });
    const result = await service.createAuction(mockAuction);
    expect(result).toEqual({ id: "323232" });
  });
});
