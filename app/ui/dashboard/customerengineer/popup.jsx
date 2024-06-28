"use client";

import Popup from "reactjs-popup";

const CustomPopup = ({ styles, reason }) => {
  const styling = `
      .popup-content{
        padding:3px;
        border-radius:3px;
        border:0.1x solid white;
        background:var(--bgSoft);
        
      }
  `;

  return (
    <>
      <style>{styling}</style>
      <Popup
        trigger={<button className={styles.button}> view</button>}
        position="right center"
      >
        <div className={styles.paragraph}>{reason}</div>
      </Popup>
    </>
  );
};

export default CustomPopup;
