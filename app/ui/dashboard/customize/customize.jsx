"use client"
import styles from "./customize.module.css";
import { GrAdd } from "react-icons/gr";


const CustomizeOption = () => {

 const handleSubmit = async(e) =>{
    e.preventDefault();
    const formData = new FormData(e.target);
    const fromEntries = Object.fromEntries(formData.entries())
    console.log(fromEntries);
 }       

  return (
    <div className={styles.container}>
     <details>
        <summary>Add Category</summary>
        <div className={styles.element}>
        <table className={styles.table}>
          <tbody>
            <tr>
              <td>
                <form className={styles.form} onSubmit={handleSubmit} >
                <input type="text" name="name" /><button>Add <GrAdd /></button>
                </form>
              </td>
              <td>Category List</td>
            </tr>
          </tbody>
        </table>
      </div>
     </details>
     <details>
        <summary>Add Category</summary>
        <div className={styles.element}>
        <table className={styles.table}>
          <tbody>
            <tr>
              <td>
                <form className={styles.form} onSubmit={handleSubmit} >
                <input type="text" name="name" /><button>Add <GrAdd /></button>
                </form>
              </td>
              <td>Category List</td>
            </tr>
          </tbody>
        </table>
      </div>
     </details>
     <details>
        <summary>Add Category</summary>
        <div className={styles.element}>
        <table className={styles.table}>
          <tbody>
            <tr>
              <td>
                <form className={styles.form} onSubmit={handleSubmit} >
                <input type="text" name="name" /><button>Add <GrAdd /></button>
                </form>
              </td>
              <td>Category List</td>
            </tr>
          </tbody>
        </table>
      </div>
     </details>
    </div>
  );
};

export default CustomizeOption;
