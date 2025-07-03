import { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  message,
  Space,
  Popconfirm,
  Upload,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import request from "../utils/request";

interface Book {
  id: number;
  name: string;
  author: string;
  description: string;
  cover: string;
}

interface BookForm {
  name: string;
  author: string;
  description: string;
}

export function BookManage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingBook, setEditingBook] = useState<Book | null>(null);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await request.get("/book/list");
      console.log(response);
      setBooks(response as unknown as Book[]);
    } catch (error) {
      console.error("获取图书列表失败:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleAdd = () => {
    setEditingBook(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record: Book) => {
    setEditingBook(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await request.delete(`/book/delete/${id}`);
      message.success("删除成功");
      fetchBooks();
    } catch (error) {
      console.error("删除失败:", error);
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingBook) {
        await request.put(`/book/update`, {
          ...values,
          id: editingBook.id,
        });
        message.success("更新成功");
      } else {
        console.log(values.cover.file.response);
        await request.post("/book/create", {
          ...values,
          cover: values.cover.file.response,
        });
        message.success("添加成功");
      }
      setModalVisible(false);
      fetchBooks();
    } catch (error) {
      console.error("操作失败:", error);
    }
  };

  const columns = [
    {
      title: "书名",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "封面",
      dataIndex: "cover",
      key: "cover",
      render: (text: string) => <img src={`http://localhost:3000/${text}`} alt="封面" />,
    },
    {
      title: "作者",
      dataIndex: "author",
      key: "author",
    },
    {
      title: "描述",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
    },
    {
      title: "操作",
      key: "action",
      render: (_: any, record: Book) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这本书吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 16 }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          添加图书
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={books}
        rowKey="id"
        loading={loading}
      />

      <Modal
        title={editingBook ? "编辑图书" : "添加图书"}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={() => setModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="书名"
            rules={[{ required: true, message: "请输入书名" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="author"
            label="作者"
            rules={[{ required: true, message: "请输入作者" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="描述"
            rules={[{ required: true, message: "请输入描述" }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item
            name="cover"
            label="封面"
            rules={[{ required: true, message: "请上传封面" }]}
          >
            <Upload
              action="http://localhost:3000/book/upload"
              maxCount={1}
              name="file"
              listType="picture-card"
            >
              {/* <Button icon={<UploadOutlined />}>上传图片</Button> */}
              <PlusOutlined />
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
