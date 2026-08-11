import { beforeEach, describe, expect, it, vi } from "vitest";

const state = vi.hoisted(() => ({ listData: [] as unknown[], listError: null as unknown, detailData: null as unknown, detailError: null as unknown }));

vi.mock("@/lib/supabase", () => ({
  tenantId: "tenant-test",
  getServerSupabase: () => {
    const chain = {
      select: () => chain,
      eq: () => chain,
      order: async () => ({ data: state.listData, error: state.listError }),
      maybeSingle: async () => ({ data: state.detailData, error: state.detailError }),
    };
    return { from: () => chain };
  },
}));

import { fetchProductsData, getProductBySlug } from "@/lib/products-db";

describe("product query result states", () => {
  beforeEach(() => {
    state.listData = [];
    state.listError = null;
    state.detailData = null;
    state.detailError = null;
  });

  it("keeps a successful empty active-product query empty", async () => {
    expect(await fetchProductsData("en")).toEqual([]);
  });

  it("keeps a successfully missing active product missing", async () => {
    expect(await getProductBySlug("heat-resistant-steel-charge-tray", "en")).toBeNull();
  });

  it("uses the approved launch fallback when the database query fails", async () => {
    state.listError = { code: "TEST_FAILURE" };
    expect(await fetchProductsData("en")).toHaveLength(2);
  });
});
