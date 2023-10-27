import React, { useState, useEffect } from "react";

import Table from "react-bootstrap/Table";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import axios from "axios";

import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export const Crud = () => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [isActive, setIsActive] = useState(0);
  const [editId, seteditId] = useState();
  const [editName, setEditName] = useState("");
  const [editAge, setEditAge] = useState("");
  const [editIsActive, setEditIsActive] = useState(0);
  const [data, setData] = useState([]);

  useEffect(() => {
    getData()
  }, []);

  const getData = () => {
    axios
      .get("http://localhost:5196/api/Employee")
      .then((result) => {
        setData(result.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleEdit = (id) => {

    handleShow();
    axios.get(`http://localhost:5196/api/Employee/Employee?id=${id}`)
    .then((result)=>{
      setEditName(result.data.name);
      setEditAge(result.data.age);
      setEditIsActive(result.data.isActive);
      seteditId(id)
    })
    .catch((error)=>{
      toast.error(error)
    })


  };
  const handleDelete = (id) => {
    if (window.confirm("Are you sure to delete?") === true) {
        axios.delete(`http://localhost:5196/api/Employee?id=${id}`)
        .then((result)=>{
          
          if(result.status===200){
            
            toast.success('Data has beem Deleted Successfully');
            getData();
          }
         
        })
        .catch((error)=>{
          toast.error(error)
        })
        
    }
  };

  const handleSubmit =()=>{

    const url = 'http://localhost:5196/api/Employee';
    const data = {
        name: name,
        age: age,
        isActive: isActive
    }
    axios.post(url,data)
    .then((result)=>{
        getData(data);
        clear();
        toast.success('Data added Successfully')
    })
    .catch((error)=>{
      toast.success(error)
    })
  }


  const clear = ()=>{
    setName('');
    setAge('');
    setIsActive(0);
    setEditName('');
    setEditAge('');
    setEditIsActive(0);
    seteditId('');
  }

  const handleUpdate = () => {
    const url = (`http://localhost:5196/api/Employee/${editId}`)
    const data = {
      id:editId,
      name: editName,
      age: editAge,
      isActive: editIsActive
  }
  axios.put(url,data)
  .then((result)=>{
    handleClose();
      getData(data);
      clear();
      toast.success('Data Updated Successfully')
  })
  .catch((error)=>{
    toast.success(error)
  })
  };

  const handleIsActive = (e)=>{
      if(e.target.checked){
        setIsActive(1)
      }
      else{
        setIsActive(0)
      }
  }

  const handleIsEditActive = (e)=>{
    if(e.target.checked){
      setEditIsActive(1)
    }
    else{
      setEditIsActive(0)
    }
}


  return (
    <>
    <ToastContainer/>
      <br></br>
      <Container>
        <Row>
          <Col>
            <input
              type="text"
              className="form-control"
              placeholder="Enter Name"
              v
              alue={name}
              onChange={(e) => (
                setName(e.target.value)
              )}
            />
          </Col>
          <Col>
            <input
              type="text"
              className="form-control"
              placeholder="Enter Age"
              value={age}
              onChange={(e) => (
                setAge(e.target.value)
              )}
            />
          </Col>
          <Col>
            <input
              type="checkbox"
              checked={isActive === 1 ? true : false}
              onChange={(e) => handleIsActive(e)}
              value={isActive}
            />
            <label>IsActive</label>
          </Col>
          <Col>
            <button className="btn btn-primary" onClick={()=>handleSubmit()}>Submit</button>
          </Col>
        </Row>
      </Container>
      <br></br>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Id</th>
            <th>Name</th>
            <th>Age</th>
            <th>IsActive</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data && data.length > 0
            ? data.map((item, index) => {
                return (
                  <tr key={index}>
                    <td>{index}</td>
                    <td>{item.id}</td>
                    <td>{item.name}</td>
                    <td>{item.age}</td>
                    <td>{item.isActive}</td>
                    <td colSpan={2}>
                      <button
                        className="btn btn-primary"
                        onClick={() => handleEdit(item.id)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDelete(item.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })
            : "Loading..."}
        </tbody>
      </Table>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Update the Data</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col>
              <input
                type="text"
                className="form-control"
                placeholder="Enter Name"
                v
                alue={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
            </Col>
            <Col>
              <input
                type="text"
                className="form-control"
                placeholder="Enter Age"
                value={editAge}
                onChange={(e) => setEditAge(e.target.value)}
              />
            </Col>
            <Col>
              <input
                type="checkbox"
                checked={editIsActive === 1 ? true : false}
                onChange={(e) => handleIsEditActive(e)}
                value={editIsActive}
              />
              <label>IsActive</label>
            </Col>
            <Col>
              <button className="btn btn-primary">Update</button>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={() => handleUpdate()}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
