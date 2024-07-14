import MainAnalyticsdataViewer from "@/app/ui/dashboard/reports/categoryReport/analytics";
import { getMerchantByPlatformAndDateRange } from "@/backend/query";
import React from "react";

const ShopifyData = async ({ searchParams }) => {
  const { start, endDate, mode } = searchParams;
  let merchantData;
  if (start && endDate && mode) {
    const { status, merchants } = await getMerchantByPlatformAndDateRange(
      start,
      endDate,
      JSON.parse(mode),
      "shopify"
    );
    if (status === 200) {
      merchantData = merchants;
    }
  }

  if (Object?.values(searchParams).length === 0) {
    const { merchants, status } = await getMerchantByPlatformAndDateRange(
      null,
      null,
      null,
      "shopify"
    );
    if (status) {
      merchantData = merchants;
    }
  }

  return <MainAnalyticsdataViewer merchants={merchantData}  platform={"shopify"} enablePagination={true} />;
};

export default ShopifyData;
