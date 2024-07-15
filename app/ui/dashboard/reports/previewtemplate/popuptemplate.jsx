"use client";

import React from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import toast from "react-hot-toast";
import styles from "./popuptemplate.module.css";
import { useState } from "react";
import Popup from "reactjs-popup";
import { MdCancel, MdDownload, MdPictureAsPdf, MdRequestPage } from "react-icons/md";
import Image from "next/image";

const PopupTemplate = ({ templateData }) => {
  const [loader, setLoader] = useState(false);
  const styling = `
    .downloadPDF #chartReport{
     
    }
  `;

  const pdfDownload = async (e) => {
    e.preventDefault();
    const targetElement = document.querySelector(".downloadPDF");
    setLoader(true);
    const scale = 2;
    try {
      const canvas = await html2canvas(targetElement, { scale: scale });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;

      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const marginLeft = (pdfWidth - imgWidth * ratio) / 2;
      const marginTop = (pdfHeight - imgHeight * ratio) / 2;

      pdf.addImage(
        imgData,
        "PNG",
        marginLeft,
        marginTop,
        imgWidth * ratio,
        imgHeight * ratio
      );
      pdf.save("report.pdf");
      const pdfBlob = pdf.output("blob");

      const formData = new FormData();
      formData.append("file", pdfBlob, "report.pdf");

      const response = await fetch("/api/send", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("Copy Sent on Your Registered Email", {
          position: "top-right",
        });
      } else {
        console.error("Error sending email:", result.error);
        toast.error("Email Sent Failed Please check the logs", {
          position: "top-right",
        });
      }
    } catch (error) {
      console.error("Error generating or sending PDF:", error);
    } finally {
      setLoader(false);
    }
  };



  return (
    <>
      <style>{styling}</style>
      <Popup
        trigger={<button className={styles.popupButton}>Preview</button>}
        position="center"
        modal
        contentStyle={{ width: "100%" }}
      >
        {(close) => (
          <div className={styles.popup}>
            <div className={styles.button}>
              <button
                onClick={pdfDownload}
                style={{ background: "transparent" }}
              >
                {loader ? (
                   <Image src={'/animate.svg'}  alt="" width="25" height="25"/>
                ) : (
                  <MdPictureAsPdf
                    style={{ color: "green", fontSize: "2.5rem" }}
                  />
                )}
              </button>
              <button onClick={close} style={{ background: "transparent" }}>
                <MdCancel style={{ color: "red", fontSize: "1rem" }} />
              </button>
            </div>
            <span className="downloadPDF">{templateData}</span>
          </div>
        )}
      </Popup>
    </>
  );
};

export default PopupTemplate;
