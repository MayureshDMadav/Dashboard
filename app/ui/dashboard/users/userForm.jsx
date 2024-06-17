"use client"

const UserForm = ({user,style,userData}) => {
  return (
    <form className={style.form} onSubmit={userData}>
    <input type="hidden" name="id" value={user ? user.id : ""} />
    <label>Username</label>
    <input type="text" name="username" placeholder={ user ? user.username : ""} />
    <label>Email</label>
    <input type="email" name="email" placeholder={user ? user.email :""} />
    <label>Password</label>
    <input type="password" name="password" placeholder={user ? user.password : ""} />
    <label>Phone</label>
    <input type="text" name="phone" placeholder={user ? user.phone : ""} />
    <label>Address</label>
    <textarea type="text" name="address" placeholder={user ? user.address : ""} />
    <label>Is Admin?</label>
    <select name="isAdmin" id="isAdmin">
      <option value={true} selected={user ? user.isAdmin : true}>
        Yes
      </option>
      <option value={false} selected={user ? !user.isAdmin : false}>
        No
      </option>
    </select>
    <label>Is Active?</label>
    <select name="isActive" id="isActive">
      <option value={true} selected={user ? user.isActive : true}>
        Yes
      </option>
      <option value={false} selected={user ? !user.isActive : false}>
        No
      </option>
    </select>
    <button>Update</button>
  </form>
  )
}

export default UserForm