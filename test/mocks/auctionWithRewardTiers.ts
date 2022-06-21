export const mockAuctionWithRewardTiers = {
  owner: "0x13BBDC67f17A0C257eF67328C658950573A16aDe",
  name: "Auction1",
  tokenAddress: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
  tokenSymbol: "XYZ",
  startDate: new Date(),
  endDate: new Date(),
  royaltySplits: [
    {
      address: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
      percentAmount: 10,
    },
  ],
  rewardTiers: [
    {
      name: "Reward tier 1",
      numberOfWinners: 2,
      nftSlots: [
        {
          nfts: [
            {
              contractAddress: "0xb47e3cd837dDF8e4c57F05d70Ab865de6e193BBB",
              tokenId: 1,
            },
            {
              contractAddress: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
              tokenId: 2,
            },
          ],
          minimumBid: 0.1,
        },
        {
          nfts: [
            {
              contractAddress: "0xb47e3cd837dDF8e4c57F05d70Ab865de6e193BBB",
              tokenId: 3,
            },
            {
              contractAddress: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
              tokenId: 4,
            },
          ],
          minimumBid: 0.1,
        },
      ],
    },
    {
      name: "Reward tier 1",
      numberOfWinners: 2,
      nftSlots: [
        {
          nfts: [
            {
              contractAddress: "0xb47e3cd837dDF8e4c57F05d70Ab865de6e193BBB",
              tokenId: 1,
            },
            {
              contractAddress: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
              tokenId: 2,
            },
          ],
          minimumBid: 0.1,
        },
        {
          nfts: [
            {
              contractAddress: "0xb47e3cd837dDF8e4c57F05d70Ab865de6e193BBB",
              tokenId: 3,
            },
            {
              contractAddress: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
              tokenId: 4,
            },
          ],
          minimumBid: 0.1,
        },
      ],
    },
  ],
};
