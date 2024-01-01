"use client"

import { useState, useEffect } from "react";
import { Image } from "@nextui-org/react";
import {
  Button,
  Modal,
  Table,
  Input,
  Typography,
  Popconfirm,
} from "antd";
import {
  QuestionCircleOutlined,
  FileUploadOutlined,
} from "@ant-design/icons";
import { FaEdit } from "react-icons/fa";
import { IoIosRefresh } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { FaFileUpload } from "react-icons/fa";
import Header from "@/components/Header/header";
import AppContainer from "@/components/Contaner/container";
import { Space } from "@/components/space/Space";

const { Text } = Typography;

// API URL for fetching and updating data
const API_URL = "https://final-task-noaf.vercel.app/api/categories";

const Page = () => {
  // State management using useState hook
  const [state, setState] = useState({
    search: "",
    refresh: 0,
    list: [],
    selectedProductId: null,
    editFormData: {},
    selectedImage: null,
    open: false,
    newData: {},
    loading: true,
  });

  // Destructuring state for easier use
  const {
    search,
    refresh,
    list,
    selectedProductId,
    editFormData,
    selectedImage,
    open,
    newData,
    loading,
  } = state;

  // Function to handle delete operation
  const handleDeleteClick = async (id) => {
    try {
      const url = `${API_URL}/${id}`;
      const response = await fetch(url, { method: "DELETE" });

      if (!response.ok) {
        const responseData = await response.json();
        console.error(`Error deleting category: ${responseData.error}`);
      } else {
        // Update refresh count on successful delete
        setState((prevState) => ({ ...prevState, refresh: prevState.refresh + 1 }));
      }
    } catch (error) {
      console.error("Error deleting:", error);
    }
  };

  // Function to handle edit operation
  const handleEditClick = async () => {
    try {
      const url = `${API_URL}/${selectedProductId}`;
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editFormData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Update refresh count on successful edit
      setState((prevState) => ({ ...prevState, refresh: prevState.refresh + 1 }));
    } catch (error) {
      console.error("Error updating data:", error);
    } finally {
      // Reset selectedProductId after edit
      setState((prevState) => ({ ...prevState, selectedProductId: null }));
    }
  };

  // Function to handle add operation
  const handleAddClick = async () => {
    try {
      const url = `${API_URL}`;
      await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newData),
      });
    } catch (error) {
      console.error("Error updating data:", error);
    } finally {
      // Close the modal and update refresh count after add
      setState((prevState) => ({ ...prevState, open: false, refresh: prevState.refresh + 1 }));
    }
  };

  // Fetch data on component mount and when search or refresh changes
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Set loading to true before fetching data
        setState((prevState) => ({ ...prevState, loading: true }));

        const url = `${API_URL}?query=${search}`;
        const res = await fetch(url);
        const jsonData = await res.json();

        // Update the list with fetched data
        setState((prevState) => ({ ...prevState, list: jsonData }));
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        // Set loading to false after fetching data
        setState((prevState) => ({ ...prevState, loading: false }));
      }
    };

    fetchData();
  }, [search, refresh]);

  // Function to handle input change for editing
  const handleEditInputChange = (e) => {
    setState((prevState) => ({
      ...prevState,
      editFormData: {
        ...prevState.editFormData,
        [e.target.name]: e.target.value,
      },
    }));
  };

  // Function to handle input change for adding
  const handleAddInputChange = (e) => {
    setState((prevState) => ({
      ...prevState,
      newData: {
        ...prevState.newData,
        [e.target.name]: e.target.value,
      },
    }));
  };

  // Function to show modal for editing
  const showModal = (id) => {
    const selectedProduct = list.find((product) => product.id === id);
    setState((prevState) => ({
      ...prevState,
      editFormData: selectedProduct,
      selectedProductId: id,
      selectedImage: selectedProduct.image,
    }));
  };

  // Function to handle modal cancel
  const handleCancel = () => {
    setState((prevState) => ({ ...prevState, selectedProductId: null, open: false }));
  };

  // Column definitions for the Ant Design Table
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
          style={{ borderRadius: "180px%", height: "70px", width: "60px" }}
          width={70}
          height={70}
        />
      ),
    },
    {
      title: "name",
      dataIndex: "name",
      key: "name",
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
    <div>
      <Header />
      <Space height={20} />
      {/* App container with width 1300 */}
      <AppContainer width={1300}>
        <Space width="100%" height="20px" />
        {/* Search and action buttons */}
        <div className="flex justify-between">
          {/* Input for searching */}
          <Input
            placeholder="Search..."
            onPressEnter={(e) => setState((prevState) => ({ ...prevState, search: e.target.value }))}
          />
          {/* Action buttons */}
          <div className="flex">
            <Space width="150px" />
            {/* Button to open add modal */}
            <Button onClick={() => setState((prevState) => ({ ...prevState, open: true }))} size="large">
              Add +
            </Button>
            {/* Button to refresh data */}
            <Button
              className="default"
              onClick={() => setState((prevState) => ({ ...prevState, refresh: refresh + 1 }))}
              size="large"
            >
              <IoIosRefresh />
            </Button>
          </div>
        </div>
        <Space width="100%" height="20px" />
        {/* Table component to display data */}
        <Table columns={columns} dataSource={list} loading={loading} />
        {/* Modal for editing */}
        <Modal
          title="Product Details"
          open={selectedProductId}
          onOk={handleEditClick}
          onCancel={handleCancel}
        >
          {selectedImage && (
            <Image src={selectedImage} alt={"Image"} width={350} height={350} />
          )}
        </Modal>
      </AppContainer>
    </div>
  );
};

export default Page;
