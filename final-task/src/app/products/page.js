"use client";

import AppContainer from "@/components/Contaner/container";
import { useEffect, useState } from "react";
import { Space } from "@/components/space/Space";
import Header from "@/components/Header/header";
import { IoIosRefresh } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { FaFileUpload } from "react-icons/fa";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { Table, Button, Input, Modal, Popconfirm } from "antd";
import * as LR from "@uploadcare/blocks";
import { Image } from "@nextui-org/react";


const Page = () => {
  const [list, setList] = useState([]);
  const [refresh, setRefresh] = useState(0);
  const [newData, setNewData] = useState({});
  const [selectedImage, setSelectedImage] = useState(null); // Define state for selected image
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [search, setSearch] = useState("");
  const [editFormData, setEditFormData] = useState({}); // Define state for edit form data

  // Function to show the modal for editing a product
  const showModal = (id) => {
    setSelectedProductId(id);
    const selectedProduct = list.find((product) => product.id === id);
    setEditFormData(selectedProduct);
    setSelectedImage(selectedProduct.image);
  };

  // Function to handle the cancelation of editing or adding a product
  const handleCancel = () => {
    setSelectedProductId(null);
    setOpen(false);
  };

  // Function to handle input change for editing a product
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    let parsedValue = value;

    // Parsing values based on the input type
    if (name === "categoryId" && /^\d+$/.test(value)) {
      parsedValue = parseInt(value, 10);
    } else if (name === "price") {
      parsedValue = parseFloat(value);
    }

    // Updating the edit form data
    setEditFormData((prevData) => ({
      ...prevData,
      [name]: parsedValue,
    }));
  };

  // Function to handle input change for adding a product
  const handleAddInputChange = (e) => {
    const { name, value } = e.target;
    let parsedValue = value;

    // Parsing values based on the input type
    if (name === "categoryId" && /^\d+$/.test(value)) {
      parsedValue = parseInt(value, 10);
    } else if (name === "price") {
      parsedValue = parseFloat(value);
    }

    // Updating the new data for adding a product
    setNewData((prevData) => ({
      ...prevData,
      [name]: parsedValue,
    }));
  };

  // Function to handle the deletion of a product
  const handleDeleteClick = (id) => {
    try {
      let url = `https://final-task-noaf.vercel.app/api/products/${id}`;
      fetch(url, {
        method: "DELETE",
      });
    } catch (error) {
      console.error("Error deleting data:", error);
    }
    setRefresh(refresh + 1);
  };

  // Effect to fetch data when the component mounts or when search/refresh changes
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true); // Set loading to true before fetching data

        let url = `https://final-task-noaf.vercel.app/api/products?query=${search}`;
        let res = await fetch(url);
        let jsonData = await res.json();
        setList(jsonData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false); // Set loading to false after data is fetched
      }
    };

    fetchData();
  }, [search, refresh]);

  // Function to handle the editing of a product
  const handleEditClick = () => {
    try {
      let url = `https://final-task-noaf.vercel.app/api/products/${selectedProductId}`;
      fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editFormData),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          setRefresh((prevRefresh) => prevRefresh + 1);
        })
        .catch((error) => {
          console.error("Error updating data:", error);
        });
    } catch (error) {
      console.error("Error updating data:", error);
    }
    setSelectedProductId(null);
  };

  // Function to handle the adding of a product
  const handleAddClick = () => {
    try {
      let url = `https://final-task-noaf.vercel.app/api/products`;
      fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newData),
      });
    } catch (error) {
      console.error("Error updating data:", error);
    }
    setOpen(false);
    setRefresh(refresh + 1);
  };

  // Columns for the Ant Design Table
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (text) => (
        <Image
          src={text}
          alt={text}
          style={{ borderRadius: "50%", height: "70px", width: "70px" }}
          width={70}
          height={70}
        />
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Category",
      dataIndex: "categoryId",
      key: "categoryId",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <>
          <Space width={20} />
          <Button onClick={() => showModal(record.id)} size="large">
            <FaEdit />
          </Button>
          <Popconfirm
            title="Delete the item"
            description="Are you sure to delete this item?"
            okText="Yes"
            cancelText="No"
            okType="danger"
            onConfirm={() => handleDeleteClick(record.id)}
            icon={<QuestionCircleOutlined style={{ color: "red" }} />}
          >
            <Button type="primary" danger size="large">
              <MdDelete />
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <>
      <Header />
      <AppContainer width={1300}>
        <Space width="100%" height="20px" />
        <div className="flex justify-between">
          <Input
            placeholder="Search..."
            onChange={(e) => setSearch(e.target.value)}
          />
          <Space width="150px" />
          <Button onClick={() => setOpen(true)} size="large">
            Add +
          </Button>
          <Button
            className="default"
            onClick={() => setRefresh(refresh + 1)}
            size="large"
          >
            <IoIosRefresh />
          </Button>
        </div>
        <Space width="100%" height="20px" />
        <Table columns={columns} dataSource={list} loading={loading} />
        <Modal
          title="Product Details"
          open={selectedProductId}
          onOk={handleEditClick}
          onCancel={handleCancel}
        >
          {selectedImage && (
            <Image src={selectedImage} alt={"Image"} width={350} height={350} />
          )}
          <p>name</p>
          <Input
            name="name"
            value={editFormData.name}
            onChange={handleEditInputChange}
          />
          <p>price</p>
          <Input
            name="price"
            value={editFormData.price}
            onChange={handleEditInputChange}
          />
          <p>image</p>
          <Input
            name="image"
            value={editFormData.image}
            onChange={handleEditInputChange}
          />
          <p>categoryId</p>
          <Input
            name="categoryId"
            value={editFormData.categoryId}
            onChange={handleEditInputChange}
          />
        </Modal>
        {/* Add Modal */}
        <Modal
          title="Product Details"
          open={open}
          onOk={handleAddClick}
          onCancel={handleCancel}
          okType="default"
        >
          <p>name</p>
          <Input name="name" onChange={handleAddInputChange} />
          <p>price</p>
          <Input name="price" onChange={handleAddInputChange} />
          <p>image</p>
          <Input name="image" onChange={handleAddInputChange} />
          <p>categoryId</p>
          <Input name="categoryId" onChange={handleAddInputChange} />
          <Space height="10px" />
          <Button
            type="link"
            style={{ fontSize: "28px", display: "flex", alignItems: "center" }}
          >
            <FaFileUpload />
            <p>Upload img</p>
            <div>
              <lr-config ctx-name="my-uploader" pubkey="f505f6eef4b92762f144" />
              <lr-file-uploader-regular
                ctx-name="my-uploader"
                css-src={`https://cdn.jsdelivr.net/npm/@uploadcare/blocks@${LR.PACKAGE_VERSION}/web/lr-file-uploader-regular.min.css`}
              />
            </div>
          </Button>
        </Modal>
      </AppContainer>
    </>
  );
};

export default Page;
