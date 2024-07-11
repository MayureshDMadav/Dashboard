"use client";

import { ReportContext } from "@/app/component/contextProvider";
import { useContext } from "react";

export const PreviewPopup = () => {
  const reportRef = useContext(ReportContext);

  console.log(reportRef?.current);

  if (!reportRef || !reportRef.current) {
    return <div>Loading preview...</div>;
  }

  return (
    <div>
      <div dangerouslySetInnerHTML={{ __html: reportRef.current.innerHTML }} />
    </div>
  );
};