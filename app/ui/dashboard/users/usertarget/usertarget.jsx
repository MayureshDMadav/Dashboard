"use client";
import React, { useState } from "react";
import styles from "./usertarget.module.css";

const SetUserTarget = () => {
  const [weeklyTargets, setWeeklyTargets] = useState([]); // Initialize with one empty target

  const addWeeklyTarget = () => {
    setWeeklyTargets([...weeklyTargets, ""]);
  };

  const removeWeeklyTarget = (index) => {
    const newTargets = [...weeklyTargets];
    newTargets.splice(index, 1);
    setWeeklyTargets(newTargets);
  };

  const handleWeeklyTargetChange = (index, value) => {
    const newTargets = [...weeklyTargets];
    newTargets[index] = value;
    setWeeklyTargets(newTargets);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Your form submission logic here
    // Example: fetch('/api/submit-data', { method: 'POST', body: JSON.stringify({ weeklyTargets, ...otherFormData }) });
  };

  return (
    <div className={styles.container}>
      <div className={styles.childElement}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="startDate">Start Date:</label>
            <input type="date" id="startDate" name="startDate" />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="endDate">End Date:</label>
            <input type="date" id="endDate" name="endDate" />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="merchantTotal">Merchant Total:</label>
            <input
              type="number"
              id="merchantTotal"
              name="merchantTotal"
              defaultValue="0"
            />
          </div>

          <div className={styles.formGroup}>
            <label>Weekly Target:</label>
            {weeklyTargets.map((target, index) => (
              <div key={index} className={styles.inputGroup}>
                <input
                  type="text"
                  name={`weeklyTarget[${index}]`}
                  value={target}
                  onChange={(e) =>
                    handleWeeklyTargetChange(index, e.target.value)
                  }
                />
                {target && (
                  <button
                    type="button"
                    onClick={() => removeWeeklyTarget(index)}
                    className={styles.removeButton}
                  >
                    -
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addWeeklyTarget}
              className={styles.addButton}
            >
              +
            </button>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="bookedArr">Booked Arr:</label>
            <input type="text" id="bookedArr" name="bookedArr" />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="expectedArr">Expected Arr:</label>
            <input type="text" id="expectedArr" name="expectedArr" />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="userId">User ID:</label>
            <select id="userId" name="userId">
              <option value="1">User 1</option>
              <option value="2">User 2</option>
              <option value="3">User 3</option>
            </select>
          </div>

          <button type="submit" className={styles.submitButton}>
            Submit
          </button>
        </form>
      </div>
      <div className={styles.childElement}></div>
    </div>
  );
};

export default SetUserTarget;
