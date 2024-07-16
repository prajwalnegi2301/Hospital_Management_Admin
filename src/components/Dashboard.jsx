import React, { useContext, useEffect, useState } from "react";
import { Context } from "../main";
import { Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { GoCheckCircleFill } from "react-icons/go";
import { AiFillCloseCircle } from "react-icons/ai";

const Dashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const {isAuthenticated,setIsAuthenticated, admin,setAdmin} = useContext(Context);
  const navigateTo = useNavigate();
  if (!isAuthenticated) {
    navigateTo("/")  }

  useEffect(() => {
    const fetchAppointments = async () => {
  
      try {
        const { data } = await axios.get(
          "http://localhost:4000/api/v1/appointment/getAll",
          { withCredentials: true }
        );
        setAppointments(data.appointments);
        
      } catch (error) {
        console.error("Error fetching appointments:", error);
        setAppointments([]);
      }
    };
    fetchAppointments();
  }, []);

  const handleUpdateStatus = async (appointmentId, status) => {
    try {
      const { data } = await axios.put(
        `http://localhost:4000/api/v1/appointment/update/${appointmentId}`,
        { status },
        { withCredentials: true }
      );
      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment._id === appointmentId
            ? { ...appointment, status }
            : appointment
        )
      );
      toast.success(data.message);
    } catch (error) {
      console.error("Error updating appointment status:", error);
      toast.error(error.response?.data?.message || "An error occurred");
    }
  };

  


  return (
    <>
      <section className="dashboard page">
        <div className="banner">
          <div className="firstBox">
            <img src="/doc.png" alt="docImg" />
            <div className="content">
              <div>
                <p>Hello ,</p>
                <h5>
                  {admin &&
                    `${admin.firstName} ${admin.lastName}`}{" "}
                </h5>
              </div>
              <p>
                Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                Facilis, nam molestias. Eaque molestiae ipsam commodi neque.
                Assumenda repellendus necessitatibus itaque.
              </p>
            </div>
          </div>
          <div className="secondBox">
            <p>Total Appointments</p>
            <h3>1500</h3>
          </div>
          <div className="thirdBox">
            <p>Registered Doctors</p>
            <h3>10</h3>
          </div>
        </div>
        <div className="banner">
          <h5>Appointments</h5>
          <div className="appointments-container">
            <div className="appointments-header">
              <div>Patient</div>
              <div>Date</div>
              <div>Doctor</div>
              <div>Department</div>
              <div>Status</div>
              <div>Visited</div>
            </div>
            <div className="appointments-body">
              {appointments && appointments.length > 0
                ? appointments.map((appointment) => (
                    <div key={appointment._id} className="appointment-row">
                      <div>{`${appointment.firstName} ${appointment.lastName}`}</div>
                      <div>{appointment.appointmentDate}</div>
                      <div>{`${appointment.doctor.firstName} ${appointment.doctor.lastName}`}</div>
                      <div>{appointment.department}</div>
                      <div>
                        <select
                          className={
                            appointment.status === "Pending"
                              ? "value-pending"
                              : appointment.status === "Accepted"
                              ? "value-accepted"
                              : "value-rejected"
                          }
                          value={appointment.status}
                          onChange={(e) =>
                            handleUpdateStatus(appointment._id, e.target.value)
                          }
                        >
                          <option value="Pending" className="value-pending">
                            Pending
                          </option>
                          <option value="Accepted" className="value-accepted">
                            Accepted
                          </option>
                          <option value="Rejected" className="value-rejected">
                            Rejected
                          </option>
                        </select>
                      </div>
                      <div>
                        {appointment.hasVisited === true ? (
                          <GoCheckCircleFill className="green" />
                        ) : (
                          <AiFillCloseCircle className="red" />
                        )}
                      </div>
                    </div>
                  ))
                : "No Appointments Found!"}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Dashboard;
