import { expect } from "chai";
import Fetcher from "../src/Fetcher";
import { Response } from "node-fetch";

const mockFetch = async (url: string) => {
  if (!url || !url.trim()) {
    throw new Error("Url cannot be blank");
  }

  return Promise.resolve(new Response());
};

// let timeout: NodeJS.Timeout;
// const mockFetchWithDelay = async (url: string) => {
//   if (!url || !url.trim()) {
//     throw new Error("Url cannot be blank");
//   }

//   const promise: Promise<Response> = new Promise((resolve, _reject) => {
//     timeout = setTimeout(() => resolve(new Response()), 6000);
//   });

//   return await promise;
// };

describe("Fetcher", () => {
  describe("ping", () => {
    it("should fetch the provided url", async () => {
      const fetcher = new Fetcher(mockFetch);
      const response = await fetcher.ping("example.com/ping");
      expect(response).to.be.instanceOf(Response);
    });

    // it("should timeout after 5 seconds", async function () {
    //   this.timeout(7000);
    //   try {
    //     const fetcher = new Fetcher(mockFetchWithDelay);
    //     await fetcher.ping("example.com/ping");
    //     expect.fail("Should have thrown an error");
    //   } catch (error) {
    //     clearTimeout(timeout);
    //     expect(error.message).to.equal("Request timed out after 5 seconds");
    //   }
    // });
  });
});
