import React, { useContext, useEffect, useState } from "react";
import { Redirect } from "@reach/router";
import { UserContext } from "../../App";
import "../../Styles.css"
import Swal from "sweetalert2";
import axios from "axios";
import { Link } from "@reach/router";
import ProfileHeader from "./ProfileHeader";
function Profile() {
  const [user] = useContext(UserContext);
  const [client, setClient] = useState(user);
  const [showEditProfile, setShowEDitProfile] = useState(false);


  const sendMail = async()=>{
    try{
      axios.get("http://localhost:4000/send-email",{
        headers:{
          Authorization: `Bearer ${user.accesstoken}`,
        }
      })
    }
    catch(err){
      console.log(err)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Make the request to the server endpoint
        const response = await axios.get(
          "http://localhost:4000/protected/profile",
          {
            headers: {
              Authorization: `Bearer ${user.accesstoken}`,
            },
          }
        );

        // Set the user data in the state
        setClient(response.data.user);
      } catch (error) {
        console.error(error);
      }
    };
    sendMail();
    fetchData();
  }, []);

  const handleInput = (e) => {
    console.log(e.target.name, " : ", e.target.value);
    setClient({ ...client, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Data for update : ", client);
      const response = await axios.put(
        `http://localhost:4000/protected/profile/${client.userid}`,
        client
      );
      Swal.fire({
        icon: "success",
        title: "Yay...",
        text: "Profile updated successfully!",
        confirmButtonColor: "#008000",
      });
    } catch (error) {
      console.log(error);
    }
  };
  console.log("Client data:", client);
  if (!client) return <Redirect from="" to="login" noThrow />;

  return (
    <>
      <div
        style={{ backgroundColor: "#1a1a1b" }}
        className="text-white d-flex justify-content-center profile"
      >
        <div className="profile-card w-50 p-4">
          <div className="p-3">
            <h1>{client.firstname}</h1>
            <h1>{client.lastname}</h1>
            <p className="text-warning">{client.email}</p>
          </div>
          <div className="p-3">
          <button
            className="btn btn-warning my-2"
            type="submit"
          >
            <Link to="/protected" className="text-decoration-none p-2" id="link_text_btn">Back</Link>
          </button>
            <ProfileHeader
              showForm={() => setShowEDitProfile(!showEditProfile)}
              changeTextAndColor={showEditProfile}
            />
            {showEditProfile && (
              <>
                <div className="shadow-lg p-3 mt-5 bg-dark rounded form p-5">
                  <form onSubmit={handleSubmit}>
                    <h2 className="text-white">AddTask</h2>
                    <div className="form-group mt-2 text-white">
                      <label>FirstName</label>
                      <input
                        className="form-control mt-2 bg-dark text-white"
                        aria-describedby="emailHelp"
                        value={client.firstname}
                        onChange={handleInput}
                        type="text"
                        name="firstname"
                        placeholder="Enter FirstName"
                        autoComplete="FirstName"
                      />
                    </div>
                    <div className="form-group mt-2 text-white">
                      <label>LastName</label>
                      <input
                        className="form-control mt-2 bg-dark text-white"
                        aria-describedby="emailHelp"
                        value={client.lastname}
                        onChange={handleInput}
                        type="text"
                        name="lastname"
                        placeholder="Enter LastName"
                        autoComplete="lastname"
                      />
                    </div>
                    <div className="form-group mt-2 text-white">
                      <label>Email</label>
                      <input
                        className="form-control mt-2 bg-dark text-white"
                        aria-describedby="emailHelp"
                        value={client.email}
                        onChange={handleInput}
                        type="email"
                        name="email"
                        placeholder="Enter Email"
                        autoComplete="email"
                      />
                    </div>
                    <div className="form-group mt-2 text-white">
                      <label>Password</label>
                      <input
                        className="form-control mt-2 bg-dark text-white"
                        aria-describedby="emailHelp"
                        value={client.password}
                        onChange={handleInput}
                        type="password"
                        name="password"
                        placeholder="Enter Password"
                        autoComplete="password"
                      />
                    </div>
                    <button type="submit" className="btn btn-warning mt-3 ">
                      Update Profile
                    </button>
                  </form>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;
